const daysBlock = document.querySelector('.timer__daysValue');
const hoursBlock = document.querySelector('.timer__hoursValue');
const minutesBlock = document.querySelector('.timer__minutesValue');
const secondsBlock = document.querySelector('.timer__secondsValue');
const dateDeadline = '12 november 2025';
const timerContainer = document.querySelector('.timer'); // контейнер таймера

const pluralize = (n, titles) => {
    const num = Math.abs(n) % 100;
    const lastDigit = num % 10;
    if (num > 10 && num < 20) return titles[2];
    if (lastDigit > 1 && lastDigit < 5) return titles[1];
    if (lastDigit === 1) return titles[0];
    return titles[2];
}

const getTimeUnits = (input) => {
    const days = Math.floor(input / 86400);
    const hours = Math.floor((input % 86400) / 3600);
    const minutes = Math.floor((input % 3600) / 60);
    const seconds = Math.floor(input % 60);

    const formatValue = (num) => String(num).padStart(2, '0');

    return {
        days: { value: formatValue(days), text: pluralize(days, ['день', 'дня', 'дней']) },
        hours: { value: formatValue(hours), text: pluralize(hours, ['час', 'часа', 'часов']) },
        minutes: { value: formatValue(minutes), text: pluralize(minutes, ['минута', 'минуты', 'минут']) },
        seconds: { value: formatValue(seconds), text: pluralize(seconds, ['секунда', 'секунды', 'секунд']) }
    };
}

const updateTimer = () => {
    const currentDate = new Date();
    const DeadDate = new Date(dateDeadline).getTime();
    const timeRemaining = (DeadDate - currentDate) / 1000;
    const displayDate = timeRemaining > 0 ? timeRemaining : 0;

    const parameters = getTimeUnits(displayDate);

    daysBlock.textContent = parameters.days.value;
    hoursBlock.textContent = parameters.hours.value;
    minutesBlock.textContent = parameters.minutes.value;
    secondsBlock.textContent = parameters.seconds.value;

    daysBlock.nextElementSibling.textContent = parameters.days.text;
    hoursBlock.nextElementSibling.textContent = parameters.hours.text;
    minutesBlock.nextElementSibling.textContent = parameters.minutes.text;
    secondsBlock.nextElementSibling.textContent = parameters.seconds.text;

    if (displayDate === 0) {
        daysBlock.style.color = 'red';
        hoursBlock.style.color = 'red';
        minutesBlock.style.color = 'red';
        secondsBlock.style.color = 'red';
    } else {
        daysBlock.style.color = '';
        hoursBlock.style.color = '';
        minutesBlock.style.color = '';
        secondsBlock.style.color = '';
    }

    if (timerContainer.classList.contains('timer__hidden')) {
        timerContainer.classList.remove('timer__hidden');
    }
}

updateTimer();
const interval = setInterval(updateTimer, 500);