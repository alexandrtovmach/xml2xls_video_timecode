
window._trackSelectorsArr = [];
window._mediaIgnoreArr = [];
window._includeAudio = document.forms['myform'].elements['audioStatus'].checked;
window._headers = [...document.forms['myform'].elements['headers'].options].reduce((prev, el) => {
	if (!el.selected) {
		return [
			...prev,
			el.innerHTML
		]
	}
	return prev
}, []);

function parseInput(event) {
	const regDelimiter = /\s*,\s*|\s*\n\s*/;
	window._trackSelectorsArr = document.forms['myform'].elements['track'].value.split(regDelimiter) || [];
	window._mediaIgnoreArr = document.forms['myform'].elements['ignore'].value.split(regDelimiter) || [];
	window._includeAudio = document.forms['myform'].elements['audioStatus'].checked;
	window._headers = [...document.forms['myform'].elements['headers'].options].reduce((prev, el) => {
		if (!el.selected) {
			return [
				...prev,
				el.innerHTML
			]
		}
		return prev
	}, []);
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


function sequenceToClipitem(sequence, format) {
	const jsonObj = sequence.length? sequence[0]: sequence;
	return convertToSimpleArray(allInOneArr(jsonObj.media[format].track, 'clipitem')
		.map(el => {
			if (el.sequence) {
				return (el.sequence[0] || el.sequence).media && sequenceToClipitem(el.sequence, format)
			} else {
				return el;
			}
		})
	)
}


function a(sequence, format, start=0) {
	const jsonObj = sequence.length? sequence[0]: sequence;
	return b(c(jsonObj.media[format].track, 'clipitem', start)
		.map(el => {
			if (el.sequence) {
				return (el.sequence[0] || el.sequence).media && [...a(el.sequence, format, el.start)]
			} else {
				return el;
			}
		})
	)
}

function b(array) {
	var res=[];
	for (var i=0; i<array.length; i++) {
		if (!array[i]) {continue}
		if (!Array.isArray(array[i])) {
			res.push(array[i]);
		} else {
			res=[...res, ...b(array[i])];
		}
	}
	return res;
}

function c(arr, field, start, end) {
	const res = [];
	arr.filter(el => el[field]).forEach(el => {
		if (el[field].length) {
			res.push(...el[field].map(elem => {
				// console.log(elem.name, +elem.end + +start, +elem.start + +start + +elem.out - +elem.in)
				const cache = {...elem};
				// cache.start = +elem.start;
				// cache.end = +elem.end;
				cache.start = +elem.start + +start;
				cache.end = +elem.end + +start;
				return cache
			}));
		} else {
			// console.log(el[field].name, +el[field].end + +start, +el[field].start + +start + +el[field].out - +el[field].in)
			const cache = {...el[field]};
			cache.start = +el[field].start;
			cache.end = +el[field].end;
			res.push(cache);
		}		
	})
	return res;
}

function convertToSimpleArray(array) {
	var res=[];
	for (var i=0; i<array.length; i++) {
		if (!array[i]) {continue}
		if (!Array.isArray(array[i])) {
			res.push(array[i]);
		} else {
			res=[...res, ...convertToSimpleArray(array[i])];
		}
	}
	return res;
}

function allInOneArr(arr, field) {
	const res = [];
	arr.filter(el => el[field]).forEach(el => {
		if (el[field].length) {
			res.push(...el[field]);
		} else {
			res.push(el[field]);
		}		
	})
	return res;
}

function receivedText(event) {
	const parsedXML = new X2JS().xml_str2json( event.target.result );
	const sequence = parsedXML.xmeml.sequence || parsedXML.xmeml.project.children.sequence;

	// console.log(parsedXML);
	// console.log(sequence);
	// console.log(a(sequence, 'video'));

	// joinCuttedMedia(a(sequence, 'video'))
	saveXLS(a(sequence, 'video'), (sequence.length? sequence[0]: sequence).name, window._includeAudio? a(sequence, 'audio'): null)
	// saveXLS(a(sequence, 'video'), (sequence.length? sequence[0]: sequence).name, window._includeAudio? a(sequence, 'audio'): null)
	// saveXLS(joinCuttedMedia(sequenceToClipitem(sequence, 'video')), (sequence.length? sequence[0]: sequence).name, window._includeAudio? joinCuttedMedia(sequenceToClipitem(sequence, 'audio')): null)
	// saveXLS(sequenceToClipitem(sequence, 'video'), (sequence.length? sequence[0]: sequence).name, window._includeAudio? sequenceToClipitem(sequence, 'audio'): null)

	function joinCuttedMedia(arr, atglance) {
		const v = [];
		if (atglance) {
			for (let i = 0; i < arr.length; i++) {
				if (arr[i+1] && (arr[i].name === arr[i+1].name)) {
					if (arr[i].end === arr[i+1].start) {
						arr[i].end = arr[i+1].end;
						v.push(arr[i]);
						i++;
					} else if ((arr[i].end <= arr[i+1].start)) {
						v.push(arr[i]);
						v.push(generateBlank(arr[i].end, arr[i+1].start));
					}
				} else {
					v.push(arr[i]);
				}
			}
			return v.filter(whiteAndBlacklistFilter).sort((a,b) => a.start - b.start).map(el => parseMedia(el)).map(headersFilter)
		} else {
			return arr.filter(whiteAndBlacklistFilter).sort((a,b) => a.start - b.start).map(el => parseMedia(el)).map(headersFilter)
		}
	}

	function whiteAndBlacklistFilter(elem) {
		return elem && (window._trackSelectorsArr.includes(elem.name) || !window._mediaIgnoreArr.includes(elem.name));
	}

	function headersFilter(elem) {
		window._headers.forEach(el => {
			delete elem[el]
		})

		return elem;
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
			'SOURCE IN': (/\.jpg|gif|png|bmp|blank\sspace/).test(mediaObj.name)? '': pointsToSeconds(mediaObj.in, mediaObj.rate.timebase),
			'SOURCE OUT': (/\.jpg|gif|png|bmp|blank\sspace/).test(mediaObj.name)? '': pointsToSeconds(mediaObj.out, mediaObj.rate.timebase),
			'SHOT DESCRIPTION': mediaObj.logginginfo && mediaObj.logginginfo.description,
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

	function saveXLS(json, name, audioJson) {
		var url = "http://oss.sheetjs.com/test_files/formula_stress_test.xlsx";

		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.responseType = "arraybuffer";

		req.onload = function(e) {
			var data = new Uint8Array(req.response);
			var workbook = XLSX.read(data, {type:"array"});

			workbook.SheetNames = [];
			workbook.Sheets = {};
			if (audioJson) {
				workbook.SheetNames.push('audio');
				workbook.SheetNames.push('audio_atGlance');
				workbook.Sheets['audio'] = XLSX.utils.json_to_sheet(joinCuttedMedia(audioJson), {origin: { r: 1, c: 1 }})
				workbook.Sheets['audio_atGlance'] = XLSX.utils.json_to_sheet(joinCuttedMedia(audioJson, true), {origin: { r: 1, c: 1 }})
			}
			workbook.SheetNames.push('video');
			workbook.SheetNames.push('video_atGlance');
			workbook.Sheets['video'] = XLSX.utils.json_to_sheet(joinCuttedMedia(json), {origin: { r: 1, c: 1 }})
			workbook.Sheets['video_atGlance'] = XLSX.utils.json_to_sheet(joinCuttedMedia(json, true), {origin: { r: 1, c: 1 }})

			XLSX.writeFile(workbook, `${name || 'project'}.xls`);
		}
		req.send();
	}
	
};
