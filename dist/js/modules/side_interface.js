import {loadImage, getUrlFromStyle} from "./help_functions.js";

const sideInterface = document.querySelector('.interface');
const sideAdvice = document.querySelector('.advice');

//-----------------------------------------Общее------------------------------------------
export function changeDisplaySideInterface(str) {
	str === "on" ? sideInterface.style.display = 'flex' : sideInterface.style.display = 'none';
}

export function changeDisplaySideAdvice(str) {
	str === "on" ? sideAdvice.style.display = 'flex' : sideAdvice.style.display = 'none';
}

export function upSideInterface() {
	sideInterface.style.zIndex = '0';
}

export function downSideInterface() {
	sideInterface.style.zIndex = '-2';
}

//-----------------------------Зона удаления элементов с доски----------------------------
const deleteZone = document.querySelector('.overlay');
const COLOR_DELETE_ZONE_V = 'rgba(255, 180, 180, 0.4)';
const COLOR_DELETE_ZONE_H = 'rgba(255, 180, 180, 0)';

export function showDeleteZone() {
	deleteZone.style.backgroundColor = COLOR_DELETE_ZONE_V;
}

export function hiddenDeleteZone() {
	deleteZone.style.backgroundColor = COLOR_DELETE_ZONE_H;
}

//-----------------------Передвигаемая копия изображения в меню----------------------------
let leftNewImgDraggable, topNewImgDraggable;
const MAX_IMG_WIDTH = '276px';
const MAX_IMG_HEIGHT = '255px';

export function setNewDraggableImgCoordinats(newImgDraggable, newImg) {
	leftNewImgDraggable = newImg.getBoundingClientRect().left + window.pageXOffset + 'px';
	topNewImgDraggable = newImg.getBoundingClientRect().top + window.pageYOffset + 'px';
	newImgDraggable.style.left = leftNewImgDraggable;
	newImgDraggable.style.top = topNewImgDraggable;
}

export function createNewDraggableImg(newImgDraggable, newImg) {
	newImgDraggable.setAttribute('src', newImg.src);
	newImgDraggable.classList.add('draggableNewImg');
	newImgDraggable.style.maxHeight = MAX_IMG_HEIGHT;
	newImgDraggable.style.maxWidth = MAX_IMG_WIDTH;
	newImgDraggable.style.objectFit = 'contain';
	newImgDraggable.style.position = 'absolute';
	newImgDraggable.style.zIndex = 1;

	setNewDraggableImgCoordinats(newImgDraggable, newImg);

	newImg.before(newImgDraggable);
}

//-------------------------------Изменение стиля кнопок-----------------------------------
const stylesForBtnPin = ['url("../img/btnStyle/white_style_pin.jpg") center center/cover no-repeat',
		'url("../img/btnStyle/cork_style_pin.jpg") center center/cover no-repeat',
		'url("../img/btnStyle/graphite_style_pin.jpg") center center/cover no-repeat'];
const stylesForBtn = ['url("../img/btnStyle/cork_style.jpg") center center/cover no-repeat',
		'url("../img/btnStyle/graphite_style.jpg") center center/cover no-repeat',
		'url("../img/btnStyle/white_style.jpg") center center/cover no-repeat'];

export function changeBtnStyle(btnSwitchStyle, btnPins, currentStyle) {
	let urlStyleBtn = getUrlFromStyle(stylesForBtn[currentStyle]);

	let promiseStyleBtn = loadImage(urlStyleBtn);
	promiseStyleBtn.then(
		img => { 
			btnSwitchStyle.style.background = 'url(' + urlStyleBtn + ') center center/cover no-repeat';
		},
	);

	let urlPinBtn = getUrlFromStyle(stylesForBtnPin[currentStyle]);
	let promisePinBtn = loadImage(urlPinBtn);
	promisePinBtn.then(
		img => { 
			btnPins.style.background = 'url(' + urlPinBtn + ') center center/cover no-repeat';
		},
	);
}