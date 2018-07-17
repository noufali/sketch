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

	this.closest = function(targets){
		// var location = new pVector(new_element.translation.x,new_element.translation.y);
		// var velocity = new pVector(0,0);
		// var acceleration = new pVector(0,0);
		let distances = {};

		function getKeyByValue(object, value) {
		  return Object.keys(object).find(key => object[key] === value);
		}

		for (var i=0;i<targets.length;i++){
			distances[i] = dist(new_element.translation.x,new_element.translation.y,targets[i].x,targets[i].y);
		}
		var arr = Object.keys( distances ).map(function ( key ) { return distances[key]; });
		var min = Math.min.apply( null, arr );
		var which = getKeyByValue(distances,min);

		return which
	}
	this.move = function(point){
		new_element.translation.set(point.x,point.y);
		return new_element
	}
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

function pVector(x, y) {
  this.x = x;
  this.y = y;
	this.mag = 0;

  this.add = function(n) {
    this.x = this.x + n.x;
    this.y = this.y + n.y;
  }

  this.display = function(o) {
		two.makePath(this.x,this.y,o.x,o.y);
  }

  this.subtract = function(s) {
    this.x = this.x - s.x;
    this.y = this.y - s.y;
  }

  this.multiply = function(m) {
    this.x = this.x * m;
    this.y = this.y * m;
  }

  this.calcMag = function() {
    this.mag = Math.sqrt(this.x * this.x + this.y * this.y);
    //console.log(this.mag);
  }

  this.setMag = function(smthg) {
    this.calcMag();

    if (this.mag != 0) {
      var v = smthg/this.mag;
      this.mag = this.mag * v;
      this.x = this.x * v;
      this.y = this.y * v;

      //console.log(this.mag);
    }

  }

  this.norm = function() {
    var m = Math.sqrt(this.x * this.x + this.y * this.y);
    if (m != 0) {
      this.x = this.x / m;
      this.y = this.y / m;
    }
  }

  this.limit = function(max) {
    this.calcMag();

    if (this.mag > max) {
      //this.mag = max;
      var v = max/this.mag;
      this.mag = this.mag * v;
      this.x = this.x * v;
      this.y = this.y * v;
    }
    //console.log(this.mag);
    console.log(sqrt(this.x * this.x + this.y * this.y));
  }
}

var reds = [];
var blues = [];
var yellows = [];
var pinks = [];
var redDots = [];
var squigglies = [];
var whities = [];

for(var i=0;i<10;i++){
	red = new Shape('#red',1,3,2);
	red.display();
	reds.push(red);

	blue = new Shape('#blue',1,-3,-2);
	blue.display();
	blues.push(blue);
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
}

two.renderer.domElement.style.background = '#1DA1F2';
//two.update();

two.bind('update', function(frameCount) {
	var face_Pts = [];
	//console.log(left_face_x);
	two.clear();
	//reorganize list into dictionary with point objects
	if (face) {
		for (var i=0;i<54;i+=2){
			// var circle = two.makeCircle(face.vertices[i], face.vertices[i+1], 5);
			var point = {};
			point['x'] = face.vertices[i];
			point['y'] = face.vertices[i+1];
			face_Pts.push(point);
		}
		//draw circles on face points
		for(var j=0;j<face_Pts.length;j++){
			var circle = two.makeCircle(face_Pts[j].x, face_Pts[j].y, 5);
		}
		// for (var i=0;i<54;i+=2){
		// 	//var circle = two.makeCircle(face.vertices[i], face.vertices[i+1], 5);
		// 	two.makePath(face.vertices[i], face.vertices[i+1], face.vertices[i+2], face.vertices[i+3], open);
		// }
	}
	//if smiling, stop shape movement
	if (smileFactor == 1) {
		console.log("smiling");
		for(let i=0;i<reds.length;i++) {
				let which = reds[i].closest(face_Pts);
				let pt = face_Pts[which];
	  		reds[i].move(pt);
			}
		for(let i=0;i<blues.length;i++) {
				let which = blues[i].closest(face_Pts);
				let pt = face_Pts[which];
				blues[i].move(pt);
			}
	} else {
		for(let i=0;i<reds.length;i++) {
	  		reds[i].update();
	   		blues[i].update();
	// 		yellows[i].update();
	// 		pinks[i].update();
	// 		redDots[i].update();
	// 		squigglies[i].update();
	// 		whities[i].update();
	 	}
	 }

}).play();  // Finally, start the animation loop
