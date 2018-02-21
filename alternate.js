function parseInput(event) {
	const regDelimiter = /\s*,\s*|\s*\n\s*/;
	window._trackSelectorsArr = document.forms['myform'].elements['track'].value.split(regDelimiter);
	window._mediaIgnoreArr = document.forms['myform'].elements['ignore'].value.split(regDelimiter).map((x)=> x.toUpperCase());
}

function loadFile(e) {
	e.preventDefault();
	var input, file, fr;

	if (typeof window.FileReader !== 'function') {
			alert("The file API isn't supported on this browser yet.");
			return false;
	}

	input = document.getElementById('myfile');
	if (!input) {
		alert("Um, couldn't find the fileinput element.");
		return false;
	}
	else if (!input.files) {
		alert("This browser doesn't seem to support the `files` property of file inputs.");
		return false;
	}
	else if (!input.files[0]) {
		alert("Please select a file before clicking 'Load'");
		return false;
	}
	else {
		file = input.files[0];
		fr = new FileReader();
		fr.onload = receivedText;
		fr.readAsText(file);
	}
}


function receivedText(event) {
	const parsedXML = new X2JS().xml_str2json( event.target.result );
	const sequence = parsedXML.xmeml.sequence || parsedXML.xmeml.project.children.sequence;
	const jsonObj = sequence.length? sequence[0]: sequence;
	const headers = [...document.forms['myform'].elements['headers'].options].reduce((prev, el) => {
		return {
			...prev,
			[el.value]: el.selected
		}
	}, {})

	console.log(headers);

	const resultJSON = {
		prjName: jsonObj.labels.label2,
		audio: (jsonObj.media.audio.track.filter(el => el.clipitem)[0] || jsonObj.media.audio.track.filter(el => el.clipitem)).clipitem,
		video: (jsonObj.media.video.track.filter(el => el.clipitem)[0] || jsonObj.media.video.track.filter(el => el.clipitem)).clipitem
	}

	console.log(resultJSON);

	// console.log(parseMedia(resultJSON.video[0]));

	saveXLS(joinCuttedMedia(resultJSON), document.forms['myform'].elements['audioStatus'].checked, resultJSON.prjName)

	function joinCuttedMedia(obj) {
		const a = [], v = [];

		for (let i = 0; i < obj.video.length; i++) {
			if (obj.video[i+1] && obj.video[i].name === obj.video[i+1].name) {
				if (obj.video[i].end === obj.video[i+1].start) {
					obj.video[i].end = obj.video[i+1].end;
					v.push(obj.video[i]);
					i++;
				} else {
					v.push(obj.video[i]);
					v.push(generateBlank(obj.video[i].end, obj.video[i+1].start));
				}
			} else {
				v.push(obj.video[i]);
			}
		}

		for (let i = 0; i < obj.audio.length; i++) {
			if (obj.audio[i+1] && obj.audio[i].name === obj.audio[i+1].name) {
				if (obj.audio[i].end === obj.audio[i+1].start) {
					obj.audio[i].end = obj.audio[i+1].end;
					a.push(obj.audio[i]);
					i++;
				} else {
					a.push(obj.audio[i]);
					a.push(generateBlank(obj.audio[i].end, obj.audio[i+1].start));
				}
			} else {
				a.push(obj.audio[i]);
			}
		}

		return {
			prjName: obj.prjName,
			video: v.map(el => parseMedia(el)),
			audio: a.map(el => parseMedia(el)),
		}
	}


	function generateBlank(start, end) {
		return {
			name: '***blank space***',
			start: start,
			end: end,
			in: 0,
			out: 0,
			logginginfo: {description: ''},
			rate: {timebase: 30}
		}
	}

	function parseMedia(mediaObj) {
		return {
			'FILE/ENTRY ID': mediaObj.name.replace(/(\.\d)(\_.*)\./, '$1.','.'),
			'TC IN': pointsToSeconds(mediaObj.start, mediaObj.rate.timebase),
			'TC OUT': pointsToSeconds(mediaObj.end, mediaObj.rate.timebase),
			'SOURCE IN': pointsToSeconds(mediaObj.in, mediaObj.rate.timebase),
			'SOURCE OUT': pointsToSeconds(mediaObj.out, mediaObj.rate.timebase),
			'SHOT DESCRIPTION': mediaObj.logginginfo.description,
			'USAGE': null,
			'UVUR': null,
		}
	}

	function pointsToSeconds(points, fps=30) {
		function showTwoDigits(number) {
			return ("00" + number).slice(-2);
		}
		var h = Math.floor(points/(60*60*fps));
		var m = (Math.floor(points/(60*fps))) % 60;
		var s = (Math.floor(points/fps)) % 60;
		var f = points % fps;
		return showTwoDigits(h) + ":" + showTwoDigits(m) + ":" + showTwoDigits(s) + ":" + showTwoDigits(f);
	}

	function saveXLS(json, audio, name) {
		var url = "http://oss.sheetjs.com/test_files/formula_stress_test.xlsx";

		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.responseType = "arraybuffer";

		req.onload = function(e) {
			var data = new Uint8Array(req.response);
			var workbook = XLSX.read(data, {type:"array"});

			workbook.SheetNames = [];
			workbook.Sheets = {};
			if (audio) {
				workbook.SheetNames.push('audio');
				workbook.Sheets['audio'] = XLSX.utils.json_to_sheet(json['audio'], {header:["FILE/ENTRY ID"], skipHeader:true})
			}
			workbook.SheetNames.push('video');
			workbook.Sheets['video'] = XLSX.utils.json_to_sheet(json['video'])

			XLSX.writeFile(workbook, `${name || 'project'}.xls`);
		}
		req.send();
	}
	
};
