'use strict';

var WIDTH = 800;
var HEIGHT = 600;
var SIDE = 127; // px
var INTERVAL = 15;
var PADDING_TOP_L = 18;
var PADDING_BTM_R = 20;
var RAD = (SIDE - PADDING_BTM_R - PADDING_TOP_L) / 2;
var MIN_DV = 1;
var MAX_DV = 5;
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
		if (p.x < -PADDING_TOP_L || p.x > WIDTH - SIDE + PADDING_BTM_R) {
			v.x *= -1;
			p.x = p.x < 0 ? -PADDING_TOP_L : WIDTH - SIDE + PADDING_BTM_R;
		}
		if (p.y < -PADDING_TOP_L || p.y > HEIGHT - SIDE + PADDING_BTM_R) {
			v.y *= -1;
			p.y = p.y < 0 ? -PADDING_TOP_L : HEIGHT- SIDE + PADDING_BTM_R;
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
		if (!animating) {
			animating = true;
			startAnim();
		}
		bubbles.push(new Bubble(
			// rand_from_range(-PADDING_TOP_L, WIDTH - SIDE + PADDING_BTM_R),
			// rand_from_range(-PADDING_TOP_L, HEIGHT - SIDE + PADDING_BTM_R),
			rand_from_range(WIDTH - SIDE + PADDING_BTM_R),
			rand_from_range(HEIGHT - SIDE + PADDING_BTM_R),
			rand_speed(),
			rand_speed(),
			SIDE
		));
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
				var x1 = bubbles[i].p.x + SIDE/2;
				var y1 = bubbles[i].p.y + SIDE/2;
				var x2 = bubbles[j].p.x + SIDE/2;
				var y2 = bubbles[j].p.y + SIDE/2;
				var v1 = bubbles[i].v;
				var v2 = bubbles[j].v;
				var dist = mod(x2 - x1, y2 - y1);
				if (dist <= RAD*2) {
					console.log('collision');
					var tx = v1.x;
					var ty = v1.y;
					v1.x = v2.x;
					v1.y = v2.y;
					v2.x = tx;
					v2.y = ty;
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
