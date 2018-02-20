


function displaySpeedTime(speedFrame, rate) { // this function does the math if the nested sequence is sped up based on user input
	if (speedFrame > 0){

		currentFrame = Math.round(speedFrame / (document.forms['myform'].elements['speed'].value / 100))
			var fps = rate;
			var h = Math.floor(currentFrame/(60*60*fps));
			var m = (Math.floor(currentFrame/(60*fps))) % 60;
			var s = (Math.floor(currentFrame/fps)) % 60;
			var f = currentFrame % fps;
			return displayTime(convertTimeToFrames(showTwoDigits(h) + ":" + showTwoDigits(m) + ":" + showTwoDigits(s) + ":" + showTwoDigits(f), fps), fps);
	} else {
		currentFrame = 0;
		var fps = rate;
		var h = Math.floor(currentFrame/(60*60*fps));
		var m = (Math.floor(currentFrame/(60*fps))) % 60;
		var s = (Math.floor(currentFrame/fps)) % 60;
		var f = currentFrame % fps;
		return showTwoDigits(h) + ":" + showTwoDigits(m) + ":" + showTwoDigits(s) + ":" + showTwoDigits(f);

	}
}

function convertTimeCodeToSeconds(timeString, framerate) {

	var timeArray = timeString.split(":");
	var hours   = parseInt(timeArray[0]) * 60 * 60;
	var minutes = parseInt(timeArray[1]) * 60;
	var seconds = parseInt(timeArray[2]);
	var frames  = parseInt(timeArray[3])*(1/framerate);
	var totalTime = hours + minutes + seconds + frames;

	return totalTime;
}

function convertTimeToFrames(timeString, framerate) {
	var secs = convertTimeCodeToSeconds(timeString, framerate);
	return Math.round(secs * framerate - 1);
}

function displayTime(currentFrame, rate) {
	var fps = rate;
	var h = Math.floor(currentFrame/(60*60*fps));
	var m = (Math.floor(currentFrame/(60*fps))) % 60;
	var s = (Math.floor(currentFrame/fps)) % 60;
	var f = currentFrame % fps;
	return showTwoDigits(h) + ":" + showTwoDigits(m) + ":" + showTwoDigits(s) + ":" + showTwoDigits(f);
}

function showTwoDigits(number) {
	return ("00" + number).slice(-2);
}

function deleteLast(lastOne) {
	var splitOne = lastOne.split('.');
	splitOne.splice(splitOne.length - 1, splitOne.length - 1);
	return splitOne.join('.')
}

function containsUnderscore(nameOf) {
	if (nameOf.includes('_')) {
		undScore1 = nameOf.split("_")[0];
		undScore2 = nameOf.split("_")[1];
		return undScore1 + "_" + undScore2;
	} else if (nameOf.includes('-') && nameOf.split('-')[0].length == 9){
		return "https://www.pond5.com/stock-footage/" + nameOf.split('-')[0];
	} else if (nameOf.match(/^[0-9]+$/) != null && nameOf.length == 8) {
		return "https://www.shutterstock.com/video/clip-" + nameOf;
	} else {
		return nameOf;
	}
}


