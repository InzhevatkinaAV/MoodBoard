import {createNewBoardImage, drawImages, changeDisplayImagesContainer, 
	moveImagesForResizeWindow, clearBoardFromImages, 
	zIndexChange, shiftImagesLayers} from "./modules/board-images.js";

import {createNewPin, changePinsStyle, drawPins, changeDisplayPinContainer, 
	movePinsForResizeWindow, clearBoardFromPins} from "./modules/pins.js";

import {createNewPalette, drawPaletts, changeDisplayPaletteContainer, 
	movePalettsForResizeWindow, clearBoardFromPaletts} from "./modules/paletts.js"; 

import {changeDisplaySideInterface, changeDisplaySideAdvice, changeBtnStyle,
	downSideInterface, upSideInterface,
	showDeleteZone, hiddenDeleteZone,
	createNewDraggableImg, setNewDraggableImgCoordinats} from "./modules/side_interface.js";

import {loadImage, getUrlFromStyle} from "./modules/help_functions.js";

const canvas = document.querySelector('#canvas');
const context = canvas.getContext("2d");
const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 550;

//---------------------------Взятие изображения по url-------------------------------------
const form = document.querySelector('#form_new_image-url');
const input = document.querySelector('#new_image-url');
const newImg = document.querySelector('#new_image');
let newImgDraggable;

form.addEventListener('submit', function(e) {
	e.preventDefault();

	try {
		const previous = document.querySelector('.draggableNewImg');
		const newImgWrapper = document.querySelector('#new_image__wrapper');
		newImgWrapper.removeChild(previous);
	} catch {}

	newImgDraggable = document.createElement('img');

	if (String(input.value) == '') {
		newImg.setAttribute('src', '../img/default_picture.svg');
		newImgDraggable.remove();
	} else {
		let promise = loadImage(input.value);

		promise.then(
			img => { 
				newImg.setAttribute('src', input.value);
				createNewDraggableImg(newImgDraggable, newImg);
			},
			error => {
				newImg.setAttribute('src', '../img/picture_img_not_found.svg');
				newImgDraggable.remove();
			}
		);
	}
});

input.addEventListener('dblclick', function() {
	input.value = '';
});

//-----------------------------Добавление пинов на доску-----------------------------------
const btnPins = document.querySelector('#btn_pins');

btnPins.addEventListener('click', function() {
	createNewPin(canvas, currentStyle);
});

//----------------------------Добавление палеток на доску----------------------------------
const btnPalette = document.querySelector('#btn_color');

btnPalette.addEventListener('click', function(event) {
	createNewPalette(canvas);
});

//------------------------------Изменение стиля доски--------------------------------------
const btnSwitchStyle = document.querySelector('#btn_switch_color');

const stylesForCanvas = ['url("../img/board/white_board.jpg") center center/cover no-repeat',
		'url("../img/board/cork_board.jpg") center center/cover no-repeat',
		'url("../img/board/graphite_board.jpg") center center/cover no-repeat'];
let currentStyle = 0;

btnSwitchStyle.addEventListener('click', function() {
	currentStyle = ++currentStyle % 3;

	//Изменение фона доски
	const url = getUrlFromStyle(stylesForCanvas[currentStyle]);
	let promise = loadImage(url);
	promise.then(
		img => {
			canvas.style.background = 'url(' + url + ') center center/cover no-repeat';
		}
	);

	//Изменение стиля кнопок и пинов
	changeBtnStyle(btnSwitchStyle, btnPins, currentStyle);
	changePinsStyle(canvas, currentStyle);
});

//--------------------------------Очищение доски----------------------------------------------
const btnClearBoard = document.querySelector('#btn_clean');

btnClearBoard.addEventListener('click', function() {
	clearBoardFromImages();
	clearBoardFromPins();
	clearBoardFromPaletts();
});

//---------------------------------Режим сохранения доски--------------------------------------
const btnSaveBoard = document.querySelector('#btn_save');

