var ticks = 60;
var angle = -180;
var velocity = 0;
var swingStage = 0;
var defectFrame = -40;
var showDefect = false;
var drawable = false;
var drawing = false;
var changingColor = false;
var changingBrightness = false;
var changingBrushSize = false;
var gallery = false;
var lastX = 0;
var lastY = 0;
var maxBrushSize = 20;
var brushSize = 10;
var drawShape = 0;
var brightness = 0;
var farthest = {};
var nearest = {};
var hovered = -1;
var hoverExpand = 0;
var cacheSelect = -1;
var timeLimit = 60;
var timeLeft = 0;
var username = '';
var maxNameLength = 20;
var calibrationScore = 0;
var lower = -125;
var grades = ['A', 'B', 'C', 'D', 'F'];
var gradeModifiers = ['-', '', '+', '+'];
var randomGrade;
var newRandomGrade = true;
var finalGrade;
var cache = {};
var menu = true;
var textFade = -0.2;
var blinking = 0;
var shift = false;
var painting;
var imageData;
var drawingData;
// ehy

var socket = io();

function getDistance(x1, y1, x2, y2) {
	return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

var defects = {'claw': {'frames': 8, 'rate': 0.65}, 'coffee': {'frames': 19, 'rate': 0.5}, 'knife': {'frames': 22, 'rate': 0.65}};

for (var i in defects) {
	var img = new Image();
	img.src = 'defects/' + i + '.png';
	defects[i]['img'] = img;

	var img1 = new Image();
	img1.src = 'defects/' + i + '_hole.png';
	defects[i]['hole_img'] = img1;
}

var paintings = [{'name': 'American Gothic', 'artist': 'Grant Wood', 'defect': 'coffee', 'defectX': 0.65, 'defectY': 0.25},
	{'name': 'Arnolfini Portrait', 'artist': 'Jan van Eyck', 'defect': 'claw', 'defectX': 0.58, 'defectY': 0.8},
	{'name': 'Burning Skull Portrait', 'artist': 'Minecraft', 'defect': 'claw', 'defectX': 0.5, 'defectY': 0.5},
	{'name': 'Composition II', 'artist': 'Piet Mondrian', 'defect': 'coffee', 'defectX': 0.65, 'defectY': 0.65},
	{'name': 'Las Meninas', 'artist': 'Diego Velázquez', 'defect': 'claw', 'defectX': 0.45, 'defectY': 0.65},
	{'name': 'Liberty Leading the People', 'artist': 'Eugène Delacroix', 'defect': 'claw', 'defectX': 0.75, 'defectY': 0.42},
	{'name': 'Girl with a Pearl Earring', 'artist': 'Johannes Vermeer', 'defect': 'coffee', 'defectX': 0.6, 'defectY': 0.5},
	{'name': 'Mona Lisa', 'artist': 'Leonardo da Vinci', 'defect': 'claw', 'defectX': 0.47, 'defectY': 0.25},
	{'name': 'Napoleon Crossing the Alps', 'artist': 'Jacques-Louis David', 'defect': 'claw', 'defectX': 0.65, 'defectY': 0.25},
	{'name': 'Napoleon\'s withdrawal from Russia', 'artist': 'Adolph Northen', 'defect': 'coffee', 'defectX': 0.22, 'defectY': 0.5},
	{'name': 'Nighthawks', 'artist': 'Edward Hopper', 'defect': 'knife', 'defectX': 0.68, 'defectY': 0.58},
	{'name': 'Saturn Devouring his Son', 'artist': 'Francisco de Goya', 'defect': 'claw', 'defectX': 0.38, 'defectY': 0.22},
	{'name': 'Self Portrait', 'artist': 'Vincent van Gogh', 'defect': 'coffee', 'defectX': 0.43, 'defectY': 0.58},
	{'name': 'Starry Night', 'artist': 'Vincent van Gogh', 'defect': 'claw', 'defectX': 0.6, 'defectY': 0.7},
	{'name': 'Storm on the Sea of Galilee', 'artist': 'Rembrandt', 'defect': 'claw', 'defectX': 0.4, 'defectY': 0.4},
	{'name': 'Sunday on the Island of La Grande Jatte', 'artist': 'Georges Seurat', 'defect': 'coffee', 'defectX': 0.5, 'defectY': 0.5},
	{'name': 'The Death of Marat', 'artist': 'Jacques-Louis David', 'defect': 'claw', 'defectX': 0.42, 'defectY': 0.6},
	{'name': 'The Great Wave off Kanagawa', 'artist': 'Hokusai', 'defect': 'claw', 'defectX': 0.38, 'defectY': 0.25},
	{'name': 'The Lady with an Ermine', 'artist': 'Leonardo da Vinci', 'defect': 'claw', 'defectX': 0.7, 'defectY': 0.7},
	{'name': 'The Last Supper', 'artist': 'Leonardo da Vinci', 'defect': 'coffee', 'defectX': 0.48, 'defectY': 0.6},
	{'name': 'The Night Watch', 'artist': 'Rembrandt', 'defect': 'claw', 'defectX': 0.21, 'defectY': 0.59},
	{'name': 'The Persistance of Memory', 'artist': 'Salvador Dalí', 'defect': 'coffee', 'defectX': 0.5, 'defectY': 0.4},
	{'name': 'The Raft of the Medusa', 'artist': 'Théodore Géricault', 'defect': 'claw', 'defectX': 0.7, 'defectY': 0.25},
	{'name': 'The School of Athens', 'artist': 'Raphael', 'defect': 'knife', 'defectX': 0.5, 'defectY': 0.52},
	{'name': 'The Scream', 'artist': 'Edvard Munch', 'defect': 'coffee', 'defectX': 0.5, 'defectY': 0.53},
	{'name': 'The Son of Man', 'artist': 'René Magritte', 'defect': 'coffee', 'defectX': 0.48, 'defectY': 0.3},
	{'name': 'The Swing', 'artist': 'Jean-Honoré Fragonard', 'defect': 'claw', 'defectX': 0.5, 'defectY': 0.55},
	{'name': 'The Third of May', 'artist': 'Francisco de Goya', 'defect': 'coffee', 'defectX': 0.6, 'defectY': 0.45},
	{'name': 'Wanderer Above the Sea of Fog', 'artist': 'Caspar David Friedrich', 'defect': 'claw', 'defectX': 0.5, 'defectY': 0.5},
	{'name': 'Washington Crossing the Delaware', 'artist': 'Emanuel Leutze', 'defect': 'claw', 'defectX': 0.5, 'defectY': 0.4},
	{'name': 'Witches\' Sabbath', 'artist': 'Francisco de Goya', 'defect': 'claw', 'defectX': 0.5, 'defectY': 0.5}];

for (var i in paintings) {
	var img = new Image();
	img.src = 'artwork/' + paintings[i].name + '.jpg';
	paintings[i]['img'] = img;

	cache[paintings[i].name] = [];
}

function getRandomPainting() {
	return paintings[Math.floor(Math.random()*paintings.length)];
}

function getIndex(data, x, y) {
	return index = ((y*data.width) + x)*4;
}

function getImageDifference(image1, image2) {
	var error = 0;
	for (var i in image1) {
		error += (image1[i] - image2[i])*(image1[i] - image2[i]);
	}

	return error;
}

function getGrade(score, calibration) {
	return (2*calibration - score)*(100/(19*calibration/10));
}

function drawCircle(data, cx, cy, d) {
	var minX = Math.max(Math.round(cx - d/2), 0);
	var maxX = Math.min(Math.round(cx + d/2), defects[painting.defect].hole_img.width);
	var minY = Math.max(Math.round(cy - d/2), 0);
	var maxY = Math.min(Math.round(cy + d/2), defects[painting.defect].hole_img.height);

	for (var i=minX; i<=maxX; i++) {
		for (var j=minY; j<=maxY; j++) {
			if ((drawShape == 0 && getDistance(cx, cy, i, j) <= d/2) || drawShape == 1) {
				var cindex = getIndex(data, i, j);

				var canColor = false;
				if (!farthest[j] || !nearest[j]) {
					if (data.data[cindex] == 255 && data.data[cindex+1] == 255 && data.data[cindex+2] == 255) {
						farthest[j] = i;
						nearest[j] = i;
						canColor = true;
					}
				} else if ((farthest[j] <= i || nearest[j] >=i) && data.data[cindex] == 255 && data.data[cindex+1] == 255 && data.data[cindex+2] == 255) {
					if (farthest[j] < i) {
						farthest[j] = i;
						canColor = true;
					}

					if (nearest[j] > i) {
						nearest[j] = i;
						canColor = true;
					}
				} else if (farthest[j] >= i && nearest[j] <= i) {
					canColor = true;
				}

				if (canColor) {
					var colorData = context.getImageData(colorChooseX, colorChooseY, 1, 1);
					var brushColor = colorData.data.slice(0, 3);

					data.data[cindex] = brushColor[0];
					data.data[cindex+1] = brushColor[1];
					data.data[cindex+2] = brushColor[2];
				}
			}
		}
	}
}

function sendArt(paintingName, userName, grade, dataSend) {
	var sendData = ('00' + dataSend.width).slice(-3);
	sendData += ('0000' + grade.toFixed(1)).slice(-5);
	sendData += ('0' + userName.length).slice(-2) + userName;
	for (var i in dataSend.data) {
		if ((i-3)%4) {
			sendData += ('00' + dataSend.data[i]).slice(-3);
		}
	}
	socket.emit('saveArt', paintingName, sendData);
}

function reset() {
	angle = -180;
	lower = -125;
	velocity = 0;
	swingStage = 0;
	defectFrame = -40;
	showDefect = false;
	drawable = false;
	drawing = false;
	farthest = {};
	nearest = {};
	imageData = null;
	drawingData = null;
	painting = null;
	hoverExpand = 0;
	cacheSelect = -1;
	newRandomGrade = true;
	finalGrade = null;
}

var colorWheel = new Image();
colorWheel.src = 'ColorWheel.png';

var galleryIcon = new Image();
galleryIcon.src = 'gallery.png';

var repairIcon = new Image();
repairIcon.src = 'repair.png';

var backIcon = new Image();
backIcon.src = 'back.png';

var readyIcon = new Image();
readyIcon.src = 'ready.png';

var skipIcon = new Image();
skipIcon.src = 'skip.png';

var titleIcon = new Image();
titleIcon.src = 'title.png';

var canvas = document.getElementById('canvas');
canvas.style.position = 'absolute';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;

var colorWheelX = canvas.width/15;
var colorWheelY = canvas.height/10;
var colorChooseX = colorWheelX + 122;
var colorChooseY = colorWheelY + 122;

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = 'rgba(40, 40, 40, 1)';
	context.fillRect(0, 0, canvas.width, canvas.height);

	if (menu) {
		context.globalAlpha = textFade;
		context.drawImage(titleIcon, (canvas.width - titleIcon.width)/2, (canvas.height - titleIcon.height)/2 - canvas.height/6);
		context.drawImage(repairIcon, 0, 0);
		context.drawImage(galleryIcon, canvas.width - galleryIcon.width, 0);

		var labelX = 0.075;
		var labelMargin = canvas.width/350;
		var width = canvas.width/4;
		var height = canvas.height/15;
		var boxX = canvas.width/2 - width/2;
		var boxY = canvas.height/1.65;
		var r = 10;
		var blinkerHeight = height/2;

		context.fillStyle = 'rgba(255, 255, 255, 1)';
		context.font = (canvas.width/90).toString() + 'px Arial';
		context.fillText('Name', boxX + width*labelX - r, boxY + canvas.width/360);

		context.strokeStyle = 'rgba(255, 255, 255, 1)';
		context.lineWidth = 1;
		context.beginPath();
		context.moveTo(boxX + r, boxY);
		context.lineTo(boxX + width*labelX - r - labelMargin, boxY);
		context.moveTo(boxX + width*labelX - r + context.measureText('Name').width + labelMargin, boxY);
		context.lineTo(boxX + width - r, boxY);
		context.quadraticCurveTo(boxX + width, boxY, boxX + width, boxY + r);
		context.lineTo(boxX + width, boxY + height - r);
		context.quadraticCurveTo(boxX + width, boxY + height, boxX + width - r, boxY + height);
		context.lineTo(boxX + r, boxY + height);
		context.quadraticCurveTo(boxX, boxY + height, boxX, boxY + height - r);
		context.lineTo(boxX, boxY + r);
		context.quadraticCurveTo(boxX, boxY, boxX + r, boxY);
		context.stroke();
		context.closePath();

		context.font = (canvas.width/60).toString() + 'px Arial';
		context.fillText(username, boxX + r + 5, boxY + (height - blinkerHeight)/0.74);

		if (blinking < ticks/2) {
			context.fillRect(boxX + r + 6 + context.measureText(username).width, boxY + (height - blinkerHeight)/2, 2, blinkerHeight);
		}

		context.globalAlpha = 1;
	} else if (gallery) {
		if (painting) {
			context.lineWidth = 6;
			var marginX = canvas.width/120;
			var marginY = canvas.height/150;
			var size = Math.min(Math.min((canvas.height - repairIcon.height - backIcon.height - 2*context.lineWidth - 2*marginY)/painting.img.height, 1), Math.min((canvas.width/2 - 2*context.lineWidth - 2*marginX)/painting.img.width, 1));

			context.drawImage(painting.img, marginX, (canvas.height - repairIcon.height - backIcon.height)/2 - size*painting.img.height/2 + repairIcon.height, size*painting.img.width, size*painting.img.height);

			context.strokeStyle = 'rgba(10, 10, 10, 1)';
			context.beginPath();
			context.rect(marginX, (canvas.height - repairIcon.height - backIcon.height)/2 - size*painting.img.height/2 + repairIcon.height, size*painting.img.width, size*painting.img.height);
			context.stroke();
			context.closePath();

			context.fillStyle = 'rgba(25, 25, 25, 1)';
			context.fillRect(2*marginX + size*painting.img.width, 0, canvas.width - 2*marginX + size*painting.img.width, canvas.height);

			context.fillStyle = 'rgba(10, 10, 10, 1)';
			context.fillRect(2*marginX + size*painting.img.width - 4, 0, 8, canvas.height);

			var gapX = canvas.width/180;
			var gapY = canvas.height/80;
			marginY = canvas.height/50;
			var thickness = canvas.height/7;
			var imgMarginX = canvas.width/160;
			var imgMarginY = canvas.height/180;
			var textMarginX = canvas.width/50;
			context.fillStyle = 'rgba(80, 80, 80, 1)';
			context.lineWidth = 4;

			var scale = (thickness - 2*context.lineWidth - 2*imgMarginY)/painting.img.height;

			context.strokeStyle = ((cacheSelect==-1) ? 'rgba(240, 240, 240, 1)' : 'rgba(10, 10, 10, 1)');
			context.beginPath();
			context.rect(2*marginX + size*painting.img.width + 8 + gapX, marginY, canvas.width - (2*marginX + size*painting.img.width + 8 + gapX) - gapX, thickness);
			context.fill();
			context.stroke();
			context.closePath();

			context.fillStyle = 'rgba(5, 5, 5, 1)';
			context.font = (canvas.width/90).toString() + 'px Arial';
			context.fillText('Original', 2*marginX + size*painting.img.width + 8 + gapX + imgMarginX + scale*painting.img.width + textMarginX, marginY + context.lineWidth + imgMarginY + scale*painting.img.height/2 + canvas.width/360);
			context.fillText('Artist: ' + painting.artist, 2*marginX + size*painting.img.width + 8 + gapX + imgMarginX + scale*painting.img.width + 3*textMarginX + context.measureText('Original').width, marginY + context.lineWidth + imgMarginY + scale*painting.img.height/2 + canvas.width/360);

			context.fillStyle = 'rgba(80, 80, 80, 1)';

			context.drawImage(painting.img, 2*marginX + size*painting.img.width + 8 + gapX + imgMarginX, marginY + context.lineWidth + imgMarginY, scale*painting.img.width, scale*painting.img.height);
			if (cacheSelect >= 0) {
				var tempCanvas=document.createElement('canvas');
				var tempContext=tempCanvas.getContext('2d');
				tempCanvas.width = cache[painting.name][cacheSelect].data.width;
				tempCanvas.height = cache[painting.name][cacheSelect].data.height;
				tempContext.putImageData(cache[painting.name][cacheSelect].data, 0, 0);

				var drawing = new Image();
				drawing.src = tempCanvas.toDataURL();

				context.drawImage(drawing, marginX + size*(painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2), (canvas.height - repairIcon.height - backIcon.height)/2 - size*painting.img.height/2 + repairIcon.height + size*(painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2) - 0.5, size*defects[painting.defect].hole_img.width, size*defects[painting.defect].hole_img.height);
			}

			for (var i in cache[painting.name]) {
				context.strokeStyle = ((cacheSelect==i) ? 'rgba(240, 240, 240, 1)' : 'rgba(10, 10, 10, 1)');
				context.beginPath();
				context.rect(2*marginX + size*painting.img.width + 8 + gapX, (+i+1)*(thickness + gapY) + marginY, canvas.width - (2*marginX + size*painting.img.width + 8 + gapX) - gapX, thickness);
				context.fill();
				context.stroke();
				context.closePath();

				context.drawImage(painting.img, 2*marginX + size*painting.img.width + 8 + gapX + imgMarginX, (+i+1)*(thickness + gapY) + marginY + context.lineWidth + imgMarginY, scale*painting.img.width, scale*painting.img.height);

				var tempCanvas = document.createElement('canvas');
				var tempContext = tempCanvas.getContext('2d');
				tempCanvas.width = cache[painting.name][i].data.width;
				tempCanvas.height = cache[painting.name][i].data.height;
				tempContext.putImageData(cache[painting.name][i].data, 0, 0);

				var drawing = new Image();
				drawing.src = tempCanvas.toDataURL();

				context.drawImage(drawing, 2*marginX + size*painting.img.width + 8 + gapX + imgMarginX + scale*(painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2), (+i+1)*(thickness + gapY) + marginY + context.lineWidth + imgMarginY + scale*(painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2), scale*defects[painting.defect].hole_img.width, scale*defects[painting.defect].hole_img.height);
			
				context.fillStyle = 'rgba(5, 5, 5, 1)';
				context.font = (canvas.width/90).toString() + 'px Arial';
				context.fillText('Grade: ' + cache[painting.name][i].grade + '%', 2*marginX + size*painting.img.width + 8 + gapX + imgMarginX + scale*painting.img.width + textMarginX, (+i+1)*(thickness + gapY) + marginY + context.lineWidth + imgMarginY + scale*painting.img.height/2 + canvas.width/360);
				context.fillText('Artist: ' + cache[painting.name][i].artist, 2*marginX + size*painting.img.width + 8 + gapX + imgMarginX + scale*painting.img.width + 3*textMarginX + context.measureText('Grade: ' + cache[painting.name][i].grade + '%').width, (+i+1)*(thickness + gapY) + marginY + context.lineWidth + imgMarginY + scale*painting.img.height/2 + canvas.width/360);
			}

			context.drawImage(backIcon, 0, canvas.height - backIcon.height);
		} else {
			var marginX = canvas.width/6;
			var imgWidth = canvas.width/19;
			var imgHeight = canvas.height/9;
			var gapX = imgWidth/10;
			var gapY = imgHeight/10;
			var maxColumns = Math.floor((canvas.width-(2*marginX))/(imgWidth + gapX));

			context.fillStyle = 'rgba(20, 20, 20, 1)';
			context.fillRect(marginX - imgWidth/2 - gapX, canvas.height/2 - ((imgHeight + gapY)*Math.floor(Object.keys(paintings).length/maxColumns))/2 - imgHeight/2 - gapY, maxColumns*(imgWidth + gapX) + gapX, (imgHeight + gapY)*Math.ceil(Object.keys(paintings).length/maxColumns) + gapY);

			var index = 0;
			for (var i in paintings) {
				var temp = paintings[i].img;

				context.drawImage(temp, temp.width/2 - 2*imgWidth, temp.height/2.5 - 2*imgHeight, imgWidth*4, imgHeight*4, (imgWidth + gapX)*(index%maxColumns) + marginX - imgWidth/2 - ((hovered == index) ? hoverExpand*gapX : 0), (imgHeight + gapY)*Math.floor(index/maxColumns) + canvas.height/2 - ((imgHeight + gapY)*Math.floor(Object.keys(paintings).length/maxColumns))/2 - imgHeight/2 - ((hovered == index) ? hoverExpand*gapY : 0), imgWidth + ((hovered == index) ? 2*hoverExpand*gapX : 0), imgHeight + ((hovered == index) ? 2*hoverExpand*gapY : 0));
				index++;
			}
		}

		context.drawImage(repairIcon, 0, 0);
	} else {
		colorWheelX = canvas.width/19;
		colorWheelY = canvas.height/10;

		context.save();

		context.translate(canvas.width/2, canvas.height/40);
		context.rotate(angle*Math.PI / 180);
		context.translate(-canvas.width/2, -canvas.height/40);

		context.strokeStyle = 'rgba(20, 20, 20, 1)';
		context.lineWidth = 4;
		context.beginPath();
		context.moveTo((canvas.width + painting.img.width)/2 - painting.img.width/10, (canvas.height - painting.img.height)/2);
		context.lineTo(canvas.width/2, canvas.height/40);
		context.stroke();
		context.closePath();

		context.beginPath();
		context.moveTo((canvas.width - painting.img.width)/2 + painting.img.width/10, (canvas.height - painting.img.height)/2);
		context.lineTo(canvas.width/2, canvas.height/40);
		context.stroke();
		context.closePath();

		context.fillStyle = 'rgba(255, 247, 50, 1)';
		context.beginPath();
		context.arc(canvas.width/2, canvas.height/40, 6, 0, 2*Math.PI);
		context.fill();
		context.lineWidth = 2;
		context.stroke();
		context.closePath();

		context.drawImage(painting.img, (canvas.width - painting.img.width)/2, (canvas.height - painting.img.height)/2);

		context.restore();

		if (showDefect && defectFrame >= 0) {
			var defect = defects[painting.defect];

			context.globalAlpha = Math.max((-defectFrame + 100)/45, 0);
			context.drawImage(defect.img, Math.min(Math.floor(defectFrame), defect.frames-1)*(defect.img.width/defect.frames) + 1, 0, defect.img.width/defect.frames - 1, defect.img.height, (canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - (defect.img.width/defect.frames)/2, (canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defect.img.height/2, defect.img.width/defect.frames, defect.img.height);
			context.globalAlpha = 1 - context.globalAlpha;
			context.drawImage(defect.hole_img, (canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - defect.hole_img.width/2, (canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defect.hole_img.height/2);
			context.globalAlpha = 1;
		}

		if (swingStage >= 8 && swingStage < 13) {
			context.fillStyle = 'rgba(255, 255, 255, 1)';
			context.strokeStyle = 'rgba(5, 5, 5, 1)';
			context.lineWidth = 5;
			context.beginPath();
			context.rect((canvas.width + painting.img.width)/2 + canvas.width/100, lower - canvas.height/9.69, canvas.width/19.2, canvas.height/9.69);
			context.fill();
			context.stroke();
			context.closePath();

			context.fillStyle = 'rgba(5, 5, 5, 1)';
			context.fillRect((canvas.width + painting.img.width)/2 + canvas.width/100 + 0.2*canvas.width/19.2 - canvas.width/500, 0, canvas.width/240, lower - canvas.height/9.69);
			context.fillRect((canvas.width + painting.img.width)/2 + canvas.width/100 + 0.8*canvas.width/19.2 - canvas.width/500, 0, canvas.width/240, lower - canvas.height/9.69);

			if (swingStage == 9 && randomGrade) {
				context.fillStyle = 'rgba(255, 0, 0, 1)';
				context.font = (canvas.width/30).toString() + 'px Arial';
				context.fillText(randomGrade, (canvas.width + painting.img.width)/2 + canvas.width/100 + 0.5*canvas.width/19.2 - context.measureText(randomGrade).width/2, lower - 0.3*canvas.height/9.69);
			} else if (swingStage == 10 && finalGrade) {
				context.fillStyle = 'rgba(255, 0, 0, 1)';
				context.font = (canvas.width/30).toString() + 'px Arial';
				var letterGrade = ((finalGrade >= 60) ? (grades[Math.floor((100-Math.min(finalGrade, 100))/10)] + gradeModifiers[Math.floor((Math.min(finalGrade, 99)-Math.floor(Math.min(finalGrade, 99)/10)*10)/3)]) : 'F');
				context.fillText(letterGrade, (canvas.width + painting.img.width)/2 + canvas.width/100 + 0.5*canvas.width/19.2 - context.measureText(letterGrade).width/2, lower - 0.3*canvas.height/9.69);
			} else if ((swingStage == 11 || swingStage == 12) && finalGrade) {
				context.fillStyle = 'rgba(255, 0, 0, 1)';
				context.font = (canvas.width/45).toString() + 'px Arial';
				context.fillText(finalGrade.toFixed(0) + '%', (canvas.width + painting.img.width)/2 + canvas.width/100 + 0.5*canvas.width/19.2 - context.measureText(finalGrade.toFixed(0) + '%').width/2, lower - 0.33*canvas.height/9.69);
			}
		}

		if (drawable || (swingStage >= 7 && swingStage < 13)) {
			if (angle) {
				var tempCanvas = document.createElement('canvas');
				var tempContext = tempCanvas.getContext('2d');
				tempCanvas.width = drawingData.width;
				tempCanvas.height = drawingData.height;
				tempContext.putImageData(drawingData, 0, 0);

				var drawing = new Image();
				drawing.src = tempCanvas.toDataURL();

				context.save();

				context.translate(canvas.width/2, canvas.height/40);
				context.rotate(angle*Math.PI / 180);
				context.translate(-canvas.width/2, -canvas.height/40);

				context.drawImage(drawing, (canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2, (canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2);
			} else {
				context.putImageData(drawingData, (canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2, (canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2);
			}
			context.restore();
		}

		if (drawable) {
			context.drawImage(colorWheel, colorWheelX, colorWheelY);

			context.fillStyle = 'rgba(0, 0, 0, ' + brightness + ')';
			context.strokeStyle = 'rgba(20, 20, 20, 1)';
			context.beginPath();
			context.arc(colorWheelX + colorWheel.width/2, colorWheelY + colorWheel.width/2, colorWheel.width/2 - 0.5, 0, 2*Math.PI);
			context.lineWidth = 4;
			context.stroke();
			context.fill();
			context.closePath();

			context.fillStyle = 'rgba(5, 5, 5, 1)';
			context.fillRect(canvas.width/35, canvas.height/9, 6, canvas.height/4.3);
			context.fillRect(canvas.width/15, canvas.height/2.5, canvas.width/10, 6);

			context.fillStyle = 'rgba(255, 255, 255, 1)';
			context.strokeStyle = 'rgba(5, 5, 5, 1)';
			context.beginPath();
			context.arc(canvas.width/15 + ((brushSize-1)/(maxBrushSize-1))*(canvas.width/10), canvas.height/2.5 + 3, brushSize/2 + 4, 0, 2*Math.PI);
			context.lineWidth = 4;
			context.stroke();
			context.fill();
			context.closePath();

			context.fillStyle = 'rgba(255, 255, 255, 1)';
			context.beginPath();
			context.rect(canvas.width/35 - canvas.width/140, canvas.height/9 + brightness*(canvas.height/4.3) - canvas.height/160, canvas.width/70 + 6, canvas.height/80);
			context.lineWidth = 3;
			context.fill();
			context.stroke();
			context.fillStyle = 'rgba(0, 0, 0, ' + brightness + ')';
			context.fill();
			context.closePath();

			context.strokeStyle = 'rgba(0, 0, 0, 1)';
			context.beginPath();
			context.arc(colorChooseX, colorChooseY, 3, 0, 2*Math.PI);
			context.lineWidth = 1;
			context.stroke();
			context.closePath();

			var timerX = colorWheelX + colorWheel.width/2;
			var timerY = canvas.height/1.7;
			var timerR = colorWheel.width/4;

			context.fillStyle = 'rgba(255, 255, 255, 1)';
			context.strokeStyle = 'rgba(0, 0, 0, 1)';
			context.lineWidth = 4;
			context.beginPath();
			context.arc(timerX, timerY, timerR, 0, 2*Math.PI, false);
			context.fill();
			context.stroke();
			context.closePath();

			context.fillStyle = 'rgba(255, 0, 0, 1)';
			context.beginPath();
			context.moveTo(timerX, timerY);
			context.arc(timerX, timerY, timerR, 1.5*Math.PI + 2*Math.PI*(1-(timeLeft/(timeLimit*ticks))), 1.5*Math.PI, true);
			context.lineTo(timerX, timerY);
			context.fill();
			context.closePath();

			context.fillStyle = 'rgba(255, ' + 255*(timeLeft/(timeLimit*ticks)) + ', ' + 255*(timeLeft/(timeLimit*ticks)) + ', 1)';
			context.strokeStyle = 'rgba(0, 0, 0, 1)';
			context.lineWidth = 3;
			context.font = (canvas.width/60).toString() + 'px Arial';
			context.beginPath();
			context.rect(timerX - context.measureText('00:00').width/2 - canvas.width/300, canvas.height/1.44 - canvas.width/70, context.measureText('00:00').width + canvas.width/150, canvas.width/70 + canvas.height/150);
			context.fill();
			context.stroke();
			context.closePath();

			context.fillStyle = 'rgba(0, 0, 0, 1)';
			context.fillText('00:' + ('0' + Math.round(timeLeft/ticks)).slice(-2), timerX - context.measureText('00:00').width/2, canvas.height/1.44);

			var mouseX = lastX + Math.round((canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2);
			var mouseY = lastY + Math.round((canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2);
			if (mouseX >= (canvas.width - painting.img.width)/2 && mouseX <= (canvas.width - painting.img.width)/2 + painting.img.width && mouseY >= (canvas.height - painting.img.height)/2 && mouseY <= (canvas.height - painting.img.height)/2 + painting.img.height) {
				context.strokeStyle = 'rgba(0, 0, 0, 1)';
				context.beginPath();
				context.arc(lastX + Math.round((canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2), lastY + Math.round((canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2), brushSize/2 + 1, 0, 2*Math.PI);
				context.lineWidth = 1;
				context.stroke();
				context.closePath();
			}
		} else if (swingStage == 3) {
			context.drawImage(readyIcon, (canvas.width - painting.img.width)/2 - readyIcon.width - canvas.width/160, (canvas.height + painting.img.height)/2 - readyIcon.height);
			context.drawImage(skipIcon, (canvas.width + painting.img.width)/2 + canvas.width/160, (canvas.height + painting.img.height)/2 - skipIcon.height);
		}

		context.drawImage(galleryIcon, canvas.width - galleryIcon.width, 0);
	}
}

setInterval(function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context = canvas.getContext('2d');
	context.imageSmoothingEnabled = false;

	if (menu) {
		textFade = Math.max(Math.min(textFade+0.005, 1), 0);
		blinking = (blinking+0.6)%ticks;
		render();
	} else if (gallery) {
		if (hovered == -1) {
			hoverExpand = 0;
		} else if (!painting) {
			hoverExpand = Math.min(hoverExpand + 0.15, 1);
		}

		render();
	} else {
		if (!painting) {
			painting = getRandomPainting();
		}

		if (showDefect) {
			defectFrame += defects[painting.defect].rate;
		}

		render();

		switch(swingStage) {
			case 0:
				velocity += 0.35;
				if(angle >= 4) {
					velocity = -1;
					swingStage++;
				}
				break;
			case 1:
				if(Math.abs(angle) <= 2) {
					velocity = 0;
					angle = 0;
					setTimeout(function () {swingStage++;}, 200);
					swingStage++;
				}
				break;
			case 4:
				showDefect = true;
				imageData = context.getImageData(0, 0, 1, 1);
				swingStage++;
				break;
			case 5:
				imageData = context.getImageData((canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2, (canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2, defects[painting.defect].hole_img.width, defects[painting.defect].hole_img.height);
				swingStage++;
				break;
			case 8:
				if (lower < canvas.height/8) {
					lower += 2.5;
				} else {
					setTimeout(function() {swingStage++}, 3000);
					setTimeout(function() {swingStage++}, 5200);
					setTimeout(function() {swingStage++}, 6900);
					swingStage++;
				}
				break;
			case 9:
				if (!randomGrade || newRandomGrade) {
					randomGrade = grades[Math.floor(Math.random()*grades.length)] + gradeModifiers[Math.floor(Math.random()*(gradeModifiers.length-1))];
					setTimeout(function() {newRandomGrade = true;}, 150);
					newRandomGrade = false;
				}
				break;
			case 12:
				lower -= 2.5;
				angle = Math.min(angle+2.3, 180);
				if (angle >= 180) {
					reset();
				}
				break;
			case 13:
				angle = Math.min(angle+2.3, 180);
				if (angle >= 180) {
					reset();
				}
				break;
		}

		if (!drawingData && defectFrame > 0 && 1 - (-defectFrame + 100)/50 >= 1) {
			drawable = true;
			drawingData = context.getImageData((canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2, (canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2, defects[painting.defect].hole_img.width, defects[painting.defect].hole_img.height);
			calibrationScore = getImageDifference(imageData.data, drawingData.data);
			showDefect = false;
			defectFrame = -40;
			timeLeft = timeLimit*ticks;
		}

		if (drawable && timeLeft > 0) {
			timeLeft--;
			if (timeLeft == 0) {
				swingStage++;
			}
		} else if (swingStage == 7) {
			var score = getImageDifference(imageData.data, drawingData.data);
			finalGrade = getGrade(score, calibrationScore);

			drawable = false;
			sendArt(painting.name, username, finalGrade, drawingData);
			swingStage++;
		}

		angle += velocity;
	}
}, 1000/ticks);

document.addEventListener('mouseup', function(event) {
	drawing = false;
	changingColor = false;
	changingBrightness = false;
	changingBrushSize = false;
});

document.addEventListener('mousedown', function(event) {
	drawing = true;
	changingColor = false;
	changingBrightness = false;
	changingBrushSize = false;

	if (menu) {
		if (event.clientX >= canvas.width - galleryIcon.width && event.clientX <= canvas.width && event.clientY >= 0 && event.clientY <= galleryIcon.height) {
			gallery = true;
			menu = false;
			reset();
		} else if (event.clientX >= 0 && event.clientX <= repairIcon.width && event.clientY >= 0 && event.clientY <= repairIcon.height) {
			gallery = false;
			menu = false;
			reset();
		}
	} else if (gallery) {
		if (event.clientX >= 0 && event.clientX <= repairIcon.width && event.clientY >= 0 && event.clientY <= repairIcon.height) {
			gallery = false;
			reset();
		} else if (!painting && hovered != -1) {
			painting = paintings[hovered];
			var ids = [];

			for (var i in cache[painting.name]) {
				ids.push(cache[painting.name][i].id);
			}

			socket.emit('getArt', painting.name, ids);

			hoverExpand = 0;
			hovered = -1;
		} else if (painting) {
			if (event.clientX >= 0 && event.clientX <= backIcon.width && event.clientY >= canvas.height - backIcon.height && event.clientY <= canvas.height) {
				painting = null;
				cacheSelect = -1;
			} else {
				var gapX = canvas.width/180;
				var gapY = canvas.height/80;
				var marginX = canvas.width/120;
				var marginY = canvas.height/50;
				var thickness = canvas.height/7;
				var imgMarginX = canvas.width/160;
				var imgMarginY = canvas.height/180;

				var size = Math.min(Math.min((canvas.height - repairIcon.height - backIcon.height - 2*context.lineWidth - 2*marginY)/painting.img.height, 1), Math.min((canvas.width/2 - 2*context.lineWidth - 2*marginX)/painting.img.width, 1));
				var scale = (thickness - 2*context.lineWidth - 2*imgMarginY)/painting.img.height;

				var index = 0;
				for (var i=0; i<=cache[painting.name].length; i++) {
					if (event.clientX >= 2*marginX + size*painting.img.width + 8 + gapX && event.clientX <= 2*marginX + size*painting.img.width + 8 + gapX + canvas.width - (2*marginX + size*painting.img.width + 8 + gapX) - gapX && event.clientY >= index*(thickness + gapY) + marginY && event.clientY <= index*(thickness + gapY) + marginY + thickness) {
						cacheSelect = index-1;
					}

					index++;
				}
			}
		}
	} else {
		var wheelDist = getDistance(event.clientX, event.clientY, colorWheelX + colorWheel.width/2, colorWheelY + colorWheel.height/2);
		if (wheelDist <= colorWheel.width/2 + 4) {
			drawing = false;

			if (wheelDist <= colorWheel.width/2 - 4) {
				changingColor = true;

				colorChooseX = event.clientX;
				colorChooseY = event.clientY;
			}
		}

		if (event.clientX >= canvas.width/35 - canvas.width/140 - 2 && event.clientX <= canvas.width/35 - canvas.width/140 + 2 + canvas.width/70 + 6 && event.clientY <= canvas.height/4.3 + canvas.height/9 + canvas.height/160 + 2 && event.clientY >= canvas.height/9 - canvas.height/160 - 2) {
			brightness = (event.clientY - canvas.height/9)/(canvas.height/4.3);
			drawing = false;
			changingBrightness = true;
		}

		if (event.clientX >= canvas.width/15 - 4 && event.clientX <= canvas.width/15 + canvas.width/10 + 11 && event.clientY >= canvas.height/2.5 - 12 && event.clientY <= canvas.height/2.5 + 20) {
			changingBrushSize = true;
			drawing = false;

			brushSize = Math.round(Math.min(Math.max((maxBrushSize-1)*((event.clientX - canvas.width/15)/(canvas.width/10)) + 1, 1), maxBrushSize));
		}

		if (drawing && painting) {
			var cx = event.clientX - Math.round((canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2);
			var cy = event.clientY - Math.round((canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2);

			drawCircle(drawingData, cx, cy, brushSize);
		}

		if (event.clientX >= canvas.width - galleryIcon.width && event.clientX <= canvas.width && event.clientY >= 0 && event.clientY <= galleryIcon.height) {
			gallery = true;
			reset();
		}

		if (swingStage == 3) {
			if (event.clientX >= (canvas.width - painting.img.width)/2 - readyIcon.width - canvas.width/160 && event.clientX <= (canvas.width - painting.img.width)/2 - canvas.width/160 && event.clientY >= (canvas.height + painting.img.height)/2 - readyIcon.height && event.clientY <= (canvas.height + painting.img.height)/2) {
				swingStage++;
			} else if (event.clientX >= (canvas.width + painting.img.width)/2 + canvas.width/160 && event.clientX <= (canvas.width + painting.img.width)/2 + canvas.width/160 + skipIcon.width && event.clientY >= (canvas.height + painting.img.height)/2 - skipIcon.height && event.clientY <= (canvas.height + painting.img.height)/2) {
				swingStage = 13;
			}
		}

		if (painting) {
			lastX = event.clientX - Math.round((canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2);
			lastY = event.clientY - Math.round((canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2);
		}
	}
});

document.addEventListener('mousemove', function(event) {
	if (menu) {

	} else if (gallery) {
		if (!painting) {
			var marginX = canvas.width/6;
			var imgWidth = canvas.width/19;
			var imgHeight = canvas.height/9;
			var gapX = imgWidth/10;
			var gapY = imgHeight/10;
			var maxColumns = Math.floor((canvas.width-(2*marginX))/(imgWidth + gapX));

			var lastHover = hovered;
			hovered = -1;
			var index = 0;
			for (var i in paintings) {
				var temp = paintings[i].img;

				if (event.clientX >= (imgWidth + gapX)*(index%maxColumns) + marginX - imgWidth/2 && event.clientX <= (imgWidth + gapX)*(index%maxColumns) + marginX - imgWidth/2 + imgWidth && event.clientY >= (imgHeight + gapY)*Math.floor(index/maxColumns) + canvas.height/2 - ((imgHeight + gapY)*Math.floor(Object.keys(paintings).length/maxColumns))/2 - imgHeight/2 && event.clientY <= (imgHeight + gapY)*Math.floor(index/maxColumns) + canvas.height/2 - ((imgHeight + gapY)*Math.floor(Object.keys(paintings).length/maxColumns))/2 - imgHeight/2 + imgHeight) {
					hovered = index;

					if (lastHover != hovered) {
						hoverExpand = 0;
					}
					break;
				}
				index++;
			}
		}
	} else {
		if (drawable && drawing && event.clientX >= (canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2 && event.clientX <= (canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2 + defects[painting.defect].hole_img.width && event.clientY >= (canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2 && event.clientY <= (canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2 + defects[painting.defect].hole_img.height) {
			var mouseX = event.clientX - Math.round((canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2);
			var mouseY = event.clientY - Math.round((canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2);

			var distance = getDistance(lastX, lastY, mouseX, mouseY);

			for(i=0; i<distance; i+=Math.round(Math.max(brushSize/3, 1))) {
				var cx = lastX - Math.round((lastX - mouseX)*(i/distance));
				var cy = lastY - Math.round((lastY - mouseY)*(i/distance));

				drawCircle(drawingData, cx, cy, brushSize);
			}
		} else if (changingColor) {
			var wheelDist = getDistance(event.clientX, event.clientY, colorWheelX + colorWheel.width/2, colorWheelY + colorWheel.height/2);
			if (wheelDist > colorWheel.width/2 - 4) {
				colorChooseX = (colorWheelX + colorWheel.width/2) + Math.round((event.clientX - (colorWheelX + colorWheel.width/2))*((colorWheel.width/2 - 4)/wheelDist));
				colorChooseY = (colorWheelY + colorWheel.height/2) + Math.round((event.clientY - (colorWheelY + colorWheel.height/2))*((colorWheel.height/2 - 4)/wheelDist));
			} else {
				colorChooseX = event.clientX;
				colorChooseY = event.clientY;
			}
		} else if (changingBrightness) {
			var mouseY = event.clientY;

			mouseY = Math.min(canvas.height/9 + canvas.height/4.3, Math.max(event.clientY, canvas.height/9));

			brightness = (mouseY - canvas.height/9)/(canvas.height/4.3);
		} else if (changingBrushSize) {
			brushSize = Math.round(Math.min(Math.max((maxBrushSize-1)*((event.clientX - canvas.width/15)/(canvas.width/10)) + 1, 1), maxBrushSize));
		}

		if (painting) {
			lastX = event.clientX - Math.round((canvas.width - painting.img.width)/2 + painting.img.width*painting.defectX - defects[painting.defect].hole_img.width/2);
			lastY = event.clientY - Math.round((canvas.height - painting.img.height)/2 + painting.img.height*painting.defectY - defects[painting.defect].hole_img.height/2);
		}
	}
});

document.addEventListener('keydown', function(event) {
	if (menu) {
		if (username.length < maxNameLength) {
			username = username + keycode(event.keyCode, shift);
		}

		switch (event.keyCode) {
			case 8: // Backspace
				if (username.length > 0) {
					username = username.slice(0, -1);
				}
				break;
			case 16: // Shift
				shift = true;
				break;
		}
	}
});

document.addEventListener('keyup', function(event) {
	if (menu) {
		switch (event.keyCode) {
			case 16: // Shift
				shift = false;
				break;
		}
	}
});

socket.on('showArt', function(paintingName, fileID, art) {
	var width = +art.slice(0, 3);
	var grade = +art.slice(3, 8);
	var length = +art.slice(8, 10);
	var artist = art.slice(10, 10 + length);
	art = art.substring(10 + length);

	var receiveData = [];
	for (var i=0; i<art.length; i+=3) {
		receiveData.push(+(art[i] + art[i+1] + art[i+2]));

		if ((i-6)%9 == 0) {
			receiveData.push(255);
		}
	}

	var found = false;
	for (var i in cache[paintingName]) {
		if (cache[paintingName][i].id == fileID) {
			found = true;
			break;
		}
	}

	if (!found) {
		cache[paintingName].push({'id': fileID, 'grade': grade, 'artist': ((artist.length) ? artist : 'Anonymous User'), 'data': new ImageData(Uint8ClampedArray.from(receiveData), width, (receiveData.length/4)/width)});
	}
});

function keycode(keycode, shift) {
  switch (keycode) {
    case 32: // Space
      return ' ';
    case 48:
      return ((shift) ? ')' : '0');
      break;
    case 49:
      return ((shift) ? '!' : '1');
      break;
    case 50:
      return ((shift) ? '@' : '2');
      break;
    case 51:
      return ((shift) ? '#' : '3');
      break;
    case 52:
      return ((shift) ? '$' : '4');
      break;
    case 53:
      return ((shift) ? '%' : '5');
      break;
    case 54:
      return ((shift) ? '^' : '6');
      break;
    case 55:
      return ((shift) ? '&' : '7');
      break;
    case 56:
      return ((shift) ? '*' : '8');
      break;
    case 57:
      return ((shift) ? '(' : '9');
      break;
    case 65: // A
      return ((shift) ? 'A' : 'a');
      break;
    case 66:
      return ((shift) ? 'B' : 'b');
      break;
    case 67:
      return ((shift) ? 'C' : 'c');
      break;
    case 68:
      return ((shift) ? 'D' : 'd');
      break;
    case 69:
      return ((shift) ? 'E' : 'e');
      break;
    case 70:
      return ((shift) ? 'F' : 'f');
      break;
    case 71:
      return ((shift) ? 'G' : 'g');
      break;
    case 72:
      return ((shift) ? 'H' : 'h');
      break;
    case 73:
      return ((shift) ? 'I' : 'i');
      break;
    case 74:
      return ((shift) ? 'J' : 'j');
      break;
    case 75:
      return ((shift) ? 'K' : 'k');
      break;
    case 76:
      return ((shift) ? 'L' : 'l');
      break;
    case 77:
      return ((shift) ? 'M' : 'm');
      break;
    case 78:
      return ((shift) ? 'N' : 'n');
      break;
    case 79:
      return ((shift) ? 'O' : 'o');
      break;
    case 80:
      return ((shift) ? 'P' : 'p');
      break;
    case 81:
      return ((shift) ? 'Q' : 'q');
      break;
    case 82:
      return ((shift) ? 'R' : 'r');
      break;
    case 83:
      return ((shift) ? 'S' : 's');
      break;
    case 84:
      return ((shift) ? 'T' : 't');
      break;
    case 85:
      return ((shift) ? 'U' : 'u');
      break;
    case 86:
      return ((shift) ? 'V' : 'v');
      break;
    case 87:
      return ((shift) ? 'W' : 'w');
      break;
    case 88:
      return ((shift) ? 'X' : 'x');
      break;
    case 89:
      return ((shift) ? 'Y' : 'y');
      break;
    case 90:
      return ((shift) ? 'Z' : 'z');
      break;
    case 186:
      return ((shift) ? ':' : ';');
      break;
    case 187:
      return ((shift) ? '+' : '=');
      break;
    case 188:
      return ((shift) ? '<' : ',');
      break;
    case 189:
      return ((shift) ? '_' : '-');
      break;
    case 190:
      return ((shift) ? '>' : '.');
      break;
    case 191:
      return ((shift) ? '?' : '/');
      break;
    case 192:
      return ((shift) ? '~' : '`');
      break;
    case 219:
      return ((shift) ? '{' : '[');
      break;
    case 220:
      return ((shift) ? '|' : '\\');
      break;
    case 221:
      return ((shift) ? '}' : ']');
      break;
    case 222:
      return ((shift) ? '"' : "'");
      break;
    case 96: // NUMPAD begins here
      return '0';
      break;
    case 97:
      return '1';
      break;
    case 98:
      return '2';
      break;
    case 99:
      return '3';
      break;
    case 100:
      return '4';
      break;
    case 101:
      return '5';
      break;
    case 102:
      return '6';
      break;
    case 103:
      return '7';
      break;
    case 104:
      return '8';
      break;
    case 105:
      return '9';
      break;
    case 106:
      return '*';
      break;
    case 107:
      return '+';
      break;
    case 109:
      return '-';
      break;
    case 110:
      return '.';
      break;
    case 111:
      return '/';
      break;
    default:
      return '';
  }
}