var timelineArray = [];
var sortedArray = [];
nestedSequence = [];
nestedCap = [];
document.forms['myform'].elements['myfile'].onchange = function(evt) {
	if (document.forms['myform'].elements['nested'].value !== '') {
		nestedSequence = document.forms['myform'].elements['nested'].value.split(',')
		nestedCap = nestedSequence.map(function(x){ return x.toUpperCase() });
		document.getElementById("sequenceInput").textContent = nestedCap[0]
		document.forms['myform'].elements['nested'].value = '';
	}

	trackSelector = document.forms['myform'].elements['track'].value.split(',')
	mediaIgnore = document.forms['myform'].elements['ignore'].value.split(',')
	mediaIgnore.map(function(x){ return x.toUpperCase() });

	if (evt.srcElement.value.split("\\")[2].split('.')[0].toUpperCase() == document.getElementById("sequenceInput").textContent){

	}

	//mediaIgnore;
	var numberArr2 = [];


	// Iterate through each element in the original array
	for(var i = 0; i < trackSelector.length; i++) {

		// Decrement the value of the original array and push it to the new one
		numberArr2.push(trackSelector[i] - 1); //numberarr2 is the number of tracks
	}

	if(!window.FileReader) return; // Browser is not compatible
			
	var reader = new FileReader();

	reader.onload = function(evt) {
		if(evt.target.readyState != 2) return;
		if(evt.target.error) {
				alert('Error while reading file');
				return;
		}

		filecontent = evt.target.result;
		//console.log(evt.target.result);
		var x2js = new X2JS();

		var jsonObj = x2js.xml_str2json( evt.target.result );
		var timerate = jsonObj.xmeml.sequence.rate.timebase;
		//console.log(jsonObj);
				//document.forms['myform'].elements['text'].value = JSON.stringify(jsonObj);
		document.forms['myform'].elements['text'].value +='\n';
		for (i2 = 0, len2 = numberArr2.length; i2 < len2; i2++) {
			if (jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.constructor == "function Object() { [native code] }") {
				if (mediaIgnore.includes(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.name.toUpperCase) == false) {

					str = deleteLast(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.name);
					startTime = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.start;
					endTime = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.end;
					ownedBy = '';
					VURcat = '';
					trackNumber = numberArr2[i2] + 1;
					inC = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.in;
					outC = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.out;
					//console.log(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.out)
					bothUndScores = containsUnderscore(str);
					allElse = str;
					entryLine = {allElse, startTime, endTime, ownedBy, bothUndScores, VURcat, trackNumber, inC, outC};
					timelineArray.push(entryLine);

				}
				//document.forms['myform'].elements['text'].value += allElse + "," + displayTime(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.start, timerate) + ",";
			} else if (jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.constructor == "function Array() { [native code] }") {
				for (i = 0, len = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem.length, text = ""; i < len; i++) {
					if (mediaIgnore.includes(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].name.toUpperCase) == false) {
						str = deleteLast(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].name);
						startTime = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].start;
						endTime = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].end;
						ownedBy = '';
						VURcat = '';
						trackNumber = numberArr2[i2] + 1;
						inC = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].in;
						outC = jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].out;

						bothUndScores = containsUnderscore(str);
						allElse = str;
						entryLine = {allElse, startTime, endTime, ownedBy, bothUndScores, VURcat, trackNumber, inC, outC};
						timelineArray.push(entryLine);
					}
				}
			}
			//end of l
		}

		cleansedArray = [];
		cleansedArray1 = [];
		cleansedArray2 = [];

		timelineArray.sort(function(a, b){
			return a.startTime-b.startTime;
		})
		console.log(timelineArray);
		sortedArray.push(timelineArray[0]);
		for (i=1 , len = timelineArray.length; i < len; i++) {
			if (nestedCap.includes(timelineArray[i].allElse.toUpperCase) == false && timelineArray[i].bothUndScores == timelineArray[i - 1].bothUndScores) {
				console.log(i);
				sortedArray[sortedArray.length - 1].endTime = timelineArray[i].endTime; // if the names are equal, we put the end time on new array

			} else {
				sortedArray.push(timelineArray[i]);
			}
		}
		//console.log(sortedArray);
		var byName = sortedArray.slice(0);
		byName.sort(function(a,b) {
				var x = a.bothUndScores.toLowerCase();
				var y = b.bothUndScores.toLowerCase();
				return x < y ? -1 : x > y ? 1 : 0;
		});



		cleansedArray.push(byName[0]);
		for (i=1 , len = byName.length; i < len; i++) {
			if (nestedCap.includes(byName[i].allElse.toUpperCase) == false && byName[i].bothUndScores == byName[i - 1].bothUndScores && byName[i].startTime == byName[i -1].endTime) {
				//console.log(i);
				cleansedArray[cleansedArray.length - 1].endTime = byName[i].endTime; // if the names are equal, we put the end time on new array

			} else {
				cleansedArray.push(byName[i]);
			}
		}
		cleansedArray.sort(function(a, b){
			return a.startTime-b.startTime;
		})

		for (i=0, len = cleansedArray.length; i < len; i++) {

			if (document.getElementById("checker").checked == true) { //this is the checker that will find if it its a nested xml sequence (needs update)
				var inPoint = cleansedArray[i].inC;
				var outPoint = cleansedArray[i].outC;
					if (Math.round(cleansedArray[i].endTime / (document.forms['myform'].elements['speed'].value / 100)) > inPoint && Math.round(cleansedArray[i].startTime / (document.forms['myform'].elements['speed'].value / 100)) <= outPoint) {
						console.log('display speed')
						document.forms['myform'].elements['text'].value += cleansedArray[i].allElse + ',' + displaySpeedTime(cleansedArray[i].startTime - inPoint, timerate) + ',' + displaySpeedTime(cleansedArray[i].endTime,timerate) + ',' + cleansedArray[i].ownedBy + ',' + cleansedArray[i].bothUndScores + ',' + cleansedArray[i].VURcat + '\n';
					}
			} else {
				if (nestedCap.includes(cleansedArray[i].allElse.toUpperCase) == false) {
					console.log('no speed')
					document.forms['myform'].elements['text'].value += cleansedArray[i].allElse + ',' + displayTime(cleansedArray[i].startTime, timerate) + ',' + displayTime(cleansedArray[i].endTime,timerate) + ',' + cleansedArray[i].ownedBy + ',' + cleansedArray[i].bothUndScores + ',' + cleansedArray[i].VURcat + '\n';
				} else {
					document.forms['myform'].elements['text'].value += cleansedArray[i].allElse + '}' + cleansedArray[i].inC + '}' + cleansedArray[i].outC
				}
			}
		}
	};

	reader.readAsText(evt.target.files[0]);
};

