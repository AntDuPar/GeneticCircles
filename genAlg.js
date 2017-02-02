//Genetic Algorithm for creating pictures out of circles
//go to anthonydupar.com/evolutionaryCircles.html to watch it work
var context;
var main = document.getElementById('main');
var main2 = document.getElementById('main2');
var cw,ch;
var img = new Image();
img.src = 'mona-lisa.jpg';
var data;
var boolSwitch = false;
var switchStart1 = 0;
var switchStart2 = 0;
var imageData;
var numbGen = 0;
var newImages = [];
var fitnessList = [];
var cordList = [];
var widthList = [];
var currCircle = 0;
var currCircleWidth = 0;
var highestFit = 0;
var currImage = 0;
var circColors = [];
var numCirc = 120;
var spec = 0;
var numbS = 0;
function init(){
		context = main.getContext('2d');
		context2 = main2.getContext('2d');
		cw = 300;
		ch = 200;
		main.width = cw;
		main.height = ch;
		main2.width = cw;
		main2.height = ch;
		context.drawImage(img, 0, 0, cw, ch);
		img.style.display = 'none';
		imageData = context.getImageData(0, 0, cw, ch);
		data = imageData.data;
		makeFirstGen();
		setInterval(draw, 1);
}
function draw(){
	//draw all of the generated pictures
	if(numbS < 23){
		context.clearRect(0, 0, cw, ch);
		for(var y = 0; y < numCirc; y++){
			context.beginPath();
			context.arc(cordList[currCircle],cordList[(currCircle+1)], widthList[currCircleWidth],0,2 * Math.PI);
			context.strokeStyle = 'rgba(' + circColors[spec] + ',' + circColors[(spec+1)] + ',' + circColors[(spec+2)] + ',' + circColors[(spec+3)] + ')';
			context.fillStyle = 'rgba(' + circColors[spec] + ',' + circColors[(spec+1)] + ',' + circColors[(spec+2)] + ',' + circColors[(spec+3)] + ')';
			context.fill();
			context.stroke();
			currCircle += 2;
			spec = spec + 4;
			currCircleWidth++;
		}
		fitnessList[numbS] = findFitness(false);
	}
	//generate new children
	if(numbS >= 23){
		numbGen++;
		breed();
		currCircle = 0;
		currCircleWidth = 0;
		numbS = -1;
		spec = 0;
		highestFit = 0;
	}
	numbS++;
}
function breed(){
	var firstParFit = 0;
	var secondParFit = 0;
	var newCircCList = [];
	var newCordList = [];
	var newWidthList = [];
	var totalFitness = 0;
	var currentChrom = 0;
	var currentChromCord = 0;
	var currentChromWidth = 0;
	for(var i = 0; i<fitnessList.length; i++){
		totalFitness += fitnessList[i];
	}
	if(numbGen % 100 == 0){
		console.log("Number Generations = " + numbGen);
		console.log("Highest Fitness = " + highestFit);
	}
	for(var l = 0; l < fitnessList.length/2; l++){
		var firstRand = Math.floor((Math.random() * totalFitness) + 1);
		var firstParent = 0;
		var tmpI = 0;
		var higherFitness = true;
		//find the first parent
		for(var x = 0; x < fitnessList.length; x++){
			if(firstRand >= tmpI && firstRand < (tmpI + fitnessList[x])){
				firstParent = x;
				firstParFit = fitnessList[x];
			}
			tmpI += fitnessList[x];
		}
		//find the second parent
		var secondRand = Math.floor((Math.random() * totalFitness) + 1);
		var secondParent = 0;
		var tmpI2 = 0;
		for(var y = 0; y < fitnessList.length; y++){
			if(secondRand >= tmpI2 && secondRand < (tmpI2 + fitnessList[y])){
				secondParent = y;
				secondParFit = fitnessList[y];
			}
			tmpI2 += fitnessList[y];
		}
		//incase the two parents are the same, make sure that they are not
		while(secondParent == firstParent){
			var secondRand2 = Math.floor((Math.random() * totalFitness) + 1);
			var tmpI3 = 0;
			for(var z = 0; z < fitnessList.length; z++){
				if(secondRand2 >= tmpI3 && secondRand2 < (tmpI3 + fitnessList[z])){
					secondParent = z;
					secondParFit = fitnessList[z];
				}
				tmpI3 += fitnessList[z];
			}
		}
		//breed the two parents into two new children
		var firstChromS = firstParent * (numCirc*4);
		var secondChromS = secondParent * (numCirc*4);
		var firstChromSCord = firstParent * (numCirc*2);
		var secondChromsCord = secondParent * (numCirc*2);
		var firstChromSWidth = firstParent * (numCirc);
		var secondChromSWidth = secondParent * (numCirc);
		var crossOverLoc = (Math.floor((Math.random() * numCirc)))*4;
		var crossOverLocCord = (Math.floor((Math.random() * numCirc)))*2;
		var crossOverLocWidth = Math.floor((Math.random() * numCirc));
		//make the first child
		for(var h = 0; h < crossOverLoc; h += 4){
			newCircCList[h + currentChrom] = circColors[h + firstChromS];
			newCircCList[(h + 1) + currentChrom] = circColors[(h+1) + firstChromS];
			newCircCList[(h + 2) + currentChrom] = circColors[(h+2) + firstChromS];
			newCircCList[(h + 3) + currentChrom] = circColors[(h+3) + firstChromS];
		}
		for(var h = 0; h < crossOverLocCord; h += 2){
			newCordList[h + currentChromCord] = cordList[h + firstChromSCord];
			newCordList[(h + 1) + currentChromCord] = cordList[(h+1) + firstChromSCord];
		}
		for(var h = 0; h < crossOverLocWidth; h++){
			newWidthList[h + currentChromWidth] = widthList[h + firstChromSWidth];
		}
		for(var j = crossOverLoc; j < numCirc*4; j += 4){
			newCircCList[j + currentChrom] = circColors[j + secondChromS];
			newCircCList[(j+1) + currentChrom] = circColors[(j+1) + secondChromS];
			newCircCList[(j+2) + currentChrom] = circColors[(j+2) + secondChromS];
			newCircCList[(j+3) + currentChrom] = circColors[(j+3) + secondChromS];
		}
		for(var j = crossOverLocCord; j < numCirc*2; j += 2){
			newCordList[j + currentChromCord] = cordList[j + secondChromsCord];
			newCordList[(j+1) + currentChromCord] = cordList[(j+1) + secondChromsCord];
		}
		for(var j = crossOverLocWidth; j < numCirc; j++){
			newWidthList[j + currentChromWidth] = widthList[j + secondChromSWidth];
		}
		//mutate the first child
		newCircCList = mutateColor(newCircCList, currentChrom);
		newCordList = mutateXY(newCordList, currentChromCord);
		newWidthList = mutateW(newWidthList, currentChromWidth);
		//find fitness of first child
		var childFit1 = findChildFitness(newCircCList, newCordList, newWidthList, currentChrom, currentChromCord, currentChromWidth);
		currentChrom = currentChrom + (numCirc*4);
		currentChromCord = currentChromCord + (numCirc*2);
		currentChromWidth = currentChromWidth + (numCirc);
		//make the second child
		for(var p = 0; p < crossOverLoc; p += 4){
			newCircCList[p + currentChrom] = circColors[p + secondChromS];
			newCircCList[(p + 1) + currentChrom] = circColors[(p+1) + secondChromS];
			newCircCList[(p + 2) + currentChrom] = circColors[(p+2) + secondChromS];
			newCircCList[(p + 3) + currentChrom] = circColors[(p+3) + secondChromS];
		}
		for(var p = 0; p < crossOverLocCord; p += 2){
			newCordList[p + currentChromCord] = cordList[p + secondChromsCord];
			newCordList[(p + 1) + currentChromCord] = cordList[(p+1) + secondChromsCord];
		}
		for(var p = 0; p < crossOverLocWidth; p++){
			newWidthList[p + currentChromWidth] = widthList[p + secondChromSWidth];
		}
		for(var b = crossOverLoc; b < numCirc*4; b += 4){
			newCircCList[b + currentChrom] = circColors[b + firstChromS];
			newCircCList[(b+1) + currentChrom] = circColors[(b+1) + firstChromS];
			newCircCList[(b+2) + currentChrom] = circColors[(b+2) + firstChromS];
			newCircCList[(b+3) + currentChrom] = circColors[(b+3) + firstChromS];
		}
		for(var b = crossOverLocCord; b < numCirc*2; b += 2){
			newCordList[b + currentChromCord] = cordList[b + firstChromSCord];
			newCordList[(b+1) + currentChromCord] = cordList[(b+1) + firstChromSCord];
		}
		for(var b = crossOverLocWidth; b < numCirc; b++){
			newWidthList[b + currentChromWidth] = widthList[b + firstChromSWidth];
		}
		//mutate second child
		newCircCList = mutateColor(newCircCList, currentChrom);
		newCordList = mutateXY(newCordList, currentChromCord);
		newWidthList = mutateW(newWidthList, currentChromWidth);
		//find fitness of the second child
		var childFit2 = findChildFitness(newCircCList, newCordList, newWidthList, currentChrom, currentChromCord, currentChromWidth);
		var cross1 = false;
		var cross2 = false;
		//compare fitness of new children with parents
		if(childFit1 < firstParFit){
			cross1 = true;
		}
		if(childFit2 < secondParFit){
			cross2 = true;
		}
		if(cross1 || cross2){
			currentChrom = currentChrom - (numCirc*4);
			currentChromCord = currentChromCord - (numCirc*2);
			currentChromWidth = currentChromWidth - (numCirc);
		}
		//if children are not more fit than parents, then keep the parents
		if(cross1){
			for(var t = 0; t < numCirc*4; t += 4){
				newCircCList[t + currentChrom] = circColors[t + firstChromS];
				newCircCList[(t+1) + currentChrom] = circColors[(t+1) + firstChromS];
				newCircCList[(t+2) + currentChrom] = circColors[(t+2) + firstChromS];
				newCircCList[(t+3) + currentChrom] = circColors[(t+3) + firstChromS];
			}
			for(var t = 0; t < numCirc*2; t += 2){
				newCordList[t + currentChromCord] = cordList[t + firstChromSCord];
				newCordList[(t+1) + currentChromCord] = cordList[(t+1) + firstChromSCord];
			}
			for(var t = 0; t < numCirc; t++){
				newWidthList[t + currentChromWidth] = widthList[t + firstChromSWidth];
			}
			if(!cross2){
				currentChrom = currentChrom + (numCirc*4);
				currentChromCord = currentChromCord + (numCirc*2);
				currentChromWidth = currentChromWidth + (numCirc);
			}
		}
		if(cross2){
			currentChrom = currentChrom + (numCirc*4);
			currentChromCord = currentChromCord + (numCirc*2);
			currentChromWidth = currentChromWidth + (numCirc);
			for(var t = 0; t < numCirc*4; t += 4){
				newCircCList[t + currentChrom] = circColors[t + secondChromS];
				newCircCList[(t+1) + currentChrom] = circColors[(t+1) + secondChromS];
				newCircCList[(t+2) + currentChrom] = circColors[(t+2) + secondChromS];
				newCircCList[(t+3) + currentChrom] = circColors[(t+3) + secondChromS];
			}
			for(var t = 0; t < numCirc*2; t += 2){
				newCordList[t + currentChromCord] = cordList[t + secondChromsCord];
				newCordList[(t+1) + currentChromCord] = cordList[(t+1) + secondChromsCord];
			}
			for(var t = 0; t < numCirc; t++){
				newWidthList[t + currentChromWidth] = widthList[t + secondChromSWidth];
			}
		}
		currentChrom = currentChrom + (numCirc*4);
		currentChromCord = currentChromCord + (numCirc*2);
		currentChromWidth = currentChromWidth + (numCirc);
	}
	//set the old parent lists to the new children lists
	circColors = newCircCList;
	cordList = newCordList;
	widthList = newWidthList;
}
function findChildFitness(colorList, xyList, wList, colListStart, xyListStart, wListStart){
	context2.clearRect(0, 0, cw, ch);
	var fitnessChild = 0;
	var currXY = xyListStart;
	var currCol = colListStart;
	var currW = wListStart;
	//draw the child on the other canvas
	for(var i = 0; i < numCirc; i++){
		context2.beginPath();
		context2.arc(xyList[currXY],xyList[(currXY+1)], wList[currW],0,2 * Math.PI);
		context2.strokeStyle = 'rgba(' + colorList[currCol] + ',' + colorList[(currCol+1)] + ',' + colorList[(currCol+2)] + ',' + colorList[(currCol+3)] + ')';
		context2.fillStyle = 'rgba(' + colorList[currCol] + ',' + colorList[(currCol+1)] + ',' + colorList[(currCol+2)] + ',' + colorList[(currCol+3)] + ')';
		context2.fill();
		context2.stroke();
		currXY += 2;
		currCol += 4;
		currW++;
	}
	fitnessChild = findFitness(true);
	//console.log(fitnessChild)
	//context.clearRect(0, 0, cw, ch);
	return fitnessChild;
}
function findFitness(child){
	var newData;
	if(child){
		newData = context2.getImageData(0, 0, main2.width, main2.height);
	}
	else{
		newData = context.getImageData(0, 0, main.width, main.height);
	}
	var staticData = newData.data;
	var fitness = 0;
	//look at the pixel data and compare to the orriginal pictures pixel data
	if(staticData.length == data.length){
		for(var i = 0; i < staticData.length; i += 4){
			var rDiff = Math.abs(staticData[i] - data[i]);
			var bDiff = Math.abs(staticData[i+1] - data[i+1]);
			var gDiff = Math.abs(staticData[i+2] - data[i+2]);
			var totalDiff = rDiff + bDiff + gDiff;
			if(totalDiff == 0){
				totalDiff = 1;
			}
			//this is so that smaller totalDiff means a higher fitness
			fitness += (1/(totalDiff/2));
		}
	}
	if(fitness > highestFit){
		highestFit = fitness;
	}
	return fitness;
}
function makeFirstGen(){
	var numCircI = (numCirc*4) * 24;
	for(var i = 0; i <= numCircI; i = i + 4){
		var randomA = (Math.random() + 0.05);
		var randomR = Math.floor((Math.random() * 255) + 1);
		var randomG = Math.floor((Math.random() * 255) + 1);
		var randomB = Math.floor((Math.random() * 255) + 1);
		circColors[i] = randomR;
		circColors[i+1] = randomG;
		circColors[i+2] = randomB;
		circColors[i+3] = randomA;
	}
	for(var t = 0; t <= (numCirc*2) * 24; t = t + 2){
		var xCord = (Math.random() * cw);
		var yCord = (Math.random() * ch);
		cordList[t] = xCord;
		cordList[t+1] = yCord;
	}
	for(var h = 0; h <= numCirc * 24; h++){
		var width = (Math.random() * (cw/2)) + 1;
		widthList[h] = width;
	}
}
function mutateColor(colListM, colListStartM){
	var doOnceC = true;
	for(var q = colListStartM; q < ((numCirc*4)+ colListStartM); q += 4){
		var mutChance = Math.floor((Math.random() * 1000) + 1);
		//mutate a circles color randomly
		if(mutChance == 50){
			var randomA = (Math.random() + 0.05);
			var randomR = Math.floor((Math.random() * 255) + 1);
			var randomG = Math.floor((Math.random() * 255) + 1);
			var randomB = Math.floor((Math.random() * 255) + 1);
			colListM[q] = randomR;
			colListM[q+1] = randomG;
			colListM[q+2] = randomB;
			colListM[q+3] = randomA;
		}
		//mutate the order of the circles
		if(mutChance == 10 && doOnceC){
			boolSwitch = true;
			switchStart1 = q/4;
			switchStart2 = Math.floor((Math.random() * numCirc));
			var circStart = (switchStart2*4) + colListStartM;
			colListM.splice(circStart, 0, colListM[switchStart1*4], colListM[(switchStart1*4)+1], colListM[(switchStart1*4)+2], colListM[(switchStart1*4)+3]);
			colListM.splice(switchStart1*4, 4);
			doOnceC = false;
			
		}
	}
	return colListM;
}
function mutateXY(xyListM, xyListStartM){
	var doOnce = true;
	for(var l = xyListStartM; l < ((numCirc*2)+xyListStartM); l += 2){
		var mutChanceC = Math.floor((Math.random() * 1000) + 1);
		//mutate the cords of one of the circles
		if(mutChanceC == 50){
			var circXNew = (Math.random() * cw);
			var circYNew = (Math.random() * ch);
			xyListM[l] = circXNew;
			xyListM[l+1] = circYNew;
		}
		//mutate the order of the circles(only is called if the previous was called)
		if(boolSwitch && doOnce){
			var xyStart = (switchStart2*2) + xyListStartM;
			xyListM.splice(xyStart, 0, xyListM[switchStart1*2], xyListM[(switchStart1*2)+1]);
			xyListM.splice(switchStart1*2, 2);
			doOnce = false;
		}
	}
	return xyListM;
}
function mutateW(wListM, wListStartM){
	for(var l = wListStartM; l < (numCirc+wListStartM); l++){
		var mutChanceW = Math.floor((Math.random() * 1000) + 1);
		//mutate the radius of a circle randomly
		if(mutChanceW == 50){
			var randW = (Math.random() * (cw/2)) + 1;
			wListM[l] = randW;
		}
		//finish mutating the order of the circles
		if(boolSwitch){
			var widthStart = switchStart2 + wListStartM;
			wListM.splice(widthStart, 0, wListM[switchStart1]);
			wListM.splice(switchStart1, 1);
			boolSwitch = false;
		}
	}
	return wListM;
}