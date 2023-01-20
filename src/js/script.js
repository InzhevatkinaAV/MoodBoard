let canvas = document.querySelector('#canvas');
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



//-------------Взятие изображения по url---------------------------------------------------
let input = document.querySelector('#new_image-url');
let form = document.querySelector('#form_new_image-url');
let newImg = document.querySelector('#new_image');
let newImgDraggable, leftNewImgDraggable, topNewImgDraggable; //копия newImg, которая будет лежать поверх, для многократного перемещения одной и той же картинки

form.addEventListener('submit', function(e) {
    e.preventDefault();

	//удаляем копию предыдущего фото, если она есть (т.е. если в форме не дефолтные картинки)
	try {
		let previous = document.querySelector('.draggableNewImg');
		let parentPrevious = document.querySelector('#new_image__wrapper');
		parentPrevious.removeChild(previous);
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
				
				//поверх лежит фото, которое можно перетаскивать
				newImgDraggable.setAttribute('src', input.value);
				// newImgDraggable.style = newImg.style;
				newImgDraggable.style.maxHeight = '220px';
				newImgDraggable.style.maxWidth = '330px'
				newImgDraggable.style.objectFit = 'contain';
				newImgDraggable.style.position = 'absolute';
				newImgDraggable.style.zIndex = imagesOnCanvas.length + 1;
				newImgDraggable.classList.add('draggableNewImg');
				leftNewImgDraggable = newImg.getBoundingClientRect().left + 'px';
				topNewImgDraggable = newImg.getBoundingClientRect().top + 'px';

				
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
//----------------------------------------------------------------------------------------



//------Перетаскивание изображения на канвас----------------------------------------------
let topC = canvas.getBoundingClientRect().top;
let bottomC = canvas.getBoundingClientRect().bottom;
let leftC = canvas.getBoundingClientRect().left;
let rightC = canvas.getBoundingClientRect().right;

let isDragging = false;

document.addEventListener('mousedown', function(event) {
	let dragElement = event.target.closest('.draggableNewImg');
	if (!dragElement) {
		console.log("!");
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

    let topE = dragElement.getBoundingClientRect().top;
    let bottomE = dragElement.getBoundingClientRect().bottom;
    let leftE = dragElement.getBoundingClientRect().left;
    let rightE = dragElement.getBoundingClientRect().right;

    if ((topE >= topC && bottomE <= bottomC) && (leftE >= leftC && rightE <= rightC)) { //когда попадаем в канвас
      dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
    } else { //когда отпускаем изображение за пределами канваса, оно автоматически встает в левый верхний угол канваса
      dragElement.style.left = leftC + 15 + 'px';
      dragElement.style.top = topC + 15 + 'px';
    }

    document.removeEventListener('mousemove', onMouseMove);
    dragElement.removeEventListener('mouseup', onMouseUp);

	//для канваса создаем копию, а перемещаемый элемент из формы помещаем в начальную позицию
	let dragElementCopy = document.createElement('img');
    dragElementCopy.setAttribute('src', dragElement.src);
	dragElementCopy.style.maxHeight = '220px';
	dragElementCopy.style.maxWidth = '330px'
	dragElementCopy.style.objectFit = 'contain';
	dragElementCopy.style.position = 'absolute';
	

	dragElementCopy.style.top = dragElement.getBoundingClientRect().top + 'px';
	dragElementCopy.style.left = dragElement.getBoundingClientRect().left + 'px';
	dragElementCopy.classList.add('onboardImg');
	newImg.before(dragElementCopy);

	newImgDraggable.style.top = topNewImgDraggable;
	newImgDraggable.style.left = leftNewImgDraggable;

	//кладем изображение в массив изображений на канвасе
	imagesOnCanvas.push(dragElementCopy);
	dragElementCopy.style.zIndex = imagesOnCanvas.length;
	newImgDraggable.style.zIndex = imagesOnCanvas.length + 1;

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

document.addEventListener('mousedown', function(event) {
	let dragElement = event.target.closest('.onboardImg');
	if (!dragElement) {
		return;
	}

	dragElement.style.zIndex = imagesOnCanvas.length + 1;
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
	
		let topE = dragElement.getBoundingClientRect().top;
		let bottomE = dragElement.getBoundingClientRect().bottom;
		let leftE = dragElement.getBoundingClientRect().left;
		let rightE = dragElement.getBoundingClientRect().right;
	
		if ((topE >= topC && bottomE <= bottomC) && (leftE >= leftC && rightE <= rightC)) { //когда попадаем в канвас
		  dragElement.style.top = parseInt(dragElement.style.top) + pageYOffset + 'px';
		} else { //когда отпускаем изображение за пределами канваса, оно автоматически встает в левый верхний угол канваса
		  dragElement.style.left = leftC + 15 + 'px';
		  dragElement.style.top = topC + 15 + 'px';
		}

		// dragElement.style.zIndex = '2';
		if (previousDraggingOnCanvas && previousDraggingOnCanvas != dragElement) {
			previousDraggingOnCanvas.style.zIndex = imagesOnCanvas.length;
			imagesOnCanvas.forEach((item) => {
				if (item.style.zIndex > 0) {
					item.style.zIndex = item.style.zIndex - 1;
					console.log("!");
				}
					
			  });
		}
	
		document.removeEventListener('mousemove', onMouseMove);
		dragElement.removeEventListener('mouseup', onMouseUp);

		previousDraggingOnCanvas = dragElement;
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
//--------------------------------------------------------------------------------------------



//-----------------Удаление изображения с канваса--------------------------------------------
// document.addEventListener('mousedown', function(event) {
// });
//-------------------------------------------------------------------------------------------


