////////////////////////
////// ПЕРЕМЕННЫЕ //////
////////////////////////

const modalWindow = document.querySelector('.modal');
const buttonModals = document.querySelectorAll('.modal__button');
const modalClose = document.querySelector('.modal_close');
const body = document.querySelector('body');

//////////////////////////////////////////////////////////////

////////////////////////////
////// МОДАЛЬНОЕ ОКНО //////
////////////////////////////

// Открытие модального окна
buttonModals.forEach((item) => {
    item.addEventListener('click', () => {
        modalWindow.style.display = 'flex';
        body.classList.add('noneScroll');
    });
})

// Закрытие модального окна
modalWindow.addEventListener('click', (e) => {
    const isModal = e.target.closest('.modal__inner');

    if (!isModal) {
        modalWindow.style.display = 'none';
        body.classList.remove('noneScroll');
    }

})

// Обработчик кнопки закрытия модального окна
modalClose.addEventListener('click', () => {
    modalWindow.style.display = 'none';
    body.classList.remove('noneScroll');
})




////////// ДРУГОЕ /////////

// Закрытие по ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modalWindow.style.display = 'none';
        body.classList.remove('noneScroll');
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal');
    const btn = document.createElement('button');
    btn.innerHTML = '&times;';
    btn.style = `
    position: absolute;
    top: 8px;
    right: 8px;
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
  `;
    btn.onclick = () => {
        modal.style.display = 'none';
        document.body.classList.remove('noneScroll');
    };
    modal.appendChild(btn);
});
