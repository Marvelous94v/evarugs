const modalWindow = document.querySelector('.modal');
const buttonModals = document.querySelectorAll('.modal__button');
const modalClose = document.querySelector('.modal_close');
const body = document.querySelector('body');

const contents = document.querySelectorAll('.program-line__content');


contents.forEach((e) => {

    const title = e.querySelector('.program-line__title');
    const descr = e.querySelector('.program-line__descr');

    /*     
        // ver 1 (записывается в свойство, только одна значение свойства = 1 функция для выполнения)

        console.dir(title);
    
        title.onclick = () => {
            console.log(title);
        } 
       
        // ver 2 (можно подключать сколько угодно событий на один элемент )
        title.addEventListener('click', () => {
            console.log('test');
        })

    */

    title.addEventListener('click', () => {
        descr.classList.toggle('active')
        // console.log(title);
    })

    // console.dir(descr.classList.remove);

})






buttonModals.forEach((item) => {
    item.addEventListener('click', () => {
        modalWindow.style.display = 'flex';
        body.classList.add('noneScroll');
    });
})

modalWindow.addEventListener('click', (e) => {
    const isModal = e.target.closest('.modal__inner');

    if (!isModal) {
        modalWindow.style.display = 'none';
        body.classList.remove('noneScroll');
    }

})

modalClose.addEventListener('click', () => {
    modalWindow.style.display = 'none';
    body.classList.remove('noneScroll');
})




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

