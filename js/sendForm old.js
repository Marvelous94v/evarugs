////////////////////////////
////// ОТПРАВКА ФОРМЫ //////
////////////////////////////

const scriptSendForm = () => {

    const form = document.querySelector('.modal');

    form.addEventListener('submit', () => {
        event.preventDefault();

        const text = form.querySelector('input[type=text]')
        const tel = form.querySelector('input[type=tel]')
        const email = form.querySelector('input[type=email]')

        const sendObj = {
            name: text.value,
            tel: tel.value,
            email: email.value
        }

        console.log(sendObj.name);
        console.log(sendObj.tel);
        console.log(sendObj.email);
        console.log(sendObj);

        fetch('https://jsonplaceholder.typicode.com1/posts', {
            method: 'POST',
            body: JSON.stringify(sendObj),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                if (response.ok) { // если HTTP-статус в диапазоне 200-299
                    // получаем тело ответа (см. про этот метод ниже)
                    return response.json()
                } else {
                    alert("Ошибка HTTP: " + response.status);
                    throw new Error(response.status + ':' + response.text)
                }
            })
            .then((json) => console.log(json))
            .finally(() => {
                console.log('Очистить форму')
            })

    })




    /*     fetch('https://jsonplaceholder.typicode.com/todos/5')
            .then(response => {
                if (response.status === 404) {
                    throw new Error('Not found!')
                }
                return response.json()
            })
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.warn(error.message)
            })
            .finally(() => {
                console.log('finaly')
            }) */


    /*     fetch('https://jsonplaceholder.typicode.com/todos/4')
            .then(response => response.json())
            .then(json => console.log(json)) */

}

scriptSendForm();



