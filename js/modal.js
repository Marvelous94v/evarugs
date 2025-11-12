////////////////////////////
////// МОДАЛЬНОЕ ОКНО //////
////////////////////////////

const scriptModal = () => {

    const modalWindow = document.querySelector('.modal');
    const buttonModals = document.querySelectorAll('.modal__button');
    // const modalClose = document.querySelector('.modal_close');
    const modalInner = document.querySelector('.modal__inner');
    const body = document.querySelector('body');
    const form = document.querySelector('form.modal');

    // Открытие модального окна
    buttonModals.forEach((item) => {
        item.addEventListener('click', () => {
            modalWindow.style.display = 'flex';
            body.classList.add('noneScroll');
        });
    })

    // Функция закрытия
    const closeModal = () => {
        // отменяем текущую отправку, если она есть
        if (window.modalCancelSend) window.modalCancelSend();

        // Скрываем форму
        modalWindow.style.display = 'none';

        // Удаляем защиту от прокрутки
        body.classList.remove('noneScroll');

        // Сбрасываем форму
        if (form) form.reset();

        // Сбрасываем уведомление безопасно (не удаляем вложенный DOM)
        const noticeOuter = modalWindow.querySelector('.form-notice');
        if (noticeOuter) {
            const noticeInner = noticeOuter.querySelector('.form-notice__inner');
            if (noticeInner) {
                // очищаем текст и убираем видимый класс, а display сбросим через transitionend
                noticeInner.textContent = '';
                noticeInner.classList.remove('is-visible', 'success', 'error', 'info');
                // если display был установлен inline — прячем его сразу
                noticeInner.style.display = 'none';
            }
        }

        // Сбрасываем классы валидации у полей (опционально, но полезно)
        const inputs = modalWindow.querySelectorAll('.modal__input');
        inputs.forEach(i => {
            i.classList.remove('is-valid', 'is-invalid');
            i.removeAttribute('aria-invalid');
        });

        // Сброс прогресс-бара
        const progressBar = modalWindow.querySelector('.form-fill-progress__bar');
        if (progressBar) {
            progressBar.style.width = '0%';
            progressBar.classList.remove('progress--bad', 'progress--warn', 'progress--good');
        }
    };

    // Закрытие модального окна (клик вне контента)
    modalWindow.addEventListener('click', (e) => {
        if (!e.target.closest('.modal__inner')) closeModal();
    });

    // Закрытие модального окна (ESC)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    /*     // Обработчик кнопки закрытия модального окна
    modalClose.addEventListener('click', () => {
        modalWindow.style.display = 'none';
        body.classList.remove('noneScroll');
    })
 */

    // Добавление кнопки через JS
    // Добавление кнопки закрытия прямо (вызовем только если modalInner найден)
    if (modalInner) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'modal__close-button';
        btn.setAttribute('aria-label', 'Закрыть');
        btn.innerHTML = '&times;';
        btn.style.cssText = `
        position: absolute;
        color: white;
        top: 25px;
        right: 25px;
        background: transparent;
        border: none;
        font-size: 24px;
        cursor: pointer;
        z-index: 10;
    `;
        btn.addEventListener('click', closeModal);
        // Если уже есть кнопка похожая — не добавлять дубль
        if (!modalInner.querySelector('.modal__close-button')) modalInner.appendChild(btn);
    }


}

scriptModal();


