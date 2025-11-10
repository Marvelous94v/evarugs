////////////////////////
////// ПЕРЕМЕННЫЕ //////
////////////////////////

const modalWindow = document.querySelector('.modal');
const buttonModals = document.querySelectorAll('.modal__button');
const modalClose = document.querySelector('.modal_close');
const body = document.querySelector('body');
const contents = document.querySelectorAll('.program-line__content');


////////////////////////////////////////////////////////////////

////////////////////////////
////// СТАРЫЕ ПРИМЕРЫ //////
////////////////////////////

/* 
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const hamburgerMenu = document.querySelector('.hamburger-menu');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        hamburgerMenu.classList.toggle('active');

        // При открытии меню, отключаем прокрутку
        if (hamburgerMenu.classList.contains('active')) {
            document.body.classList.add('noneScroll');
        } else {
            document.body.classList.remove('noneScroll');
        }
    });

    // Закрытие меню при клике вне его области
    document.addEventListener('click', function (event) {
        if (!hamburger.contains(event.target) &&
            !hamburgerMenu.contains(event.target) &&
            hamburgerMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            hamburgerMenu.classList.remove('active');
            document.body.classList.remove('noneScroll');
        }
    });
});
 */


/* 
const element = document.querySelector('.header');
const elements = document.querySelectorAll('div')

console.dir(elements);

for (let i = 0; i < elements.length; i++) {

    console.log(elements[i]);

}

elements.forEach((e, i, a) => {
    console.log(e);
    console.log(i);
    console.log(a);

})

 */

