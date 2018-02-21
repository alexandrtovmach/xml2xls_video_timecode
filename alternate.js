function parseInput(event) {
	// if (document.forms['myform'].elements['nested'].value !== '') {
	// 	nestedSequence = document.forms['myform'].elements['nested'].value.split(',')
	// 	nestedCap = nestedSequence.map(function(x){ return x.toUpperCase() });
	// 	document.getElementById("sequenceInput").textContent = nestedCap[0]
	// 	document.forms['myform'].elements['nested'].value = '';
	// }

	const regDelimiter = /\s{0,3},\s{0,3}/;
	window._trackSelectorsArr = document.forms['myform'].elements['track'].value.split(regDelimiter);
	window._mediaIgnoreArr = document.forms['myform'].elements['ignore'].value.split(regDelimiter).map((x)=> x.toUpperCase());

	// if (evt.srcElement.value.split("\\")[2].split('.')[0].toUpperCase() == document.getElementById("sequenceInput").textContent){

	// }

	//mediaIgnoreArr;
	// var numberArr2 = [];


	// Iterate through each element in the original array
	// for(var i = 0; i < trackSelectorsArr.length; i++) {
	// 	// Decrement the value of the original array and push it to the new one
	// 	numberArr2.push(trackSelectorsArr[i] - 1); //numberarr2 is the number of tracks
	// }
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
	var x2js = new X2JS();
	var jsonObj = x2js.xml_str2json( event.target.result ).xmeml.sequence;

	console.log(jsonObj);

	var resultJSON = {
		prjName: jsonObj.labels.label2,
		audio: (jsonObj.media.audio.track.filter(el => el.clipitem)[0] || jsonObj.media.audio.track.filter(el => el.clipitem)).clipitem,
		video: (jsonObj.media.video.track.filter(el => el.clipitem)[0] || jsonObj.media.video.track.filter(el => el.clipitem)).clipitem
	}

	// console.log(resultJSON);

	// console.log(parseMedia(resultJSON.video[0]));


	saveXLS(joinCuttedMedia(resultJSON), ['video', 'audio'], resultJSON.prjName)




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
			'USAGE': '',
			'UVUR': '',
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

	function saveXLS(json, sheets, name) {
		var url = "http://oss.sheetjs.com/test_files/formula_stress_test.xlsx";

		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.responseType = "arraybuffer";

		req.onload = function(e) {
			var data = new Uint8Array(req.response);
			var workbook = XLSX.read(data, {type:"array"});

			workbook.SheetNames = [];
			workbook.Sheets = {};
			sheets.forEach(el => {
				workbook.SheetNames.push(el);
				workbook.Sheets[el] = XLSX.utils.json_to_sheet(json[el])
			})

			XLSX.writeFile(workbook, `${name || 'project'}.xls`);
		}
		req.send();
	}
	
};
