let canvas = document.querySelector('#canvas');
let container = document.querySelector('.container');
let marginStart = container.getBoundingClientRect().left;
let marginNow = container.getBoundingClientRect().left;
let marginDx = 0;

let boardImagesContainer = document.querySelector('.board-image_container');
let imagesOnCanvas = new Array();

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
});
//-----------------------------------------------------------------------------------------

//для изменения z-индекса
function zIndexChange(obj, num) {
	obj.style.zIndex = imagesOnCanvas.length + num;
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

				newImg.before(newImgDraggable); //Вставляем newImgDraggable перед newImg в HTML
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
	//кладем изображение в массив изображений на канвасе
	imagesOnCanvas.push(dragElementCopy);

	try {
		newImgDraggable = document.querySelector('.draggableNewImg');
		zIndexChange(newImgDraggable, 3);
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

	zIndexChange(dragElement, 2);

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
			zIndexChange(newImgDraggable, 3);
		} catch {
	
		}

		zIndexChange(dragElement, 1);

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

		if (previousDraggingOnCanvas && previousDraggingOnCanvas != dragElement) {
		 	imagesOnCanvas.forEach((item) => {
		 		if (item.style.zIndex > 0) {
		 			item.style.zIndex = item.style.zIndex - 1;
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
	//Удаление всех картинок
	clearArrayImagesOnCanvas();

	//Очищение формы и инпута НУЖНО ЛИ?
	/*input.value = '';
	let newImgDraggable = document.querySelector('.draggableNewImg');
	newImgDraggable.remove();
	newImg.setAttribute('src', '../img/default_picture.svg');*/
});

function clearArrayImagesOnCanvas() {
	for (let i = 0; i < imagesOnCanvas.length; i++) {
		imagesOnCanvas[i].remove();
	}
	imagesOnCanvas.length = 0;
}
//--------------------------------------------------------------------------------------------



//--------------------------Сохранение картинки-----------------------------------------------
let btnSaveBoard = document.querySelector('#btn_save');
let board = document.querySelector('.board__wrapper');
let boardImages = document.querySelector('.board-image_container');
let resultModalWindow = document.querySelector('.overlay_with_result');

btnSaveBoard.addEventListener('click', function() {
	let context = canvas.getContext("2d");
	canvas.width = 950;
	canvas.height = 550;
	let coordsC = canvas.getBoundingClientRect();

	//сортировка и массива imagesOnCanvas
	for (let i = 0; i < imagesOnCanvas.length; i++) {
		for (let j = i; j < imagesOnCanvas.length; j++) {
			if (imagesOnCanvas[i].style.zIndex >= imagesOnCanvas[j].style.zIndex) {
				let temp = imagesOnCanvas[i];
				imagesOnCanvas[i] = imagesOnCanvas[j];
				imagesOnCanvas[j] = temp;
			}
		}
	}

	//отрисовка на канвасе фона
	let backgroundImg = new Image();
	let startURL = stylesForCanvas[currentStyle].indexOf('(');
	let finishURL = stylesForCanvas[currentStyle].indexOf(')');
	let url = stylesForCanvas[currentStyle].slice(startURL + 2, finishURL - 1);
	backgroundImg.src = url;
	backgroundImg.style.width = canvas.style.width;
	backgroundImg.style.height = canvas.style.height;
	context.drawImage(backgroundImg, 0, 0);

	//и картинок с учетом смещения координат
	 for (let i = 0; i < imagesOnCanvas.length; i++) {
		console.log(imagesOnCanvas[i].style.zIndex);
		let coordsImg = imagesOnCanvas[i].getBoundingClientRect();
		context.drawImage(imagesOnCanvas[i], parseInt(imagesOnCanvas[i].style.left) - coordsC.left, parseInt(imagesOnCanvas[i].style.top) - coordsC.top, parseInt(coordsImg.right - coordsImg.left), parseInt(coordsImg.bottom - coordsImg.top));
	 }

	//display none у всех draggableImagesOnCanvas в board-image_container
	boardImages.style.display = 'none';

	//всплытие оверлея с подсказкой как сохранить картинку
	resultModalWindow.style.display = 'flex';
	interface.style.display = 'none';
	resultModalWindow.style.zIndex = 3;

	// clearArrayImagesOnCanvas();
});
//---------------------------------------------------------------------------------------------


//--------------Возвращение обратно к редактированию-------------------------------------------
let continueBottom = document.querySelector('#continue');

continueBottom.addEventListener('click', function() {
	let context = canvas.getContext("2d");
	context.clearRect(0, 0, 950, 550);

	boardImages.style.display = 'flex';

	resultModalWindow.style.display = 'none';
	interface.style.display = 'flex';
	resultModalWindow.style.zIndex = -2;
});
//---------------------------------------------------------------------------------------------


//-------------при резайзе надо двигать все draggable элементы тк они лежат поверх-------------
window.addEventListener('resize', (e) => {
	marginNow = container.getBoundingClientRect().left;
	marginDx = marginNow - marginStart;
	console.log("marginPrev(" + parseInt(marginStart) + ") - marginStart(" + parseInt(marginNow) + ") = " + marginDx);
	marginStart = marginNow;

	//Копию передвигаемого изображения кладем поверх newImg
	if (newImgDraggable) {
		leftNewImgDraggable = newImg.getBoundingClientRect().left + 'px';
		topNewImgDraggable = newImg.getBoundingClientRect().top + 'px';
		newImgDraggable.style.left =leftNewImgDraggable;
		newImgDraggable.style.top = topNewImgDraggable;
	}

	boardImagesContainer.childElementCount

	if (boardImagesContainer.hasChildNodes()) {
		// Таким образом, сначала мы проверяем, не пуст ли объект, есть ли у него дети
		let children = boardImagesContainer.childNodes;
		children.forEach(element => element.style.left = parseInt(element.style.left) + marginDx + 'px');
	  }

});

