const canvas = document.querySelector('#canvas');
const context = canvas.getContext("2d");
const CANVAS_WIDTH = 950;
const CANVAS_HEIGHT = 550;

const container = document.querySelector('.container');
let marginStart = container.getBoundingClientRect().left;
let marginNow = container.getBoundingClientRect().left;
let marginDx = 0;

//-------------------------------------Изменение стиля доски-------------------------------------------
const btnSwitchStyle = document.querySelector('#btn_switch_color');

const stylesForBtn = ['url("../img/btnStyle/cork_style.jpg") center center/cover no-repeat',
				'url("../img/btnStyle/graphite_style.jpg") center center/cover no-repeat',
				'url("../img/btnStyle/white_style.jpg") center center/cover no-repeat'];
const stylesForCanvas = ['url("../img/board/white_board.jpg") center center/cover no-repeat',
				'url("../img/board/cork_board.jpg") center center/cover no-repeat',
				'url("../img/board/graphite_board.jpg") center center/cover no-repeat'];
let currentStyle = 0;

btnSwitchStyle.addEventListener('click', function() {
	currentStyle = ++currentStyle % 3;

	btnSwitchStyle.style.background = stylesForBtn[currentStyle];
	canvas.style.background = stylesForCanvas[currentStyle];

	btnPins.style.background = stylesForBtnPin[currentStyle];

	if (pinsContainer.hasChildNodes()) {
		let children = pinsContainer.childNodes;
		children.forEach(element => styleOfPin(element));

		let canvasCoord = canvas.getBoundingClientRect();

		for (let i = 0; i < children.length; i++) {
			let pinCoord = children[i].getBoundingClientRect();
			if (pinCoord.left < canvasCoord.left) {
				children[i].style.left = canvasCoord.left;
			}
			if (pinCoord.top < canvasCoord.top) {
				children[i].style.top = canvasCoord.top;
			}
			if (pinCoord.right > canvasCoord.right) {
				children[i].style.left = parseInt(pinCoord.left) - (parseInt(pinCoord.right) 
										- parseInt(canvasCoord.right)) + 'px';
			}
			if (pinCoord.bottom > canvasCoord.bottom) {
				children[i].style.top = parseInt(pinCoord.top) - (parseInt(pinCoord.bottom) 
										- parseInt(canvasCoord.bottom)) + 'px';
			}
		}
	}
});
//-----------------------------------------------------------------------------------------------------


//-------------------------------------Добавление пинов на доску---------------------------------------
const btnPins = document.querySelector('#btn_pins');
const pinsContainer = document.querySelector('.board-pins_container');

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
	let newPin = document.createElement('img');
	
	styleOfPin(newPin);

	newPin.style.position = 'absolute';
	newPin.style.left = canvas.getBoundingClientRect().left + canvas.getBoundingClientRect().width / 2 + 'px';
	newPin.style.top = canvas.getBoundingClientRect().top + canvas.getBoundingClientRect().height / 2 + 'px';
	newPin.classList.add('pin');

	pinsContainer.append(newPin);
});

function styleOfPin(pin) {
	let maxWidth = '50px';

	switch (currentStyle) {
		case 0: 
			pin.setAttribute('src', pinWhiteBoard);
			break;
		case 1: 
			pin.setAttribute('src', pinCorkBoard[randomInt(0, 4)]); 
			break;
		case 2:
			pin.setAttribute('src', pinGraphiteBoard[randomInt(0, 4)]); 
			maxWidth = '100px';
			break;
	}
	pin.style.maxWidth = maxWidth;
}

function randomInt(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
  }
//-----------------------------------------------------------------------------------------------------


//------------------------------Добавление палетки на доску--------------------------------------------
const btnPalette = document.querySelector('#btn_color');
const paletteContainer = document.querySelector('.palette_container');

btnPalette.addEventListener('click', function(event) {
	let newPalette = document.createElement('input');
	newPalette.type = "color";
	newPalette.name="bg";
	
	newPalette.style.position = 'absolute';
	newPalette.style.left = canvas.getBoundingClientRect().left + canvas.getBoundingClientRect().width / 2 + 'px';
	newPalette.style.top = canvas.getBoundingClientRect().top + canvas.getBoundingClientRect().height / 2 + 'px';
	newPalette.classList.add('palette');

	paletteContainer.append(newPalette);
});
//----------------------------------------------------------------------------------------------------


