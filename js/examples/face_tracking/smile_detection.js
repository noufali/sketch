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
	this.facePt = function(){
		return index
	}
	this.move = function(position, circle){
		var vector = new Two.Vector(circle.x,circle.y);
		var dir = vector.subSelf(position);
		//setting acceleration - rate of change for velocity which is 0.5 movement in x and y direction
		dir = this.setMag(dir,0.5);
		//dir.normalize();
		//dir.multiplyScalar(2);
		acceleration = dir;

		//adding rate of change to velocity so it moves
		velocity.addSelf(acceleration);
		//limiting distance from target destination to 5 vector length
		let new_velocity = this.limit(velocity,5);
		//adding velocity to position of object so it moves
		position.addSelf(new_velocity);
		new_element.translation = position;
	}
	this.setMag = function(vector, smthg) {
    let magnitude = this.calcMag(vector);

    if (magnitude != 0) {
      var v = smthg/magnitude;
      magnitude = magnitude * v;
      vector.x = vector.x * v;
      vector.y = vector.y * v;
    }
		return vector
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
		//console.log(Math.sqrt(vector.x * vector.x + vector.y * vector.y));
		return vector
	}
  this.display = function() {
		let first = document.querySelector(this.element);
		new_element = two.interpret(first);
		new_element.translation.set(getRandom(0,1000),getRandom(0,650));
		new_element.scale = this.scale;
		location = new Two.Vector(new_element.translation.x,new_element.translation.y);
		velocity = new Two.Vector(0,0);
		acceleration = new Two.Vector(0,0);

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


for(var i=0;i<10;i++){
	red = new Shape('#red',0.75,3,2);
	red.display();
	reds.push(red);

	blue = new Shape('#blue',0.75,2,-3);
	blue.display();
	blues.push(blue);

	yellow = new Shape('#yellow',0.75,1,1);
	yellow.display();
	yellows.push(yellow);

}

for(var i=0;i<20;i++){
	pink = new Shape('#pink',1,4,1);
	pink.display();
	pinks.push(pink);

	redDot = new Shape('#redDot',1,-4,-2);
	redDot.display();
	redDots.push(redDot);

	squiggly = new Shape('#squiggly',0.75,-5,-3);
	squiggly.display();
	squigglies.push(squiggly);

	// white = new Shape('#white',1,-1,-2);
	// white.display();
	// whities.push(white);
}

reds.splice(0,1);
blues.splice(0,1);
yellows.splice(0,1);
squigglies.splice(0,1);
pinks.splice(0,1);
redDots.splice(0,1);
//whities.splice(0,1);
two.renderer.domElement.style.background = '#1DA1F2';
//two.update();
let anchors = [];

two.bind('update', function(frameCount) {
	var face_Pts = [];
	var a_Pts = [];
	var d_Pts = [];
	var p_Pts = [];
	two.clear();

	//reorganize list into dictionary with point objects
	if (face) {
		// D LETTER
		// two.makeCircle(face.vertices[66], face.vertices[67], 5).noStroke().fill = '#FF8000';
		// two.makeCircle(face.vertices[60], face.vertices[61], 5).noStroke().fill = '#FF8000';
		// two.makeCircle(face.vertices[58], face.vertices[59], 5).noStroke().fill = '#FF8000';
		// two.makeCircle(face.vertices[56], face.vertices[57], 5).noStroke().fill = '#FF8000';
		// two.makeCircle(face.vertices[54], face.vertices[55]-20, 5).noStroke().fill = '#FF8000';
		// two.makeCircle(face.vertices[84], face.vertices[85]-30, 5).noStroke().fill = '#FF8000'; //right eye - 42
		// two.makeCircle(face.vertices[90]+20, face.vertices[91]+50, 5).noStroke().fill = '#FF8000';

		//let d = two.makeCurve(face.vertices[66], face.vertices[67],face.vertices[60], face.vertices[61],face.vertices[58], face.vertices[59],face.vertices[56], face.vertices[57],face.vertices[54], face.vertices[55]-20,face.vertices[84], face.vertices[85]-30,face.vertices[90]+20, face.vertices[91]+50);
		d_Pts.push( {'x':face.vertices[66],'y':face.vertices[67]} );
		d_Pts.push( {'x':face.vertices[60],'y':face.vertices[61]} );
		d_Pts.push( {'x':face.vertices[58],'y':face.vertices[59]} );
		d_Pts.push( {'x':face.vertices[56],'y':face.vertices[57]} );
		d_Pts.push( {'x':face.vertices[54],'y':face.vertices[55]-20} );
		d_Pts.push( {'x':face.vertices[84],'y':face.vertices[85]-30} );
		d_Pts.push( {'x':face.vertices[90]+20,'y':face.vertices[91]+50} );

		//mouth - 51
		// two.makeCircle(face.vertices[98], face.vertices[99], 5);

		// P LETTER
		// two.makeCircle(face.vertices[96], face.vertices[97], 5).noStroke().fill = '#FF8000';
		// two.makeCircle(face.vertices[8]-50, face.vertices[9], 5).noStroke().fill = '#FF8000';
		// two.makeCircle(face.vertices[8]-50, face.vertices[9]+100, 5).noStroke().fill = '#FF8000';
		// two.makeCircle(face.vertices[8]-50, face.vertices[9]+130, 5).noStroke().fill = '#FF8000';

		//let p = two.makeCurve(face.vertices[8]-50, face.vertices[9]+130,face.vertices[8]-50, face.vertices[9]+100,face.vertices[8]-50, face.vertices[9],face.vertices[96], face.vertices[97],face.vertices[8]-50, face.vertices[9]+100,true);
		p_Pts.push( {'x':face.vertices[8]-50,'y':face.vertices[9]+130} );
		p_Pts.push( {'x':face.vertices[8]-50,'y':face.vertices[9]+100} );
		p_Pts.push( {'x':face.vertices[8]-50,'y':face.vertices[9]} );
		p_Pts.push( {'x':face.vertices[96],'y':face.vertices[97]} );


		for (var i=0;i<54;i+=2) {
			// var circle = two.makeCircle(face.vertices[i], face.vertices[i+1], 5);
			var point = {};
			point['x'] = face.vertices[i];
			point['y'] = face.vertices[i+1];
			face_Pts.push(point);
		}
		// A LETTER
		// two.makeCircle(face_Pts[19].x+40, face_Pts[19].y-30, 5).noStroke().fill = '#FF8000';
		// two.makeCircle(face_Pts[19].x, face_Pts[19].y-70, 5).noStroke().fill = '#FF8000';
		// two.makeCircle(face_Pts[18].x-10, face_Pts[18].y-30, 5).noStroke().fill = '#FF8000';
		// two.makeCircle(face.vertices[78], face.vertices[79], 5).noStroke().fill = '#FF8000'; //left eye - 39
		// two.makeCircle(face.vertices[72]-30, face.vertices[73]+10, 5).noStroke().fill = '#FF8000';


		//let a = two.makeCurve(face.vertices[78], face.vertices[79],face_Pts[19].x+40, face_Pts[19].y-30,face_Pts[19].x, face_Pts[19].y-70, face_Pts[18].x-10, face_Pts[18].y-30,face.vertices[72]-30, face.vertices[73]+10,true);
		a_Pts.push( {'x':face.vertices[78],'y':face.vertices[79]} );
		a_Pts.push( {'x':face_Pts[19].x+40, 'y':face_Pts[19].y-30} );
		a_Pts.push( {'x':face_Pts[19].x, 'y':face_Pts[19].y-70} );
		a_Pts.push( {'x':face_Pts[18].x-10, 'y':face_Pts[18].y-30} );
		a_Pts.push( {'x':face.vertices[72]-30, 'y':face.vertices[73]+10} );

		//let a_cross = two.makeLine(face_Pts[19].x+40, face_Pts[19].y-30, face_Pts[18].x-10, face_Pts[18].y-30);

		//draw circles on face points
		// for(var j=0;j<face_Pts.length;j++){
		// 	var circle = two.makeCircle(face_Pts[j].x, face_Pts[j].y, 5);
		// }

		// for (var i=0;i<54;i+=2){
		// 	//var circle = two.makeCircle(face.vertices[i], face.vertices[i+1], 5);
		// 	two.makePath(face.vertices[i], face.vertices[i+1], face.vertices[i+2], face.vertices[i+3], open);
		// }
		for(let i=0;i<d_Pts.length;i++) {
			a_Pts.push(d_Pts[i]);
		}
		for(let i=0;i<p_Pts.length;i++) {
			a_Pts.push(p_Pts[i]);
		}
	}

	//if smiling, stop shape movement
	if (smileFactor == 1) {
		console.log("smiling");
		if (status == 0) {
			for(let i=0;i<reds.length;i++) {
					let circle = reds[i].closest(a_Pts);
					anchors.push(reds[i]);
					anchors.push(circle);

					let circle_B = blues[i].closest(a_Pts);
					anchors.push(blues[i]);
					anchors.push(circle_B);

					let circle_Y = yellows[i].closest(a_Pts);
					anchors.push(yellows[i]);
					anchors.push(circle_Y);

					// let circle_S = squigglies[i].closest(a_Pts);
					// anchors.push(squigglies[i]);
					// anchors.push(circle_S);

					// let circle_P = pinks[i].closest(a_Pts);
					// anchors.push(pinks[i]);
					// anchors.push(circle_P);
					//
					// let circle_R = redDots[i].closest(a_Pts);
					// anchors.push(redDots[i]);
					// anchors.push(circle_R);
					//
					// let circle_W = whities[i].closest(a_Pts);
					// anchors.push(whities[i]);
					// anchors.push(circle_W);
			}
			status = 1;
		} else {
			let a = two.makeCurve(a_Pts[0].x,a_Pts[0].y,a_Pts[1].x,a_Pts[1].y,a_Pts[2].x,a_Pts[2].y,a_Pts[3].x,a_Pts[3].y,a_Pts[4].x,a_Pts[4].y,true);
			let a_cross = two.makeLine(a_Pts[1].x,a_Pts[1].y,a_Pts[3].x,a_Pts[3].y);

			let d = two.makeCurve(d_Pts[0].x,d_Pts[0].y,d_Pts[1].x,d_Pts[1].y,d_Pts[2].x,d_Pts[2].y,d_Pts[3].x,d_Pts[3].y,d_Pts[4].x,d_Pts[4].y,d_Pts[5].x,d_Pts[5].y,d_Pts[6].x,d_Pts[6].y,);

			let p = two.makeCurve(p_Pts[0].x,p_Pts[0].y,p_Pts[1].x,p_Pts[1].y,p_Pts[2].x,p_Pts[2].y,p_Pts[3].x,p_Pts[3].y,p_Pts[1].x,p_Pts[1].y,true);

			a.noFill();
			a.stroke = 'rgba(255, 255, 255, 0.9)';
			a.linewidth = 15;
			a_cross.noFill();
			a_cross.stroke = 'rgba(255, 255, 255, 0.9)';
			a_cross.linewidth = 15;

			d.stroke = 'rgba(255, 255, 255, 0.9)';
			d.noFill();
			d.linewidth = 15;

			p.noFill();
			p.stroke = 'rgba(255, 255, 255, 0.9)';
			p.linewidth = 15;

			//draw circles + move shapes
			for (var i=0;i<anchors.length;i+=2){
				let index = anchors[i].facePt();
				let position = anchors[i].position();
				//let pt = two.makeCircle(a_Pts[index].x, a_Pts[index].y, 2);
				//pt.fill = "black";
				//pt.noStroke();
				var line = two.makeLine(position.x,position.y, a_Pts[index].x, a_Pts[index].y);
				line.stroke = 'rgba(255, 255, 255, 0.9)';
				anchors[i].move(position,a_Pts[index]);
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
				yellows[i].update();
				pinks[i].update();
				redDots[i].update();
				squigglies[i].update();
				//whities[i].update();
	 	}
	 }

}).play();
