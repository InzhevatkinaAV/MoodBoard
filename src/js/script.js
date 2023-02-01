const canvas = document.querySelector('#canvas');
const context = canvas.getContext("2d");
const CANVAS_WIDTH = 850;
const CANVAS_HEIGHT = 550;
const MAX_IMG_WIDTH = '276px';
const MAX_IMG_HEIGHT = '255px';

const container = document.querySelector('.container');
const boardImagesContainer = document.querySelector('.board-image_container');
const pinsContainer = document.querySelector('.board-pins_container');
const paletteContainer = document.querySelector('.board-palette_container');

//---------------------------Взятие изображения по url---------------------------------------
const form = document.querySelector('#form_new_image-url');
const input = document.querySelector('#new_image-url');
const newImgWrapper = document.querySelector('#new_image__wrapper');
const newImg = document.querySelector('#new_image');

let newImgDraggable, leftNewImgDraggable, topNewImgDraggable;

function loadImage(src) {
	return new Promise(function(resolve, reject) {
		const img = document.createElement('img');
		img.src = src;
		
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error(`Ошибка загрузки изображения ${src}`));
	});
}

input.addEventListener('dblclick', function() {
	input.value = '';
});

function getNewDraggableImgCoordinats() {
	leftNewImgDraggable = newImg.getBoundingClientRect().left + window.pageXOffset + 'px';
	topNewImgDraggable = newImg.getBoundingClientRect().top + window.pageYOffset + 'px';
	newImgDraggable.style.left = leftNewImgDraggable;
	newImgDraggable.style.top = topNewImgDraggable;
}

form.addEventListener('submit', function(e) {
	e.preventDefault();

	try {
		const previous = document.querySelector('.draggableNewImg');
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
				
				newImgDraggable.setAttribute('src', input.value);
				newImgDraggable.classList.add('draggableNewImg');
				newImgDraggable.style.maxHeight = MAX_IMG_HEIGHT;
				newImgDraggable.style.maxWidth = MAX_IMG_WIDTH;
				newImgDraggable.style.objectFit = 'contain';
				newImgDraggable.style.position = 'absolute';
				newImgDraggable.style.zIndex = 1;
				getNewDraggableImgCoordinats();

				newImg.before(newImgDraggable);
			},
			error => {
				newImg.setAttribute('src', '../img/picture_img_not_found.svg');
				newImgDraggable.remove();
			}
		);
	}
});
//--------------------------------------------------------------------------------------------



//-------------------------Добавление пинов на доску-----------------------------------------
const btnPins = document.querySelector('#btn_pins');

const stylesForBtnPin = ['url("../img/btnStyle/white_style_pin.jpg") center center/cover no-repeat',
		'url("../img/btnStyle/cork_style_pin.jpg") center center/cover no-repeat',
		'url("../img/btnStyle/graphite_style_pin.jpg") center center/cover no-repeat'];

const pinWhiteBoard = "../img/pins/pin1_style3.png";
const pinCorkBoard = ["../img/pins/pin1_style1.png", "../img/pins/pin2_style1.png", 
		"../img/pins/pin3_style1.png", "../img/pins/pin4_style1.png",
		"../img/pins/pin5_style1.png"];
const pinGraphiteBoard = ["../img/pins/pin1_style2.png", "../img/pins/pin2_style2.png", 
		"../img/pins/pin3_style2.png", "../img/pins/pin4_style2.png",
		"../img/pins/pin5_style2.png"];

btnPins.addEventListener('click', function() {
	const newPin = document.createElement('img');
	
	styleOfPin(newPin);

	newPin.style.position = 'absolute';
	newPin.style.left = canvas.getBoundingClientRect().left + canvas.getBoundingClientRect().width / 2 + window.pageXOffset + 'px';
	newPin.style.top = canvas.getBoundingClientRect().top + canvas.getBoundingClientRect().height / 2 + window.pageYOffset + 'px';
	newPin.classList.add('pin');

	pinsContainer.append(newPin);
});
//-------------------------------------------------------------------------------------------



//------------------------------Добавление палеток на доску----------------------------------
const btnPalette = document.querySelector('#btn_color');