//-------------------------Взятие изображения по url---------------------------------------------------
const input = document.querySelector('#new_image-url');
const form = document.querySelector('#form_new_image-url');
const newImg = document.querySelector('#new_image');
const newImgWrapper = document.querySelector('#new_image__wrapper');
let newImgDraggable, leftNewImgDraggable, topNewImgDraggable;

form.addEventListener('submit', function(e) {
    e.preventDefault();

	try {
		let previous = document.querySelector('.draggableNewImg');
		newImgWrapper.removeChild(previous);
		} catch {
	}

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
				newImgDraggable.style.maxHeight = '220px';
				newImgDraggable.style.maxWidth = '330px'
				newImgDraggable.style.objectFit = 'contain';
				newImgDraggable.style.position = 'absolute';

				zIndexChange(newImgDraggable, 3);

				newImgDraggable.classList.add('draggableNewImg');

				leftNewImgDraggable = newImg.getBoundingClientRect().left + 'px';
				topNewImgDraggable = newImg.getBoundingClientRect().top + 'px';
				newImgDraggable.style.left = leftNewImgDraggable;
				newImgDraggable.style.top = topNewImgDraggable;

				newImg.before(newImgDraggable);
          	},
            error => {
				newImg.setAttribute('src', '../img/picture_404.svg');
				newImgDraggable.remove();
			}
        );
    }
});

