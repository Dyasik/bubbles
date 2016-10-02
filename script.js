'use strict';

var WIDTH = 800;
var HEIGHT = 600;
var SIDE = 128; // px
var INTERVAL = 10;
// var PADDING_TOP_L = 18;
// var PADDING_BTM_R = 20;
var PADD = 3; // px
var RAD = SIDE / 2;
var MIN_DV = 1;
var MAX_DV = 3;
var SVG;
var ID;
var animating;
var bubbles = []; // list of bubbles

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
	// var div = document.createElement('div');
	// div.setAttribute('style', 'left: ' + p.x + 'px; top: ' + p.y + 'px;');
	// div.setAttribute('id', 'div');
	// document.body.appendChild(div);

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
		// div.setAttribute('style', 'left: ' + (p.x + SIDE/2) + 'px; top: ' + (p.y + SIDE/2) + 'px;');
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
				// rand_from_range(-PADDING_TOP_L, WIDTH - SIDE + PADDING_BTM_R),
				// rand_from_range(-PADDING_TOP_L, HEIGHT - SIDE + PADDING_BTM_R),
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
				if (dist <= SIDE - PADD) {
					console.log('collision');
					var vx1 = bub1.v.x;
					var vy1 = bub1.v.y;
					var vx2 = bub2.v.x;
					var vy2 = bub2.v.y;
					var v1 = mod(vx1, vy1);
					var v2 = mod(vx2, vy2);
					var th1 = Math.asin(vx1 / v1); // first bubble angle
					var th2 = Math.asin(vx2 / v2); // second bubble angle
					var fi = Math.asin(Math.abs(bub1.p.x - bub2.p.x) / 
						mod(bub1.p.x - bub2.p.x, bub1.p.y - bub2.p.y));
					bub1.v.x = v2 * Math.cos(th2 - fi) * Math.cos(fi) +
						v1 * Math.sin(th1 - fi) * Math.cos(fi + Math.PI/2);
					bub1.v.y = v2 * Math.cos(th2 - fi) * Math.sin(fi) +
						v1 * Math.sin(th1 - fi) * Math.sin(fi + Math.PI/2);
					bub2.v.x = v1 * Math.cos(th1 - fi) * Math.cos(fi) +
						v2 * Math.sin(th2 - fi) * Math.cos(fi + Math.PI/2);
					bub2.v.y = v1 * Math.cos(th1 - fi) * Math.sin(fi) +
						v2 * Math.sin(th2 - fi) * Math.sin(fi + Math.PI/2);
					// var tx = v1.x;
					// var ty = v1.y;
					// v1.x = v2.x;
					// v1.y = v2.y;
					// v2.x = tx;
					// v2.y = ty;
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
