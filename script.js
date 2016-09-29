'use strict';

var WIDTH = 1280;
var HEIGHT = 800;
var INTERVAL = 15;

document.addEventListener('DOMContentLoaded', init);

function init(event) {
	var main = document.querySelector('#main');
	main.setAttribute('width', WIDTH);
	main.setAttribute('height', HEIGHT);
	var bub1 = document.querySelector('#bub1');
	var animating = false;
	document.addEventListener('click', function (event) {
		if (animating) {
			animating = false;
			clearTimeout(id);
		} else {
			animating = true;
			startAnim();
		}
	});
}

function startAnim() {
	var v = {
		x: 2,
		y: 4
	}
	var p = {
		x: 0,
		y: 0
	}
	var id = setTimeout(anim, INTERVAL);
	function anim() {
		p.x += v.x;
		p.y += v.y;
		if (p.y < 0 || p.y > HEIGHT - 100) {
			v.y *= -1;
		} 
		if (p.x < 0 || p.x > WIDTH - 100) {
			v.x *= -1;
		}
		bub1.setAttribute('x', p.x);
		bub1.setAttribute('y', p.y);
		id = setTimeout(anim, INTERVAL);
	}
}
