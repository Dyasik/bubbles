'use strict';

var WIDTH = 800;
var HEIGHT = 600;
var INTERVAL = 15;
var ID;

document.addEventListener('DOMContentLoaded', init);

function init(event) {
	var main = document.querySelector('#main_svg');
	main.setAttribute('width', WIDTH);
	main.setAttribute('height', HEIGHT);
	var bub1 = document.querySelector('#bub1');
	var animating = false;
	document.addEventListener('click', function (event) {
		if (animating) {
			animating = false;
			clearTimeout(ID);
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
	ID = setTimeout(anim, INTERVAL);
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
		ID = setTimeout(anim, INTERVAL);
	}
}
