var smileFactor;
var face;

(function exampleCode() {
	"use strict";

	brfv4Example.initCurrentExample = function(brfManager, resolution) {
		brfManager.init(resolution, resolution, brfv4Example.appId);
	};

	brfv4Example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		draw.clear();

		// Face detection results: a rough rectangle used to start the face tracking.

		draw.drawRects(brfManager.getAllDetectedFaces(),	false, 1.0, 0x00a1ff, 0.5);
		draw.drawRects(brfManager.getMergedDetectedFaces(),	false, 2.0, 0xffd200, 1.0);

		var faces = brfManager.getFaces(); // default: one face, only one element in that array.

		for(var i = 0; i < faces.length; i++) {

			face = faces[i];

			if(		face.state === brfv4.BRFState.FACE_TRACKING_START ||
					face.state === brfv4.BRFState.FACE_TRACKING) {

				// Smile Detection

				setPoint(face.vertices, 48, p0); // mouth corner left
				setPoint(face.vertices, 54, p1); // mouth corner right
				//console.log(face.vertices);

				var mouthWidth = calcDistance(p0, p1);

				setPoint(face.vertices, 39, p1); // left eye inner corner
				setPoint(face.vertices, 42, p0); // right eye outer corner

				var eyeDist = calcDistance(p0, p1);
				smileFactor = mouthWidth / eyeDist;

				smileFactor -= 1.40; // 1.40 - neutral, 1.70 smiling

				if(smileFactor > 0.25) smileFactor = 0.25;
				if(smileFactor < 0.00) smileFactor = 0.00;

				smileFactor *= 4.0;

				if(smileFactor < 0.0) { smileFactor = 0.0; }
				if(smileFactor > 1.0) { smileFactor = 1.0; }

				//console.log(smileFactor);
				// Let the color show you how much you are smiling.

				var color =
					(((0xff * (1.0 - smileFactor) & 0xff) << 16)) +
					(((0xff * smileFactor) & 0xff) << 8);

				// Face Tracking results: 68 facial feature points.

				//draw.drawTriangles(	face.vertices, face.triangles, false, 1.0, color, 0.4);
				//draw.drawVertices(	face.vertices, 2.0, false, color, 0.4);

				// brfv4Example.dom.updateHeadline("BRFv4 - intermediate - face tracking - simple " +
				// 	"smile detection.\nDetects how much someone is smiling. smile factor: " +
				// 	(smileFactor * 100).toFixed(0) + "%");
				brfv4Example.dom.updateHeadline((smileFactor * 100).toFixed(0) + "%");
			}
		}
	};

	var p0				= new brfv4.Point();
	var p1				= new brfv4.Point();

	var setPoint		= brfv4.BRFv4PointUtils.setPoint;
	var calcDistance	= brfv4.BRFv4PointUtils.calcDistance;

	// brfv4Example.dom.updateHeadline("BRFv4 - intermediate - face tracking - simple smile " +
	// 	"detection.\nDetects how much someone is smiling.");
	//
	// brfv4Example.dom.updateCodeSnippet(exampleCode + "");
})();

var overlay = document.getElementById("overlay");
var red;
var blue;
var yellow;
var redDot;
var pink;
var squiggly;
var two;

two = new Two({
    width: 1280,
    height: 720
}).appendTo(overlay);

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}


//importing svgs, placing them randomly on canvas, moving them
function Shape(element, scale, xspeed, yspeed) {
	this.element = element;
	// this.amount = amount;
	this.scale = scale;
	this.xspeed = xspeed;
	this.yspeed = yspeed;
	let elements = [];
	let new_element;

	this.update = function(){
		let timer = 0.0001 * Date.now();
		//for (var i=0;i<elements.length;i++) {
		new_element.translation.x += this.xspeed;
		new_element.translation.y += this.yspeed;
		//new_element.rotation += getRandom(0.1,0.5) * Math.cos( 0.0001 );
		//console.log(Math.sin(180) * 200);
		this.xspeed = this.bounce(new_element.translation.x, this.xspeed,0,1000);
		this.yspeed = this.bounce(new_element.translation.y, this.yspeed,0,650);
		//console.log(elements[i].translation.x);
		//}
	};

	//Bounce function
	this.bounce = function(position,speed,min,max) {
		if(position < min || position > max) {
      speed *= -1;
    }
    return speed;
	};

  this.display = function() {
		let first = document.querySelector(this.element);
		//for (var i=0; i<this.amount;i++) {
		new_element = two.interpret(first);
		new_element.translation.set(getRandom(0,1000),getRandom(0,650));
			//elements.push(new_element);
		//}
		return new_element
  }

	this.pt = function() {
		let position = [];
		position.push (new_element.translation.x);
		position.push (new_element.translation.y);
		return position;
	}
}

var reds = [];
var blues = [];
var yellows = [];
var pinks = [];
var redDots = [];
var squigglies = [];
var whities = [];

// for(var i=0;i<10;i++){
// 	red = new Shape('#red',1,3,2);
// 	red.display();
// 	reds.push(red);
//
// 	blue = new Shape('#blue',1,-3,-2);
// 	blue.display();
// 	blues.push(blue);
//
// 	yellow = new Shape('#yellow',1,1,1);
// 	yellow.display();
// 	yellows.push(yellow);
//
// 	pink = new Shape('#pink',1,4,1);
// 	pink.display();
// 	pinks.push(pink);
//
// 	redDot = new Shape('#redDot',1,-4,-2);
// 	redDot.display();
// 	redDots.push(redDot);
//
// 	squiggly = new Shape('#squiggly',1,-5,-3);
// 	squiggly.display();
// 	squigglies.push(squiggly);
//
// 	white = new Shape('#white',1,-1,-2);
// 	white.display();
// 	whities.push(white);
// }

two.renderer.domElement.style.background = '#1DA1F2';
//two.update();

two.bind('update', function(frameCount) {
	//console.log(left_face_x);
	two.clear();
	if (face){
		for (var i=0;i<54;i+=2){
			var circle = two.makeCircle(face.vertices[i], face.vertices[i+1], 5);
		}

		// for (var i=0;i<54;i+=2){
		// 	//var circle = two.makeCircle(face.vertices[i], face.vertices[i+1], 5);
		// 	two.makePath(face.vertices[i], face.vertices[i+1], face.vertices[i+2], face.vertices[i+3], open);
		// }
		console.log("yes");
	}
  // This code is called everytime two.update() is called.
  // Effectively 60 times per second.
	// if (smileFactor == 1) {
	// 	console.log("smiling");
	// 	// let center = reds[0].pt();
	// 	// console.log(center);
	// } else {
	// 	for(let i=0;i<reds.length;i++){
	// 		reds[i].update();
	// 		blues[i].update();
	// 		yellows[i].update();
	// 		pinks[i].update();
	// 		redDots[i].update();
	// 		squigglies[i].update();
	// 		whities[i].update();
	// 	}
	// }

}).play();  // Finally, start the animation loop
