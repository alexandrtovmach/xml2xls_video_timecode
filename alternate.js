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
	var jsonObj = x2js.xml_str2json( event.target.result );
	
	// var timerate = jsonObj.xmeml.sequence.rate.timebase;
	// //console.log(jsonObj);
	// 		//document.forms['myform'].elements['text'].value = JSON.stringify(jsonObj);
	// document.forms['myform'].elements['text'].value +='\n';
	// for (i2 = 0, len2 = numberArr2.length; i2 < len2; i2++) {
	// 	if (jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.constructor == "function Object() { [native code] }") {
	// 		if (mediaIgnoreArr.includes(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.name.toUpperCase) == false) {

	// 			str = deleteLast(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.name);
	// 			startTime = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.start;
	// 			endTime = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.end;
	// 			ownedBy = '';
	// 			VURcat = '';
	// 			trackNumber = numberArr2[i2] + 1;
	// 			inC = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.in;
	// 			outC = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.out;
	// 			//console.log(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.out)
	// 			bothUndScores = containsUnderscore(str);
	// 			allElse = str;
	// 			entryLine = {allElse, startTime, endTime, ownedBy, bothUndScores, VURcat, trackNumber, inC, outC};
	// 			timelineArray.push(entryLine);

	// 		}
	// 		//document.forms['myform'].elements['text'].value += allElse + "," + displayTime(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.start, timerate) + ",";
	// 	} else if (jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.constructor == "function Array() { [native code] }") {
	// 		for (i = 0, len = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.length, text = ""; i < len; i++) {
	// 			if (mediaIgnoreArr.includes(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].name.toUpperCase) == false) {
	// 				str = deleteLast(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].name);
	// 				startTime = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].start;
	// 				endTime = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].end;
	// 				ownedBy = '';
	// 				VURcat = '';
	// 				trackNumber = numberArr2[i2] + 1;
	// 				inC = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].in;
	// 				outC = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].out;

	// 				bothUndScores = containsUnderscore(str);
	// 				allElse = str;
	// 				entryLine = {allElse, startTime, endTime, ownedBy, bothUndScores, VURcat, trackNumber, inC, outC};
	// 				timelineArray.push(entryLine);
	// 			}
	// 		}
	// 	}
	// 	//end of l
	// }

	// cleansedArray = [];
	// cleansedArray1 = [];
	// cleansedArray2 = [];

	// timelineArray.sort(function(a, b){
	// 	return a.startTime-b.startTime;
	// })
	// console.log(timelineArray);
	// sortedArray.push(timelineArray[0]);
	// for (i=1 , len = timelineArray.length; i < len; i++) {
	// 	if (nestedCap.includes(timelineArray[i].allElse.toUpperCase) == false && timelineArray[i].bothUndScores == timelineArray[i - 1].bothUndScores) {
	// 		console.log(i);
	// 		sortedArray[sortedArray.length - 1].endTime = timelineArray[i].endTime; // if the names are equal, we put the end time on new array

	// 	} else {
	// 		sortedArray.push(timelineArray[i]);
	// 	}
	// }
	// //console.log(sortedArray);
	// var byName = sortedArray.slice(0);
	// byName.sort(function(a,b) {
	// 		var x = a.bothUndScores.toLowerCase();
	// 		var y = b.bothUndScores.toLowerCase();
	// 		return x < y ? -1 : x > y ? 1 : 0;
	// });



	// cleansedArray.push(byName[0]);
	// for (i=1 , len = byName.length; i < len; i++) {
	// 	if (nestedCap.includes(byName[i].allElse.toUpperCase) == false && byName[i].bothUndScores == byName[i - 1].bothUndScores && byName[i].startTime == byName[i -1].endTime) {
	// 		//console.log(i);
	// 		cleansedArray[cleansedArray.length - 1].endTime = byName[i].endTime; // if the names are equal, we put the end time on new array

	// 	} else {
	// 		cleansedArray.push(byName[i]);
	// 	}
	// }
	// cleansedArray.sort(function(a, b){
	// 	return a.startTime-b.startTime;
	// })

	// for (i=0, len = cleansedArray.length; i < len; i++) {

	// 	if (document.getElementById("checker").checked == true) { //this is the checker that will find if it its a nested xml sequence (needs update)
	// 		var inPoint = cleansedArray[i].inC;
	// 		var outPoint = cleansedArray[i].outC;
	// 			if (Math.round(cleansedArray[i].endTime / (document.forms['myform'].elements['speed'].value / 100)) > inPoint && Math.round(cleansedArray[i].startTime / (document.forms['myform'].elements['speed'].value / 100)) <= outPoint) {
	// 				console.log('display speed')
	// 				document.forms['myform'].elements['text'].value += cleansedArray[i].allElse + ',' + displaySpeedTime(cleansedArray[i].startTime - inPoint, timerate) + ',' + displaySpeedTime(cleansedArray[i].endTime,timerate) + ',' + cleansedArray[i].ownedBy + ',' + cleansedArray[i].bothUndScores + ',' + cleansedArray[i].VURcat + '\n';
	// 			}
	// 	} else {
	// 		if (nestedCap.includes(cleansedArray[i].allElse.toUpperCase) == false) {
	// 			console.log('no speed')
	// 			document.forms['myform'].elements['text'].value += cleansedArray[i].allElse + ',' + displayTime(cleansedArray[i].startTime, timerate) + ',' + displayTime(cleansedArray[i].endTime,timerate) + ',' + cleansedArray[i].ownedBy + ',' + cleansedArray[i].bothUndScores + ',' + cleansedArray[i].VURcat + '\n';
	// 		} else {
	// 			document.forms['myform'].elements['text'].value += cleansedArray[i].allElse + '}' + cleansedArray[i].inC + '}' + cleansedArray[i].outC
	// 		}
	// 	}
	// }
};

// reader.readAsText(evt.target.files[0]);

