import {loadImage, clear, moveForResizeWindow, randomInt} from "./help_functions.js";

const pinsContainer = document.querySelector('.board-pins_container');

const pinWhiteBoard = "../img/pins/pin1_style3.png";
const pinCorkBoard = ["../img/pins/pin1_style1.png", "../img/pins/pin2_style1.png", 
		"../img/pins/pin3_style1.png", "../img/pins/pin4_style1.png",
		"../img/pins/pin5_style1.png"];
const pinGraphiteBoard = ["../img/pins/pin1_style2.png", "../img/pins/pin2_style2.png", 
		"../img/pins/pin3_style2.png", "../img/pins/pin4_style2.png",
		"../img/pins/pin5_style2.png"];

export function createNewPin(canvas, currentStyle) {
	const newPin = document.createElement('img');
	
	styleOfPin(newPin, currentStyle);
	newPin.classList.add('pin');

	newPin.style.position = 'absolute';
	newPin.style.left = canvas.getBoundingClientRect().left + canvas.getBoundingClientRect().width / 2 + window.pageXOffset + 'px';
	newPin.style.top = canvas.getBoundingClientRect().top + canvas.getBoundingClientRect().height / 2 + window.pageYOffset + 'px';

	addNewPin(newPin);
}	

function addNewPin(newPin) {
	pinsContainer.append(newPin);
}

export function drawPins(canvas, context) {
	const coordsC = canvas.getBoundingClientRect();

	if (pinsContainer.hasChildNodes()) {
		const children = pinsContainer.childNodes;
		children.forEach(element => {context.drawImage(element, 
			parseInt(element.style.left) - coordsC.left - window.pageXOffset, 
			parseInt(element.style.top) - coordsC.top - window.pageYOffset, 
			parseInt(element.getBoundingClientRect().right - element.getBoundingClientRect().left), 
			parseInt(element.getBoundingClientRect().bottom - element.getBoundingClientRect().top))
		});
	}
}

export function changePinsStyle(canvas, currentStyle) {
	if (pinsContainer.hasChildNodes()) {
		const children = pinsContainer.childNodes;

		children.forEach(element => styleOfPin(element, currentStyle));

		const canvasCoord = canvas.getBoundingClientRect();
		let {top: canvasCoordTop, right: canvasCoordRight, bottom: canvasCoordBottom, left: canvasCoordLeft} = canvasCoord;

		let width, height;
		if (currentStyle == 2) {
			width = 100;
			height = 100;
		} else {
			width = 50;
			height = 50;
		}
		
		for (let i = 0; i < children.length; i++) {
			const pinCoord = children[i].getBoundingClientRect();
			let {top: pinCoordTop, right: pinCoordRight, bottom: pinCoordBottom, left: pinCoordLeft} = pinCoord;

			if (pinCoordTop < canvasCoordTop) {
				children[i].style.top = canvasCoordTop + window.pageYOffset;
			}
			if (pinCoordLeft + width > canvasCoordRight) {
				children[i].style.left = parseInt(pinCoordLeft) - (parseInt(pinCoordLeft + width) 
										- parseInt(canvasCoordRight + window.pageXOffset)) + 'px';
			}
			if (pinCoordTop + height > canvasCoordBottom) {
				children[i].style.top = parseInt(pinCoordTop) - (parseInt(pinCoordTop + height) 
										- parseInt(canvasCoordBottom + window.pageYOffset)) + 'px';
			}
			if (pinCoordLeft < canvasCoordLeft) {
				children[i].style.left = canvasCoordLeft + window.pageXOffset;
			}
		}
	}
}

function styleOfPin(pin, currentStyle) {
	let maxWidth = '50px';
	let numSrc = randomInt(0, 4);
	let promise;

	switch (currentStyle) {
		case 0:
			promise = loadImage(pinWhiteBoard);
			promise.then(
				img => { 
					pin.setAttribute('src', pinWhiteBoard);
					pin.style.maxWidth = maxWidth;
				},
			);
			break;
		case 1: 
			promise = loadImage(pinCorkBoard[numSrc]);
			promise.then(
				img => { 
					pin.setAttribute('src', pinCorkBoard[numSrc]);
					pin.style.maxWidth = maxWidth;
				},
			);
			break;
		case 2:
			promise = loadImage(pinGraphiteBoard[numSrc]);
			promise.then(
				img => { 
					pin.setAttribute('src', pinGraphiteBoard[numSrc]);
					maxWidth = '100px';
					pin.style.maxWidth = maxWidth;
				},
			);
			break;
	}
}

export function movePinsForResizeWindow(dX) {
	moveForResizeWindow(pinsContainer, dX);
}

export function clearBoardFromPins() {
	clear(pinsContainer);
}

export function changeDisplayPinContainer(propertyName) {
	pinsContainer.style.display = propertyName;
}