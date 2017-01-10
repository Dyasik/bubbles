'use strict';

var WIDTH = 800; // Screen width
var HEIGHT = 600; // Screen height
var SIDE = 128; // Bubble's side, px
var INTERVAL = 10; // Animation delay
var PADD = 3; // Distance between Bubble div and picture (padding), px
var RAD = SIDE / 2;
var MIN_DV = 1; // Min speed component
var MAX_DV = 3; // Max speed component
var SVG; // Screen
var ID; // For animation timeout
var animating; // Whether the animation is playing or not
var bubbles = []; // List of bubbles

function rand_from_range (min, max) {
	if (arguments.length == 1) {
		max = arguments[0];
		min = 0;
	}
	return Math.round(Math.random() * (max - min)) + min;
}

function rand_speed () {
	return rand_from_range(MIN_DV, MAX_DV) * (Math.round(Math.random(10)) % 2 ? -1 : 1);
}

function mod(a, b) {
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

// Projects vector A on vector B.
function proj(a, b) {
	var base = (a.x*b.x + a.y*b.y) / (b.x*b.x + b.y*b.y);
	return {
    	x: base * b.x,
    	y: base * b.y
 	}
}

/**
* Bubble class.
*
* @param x Number Left top corner X coord
* @param y Number Left top corner Y coord
* @param dx Number Speed's X part
* @param dy Number Speed's Y part
* @param side Number Side of the square div
* 
* @reutrns Object Bubble instance
*/
function Bubble(x, y, dx, dy, side) {
	var v = {
		x: dx,
		y: dy
	}
	var p = {
		x: x,
		y: y
	}
	var bub = document.querySelector('#bub1').cloneNode(true);
	bub.setAttribute('width', side);
	bub.setAttribute('height', side);
	bub.setAttribute('x', p.x);
	bub.setAttribute('y', p.y);		
	SVG.appendChild(bub);

	function move () {
		p.x += v.x;
		p.y += v.y;
		if (p.x < -PADD || p.x > WIDTH - SIDE + PADD) {
			v.x *= -1;
			p.x = p.x < 0 ? -PADD : WIDTH - SIDE + PADD;
		}
		if (p.y < -PADD || p.y > HEIGHT - SIDE + PADD) {
			v.y *= -1;
			p.y = p.y < 0 ? -PADD : HEIGHT - SIDE + PADD;
		}
		bub.setAttribute('x', p.x);
		bub.setAttribute('y', p.y);
	}

	return {
		v: v,
		p: p,
		move: move
	};
}

document.addEventListener('DOMContentLoaded', init);

function init(event) {
	SVG = document.querySelector('#main_svg');
	SVG.setAttribute('width', WIDTH);
	SVG.setAttribute('height', HEIGHT);
	SVG.addEventListener('click', function (event) {
		if (event.clientX < WIDTH - RAD && event.clientX > RAD &&
			event.clientY < HEIGHT - RAD && event.clientY > RAD) {
			if (!animating) {
				animating = true;
				startAnim();
			}
			bubbles.push(new Bubble(
				event.clientX - RAD,
				event.clientY - RAD,
				rand_speed(),
				rand_speed(),
				SIDE
			));
		}
	});
	SVG.addEventListener('contextmenu', function (event) {
		event.preventDefault();
		animating = false;
		clearInterval(ID);
	});
}

function startAnim() {
	ID = setTimeout(anim, INTERVAL);
	function anim() {
		if (bubbles.length !== 1) {
			for (var i = 0; i < bubbles.length - 1; i++) {
			for (var j = i + 1; j < bubbles.length; j++) {
				var bub1 = bubbles[i];
				var bub2 = bubbles[j];
				var x1 = bub1.p.x + SIDE/2 + PADD;
				var y1 = bub1.p.y + SIDE/2 + PADD;
				var x2 = bub2.p.x + SIDE/2 + PADD;
				var y2 = bub2.p.y + SIDE/2 + PADD;
				var dist = mod(x2 - x1, y2 - y1);
				if (dist <= SIDE - PADD) { // Collision!
					/* When two identical bodies collide, they 
					   swap their normal speeds, while tangent speeds
					   remain the same */
					var cl = { // central line, connects bubbles' centers
						x: x2 - x1,
						y: y2 - y1
					};
					var v1 = bub1.v;
					var v2 = bub2.v;
					// calculate normal speeds
					var v1norm = proj(v1, cl);
					var v2norm = proj(v2, cl);
					// swap 'em all!
					bub1.v.x += -v1norm.x + v2norm.x;
					bub1.v.y += -v1norm.y + v2norm.y;
					bub2.v.x += -v2norm.x + v1norm.x;
					bub2.v.y += -v2norm.y + v1norm.y;
				}
			}
			}
		}
		for (var b in bubbles) {
			bubbles[b].move();
		}
		ID = setTimeout(anim, INTERVAL);
	}
}
