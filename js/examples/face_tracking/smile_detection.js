var smileFactor;

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

			var face = faces[i];

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

				draw.drawTriangles(	face.vertices, face.triangles, false, 1.0, color, 0.4);
				draw.drawVertices(	face.vertices, 2.0, false, color, 0.4);

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
    width: 3500,
    height: 750
}).appendTo(overlay);

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

//importing svgs, placing them randomly on canvas, moving them
function Shape(element,amount, scale, xspeed, yspeed) {
	this.element = element;
	this.amount = amount;
	this.scale = scale;
	this.xspeed = xspeed;
	this.yspeed = yspeed;
	let elements = [];
	let new_element;

	this.update = function(){
		for (var i=0;i<elements.length;i++) {
			elements[i].translation.x += this.xspeed;
			elements[i].translation.y += this.yspeed;
			this.xspeed = this.bounce(elements[i].translation.x, this.xspeed,0,1000);
			this.yspeed = this.bounce(elements[i].translation.y, this.yspeed,0,550);
		}
	};

	//Bounce function
	this.bounce = function(position,speed,min,max) {
		if(position < min || position > max) {
      speed *= -1;
    }
    return speed;
	};

  // this.bounce = function(){
	// 	//console.log(elements);
	// 	for (var i=0;i<elements.length;i++) {
	// 		elements[i].translation.x += this.xspeed;
	// 		elements[i].translation.y += this.yspeed;
	//
	// 		// if(elements[i].translation.x < 0 || elements[i].translation.x > 1000) {
	//     //   xspeed *= -1;
	//     // }
	// 		// if(elements[i].translation.y < 0 || elements[i].translation.y > 650) {
	// 		// 	yspeed *= -1;
	// 		// }
  // 	};
	// }

  this.display = function() {
		let first = document.querySelector(this.element);
		for (var i=0; i<this.amount;i++) {
			new_element = two.interpret(first);
			new_element.translation.set(getRandom(0,1000),getRandom(0,650));
			elements.push(new_element);
		}
		return elements
  }
}

red = new Shape('#red',10,1,3,2);
red.display();
console.log(red);
blue = new Shape('#blue',10,1,3,2);
blue.display();
yellow = new Shape('#yellow',10,1,3,2);
yellow.display();
redDot = new Shape('#redDot',10,1,3,2);
redDot.display();
pink = new Shape('#pink',10,1,3,2);
pink.display();
squiggly = new Shape('#squiggly',10,1,3,2);
squiggly.display();

//two.renderer.domElement.style.background = '#1DA1F2';
//two.update();

two.bind('update', function(frameCount) {
  // This code is called everytime two.update() is called.
  // Effectively 60 times per second.
	red.update();
	blue.update();
	yellow.update();
	pink.update();
	redDot.update();
	squiggly.update();

}).play();  // Finally, start the animation loop
