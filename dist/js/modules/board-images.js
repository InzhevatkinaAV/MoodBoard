import {mergeSort, clear, moveForResizeWindow} from "./help_functions.js";

const boardImagesContainer = document.querySelector('.board-image_container');
const MAX_IMG_WIDTH = '276px';
const MAX_IMG_HEIGHT = '255px';

export function createNewBoardImage(dragElement) {
	const dragElementCopy = document.createElement('img');
	dragElementCopy.classList.add('onboardImg');

	dragElementCopy.setAttribute('src', dragElement.src);
	dragElementCopy.style.maxHeight = MAX_IMG_HEIGHT;
	dragElementCopy.style.maxWidth = MAX_IMG_WIDTH;
	dragElementCopy.style.objectFit = 'contain';
	dragElementCopy.style.position = 'absolute';

	dragElementCopy.style.top = dragElement.getBoundingClientRect().top + window.pageYOffset + 'px';
	dragElementCopy.style.left = dragElement.getBoundingClientRect().left + window.pageXOffset + 'px';

	zIndexChange(dragElementCopy, 1);

	addImageOnBoard(dragElementCopy);
}

function addImageOnBoard(dragElementCopy) {
	boardImagesContainer.append(dragElementCopy);
}

export function drawImages(canvas, context) {
	const coordsC = canvas.getBoundingClientRect();

	if (boardImagesContainer.hasChildNodes()) {
		const children = boardImagesContainer.childNodes;
		let imagesOnCanvas = [];
		children.forEach(elem => imagesOnCanvas.push(elem));
		const sortedImagesOnCanvas = mergeSort(imagesOnCanvas);
		for (let i = 0; i < sortedImagesOnCanvas.length; i++) {
			const coordsImg = sortedImagesOnCanvas[i].getBoundingClientRect();
			context.drawImage(sortedImagesOnCanvas[i], 
				parseInt(sortedImagesOnCanvas[i].style.left) - coordsC.left - window.pageXOffset, 
				parseInt(sortedImagesOnCanvas[i].style.top) - coordsC.top - window.pageYOffset, 
				parseInt(coordsImg.right - coordsImg.left), 
				parseInt(coordsImg.bottom - coordsImg.top));
		}
	}
}

export function zIndexChange(obj, num) {
	obj.style.zIndex = boardImagesContainer.childElementCount + num;
}

export function shiftImagesLayers(zIndex) {
	if (boardImagesContainer.hasChildNodes()) {
		let children = boardImagesContainer.childNodes;
		children.forEach( function(elem) {
			if (elem.style.zIndex > zIndex) {
				elem.style.zIndex = elem.style.zIndex - 1;
			}
		});
	}
}

export function moveImagesForResizeWindow(dX) {
	moveForResizeWindow(boardImagesContainer, dX);
}

export function clearBoardFromImages() {
	clear(boardImagesContainer);
}

export function changeDisplayImagesContainer(propertyName) {
	boardImagesContainer.style.display = propertyName;
}