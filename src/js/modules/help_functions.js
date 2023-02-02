export function loadImage(src) {
	return new Promise(function(resolve, reject) {
		const img = document.createElement('img');
		img.src = src;
		
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error(`Ошибка загрузки изображения ${src}`));
	});
}

export function getUrlFromStyle(backgroundStyle) {
	const startURL = backgroundStyle.indexOf('(');
	const finishURL = backgroundStyle.indexOf(')');
	return backgroundStyle.slice(startURL + 2, finishURL - 1);
}

export function clear(container) {
    if (container.hasChildNodes()) {
        const children = container.childNodes;
        while (children.length > 0) {
            children[0].remove();
        }
    }
}

export function moveForResizeWindow(container, dX) {
    if (container.hasChildNodes()) {
        let children = container.childNodes;
        children.forEach(element => element.style.left = parseInt(element.style.left) + parseInt(dX) + 'px');
    }
}

export function randomInt(min, max) {
	const rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

export function mergeSort(array) {
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