btnSaveBoard.addEventListener('click', function() {
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	//Отрисовка фона доски
	const backgroundImg = new Image();
	const url = getUrlFromStyle(stylesForCanvas[currentStyle]);
	backgroundImg.src = url;
	backgroundImg.width = canvas.width;
	backgroundImg.height = canvas.height;

	const promise = loadImage(url);

	promise.then(
		img => {
			context.drawImage(backgroundImg, 0, 0);

			//Отрисовка изображений, палеток и пинов
			drawImages(canvas, context);
			drawPaletts(canvas, context);
			drawPins(canvas, context);

			changeDisplayImagesContainer('none');
			changeDisplayPinContainer('none');
			changeDisplayPaletteContainer('none');

			//Демонстрация подсказки по сохранению доски
			changeDisplaySideInterface("off");
			changeDisplaySideAdvice("on");
		},

		error => {alert("Try again, please.")}
	)
});

//-----------------------Возвращение в режим редактирования------------------------------------
const continueBottom = document.querySelector('#continue');

continueBottom.addEventListener('click', function() {
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	changeDisplayImagesContainer('flex');
	changeDisplayPinContainer('flex');
	changeDisplayPaletteContainer('flex');

	changeDisplaySideAdvice("off");
	changeDisplaySideInterface("on");

	if (newImgDraggable) {
		setNewDraggableImgCoordinats(newImgDraggable, newImg);
	}
});

//------------------------------Реакция на маштабирование---------------------------------
let positionStartX = parseInt(canvas.getBoundingClientRect().left + window.pageXOffset).toFixed(0);

window.addEventListener('resize', (e) => {
	let positionNowX = parseInt(canvas.getBoundingClientRect().left + window.pageXOffset).toFixed(0);
	let dX = (positionNowX - positionStartX).toFixed(0);
	positionStartX = positionNowX;

	//Передвигаемую копию newImg помещаем поверх newImg
	if (newImgDraggable) {
		setNewDraggableImgCoordinats(newImgDraggable, newImg);
	}

	//Передвигаем картинки, палетки, пины
	moveImagesForResizeWindow(dX);
	movePalettsForResizeWindow(dX);
	movePinsForResizeWindow(dX);
});

//-----------------------Перемещения объектов на доске------------------------------------
let isDragging = false;

