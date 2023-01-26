const canvas = document.querySelector('#canvas');
const context = canvas.getContext("2d");
const CANVAS_WIDTH = 950;
const CANVAS_HEIGHT = 550;

const container = document.querySelector('.container');
let marginStart = container.getBoundingClientRect().left;
let marginNow = container.getBoundingClientRect().left;
let marginDx = 0;

//-------------Изменение стиля доски-------------------------------------------------------
let btnSwitchStyle = document.querySelector('#btn_switch_color');

let stylesForBtn = ['url("../img/btnStyle/cork_style.jpg") center center/cover no-repeat',
				'url("../img/btnStyle/graphite_style.jpg") center center/cover no-repeat',
				'url("../img/btnStyle/white_style.jpg") center center/cover no-repeat'];
let stylesForCanvas = ['url("../img/board/white_board.jpg") center center/cover no-repeat',
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
//-----------------------------------------------------------------------------------------


//-------------------------Добавление пинов на доску---------------------------------------
let btnPins = document.querySelector('#btn_pins');
let pinsContainer = document.querySelector('.board-pins_container');

let stylesForBtnPin = ['url("../img/btnStyle/white_style_pin.jpg") center center/cover no-repeat',
						'url("../img/btnStyle/cork_style_pin.jpg") center center/cover no-repeat',
						'url("../img/btnStyle/graphite_style_pin.jpg") center center/cover no-repeat'];

let pinWhiteBoard = "../img/pins/pin1_style3.png";
let pinCorkBoard = ["../img/pins/pin1_style1.png", "../img/pins/pin2_style1.png", 
					"../img/pins/pin3_style1.png", "../img/pins/pin4_style1.png",
					"../img/pins/pin5_style1.png"];
let pinGraphiteBoard = ["../img/pins/pin1_style2.png", "../img/pins/pin2_style2.png", 
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

//перемещение пинов на доске
document.addEventListener('mousedown', function(event) {
	let dragElement = event.target.closest('.pin');
	if (!dragElement) {
		return;
	}

	takeNewImg = false;

	event.preventDefault();
	dragElement.ondragstart = function() {
    	return false;
	};

	let coords, shiftX, shiftY;

  	startDrag(dragElement, event.clientX, event.clientY);

	function onMouseUp(event) {
		finishDrag();
	};
	
	function onMouseMove(event) {
		moveAt(event.clientX, event.clientY);
	}

	function startDrag(element, clientX, clientY) {
		if(isDragging) {
		  return;
		}
	
		isDragging = true;

		//Плавно появляется область, перенеся в которую изображение, оно удаляется с доски
		deleteZone.style.backgroundColor = 'rgba(255, 180, 180, 0.4)';
		interface.style.zIndex = '-2';
	
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
				dragElement.remove();
			} else {
				dragElement.style.left = leftC + (rightC - leftC) / 2 + 'px';
				dragElement.style.top = topC + (bottomC - topC) / 2 + 'px';
			}
		}
	
		document.removeEventListener('mousemove', onMouseMove);
		dragElement.removeEventListener('mouseup', onMouseUp);

		deleteZone.style.backgroundColor = 'rgba(255, 180, 180, 0)';
		interface.style.zIndex = '0';
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

function randomInt(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
  }
  //---------------------------------------------------------------------------------------


//------------------------------добавление палетки----------------------------------------
let btnPalette = document.querySelector('#btn_color');
let paletteContainer = document.querySelector('.palette_container');

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

document.addEventListener('mousedown', function(event) {
	let dragElement = event.target.closest('.palette');
	if (!dragElement) {
		return;
	}

	takeNewImg = false;

	event.preventDefault();
	dragElement.ondragstart = function() {
    	return false;
	};

	let coords, shiftX, shiftY;

  	startDrag(dragElement, event.clientX, event.clientY);

	function onMouseUp(event) {
		finishDrag();
	};
	
	function onMouseMove(event) {
		moveAt(event.clientX, event.clientY);
	}

	function startDrag(element, clientX, clientY) {
		if(isDragging) {
		  return;
		}
	
		isDragging = true;

		//Плавно появляется область, перенеся в которую изображение, оно удаляется с доски
		deleteZone.style.backgroundColor = 'rgba(255, 180, 180, 0.4)';
		interface.style.zIndex = '-2';
	
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
	
		if ((topE >= topC && bottomE <= bottomC) && (leftE >= leftC && rightE <= rightC)) { //когда попадаем в канвас
		  	dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
		} else { 
			if ((bottomE < topC) || (leftE > rightC) || (topE > bottomC) || (rightE < leftC)) { //когда отпускаем изображение полностью за пределами канваса, оно удаляется
				dragElement.remove();
			} else { //когда отпускаем изображение частично  за пределами канваса, оно возвращается на канвас
				dragElement.style.left = leftC + (rightC - leftC) / 2 + 'px';
				dragElement.style.top = topC + (bottomC - topC) / 2 + 'px';
			}
		}
	
		document.removeEventListener('mousemove', onMouseMove);
		dragElement.removeEventListener('mouseup', onMouseUp);

		deleteZone.style.backgroundColor = 'rgba(255, 180, 180, 0)';
		interface.style.zIndex = '0';
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
//-------------------------------------------------------------------------------------------

//для изменения z-индекса
function zIndexChange(obj, num) {
	obj.style.zIndex = boardImagesContainer.childElementCount + num;
}

//-------------Взятие изображения по url---------------------------------------------------
let input = document.querySelector('#new_image-url');
let form = document.querySelector('#form_new_image-url');
let newImg = document.querySelector('#new_image');
let newImgDraggable, leftNewImgDraggable, topNewImgDraggable; //копия newImg, которая будет лежать поверх, для многократного перемещения одной и той же картинки
let newImgWrapper = document.querySelector('#new_image__wrapper');

form.addEventListener('submit', function(e) {
    e.preventDefault();

	//удаляем копию предыдущего фото, если она есть (т.е. если в форме не дефолтные картинки)
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
				
				//поверх кладем фото, которое можно перетаскивать
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

//Удобно ли?
input.addEventListener('dblclick', function() {
	input.value = '';
});
//----------------------------------------------------------------------------------------



//------Перетаскивание изображения на канвас----------------------------------------------
const boardImagesContainer = document.querySelector('.board-image_container');
let isDragging = false;

document.addEventListener('mousedown', function(event) {
	let dragElement = event.target.closest('.draggableNewImg');
	if (!dragElement) {
		return;
	}

	event.preventDefault();

	dragElement.ondragstart = function() {
    	return false;
	};

  let coords, shiftX, shiftY;

  startDrag(dragElement, event.clientX, event.clientY);


  function onMouseUp(event) {
    finishDrag();
	//для канваса создаем копию, а перемещаемый элемент из формы помещаем в начальную позицию
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
	boardImagesContainer.append(dragElementCopy); //перекладываем картинки в спецконтейнер div для всех картинок

	newImgDraggable.style.top = topNewImgDraggable;
	newImgDraggable.style.left = leftNewImgDraggable;

	try {
		newImgDraggable = document.querySelector('.draggableNewImg');
		zIndexChange(newImgDraggable, 1);
	} catch {

	}
	
  };

  function onMouseMove(event) {
    moveAt(event.clientX, event.clientY);
  }

  // в начале перемещения элемента:
  //   запоминаем место клика по элементу (shiftX, shiftY),
  //   переключаем позиционирование элемента (position:fixed) и двигаем элемент
	function startDrag(element, clientX, clientY) {
    	if(isDragging) {
      		return;
    	}

    	isDragging = true;

    	document.addEventListener('mousemove', onMouseMove);
    	element.addEventListener('mouseup', onMouseUp);

    	shiftX = clientX - element.getBoundingClientRect().left;
    	shiftY = clientY - element.getBoundingClientRect().top;

    	element.style.position = 'fixed';

    	moveAt(clientX, clientY);
  	};

  	// переключаемся обратно на абсолютные координаты
  	// чтобы закрепить элемент относительно документа
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
			//когда попадаем в канвас
      		dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
    	} else { 
			//когда отпускаем изображение за пределами канваса, оно автоматически встает в левый верхний угол канваса
      		dragElement.style.left = leftC + 15 + 'px';
      		dragElement.style.top = topC + 15 + 'px';
    	}

    	document.removeEventListener('mousemove', onMouseMove);
    	dragElement.removeEventListener('mouseup', onMouseUp);
  	}

  	function moveAt(clientX, clientY) {
    	// вычисляем новые координаты (относительно окна)
    	let newX = clientX - shiftX;
    	let newY = clientY - shiftY;

    	// проверяем, не переходят ли новые координаты за нижний край окна:
    	// сначала вычисляем гипотетический новый нижний край окна
    	let newBottom = newY + dragElement.offsetHeight;

    	// затем, если новый край окна выходит за пределы документа, прокручиваем страницу
    	if (newBottom > document.documentElement.clientHeight) {
    		// координата нижнего края документа относительно окна
    		let docBottom = document.documentElement.getBoundingClientRect().bottom;

      		// простой скролл документа на 10px вниз имеет проблему -
      		// он может прокручивать документ за его пределы,
      		// поэтому используем Math.min(расстояние до конца, 10)
      		let scrollY = Math.min(docBottom - newBottom, 10);

      		// вычисления могут быть не совсем точны - случаются ошибки при округлении,
      		// которые приводят к отрицательному значению прокрутки. отфильтруем их:
      		if (scrollY < 0) scrollY = 0;

      		window.scrollBy(0, scrollY);

      		// быстрое перемещение мыши может поместить курсор за пределы документа вниз
      		// если это произошло -
      		// ограничиваем новое значение Y максимально возможным исходя из размера документа:
      		newY = Math.min(newY, document.documentElement.clientHeight - dragElement.offsetHeight);
    	}

    	// проверяем, не переходят ли новые координаты за верхний край окна (по схожему алгоритму)
    	if (newY < 0) {
      		// прокручиваем окно вверх
      		let scrollY = Math.min(-newY, 10);
      		if (scrollY < 0) scrollY = 0; // проверяем ошибки точности

      		window.scrollBy(0, -scrollY);
      		// быстрое перемещение мыши может поместить курсор за пределы документа вверх
      		newY = Math.max(newY, 0); // newY не может быть меньше нуля
    	}


    	// ограничим newX размерами окна
    	// согласно условию, горизонтальная прокрутка отсутствует, поэтому это не сложно:
    	if (newX < 0) newX = 0;
    	if (newX > document.documentElement.clientWidth - dragElement.offsetWidth) {
      		newX = document.documentElement.clientWidth - dragElement.offsetWidth;
    	}

    	dragElement.style.left = newX + 'px';
    	dragElement.style.top = newY + 'px';

  	}

});
//-------------------------------------------------------------------------------------------



//------------------Перетаскивание изображения внутри канваса---------------------------------
let isDraggingOnCanvas = false;
let previousDraggingOnCanvas;
let takeNewImg = false;

//для удаления
let deleteZone = document.querySelector('.overlay');
let interface = document.querySelector('.interface');

document.addEventListener('mousedown', function(event) {
	let dragElement = event.target.closest('.onboardImg');
	if (!dragElement) {
		return;
	}

	zIndex = dragElement.style.zIndex;
	zIndexChange(dragElement, 1);

	takeNewImg = false;

	event.preventDefault();
	dragElement.ondragstart = function() {
    	return false;
	};

	let coords, shiftX, shiftY;

  	startDrag(dragElement, event.clientX, event.clientY);

	function onMouseUp(event) {
		finishDrag();

		try {
			newImgDraggable = document.querySelector('.draggableNewImg');
			zIndexChange(newImgDraggable, 1);
		} catch {
	
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

		//Плавно появляется область, перенеся в которую изображение, оно удаляется с доски
		deleteZone.style.backgroundColor = 'rgba(255, 180, 180, 0.4)';
		interface.style.zIndex = '-2';
	
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
	
		if ((topE >= topC && bottomE <= bottomC) && (leftE >= leftC && rightE <= rightC)) { //когда попадаем в канвас
		  	dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
		} else { 
			if ((bottomE < topC) || (leftE > rightC) || (topE > bottomC) || (rightE < leftC)) { //когда отпускаем изображение полностью за пределами канваса, оно удаляется
				dragElement.remove();
			} else { //когда отпускаем изображение частично  за пределами канваса, оно возвращается на канвас
		   		dragElement.style.left = leftC + 15 + 'px';
		   		dragElement.style.top = topC + 15 + 'px';
			}
		}
	
		document.removeEventListener('mousemove', onMouseMove);
		dragElement.removeEventListener('mouseup', onMouseUp);

		if (boardImagesContainer.hasChildNodes()) {
			let children = boardImagesContainer.childNodes;
			children.forEach( function(elem) {
				if (elem.style.zIndex > zIndex) {
					elem.style.zIndex = elem.style.zIndex - 1;
				}
			});
		}

		previousDraggingOnCanvas = dragElement;
		deleteZone.style.backgroundColor = 'rgba(255, 180, 180, 0)';
		interface.style.zIndex = '0';
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
//--------------------------------------------------------------------------------------------



//---------------------Очищение канваса-------------------------------------------------------
let btnClearBoard = document.querySelector('#btn_clean');

btnClearBoard.addEventListener('click', function() {
	clearArrayImages();
	clearArrayPins();
	clearArrayPalette();
});

function clearArrayImages() {
	// boardImagesContainer.childElementCount;
	if (boardImagesContainer.hasChildNodes()) {
		let children = boardImagesContainer.childNodes;
		while (children.length > 0) {
			children[0].remove();
		}
	}

	for (let i = 0; i < imagesOnCanvas.length; i++) {
		imagesOnCanvas[i].remove();
	}
	imagesOnCanvas.length = 0;
}

function clearArrayPins() {
	// pinsContainer.childElementCount;
	if (pinsContainer.hasChildNodes()) {
		let children = pinsContainer.childNodes;
		while (children.length > 0) {
			children[0].remove();
		}
	}
}

function clearArrayPalette() {
	// paletteContainer.childElementCount;
	if (paletteContainer.hasChildNodes()) {
		let children = paletteContainer.childNodes;
		while (children.length > 0) {
			children[0].remove();
		}
	}
}
//--------------------------------------------------------------------------------------------



//--------------------------Сохранение картинки-----------------------------------------------
let btnSaveBoard = document.querySelector('#btn_save');
let board = document.querySelector('.board__wrapper');
let boardImages = document.querySelector('.board-image_container');
let resultModalWindow = document.querySelector('.overlay_with_result');
let paletteImgContainer = document.querySelector('.palette_img_container');

btnSaveBoard.addEventListener('click', function() {
	canvas.width = 950;
	canvas.height = 550;

	let coordsC = canvas.getBoundingClientRect();

	//отрисовка на канвасе фона
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

			//и картинок с учетом смещения координат и z-слоев
			if (boardImagesContainer.hasChildNodes()) {
				let children = boardImagesContainer.childNodes;
				let imagesOnCanvas = [];
				children.forEach(elem => imagesOnCanvas.push(elem));
				let sortedImagesOnCanvas = mergeSort(imagesOnCanvas);
				for (let i = 0; i < sortedImagesOnCanvas.length; i++) {
					let coordsImg = sortedImagesOnCanvas[i].getBoundingClientRect();
					context.drawImage(sortedImagesOnCanvas[i], parseInt(sortedImagesOnCanvas[i].style.left) - coordsC.left, parseInt(sortedImagesOnCanvas[i].style.top) - coordsC.top, parseInt(coordsImg.right - coordsImg.left), parseInt(coordsImg.bottom - coordsImg.top));
				}
			}

			//палеток
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

			//и пинов с учетом смещения координат
			// pinsContainer.childElementCount;
			if (pinsContainer.hasChildNodes()) {
				let children = pinsContainer.childNodes;
				children.forEach(element => context.drawImage(element, parseInt(element.style.left) - coordsC.left, parseInt(element.style.top) - coordsC.top, parseInt(element.getBoundingClientRect().right - element.getBoundingClientRect().left), parseInt(element.getBoundingClientRect().bottom - element.getBoundingClientRect().top)));
			}

			//display none у всех элементов на канвасе
			boardImages.style.display = 'none';
			pinsContainer.style.display = 'none';
			paletteContainer.style.display = 'none';

			//всплытие оверлея с подсказкой как сохранить картинку
			resultModalWindow.style.display = 'flex';
			interface.style.display = 'none';
			resultModalWindow.style.zIndex = 3;

		},
		error => {}
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
//---------------------------------------------------------------------------------------------


//--------------Возвращение обратно к редактированию-------------------------------------------
let continueBottom = document.querySelector('#continue');

continueBottom.addEventListener('click', function() {
	let context = canvas.getContext("2d");
	context.clearRect(0, 0, 950, 550);

	boardImages.style.display = 'flex';
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
//---------------------------------------------------------------------------------------------


//-------------при резайзе надо двигать все draggable элементы тк они лежат поверх-------------
window.addEventListener('resize', (e) => {
	marginNow = container.getBoundingClientRect().left;
	marginDx = marginNow - marginStart;
	marginStart = marginNow;

	//Копию передвигаемого изображения кладем поверх newImg
	if (newImgDraggable) {
		newImgDraggable.style.position = 'absolute';
		leftNewImgDraggable = newImg.getBoundingClientRect().left + 'px';
		topNewImgDraggable = newImg.getBoundingClientRect().top + 'px';
		newImgDraggable.style.left =leftNewImgDraggable;
		newImgDraggable.style.top = topNewImgDraggable;
	}

	//двигаем картинки
	// boardImagesContainer.childElementCount;
	if (boardImagesContainer.hasChildNodes()) {
		let children = boardImagesContainer.childNodes;
		children.forEach(element => element.style.left = parseInt(element.style.left) + marginDx + 'px');
	}

	//двигаем палетки
	if (paletteContainer.hasChildNodes()) {
		let children = paletteContainer.childNodes;
		children.forEach(element => element.style.left = parseInt(element.style.left) + marginDx + 'px');
	  }

	//двигаем пины
	pinsContainer.childElementCount;
	if (pinsContainer.hasChildNodes()) {
		let children = pinsContainer.childNodes;
		children.forEach(element => element.style.left = parseInt(element.style.left) + marginDx + 'px');
	}

});