(function () {
	var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  };


  var create = document.getElementById('create'),
    text = document.getElementById('text');

  create.addEventListener('click', function () {
    var link = document.getElementById('downloadlink');
    link.href = makeTextFile(text.value);
    link.style.display = 'block';
  }, false);
})();


// function doVidPoint(points, curPoint, curNewObj){
//     if (points.length-1 === points.indexOf(curPoint)){
//         return curNewObj;
//     }
//     if (curNewObj === null){
//         curNewObj = [];
//     }
//     timelineArray.map((point) => {
//         if (point.bothUndScores === curPoint.bothUndScores && point !== curPoint){
//             if (point.startTime === curPoint.endTime){
//               console.log('new vid')
//                 var newVidObj = {
//                     name: point.bothUndScores,
//                     start: curPoint.startTime,
//                     end: point.endTime
//                 }
//                 curNewObj.push(newVidObj);
//                 console.log('newpush')
//                 console.log(newVidObj)
//             }
//         }
//     });
//     return doVidPoint(points, points[points.indexOf(curPoint)+1], curNewObj);
// }
//
// var newObj = doVidPoint(timelineArray, timelineArray[0], null);

// var responseOBJ = '';
//
// getURL('pcases_594_land_o_lakes_dairy_factory_farm_media_edit_peta_v1.mov');
// function getURL(url1) {
//
// var xhr = new XMLHttpRequest();
// xhr.open("GET", 'http://audiovideosystem/results.aspx?Mode=Simple&MediaType=99&Description=' + url1 + '&DescriptionOp=11', true);
// xhr.onload = function (e) {
//   if (xhr.readyState === 4) {
//     if (xhr.status === 200) {
//       responseOBJ = 'http://audiovideosystem/' + xhr.responseText.split('"')[xhr.responseText.split('"').indexOf("dgResults_hypView_0") + 2];
// console.log(responseOBJ);
//
//     } else {
//       console.error(xhr.statusText);
//     }
//   }
// };
// xhr.onerror = function (e) {
//   console.error(xhr.statusText);
// };
// xhr.send(null);
// }

//console.log(allElse); need to split by the .
//if (jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i] > 0)
//{

/*	if (i==0) {
document.forms['myform'].elements['text'].value += allElse + "," + displayTime(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].start, timerate) + ",";
} else {

try {
  if (jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].name != jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i - 1].name)
  {
    document.forms['myform'].elements['text'].value += allElse + "," + displayTime(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].start, timerate) + ",";
  };
  }
  catch(err) {
console.log(i);
};
};
//};
//if (jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i + 1] < len)
//{
try {
  if (jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].name !== jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i + 1].name)
  {
    document.forms['myform'].elements['text'].value += displayTime(jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].end, timerate) + ",," + bothUndScores + "," + '\n';
  };
  }
  catch(err) {
console.log(i);

};*/

//};
//document.forms['myform'].elements['text'].value += allElse + "," + jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].start + "," + jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].end + ",," + bothUndScores + "," + '\n';
//console.log(bothUndScores + " " + jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].start + " " + jsonObj.xmeml.sequence.media.video.track[numberArr2[i2]].clipitem[i].end + '\r\n');
