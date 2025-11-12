//////////////////////////////
////// Подсчет финансов ////// 
//////////////////////////////

/* Заработок плавно увеличивается с течением месяца от 350 000 ₽ к 500 000 ₽ (примерно), пропорционально дню + секундам текущего дня.
Количество учеников растёт на 10% в месяц, с сохранением 95% закончивших.
Анимация срабатывает только один раз при попадании блока в среднюю треть экрана. */

const scriptCashDynamic = () => {
    const courseProgress = document.querySelector('.course__progress-element progress');
    const courseNumber = document.querySelector('.course__progress .course__number');
    const courseStudents = document.querySelectorAll('.course__counter .course__number');
    const courseBlock = document.querySelector('.course');

    if (!courseProgress || !courseNumber || !courseStudents || !courseBlock) return;

    let animated = false;

    // Получаем "динамическое" значение заработка и учеников по дате
    function calculateValues() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-11
        const day = now.getDate();
        const secondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const totalSecondsDay = 24 * 3600;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const baseEarned = 350000;
        const monthlyGrowth = 150000;
        const baseStudents = 200;
        const monthlyStudentsGrowthPercent = 0.10; // 10%

        // Прогресс месяца в долях
        const monthProgress = (day - 1 + secondsToday / totalSecondsDay) / daysInMonth;

        // Заработок
        const earned = Math.floor(baseEarned + monthProgress * monthlyGrowth);

        // Ученики
        const totalStudents = Math.floor(baseStudents + monthProgress * (baseStudents * monthlyStudentsGrowthPercent));
        const finishedStudents = Math.floor(totalStudents * 0.95);

        return { earned, totalStudents, finishedStudents };
    }

    // Анимация числа и прогресс-бара
    function animateValue(finalValue, finalProgress, duration = 1500) {
        const start = 0;
        const startTime = performance.now();
        const maxValue = 1000000;

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(progress * finalValue);

            courseNumber.textContent = currentValue.toLocaleString('ru-RU') + '₽';
            courseProgress.value = Math.floor(progress * finalProgress);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                courseNumber.textContent = finalValue.toLocaleString('ru-RU') + '₽';
                courseProgress.value = finalProgress;
            }
        }

        requestAnimationFrame(update);
    }

    function checkVisibility() {
        if (animated) return;

        const rect = courseBlock.getBoundingClientRect();
        const screenHeight = window.innerHeight;
        const topThird = screenHeight / 3;
        const bottomThird = 2 * screenHeight / 3;

        if (rect.top < bottomThird && rect.bottom > topThird) {
            const { earned, totalStudents, finishedStudents } = calculateValues();

            animateValue(earned, earned);

            // Обновляем количество учеников сразу (можно добавить анимацию аналогично)
            courseStudents[0].textContent = totalStudents;
            courseStudents[1].textContent = finishedStudents;

            animated = true;
            window.removeEventListener('scroll', checkVisibility);
        }
    }

    // Изначально обнуляем значения
    courseNumber.textContent = '0₽';
    courseProgress.value = 0;

    window.addEventListener('scroll', checkVisibility);
    checkVisibility();
};

document.addEventListener('DOMContentLoaded', scriptCashDynamic);