document.addEventListener('mousedown', function(event) {
	let dragElement, typeOfDragElement;
	if (!(isTypeOfDragElement("pin") || isTypeOfDragElement("palette") || 
		isTypeOfDragElement("draggableNewImg") || isTypeOfDragElement("onboardImg"))) {
		return;
	}

	let zIndex = dragElement.style.zIndex;

	event.preventDefault();
	dragElement.ondragstart = () => false;

	if (typeOfDragElement == "onboardImg") {
		zIndexChange(dragElement, 1);
	}
	
	if (typeOfDragElement !== "draggableNewImg") {
		downSideInterface();
	}

	let shiftX, shiftY;
	let topC, bottomC, leftC, rightC;
	let topE, bottomE, leftE, rightE;

	startDrag(dragElement, event.clientX, event.clientY);

	function onMouseUp(event) {
		finishDrag();
		if (typeOfDragElement == "draggableNewImg") {
			createNewBoardImage(dragElement);
			setNewDraggableImgCoordinats(newImgDraggable, newImg);
		}
	};

	function onMouseMove(event) {
		moveAt(event.clientX, event.clientY);

		getCanvasCoordinats();
		getElementCoordinats();
		if ((bottomE < topC) || (leftE > rightC) || (topE > bottomC) || (rightE < leftC)) {
			if (typeOfDragElement !== "draggableNewImg") {
				showDeleteZone();
			}
		} else {
			if (typeOfDragElement !== "draggableNewImg") {
				hiddenDeleteZone();
			}
		}
	}

	function startDrag(element, clientX, clientY) {
		if(isDragging) {
			return;
		}
	
		isDragging = true;
	
		document.addEventListener('mousemove', onMouseMove);
		element.addEventListener('mouseup', onMouseUp);
	
		shiftX = clientX - element.getBoundingClientRect().left;
		shiftY = clientY - element.getBoundingClientRect().top;
	
		element.style.position = 'absolute';

		moveAt(clientX, clientY);
	};

	function finishDrag() {   
		if(!isDragging) {
			return;
		}
	
		isDragging = false;

		getCanvasCoordinats();
		getElementCoordinats();
		if ((topE >= topC && bottomE <= bottomC) && (leftE >= leftC && rightE <= rightC)) {
				dragElement.style.top = topE + scrollY + 'px';
				dragElement.style.left = leftE + scrollX + 'px';
		} else { 
			if ((bottomE < topC) || (leftE > rightC) || (topE > bottomC) || (rightE < leftC)) {
				if (typeOfDragElement !== "draggableNewImg") {
					dragElement.remove();
					hiddenDeleteZone();
				} else {
					if (typeOfDragElement == "pin" || typeOfDragElement == "palette") {
						dragElement.style.left = leftC + (rightC - leftC) / 2 + scrollX + 'px';
						dragElement.style.top = topC + (bottomC - topC) / 2 + scrollY + 'px';
					} else {
						dragElement.style.left = leftC + 15 + scrollX + 'px';
						dragElement.style.top = topC + 15 + scrollY + 'px';
					}
				}
			} else {
				if (typeOfDragElement == "pin" || typeOfDragElement == "palette") {
					dragElement.style.left = leftC + (rightC - leftC) / 2 + scrollX + 'px';
					dragElement.style.top = topC + (bottomC - topC) / 2 + scrollY + 'px';
				} else {
					dragElement.style.left = leftC + 15 + scrollX + 'px';
			 		dragElement.style.top = topC + 15 + scrollY + 'px';
				}	
			}
		}
	
		document.removeEventListener('mousemove', onMouseMove);
		dragElement.removeEventListener('mouseup', onMouseUp);

		if (typeOfDragElement !== "draggableNewImg") {
			upSideInterface();
		}	

		if (typeOfDragElement == "onboardImg") {
			shiftImagesLayers(zIndex);
		}	
	}
	
	function moveAt(clientX, clientY) {
		let newX = clientX - shiftX;
		let newY = clientY - shiftY;
	
		let newBottom = newY + dragElement.offsetHeight;
	
		if (newBottom > document.documentElement.clientHeight) {
			let docBottom = document.documentElement.getBoundingClientRect().bottom;
	
			let scrollY = Math.min(docBottom - newBottom, 10);

			if (scrollY < 0) scrollY = 0;
	
			window.scrollBy(0, scrollY);
	
			newY = Math.min(newY, document.documentElement.clientHeight - dragElement.offsetHeight);
		}
	
		if (newY < 0) {
				let scrollY = Math.min(-newY, 10);
				if (scrollY < 0) scrollY = 0;
	
				window.scrollBy(0, -scrollY);
				newY = Math.max(newY, 0);
		}
	
	
		if (newX < 0) {
			newX = 0;
		} 
		if (newX > document.documentElement.clientWidth - dragElement.offsetWidth) {
			newX = document.documentElement.clientWidth - dragElement.offsetWidth;
		}
	
		dragElement.style.left = newX + window.pageXOffset + 'px';
		dragElement.style.top = newY + window.pageYOffset + 'px';		
	}

	function isTypeOfDragElement(type) {
		typeOfDragElement = type;	
		type = "." + type;
		dragElement = event.target.closest(type);
	
		 if (!dragElement) {
			return false;
		 }
	
		 return true;
	}

	function getCanvasCoordinats() {
		topC = canvas.getBoundingClientRect().top;
		bottomC = canvas.getBoundingClientRect().bottom;
		leftC = canvas.getBoundingClientRect().left;
		rightC = canvas.getBoundingClientRect().right;
	}

	function getElementCoordinats() {
		topE = dragElement.getBoundingClientRect().top;
		bottomE = dragElement.getBoundingClientRect().bottom;
		leftE = dragElement.getBoundingClientRect().left;
		rightE = dragElement.getBoundingClientRect().right;
	}
});