let input = document.querySelector('#new_image-url');
let form = document.querySelector('#form_new_image-url');
let newImg = document.querySelector('#new_image');


form.addEventListener('submit', function(e) {
    e.preventDefault();
        if (String(input.value) == '') {
            newImg.setAttribute('src', '../img/default_picture.svg');
        } else {
            let promise = loadImage(input.value);

            promise.then(
                img => newImg.setAttribute('src', input.value),
                error => newImg.setAttribute('src', '../img/picture_404.svg')
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