btnPalette.addEventListener('click', function(event) {
	const newPalette = document.createElement('input');
	newPalette.type = "color";
	newPalette.name="bg";
	
	newPalette.style.position = 'absolute';
	newPalette.style.left = canvas.getBoundingClientRect().left + canvas.getBoundingClientRect().width / 2 + window.pageXOffset + 'px';
	newPalette.style.top = canvas.getBoundingClientRect().top + canvas.getBoundingClientRect().height / 2 + window.pageYOffset + 'px';
	newPalette.classList.add('palette');

	paletteContainer.append(newPalette);
});
//-------------------------------------------------------------------------------------------



//----------------------------------Изменение стиля доски------------------------------------
const btnSwitchStyle = document.querySelector('#btn_switch_color');

const stylesForBtn = ['url("../img/btnStyle/cork_style.jpg") center center/cover no-repeat',
		'url("../img/btnStyle/graphite_style.jpg") center center/cover no-repeat',
		'url("../img/btnStyle/white_style.jpg") center center/cover no-repeat'];
const stylesForCanvas = ['url("../img/board/white_board.jpg") center center/cover no-repeat',
		'url("../img/board/cork_board.jpg") center center/cover no-repeat',
		'url("../img/board/graphite_board.jpg") center center/cover no-repeat'];
let currentStyle = 0;

