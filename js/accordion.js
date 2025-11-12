////////////////////////////
////// ЭТАПЫ ОБУЧЕНИЯ //////
////////////////////////////

const scriptAccordion = () => {

    const contents = document.querySelectorAll('.program-line__content');

    contents.forEach((e) => {


        const title = e.querySelector('.program-line__title');
        const descr = e.querySelector('.program-line__descr');

        title.addEventListener('click', () => {

            // Список активный описаний
            const isActive = descr.classList.contains('active');

            // Закрываем все активные блоки
            document.querySelectorAll('.program-line__descr.active').forEach((el) => {
                el.classList.remove('active');
            });

            // Если текущий был неактивен — открываем его, иначе — оставляем закрытым
            if (!isActive) {
                descr.classList.add('active');
            }
        });
    });

}

scriptAccordion();