function loadImage(src) {
    return new Promise(function(resolve, reject) {
      let img = document.createElement('img');
      img.src = src;
  
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Ошибка загрузки изображения ${src}`));
  
      document.head.append(img);
    });
}

input.addEventListener('dblclick', function() {
	input.value = '';
});
//------------------------------------------------------------------------------------------------------


//-----------------------------------------Очищение канваса---------------------------------------------
let btnClearBoard = document.querySelector('#btn_clean');

btnClearBoard.addEventListener('click', function() {
	clearArrayImages();
	clearArrayPins();
	clearArrayPalette();
});

function clearArrayImages() {
	if (boardImagesContainer.hasChildNodes()) {
		let children = boardImagesContainer.childNodes;
		while (children.length > 0) {
			children[0].remove();
		}
	}
}

function clearArrayPins() {
	if (pinsContainer.hasChildNodes()) {
		let children = pinsContainer.childNodes;
		while (children.length > 0) {
			children[0].remove();
		}
	}
}

function clearArrayPalette() {
	if (paletteContainer.hasChildNodes()) {
		let children = paletteContainer.childNodes;
		while (children.length > 0) {
			children[0].remove();
		}
	}
}
//------------------------------------------------------------------------------------------------------


//-------------------------------------Сохранение мудборда----------------------------------------------
const btnSaveBoard = document.querySelector('#btn_save');
const resultModalWindow = document.querySelector('.overlay_with_result');
const paletteImgContainer = document.querySelector('.palette_img_container');

btnSaveBoard.addEventListener('click', function() {
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	let coordsC = canvas.getBoundingClientRect();

	let backgroundImg = new Image();
	let startURL = stylesForCanvas[currentStyle].indexOf('(');
	let finishURL = stylesForCanvas[currentStyle].indexOf(')');
	let url = stylesForCanvas[currentStyle].slice(startURL + 2, finishURL - 1);
	backgroundImg.src = url;
	backgroundImg.width = canvas.width;
	backgroundImg.height = canvas.height;

	let promise = loadImage(url);

	promise.then(
		img => {
			context.drawImage(backgroundImg, 0, 0);

			if (boardImagesContainer.hasChildNodes()) {
				let children = boardImagesContainer.childNodes;
				let imagesOnCanvas = [];
				children.forEach(elem => imagesOnCanvas.push(elem));
				let sortedImagesOnCanvas = mergeSort(imagesOnCanvas);
				for (let i = 0; i < sortedImagesOnCanvas.length; i++) {
					let coordsImg = sortedImagesOnCanvas[i].getBoundingClientRect();
					context.drawImage(sortedImagesOnCanvas[i], parseInt(sortedImagesOnCanvas[i].style.left) - coordsC.left, 
										parseInt(sortedImagesOnCanvas[i].style.top) - coordsC.top, 
										parseInt(coordsImg.right - coordsImg.left), parseInt(coordsImg.bottom - coordsImg.top));
				}
			}

			if (paletteContainer.hasChildNodes()) {
				let children = paletteContainer.childNodes;
				for (let i = 0; i < children.length; i++) {
					context.beginPath();
					context.rect(parseInt(children[i].style.left) - coordsC.left, parseInt(children[i].style.top) - coordsC.top, 70.6, 70.6);
					context.fillStyle = "#eeeeee";
					context.fill();

					context.beginPath();
					context.rect(parseInt(children[i].style.left) + 5 - coordsC.left, parseInt(children[i].style.top) + 5 - coordsC.top, 60, 60);
					context.fillStyle = children[i].value;
					context.fill();
					context.lineWidth = 0.3;
					context.stroke();
				}
			}

			if (pinsContainer.hasChildNodes()) {
				let children = pinsContainer.childNodes;
				children.forEach(element => {context.drawImage(element, parseInt(element.style.left) - coordsC.left, 
												parseInt(element.style.top) - coordsC.top, 
												parseInt(element.getBoundingClientRect().right - element.getBoundingClientRect().left), 
												parseInt(element.getBoundingClientRect().bottom - element.getBoundingClientRect().top))});
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
});

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

    return merge(mergeSort(arrayLeft), mergeSort(arrayRight));;
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
//------------------------------------------------------------------------------------------------------


//------------------------Возвращение в режим редактирования доски---------------------------------------
let continueBottom = document.querySelector('#continue');

continueBottom.addEventListener('click', function() {
	let context = canvas.getContext("2d");
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	boardImagesContainer.style.display = 'flex';
	pinsContainer.style.display = 'flex';
	paletteContainer.style.display = 'flex';

	resultModalWindow.style.display = 'none';
	interface.style.display = 'flex';
	resultModalWindow.style.zIndex = -2;

	if (newImgDraggable) {
		newImgDraggable.style.position = 'absolute';
		leftNewImgDraggable = newImg.getBoundingClientRect().left + 'px';
		topNewImgDraggable = newImg.getBoundingClientRect().top + 'px';
		newImgDraggable.style.left =leftNewImgDraggable;
		newImgDraggable.style.top = topNewImgDraggable;
	}
});
//------------------------------------------------------------------------------------------------------


//-------------------------------------Смещения при резайзе страницы------------------------------------
window.addEventListener('resize', (e) => {
	marginNow = container.getBoundingClientRect().left;
	marginDx = marginNow - marginStart;
	marginStart = marginNow;

	if (newImgDraggable) {
		newImgDraggable.style.position = 'absolute';
		leftNewImgDraggable = newImg.getBoundingClientRect().left + 'px';
		topNewImgDraggable = newImg.getBoundingClientRect().top + 'px';
		newImgDraggable.style.left =leftNewImgDraggable;
		newImgDraggable.style.top = topNewImgDraggable;
	}

	if (boardImagesContainer.hasChildNodes()) {
		let children = boardImagesContainer.childNodes;
		children.forEach(element => element.style.left = parseInt(element.style.left) + marginDx + 'px');
	}

	if (paletteContainer.hasChildNodes()) {
		let children = paletteContainer.childNodes;
		children.forEach(element => element.style.left = parseInt(element.style.left) + marginDx + 'px');
	  }

	pinsContainer.childElementCount;
	if (pinsContainer.hasChildNodes()) {
		let children = pinsContainer.childNodes;
		children.forEach(element => element.style.left = parseInt(element.style.left) + marginDx + 'px');
	}

});
//------------------------------------------------------------------------------------------------------


//----------------------------------Перемещение изображений----------------------------------------------
const boardImagesContainer = document.querySelector('.board-image_container');
const deleteZone = document.querySelector('.overlay');
const interface = document.querySelector('.interface');

let isDragging = false;

function zIndexChange(obj, num) {
	obj.style.zIndex = boardImagesContainer.childElementCount + num;
}

document.addEventListener('mousedown', function(event) {
	let dragElement = event.target.closest('.pin');
    let typeOfDragElement = "pin";
	if (!dragElement) {
		dragElement = event.target.closest('.palette');
        typeOfDragElement = "palette";
        if (!dragElement) {
            dragElement = event.target.closest('.draggableNewImg');
            typeOfDragElement = "draggableNewImg";
            if (!dragElement) {
                dragElement = event.target.closest('.onboardImg');
                typeOfDragElement = "onboardImg";
	            if (!dragElement) {
		            return;
	            }
            }
        }
	}

    if (typeOfDragElement == "onboardImg") {
        zIndex = dragElement.style.zIndex;
	    zIndexChange(dragElement, 1);
    }

	event.preventDefault();
	dragElement.ondragstart = function() {
    	return false;
	};

	let coords, shiftX, shiftY;

  	startDrag(dragElement, event.clientX, event.clientY);

	function onMouseUp(event) {
        finishDrag();
        if (typeOfDragElement == "draggableNewImg") {
            let dragElementCopy = document.createElement('img');
            dragElementCopy.setAttribute('src', dragElement.src);
            dragElementCopy.style.maxHeight = '220px';
            dragElementCopy.style.maxWidth = '330px'
            dragElementCopy.style.objectFit = 'contain';
            dragElementCopy.style.position = 'absolute';

            dragElementCopy.style.top = dragElement.getBoundingClientRect().top + 'px';
            dragElementCopy.style.left = dragElement.getBoundingClientRect().left + 'px';

            zIndexChange(dragElementCopy, 1);

            dragElementCopy.classList.add('onboardImg');
            boardImagesContainer.append(dragElementCopy);

            newImgDraggable.style.top = topNewImgDraggable;
            newImgDraggable.style.left = leftNewImgDraggable;
        }
	};
	

	function onMouseMove(event) {
		moveAt(event.clientX, event.clientY);
	}


	function startDrag(element, clientX, clientY) {
		if(isDragging) {
		  return;
		}
	
		isDragging = true;

        if (typeOfDragElement != "draggableNewImg") {
		    deleteZone.style.backgroundColor = 'rgba(255, 180, 180, 0.4)';
		    interface.style.zIndex = '-2';
        }
	
		document.addEventListener('mousemove', onMouseMove);
		element.addEventListener('mouseup', onMouseUp);
	
		shiftX = clientX - element.getBoundingClientRect().left;
		shiftY = clientY - element.getBoundingClientRect().top;
	
		element.style.position = 'fixed';

		moveAt(clientX, clientY);
	};


	function finishDrag() {   
		if(!isDragging) {
		  return;
		}
	
		isDragging = false;

        let topC = canvas.getBoundingClientRect().top;
		let bottomC = canvas.getBoundingClientRect().bottom;
		let leftC = canvas.getBoundingClientRect().left;
		let rightC = canvas.getBoundingClientRect().right;
	
		let topE = dragElement.getBoundingClientRect().top;
		let bottomE = dragElement.getBoundingClientRect().bottom;
		let leftE = dragElement.getBoundingClientRect().left;
		let rightE = dragElement.getBoundingClientRect().right;
	
		if ((topE >= topC && bottomE <= bottomC) && (leftE >= leftC && rightE <= rightC)) {
		  	dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
		} else { 
			if ((bottomE < topC) || (leftE > rightC) || (topE > bottomC) || (rightE < leftC)) {
                if (typeOfDragElement != "draggableNewImg") {
                    dragElement.remove();
                } else {
					if (typeOfDragElement == "pin" || typeOfDragElement == "palette") {
						dragElement.style.left = leftC + (rightC - leftC) / 2 + 'px';
						dragElement.style.top = topC + (bottomC - topC) / 2 + 'px';
					} else {
						
						dragElement.style.left = leftC + 15 + 'px';
						   dragElement.style.top = topC + 15 + 'px';
					}
                }
			} else {
                if (typeOfDragElement == "pin" || typeOfDragElement == "palette") {
                    dragElement.style.left = leftC + (rightC - leftC) / 2 + 'px';
				    dragElement.style.top = topC + (bottomC - topC) / 2 + 'px';
                } else {
                    dragElement.style.left = leftC + 15 + 'px';
		   		    dragElement.style.top = topC + 15 + 'px';
                }
				
			}
		}
	
		document.removeEventListener('mousemove', onMouseMove);
		dragElement.removeEventListener('mouseup', onMouseUp);

        if (typeOfDragElement != "draggableNewImg") {
            deleteZone.style.backgroundColor = 'rgba(255, 180, 180, 0)';
		    interface.style.zIndex = '0';
        }

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
	
		dragElement.style.left = newX + 'px';
		dragElement.style.top = newY + 'px';		
	}	
});
//------------------------------------------------------------------------------------------------------