function styleOfPin(pin) {
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

function randomInt(min, max) {
	const rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

btnSwitchStyle.addEventListener('click', function() {
	currentStyle = ++currentStyle % 3;

	//Изменение фона канваса
	const startURL = stylesForCanvas[currentStyle].indexOf('(');
	const finishURL = stylesForCanvas[currentStyle].indexOf(')');
	const url = stylesForCanvas[currentStyle].slice(startURL + 2, finishURL - 1);
	let promise = loadImage(url);
	promise.then(
		img => {
			canvas.style.background = 'url(' + url + ') center center/cover no-repeat';
		}
	);
	
	//Изменение стиля кнопок и пинов
	changeBtnStyle();
	changePinsStyle();

	function changeBtnStyle() {
		btnSwitchStyle.style.background = stylesForBtn[currentStyle];
		btnPins.style.background = stylesForBtnPin[currentStyle];
	}

	function changePinsStyle() {
		if (pinsContainer.hasChildNodes()) {
			const children = pinsContainer.childNodes;
			children.forEach(element => styleOfPin(element));
	
			const canvasCoord = canvas.getBoundingClientRect();
			let {top: canvasCoordTop, right: canvasCoordRight, bottom: canvasCoordBottom, left: canvasCoordLeft} = canvasCoord;
	
			for (let i = 0; i < children.length; i++) {
				const pinCoord = children[i].getBoundingClientRect();
				let {top: pinCoordTop, right: pinCoordRight, bottom: pinCoordBottom, left: pinCoordLeft} = pinCoord;

				if (pinCoordTop < canvasCoordTop) {
					children[i].style.top = canvasCoordTop + window.pageYOffset;
				}
				if (pinCoordRight > canvasCoordRight) {
					children[i].style.left = parseInt(pinCoordLeft) - (parseInt(pinCoordRight) 
											- parseInt(canvasCoordRight + window.pageXOffset)) + 'px';
				}
				if (pinCoordBottom > canvasCoordBottom) {
					children[i].style.top = parseInt(pinCoordTop) - (parseInt(pinCoordBottom) 
											- parseInt(canvasCoordBottom + window.pageYOffset)) + 'px';
				}
				if (pinCoordLeft < canvasCoordLeft) {
					children[i].style.left = canvasCoordLeft + window.pageXOffset;
				}
			}
		}
	}
});
//-------------------------------------------------------------------------------------------



//--------------------------------Очищение доски----------------------------------------------
const btnClearBoard = document.querySelector('#btn_clean');

btnClearBoard.addEventListener('click', function() {
	clear(boardImagesContainer);
	clear(pinsContainer);
	clear(paletteContainer);

	function clear(container) {
		if (container.hasChildNodes()) {
			const children = container.childNodes;
			while (children.length > 0) {
				children[0].remove();
			}
		}
	}

});
//---------------------------------------------------------------------------------------------



//---------------------------------Режим сохранения доски--------------------------------------
const btnSaveBoard = document.querySelector('#btn_save');
const resultModalWindow = document.querySelector('.overlay_with_result');
const paletteImgContainer = document.querySelector('.palette_img_container');

btnSaveBoard.addEventListener('click', function() {
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	const coordsC = canvas.getBoundingClientRect();

	//Отрисовка фона
	const backgroundImg = new Image();
	const startURL = stylesForCanvas[currentStyle].indexOf('(');
	const finishURL = stylesForCanvas[currentStyle].indexOf(')');
	const url = stylesForCanvas[currentStyle].slice(startURL + 2, finishURL - 1);
	backgroundImg.src = url;
	backgroundImg.width = canvas.width;
	backgroundImg.height = canvas.height;

	const promise = loadImage(url);

	promise.then(
		img => {
			context.drawImage(backgroundImg, 0, 0);

			//Отрисовка картинок с учетом слоев
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

			//Отрисовка палеток
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

			//Отрисовка пинов
			if (pinsContainer.hasChildNodes()) {
				const children = pinsContainer.childNodes;
				children.forEach(element => {context.drawImage(element, 
					parseInt(element.style.left) - coordsC.left - window.pageXOffset, 
					parseInt(element.style.top) - coordsC.top - window.pageYOffset, 
					parseInt(element.getBoundingClientRect().right - element.getBoundingClientRect().left), 
					parseInt(element.getBoundingClientRect().bottom - element.getBoundingClientRect().top))
				});
			}

			boardImagesContainer.style.display = 'none';
			pinsContainer.style.display = 'none';
			paletteContainer.style.display = 'none';

			resultModalWindow.style.display = 'flex';
			interface.style.display = 'none';
			resultModalWindow.style.zIndex = 3;
		},

		error => {alert("Try again, please")}
	)

	function mergeSort(array) {
		if (!array || !array.length) {
			return null;
		}
	
		if (array.length <= 1) {
			return array;
		}
	
		const middle = Math.floor(array.length / 2);
		const arrayLeft = array.slice(0, middle);
		const arrayRight = array.slice(middle);
	
		return merge(mergeSort(arrayLeft), mergeSort(arrayRight));
	};
	
	function merge(arrayPart1, arrayPart2) {
		let arraySort = [];
		let i = 0;
		let j = 0;
		
		while (i < arrayPart1.length && j < arrayPart2.length) {
			if (arrayPart1[i].style.zIndex < arrayPart2[j].style.zIndex) {
				arraySort.push(arrayPart1[i++]);
			} else {
				arraySort.push(arrayPart2[j++]);
			}
		}
	
		return [...arraySort, ...arrayPart1.slice(i), ...arrayPart2.slice(j)];
	};
});
//---------------------------------------------------------------------------------------------



//-----------------------Возвращение в режим редактирования------------------------------------
const continueBottom = document.querySelector('#continue');

continueBottom.addEventListener('click', function() {
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	boardImagesContainer.style.display = 'flex';
	pinsContainer.style.display = 'flex';
	paletteContainer.style.display = 'flex';

	resultModalWindow.style.display = 'none';
	interface.style.display = 'flex';
	resultModalWindow.style.zIndex = -2;

	if (newImgDraggable) {
		getNewDraggableImgCoordinats();
	}
});
//----------------------------------------------------------------------------------------



//------------------------------Реакция на маштабирование---------------------------------
let positionStartX = parseInt(canvas.getBoundingClientRect().left + window.pageXOffset).toFixed(0);
let positionNowX = parseInt(canvas.getBoundingClientRect().left + window.pageXOffset).toFixed(0);
let dX = 0;

window.addEventListener('resize', (e) => {
	positionNowX = parseInt(canvas.getBoundingClientRect().left + window.pageXOffset).toFixed(0);
	dX = (positionNowX - positionStartX).toFixed(0);
	positionStartX = positionNowX;;

	//Передвигаемую копию newImg кладем поверх newImg
	if (newImgDraggable) {
		getNewDraggableImgCoordinats();
	}

	//Передвигаем картинки, палетки, пины
	move(boardImagesContainer);
	move(paletteContainer);
	move(pinsContainer);

	function move(container) {
		if (container.hasChildNodes()) {
			let children = container.childNodes;
			children.forEach(element => element.style.left = parseInt(element.style.left) + parseInt(dX) + 'px');
		}
	}
});
//----------------------------------------------------------------------------------------



//----------------------------Перемещения объектов----------------------------------------
const deleteZone = document.querySelector('.overlay');
const interface = document.querySelector('.interface');
const COLOR_DELETE_ZONE_V = 'rgba(255, 180, 180, 0.4)';
const COLOR_DELETE_ZONE_H = 'rgba(255, 180, 180, 0)';
let isDragging = false;

document.addEventListener('mousedown', function(event) {
	let dragElement, typeOfDragElement;
	if (!(isTypeOfDragElement("pin") || isTypeOfDragElement("palette") || 
		isTypeOfDragElement("draggableNewImg") || isTypeOfDragElement("onboardImg"))) {
		return;
	}

	event.preventDefault();
	dragElement.ondragstart = () => false;

	shiftDraggableLayer();
	hiddenInterface();

	let shiftX, shiftY;
	let topC, bottomC, leftC, rightC;
	let topE, bottomE, leftE, rightE;

	startDrag(dragElement, event.clientX, event.clientY);

	function onMouseUp(event) {
		finishDrag();
		if (typeOfDragElement == "draggableNewImg") {
			const dragElementCopy = document.createElement('img');
			dragElementCopy.classList.add('onboardImg');

			dragElementCopy.setAttribute('src', dragElement.src);
			dragElementCopy.style.maxHeight = MAX_IMG_HEIGHT;
			dragElementCopy.style.maxWidth = MAX_IMG_WIDTH;
			dragElementCopy.style.objectFit = 'contain';
			dragElementCopy.style.position = 'absolute';

			dragElementCopy.style.top = dragElement.getBoundingClientRect().top + window.pageYOffset + 'px';
			dragElementCopy.style.left = dragElement.getBoundingClientRect().left + window.pageXOffset + 'px';
			getNewDraggableImgCoordinats();

			zIndexChange(dragElementCopy, 1);
			
			boardImagesContainer.append(dragElementCopy);
		}
	};

	function onMouseMove(event) {
		moveAt(event.clientX, event.clientY);

		getCanvasAndElementCoordinats()
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

		getCanvasAndElementCoordinats();
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

		showInterface();

		shiftAllLayers();
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

	function zIndexChange(obj, num) {
		obj.style.zIndex = boardImagesContainer.childElementCount + num;
	}

	function shiftDraggableLayer() {
		if (typeOfDragElement == "onboardImg") {
			zIndex = dragElement.style.zIndex;
			zIndexChange(dragElement, 1);
		}
	}

	function shiftAllLayers() {
		if (typeOfDragElement == "onboardImg") {
			if (boardImagesContainer.hasChildNodes()) {
				let children = boardImagesContainer.childNodes;
				children.forEach( function(elem) {
					if (elem.style.zIndex > zIndex) {
						elem.style.zIndex = elem.style.zIndex - 1;
					}
				});
			}
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
	
	
		if (newX < 0) newX = 0;
		if (newX > document.documentElement.clientWidth - dragElement.offsetWidth) {
				newX = document.documentElement.clientWidth - dragElement.offsetWidth;
		}
	
		dragElement.style.left = newX + window.pageXOffset + 'px';
		dragElement.style.top = newY + window.pageYOffset + 'px';		
	}

	function showDeleteZone() {
		if (typeOfDragElement !== "draggableNewImg") {
			deleteZone.style.backgroundColor = COLOR_DELETE_ZONE_V;
		}
	}

	function hiddenDeleteZone() {
		if (typeOfDragElement !== "draggableNewImg") {
			deleteZone.style.backgroundColor = COLOR_DELETE_ZONE_H;
		}
	}

	function showInterface() {
		if (typeOfDragElement !== "draggableNewImg") {
			interface.style.zIndex = '0';
		}
	}

	function hiddenInterface() {
		if (typeOfDragElement !== "draggableNewImg") {
			interface.style.zIndex = '-2';
		}
	}

	function getCanvasAndElementCoordinats() {
		topC = canvas.getBoundingClientRect().top;
		bottomC = canvas.getBoundingClientRect().bottom;
		leftC = canvas.getBoundingClientRect().left;
		rightC = canvas.getBoundingClientRect().right;
	
		topE = dragElement.getBoundingClientRect().top;
		bottomE = dragElement.getBoundingClientRect().bottom;
		leftE = dragElement.getBoundingClientRect().left;
		rightE = dragElement.getBoundingClientRect().right;
	}
});
//----------------------------------------------------------------------------------------