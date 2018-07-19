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
var status = 0;

two = new Two({
    width: 1280,
    height: 720
}).appendTo(overlay);

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function diff (num1, num2) {
  if (num1 > num2) {
    return (num1 - num2);
  } else {
    return (num2 - num1);
  }
};

function dist (x1, y1, x2, y2) {
  var deltaX = diff(x1, x2);
  var deltaY = diff(y1, y2);
  var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  return (dist);
};

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

Array.min = function( array ){
    return Math.min.apply( Math, array );
};


//importing svgs, placing them randomly on canvas, moving them etc
function Shape(element, scale, xspeed, yspeed) {
	this.element = element;
	this.scale = scale;
	this.xspeed = xspeed;
	this.yspeed = yspeed;
	let new_element;
	let location;
	let velocity;
	let acceleration;
	let index;

	this.update = function() {
		new_element.translation.x += this.xspeed;
		new_element.translation.y += this.yspeed;
		//new_element.rotation += getRandom(0.1,0.5) * Math.cos( 0.0001 );
		this.xspeed = this.bounce(new_element.translation.x, this.xspeed,0,1000);
		this.yspeed = this.bounce(new_element.translation.y, this.yspeed,0,650);
	};

	//Bounce function
	this.bounce = function(position,speed,min,max) {
		if(position < min || position > max) {
      speed *= -1;
    }
    return speed;
	};

	this.position = function() {
		let position = new_element.translation;

		return position
	}

	this.closest = function(targets){
		let distances = [];
		let circle;

		// for (var i=0;i<targets.length;i++){
		// 	distances[i] = dist(new_element.translation.x,new_element.translation.y,targets[i].x,targets[i].y);
		// }
		for (var i=0;i<targets.length;i++){
			distance = dist(new_element.translation.x,new_element.translation.y,targets[i].x,targets[i].y);
			distances.push(distance);
			// if (distance < 100){
			// 	circle = targets[i];
			// }
		}

		var minimum = Array.min(distances);

		for (var i=0;i<targets.length;i++){
			distance = dist(new_element.translation.x,new_element.translation.y,targets[i].x,targets[i].y);
			if (distance == minimum){
				circle = targets[i];
				index = i;
			}
		}
		return circle
	}
	this.facePt = function (){
		return index
	}
	this.move = function(circle){
		var vector = new Two.Vector(circle.x,circle.y);
		var dir = vector.subSelf(location);
		dir.normalize();
		dir.multiplyScalar(0.5);
		acceleration = dir;

		velocity.addSelf(acceleration);
		let new_velocity = this.limit(velocity,2);
		location.addSelf(new_velocity);
		new_element.translation = location;
	}
	this.calcMag = function(v) {
		let magnitude = Math.sqrt(v.x * v.x + v.y * v.y);

		return magnitude
	}
	this.limit = function(vector, max) {
		let magnitude = this.calcMag(vector);

		if (magnitude > max) {
			var v = max/magnitude;
			magnitude = magnitude * v;
			vector.x = vector.x * v;
			vector.y = vector.y * v;
		}
		//console.log(this.mag);
		//console.log(Math.sqrt(vector.x * vector.x + vector.y * vector.y));
		return vector
	}
  this.display = function() {
		let first = document.querySelector(this.element);
		new_element = two.interpret(first);
		new_element.translation.set(getRandom(0,1000),getRandom(0,650));
		location = new Two.Vector(new_element.translation.x,new_element.translation.y);
		velocity = new Two.Vector(0,0);
		acceleration = new Two.Vector(this.xspeed,this.yspeed);

		return new_element
  }
}

var reds = [];
var blues = [];
var yellows = [];
var pinks = [];
var redDots = [];
var squigglies = [];
var whities = [];


for(var i=0;i<5;i++){
	red = new Shape('#red',1,3,2);
	red.display();
	reds.push(red);

	blue = new Shape('#blue',1,2,-3);
	blue.display();
	blues.push(blue);

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
}
reds.splice(0,1);
blues.splice(0,1);
two.renderer.domElement.style.background = '#1DA1F2';
//two.update();
let anchors = [];

two.bind('update', function(frameCount) {
	var face_Pts = [];
	two.clear();

	//reorganize list into dictionary with point objects
	if (face) {
		for (var i=0;i<54;i+=2) {
			// var circle = two.makeCircle(face.vertices[i], face.vertices[i+1], 5);
			var point = {};
			point['x'] = face.vertices[i];
			point['y'] = face.vertices[i+1];
			face_Pts.push(point);
		}
		//draw circles on face points
		// for(var j=0;j<face_Pts.length;j++){
		// 	var circle = two.makeCircle(face_Pts[j].x, face_Pts[j].y, 5);
		// }

		// for (var i=0;i<54;i+=2){
		// 	//var circle = two.makeCircle(face.vertices[i], face.vertices[i+1], 5);
		// 	two.makePath(face.vertices[i], face.vertices[i+1], face.vertices[i+2], face.vertices[i+3], open);
		// }
	}

	//if smiling, stop shape movement
	if (smileFactor == 1) {
		console.log("smiling");
		if (status == 0) {
			for(let i=0;i<reds.length;i++) {
					let circle = reds[i].closest(face_Pts);
					anchors.push(reds[i]);
					anchors.push(circle);

					let circle_B = blues[i].closest(face_Pts);
					anchors.push(blues[i]);
					anchors.push(circle_B);
			}
			status = 1;
		} else {
			//draw circles + move shapes
			for (var i=0;i<anchors.length;i+=2){
				let index = anchors[i].facePt();
				let position = anchors[i].position();
				two.makeCircle(face_Pts[index].x, face_Pts[index].y, 5);
				var line = two.makeLine(position.x,position.y, face_Pts[index].x, face_Pts[index].y);
				line.stroke = 'orangered';
				anchors[i].move(anchors[i+1]);
			}
		}
		// for(let i=0;i<blues.length;i++) {
		// 		blues[i].closest(face_Pts);
		// 		//let pt = face_Pts[which];
		// 		//blues[i].move(pt);
		// 	}
	} else {
		anchors = [];
		status = 0;
		for(let i=0;i<reds.length;i++) {
	  		reds[i].update();
	   		blues[i].update();
				//yellows[i].update();
				//pinks[i].update();
				//redDots[i].update();
				//squigglies[i].update();
				//whities[i].update();
	 	}
	 }

}).play();
