import {clear, moveForResizeWindow} from "./help_functions.js";

const paletteContainer = document.querySelector('.board-palette_container');

export function createNewPalette(canvas) {
	const newPalette = document.createElement('input');
	newPalette.type = "color";
	newPalette.name="bg";
	
	newPalette.style.position = 'absolute';
	newPalette.style.left = canvas.getBoundingClientRect().left + canvas.getBoundingClientRect().width / 2 + window.pageXOffset + 'px';
	newPalette.style.top = canvas.getBoundingClientRect().top + canvas.getBoundingClientRect().height / 2 + window.pageYOffset + 'px';
	newPalette.classList.add('palette');

	addNewPalette(newPalette);
}

function addNewPalette(newPalette) {
	paletteContainer.append(newPalette);
}

export function drawPaletts(canvas, context) {
	const coordsC = canvas.getBoundingClientRect()

	if (paletteContainer.hasChildNodes()) {
		const children = paletteContainer.childNodes;
		for (let i = 0; i < children.length; i++) {
			context.beginPath();
			context.rect(parseInt(children[i].style.left) - coordsC.left - window.pageXOffset, 
				parseInt(children[i].style.top) - coordsC.top - window.pageYOffset, 70.6, 70.6);
			context.fillStyle = "#eeeeee";
			context.fill();

			context.beginPath();
			context.rect(parseInt(children[i].style.left) + 5 - coordsC.left - window.pageXOffset, 
				parseInt(children[i].style.top) + 5 - coordsC.top - window.pageYOffset, 60, 60);
			context.fillStyle = children[i].value;
			context.fill();
			context.lineWidth = 0.3;
			context.stroke();
		}
	}
}

export function movePalettsForResizeWindow(dX) {
	moveForResizeWindow(paletteContainer, dX);
}

export function clearBoardFromPaletts() {
	clear(paletteContainer);
}

export function changeDisplayPaletteContainer(propertyName) {
	paletteContainer.style.display = propertyName;
}