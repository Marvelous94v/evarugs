////////////////////////////
////// ОТПРАВКА ФОРМЫ //////
////////////////////////////

// Модуль: отправка формы внутри модального окна
const scriptSendForm = () => {

    'use strict';

    // Конфиг
    const CONFIG = {
        noticeDuration: 4000,
        debounceMs: 300,
        spinnerClass: 'sending'
    };

    // Форма
    const form = document.querySelector('form.modal');
    if (!form) return;

    // Настраиваем endpoint: можно задать через data-endpoint, иначе дефолт.
    const endpoint = form.dataset.endpoint?.trim() || 'https://jsonplaceholder.typicode.com/posts';

    // Ключевые элементы внутри формы
    const noticeOuter = form.querySelector('.form-notice');
    const noticeInner = noticeOuter?.querySelector('.form-notice__inner') ?? null;
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnText = submitBtn?.querySelector('.button__text') ?? null;
    const progressBar = form.querySelector('.form-fill-progress__bar');
    const inputs = Array.from(form.querySelectorAll('.modal__input'));

    if (!submitBtn || !noticeInner) {
        // Если отсутствует базовый UI — логируем и выходим, чтобы не кидать ошибки
        console.warn('scriptSendForm: missing submit button or notice element — init aborted');
        return;
    }

    // Состояние выполнения запроса
    let noticeTimer = null;
    let currentController = null;

    // Регулярные выражения для дополнительных проверок
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRe = /^(?=(?:.*\d){7,})[+\d\s\-\(\)]+$/;

    ////////////////////////////////////////////////////////////////////////////////

    // ------------------ УТИЛИТЫ ------------------

    // Debounce — задержка вызова функции
    const debounce = (fn, ms = CONFIG.debounceMs) => {
        let t = null;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), ms);
        };
    };

    // Показ уведомления (text, variant: 'error'|'success'|'info', duration)
    function showNotice(text, variant = 'error', duration = CONFIG.noticeDuration) {
        clearTimeout(noticeTimer);
        noticeInner.classList.remove('success', 'error', 'info', 'is-visible');
        noticeInner.classList.add(variant);
        noticeInner.textContent = text;
        noticeInner.style.display = 'block';

        // активация transition в следующем кадре
        requestAnimationFrame(() => noticeInner.classList.add('is-visible'));

        noticeTimer = setTimeout(hideNotice, duration);
    }

    // Скрыть уведомление
    function hideNotice() {
        clearTimeout(noticeTimer);
        // remove visible class — затем при окончании transition скрываем display
        noticeInner.classList.remove('is-visible');

        // слушаем конец transition один раз
        const onEnd = (e) => {
            // защитно: смотрим на opacity, чтобы быть уверенными, что это нужный transition
            if (!e || e.propertyName === 'opacity') {
                noticeInner.style.display = 'none';
            }
        };
        noticeInner.addEventListener('transitionend', onEnd, { once: true });

        // fallback: если у элемента нет transition, скрыть через небольшой таймаут
        setTimeout(() => {
            if (getComputedStyle(noticeInner).display !== 'none' && !noticeInner.classList.contains('is-visible')) {
                noticeInner.style.display = 'none';
            }
        }, 350);
    }



    // ------------------ ВАЛИДАЦИЯ ------------------

    /*  isFieldValid
        ------------
        - Проверяет одно поле input на валидность.
        - Возвращает true, если поле корректно, false — если есть ошибки.
        - Используется как для живой валидации при вводе (input/blur),
            так и перед финальной отправкой формы.
        - Логика:
            1) Если поле отсутствует, считается валидным (защита от ошибок в коде).
            2) Берём текущее значение поля и убираем лишние пробелы (trim).
            3) Проверка обязательности (required):
            - Если поле обязательное и пустое => неверно.
            4) Специфичные типы:
            - email: проверка через регулярное выражение emailRe.
            - tel: проверка через регулярное выражение telRe.
            - Если поле пустое, но необязательное => валидно.
            5) Фоллбек на HTML5 constraint API:
            - Если input.checkValidity существует, используем его.
            6) Если ничего не сработало — считаем поле валидным.
    */
    function isFieldValid(input) {
        if (!input) return true;
        const val = (input.value || '').trim();

        if (input.hasAttribute('required') && val === '') return false;

        if (input.type === 'email') {
            if (val === '') return !input.hasAttribute('required');
            return emailRe.test(val);
        }
        if (input.type === 'tel') {
            if (val === '') return !input.hasAttribute('required');
            return telRe.test(val);
        }

        if (typeof input.checkValidity === 'function') {
            return input.checkValidity();
        }

        return true;
    }

    /*  validateAll
        -----------
        - Проходит по массиву inputs и создаёт Map (input -> boolean),
            где boolean — валидность этого поля.
        - Используется для кеширования результатов isFieldValid на одну «итерацию» обновления.
    */
    function validateAll(inputsArray) {
        const map = new Map();
        for (const el of inputsArray) {
            // Вызываем isFieldValid ровно один раз для каждого поля.
            map.set(el, isFieldValid(el));
        }
        return map;
    }

    /*  updateFieldState(input, validityMap)
        ------------------------------------
        - Обновляет визуальный статус одного поля по результату в validityMap (если он передан).
        - Если validityMap не передан — поведение прежнее (вычисляет isFieldValid локально),
            чтобы сохранить обратную совместимость с вызовами вне основного цикла.
        - Комментарии внутри объясняют, что происходит новичку.
    */
    function updateFieldState(input, validityMap) {
        if (!input) return;

        // Получаем результат проверки: сначала из карты, иначе вычисляем.
        const valid = validityMap ? Boolean(validityMap.get(input)) : isFieldValid(input);

        // Для оптимизации меняем DOM только если состояние реально поменялось.
        const currentlyValid = input.classList.contains('is-valid');
        const currentlyInvalid = input.classList.contains('is-invalid');

        if (valid) {
            if (!currentlyValid) input.classList.add('is-valid');
            if (currentlyInvalid) input.classList.remove('is-invalid');
            // aria-invalid — важен для доступности: ставим только при изменении.
            if (input.getAttribute('aria-invalid') !== 'false') {
                input.setAttribute('aria-invalid', 'false');
            }
        } else {
            if (!currentlyInvalid) input.classList.add('is-invalid');
            if (currentlyValid) input.classList.remove('is-valid');
            if (input.getAttribute('aria-invalid') !== 'true') {
                input.setAttribute('aria-invalid', 'true');
            }
        }
    }

    /*  calcFillPercentValid(validityMap)
        ---------------------------------
        - Подсчитывает процент валидных обязательных полей.
        - Если передана validityMap, использует её вместо повторного вызова isFieldValid.
        - Поведение: если есть явный набор required — считаем по нему; иначе берем все inputs.
    */
    function calcFillPercentValid(validityMap) {
        const required = inputs.filter(i => i.hasAttribute('required'));
        const total = required.length || inputs.length;

        let validCount = 0;
        const listToCount = required.length ? required : inputs;

        for (const i of listToCount) {
            const valid = validityMap ? Boolean(validityMap.get(i)) : isFieldValid(i);
            if (valid) validCount++;
        }

        // Если total === 0 (какая-то атипичная ситуация), защитимся от деления на 0.
        if (!total) return 100;
        return Math.round((validCount / total) * 100);
    }

    /*  updateFillProgressAndState()
        -----------------------------------------
        - Вычисляем валидность для всех полей ОДИН РАЗ (validateAll).
        - Затем используем эту карту в updateFieldState и calcFillPercentValid.
        - Вычисление anyInvalidVisible также использует карту (никаких повторных isFieldValid).
        - Установка ширины прогрессбара делаем в requestAnimationFrame для уменьшения layout-thrashing.
    */
    function updateFillProgressAndState() {

        // 1) Кешируем все проверки полей.
        const validityMap = validateAll(inputs);

        // 2) Обновляем визуальное состояние каждого поля, используя кеш.
        inputs.forEach(input => updateFieldState(input, validityMap));

        // 3) Работа с прогрессбаром
        if (!progressBar) return;

        const percent = calcFillPercentValid(validityMap);

        // Проверяем, есть ли заполненные, но некорректные поля (видимые ошибки)
        const anyInvalidVisible = inputs.some(i => (i.value || '').trim() !== '' && !validityMap.get(i));

        // Снимаем все классы статуса и добавляем только нужный.
        // Меняем классы только если это действительно требуется (можно дополнительно сравнить),
        // но для простоты — удаляем и выставляем заново (это дешёвая операция при небольшом количестве классов).
        progressBar.classList.remove('progress--bad', 'progress--warn', 'progress--good');

        if (anyInvalidVisible) progressBar.classList.add('progress--bad');
        else if (percent < 100) progressBar.classList.add('progress--warn');
        else progressBar.classList.add('progress--good');

        // Устанавливаем ширину прогрессбара в rAF — чтобы сгруппировать изменение стилей и уменьшить layout cost.
        window.requestAnimationFrame(() => {
            progressBar.style.width = `${percent}%`;
        });
    }



    ////////////////////////////////////////////////////////////////////////////////

    // ------------------ ОСНОВНОЙ КОД ------------------

    const debouncedUpdate = debounce(updateFillProgressAndState, CONFIG.debounceMs);

    // Навесим события для живой валидации
    inputs.forEach(input => {
        // "input" — срабатывает на каждый символ (живой ввод)
        input.addEventListener('input', debouncedUpdate);

        // "blur" — когда пользователь покинул поле
        /*         input.addEventListener('blur', () => {
                    updateFieldState(input);              // проверка и обновление состояния поля
                    updateFillProgressAndState();         // обновление прогресс-бара заполнения формы
                }); */
    });


    // Первичная отрисовка
    updateFillProgressAndState();

    // Валидация всей формы перед отправкой
    function validateForm() {
        // HTML5 checkValidity — если доступно, получаем первое невалидное поле
        if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.focus({ preventScroll: false });
                if (firstInvalid.type === 'email') showNotice('Введите корректный e-mail', 'error');
                else if (firstInvalid.type === 'tel') showNotice('Введите корректный телефон', 'error');
                else showNotice('Заполните обязательные поля', 'error');
            }
            return false;
        }

        // Доп. проверки для email/tel (нашими регексами)
        const tel = form.querySelector('input[type="tel"]');
        if (tel && !isFieldValid(tel)) {
            tel.focus();
            showNotice('Неверный формат телефона', 'error');
            return false;
        }
        const email = form.querySelector('input[type="email"]');
        if (email && !isFieldValid(email)) {
            email.focus();
            showNotice('Неверный формат e-mail', 'error');
            return false;
        }

        // Проверим обязательные поля через isFieldValid
        const required = inputs.filter(i => i.hasAttribute('required'));
        const invalidReq = required.find(i => !isFieldValid(i));
        if (invalidReq) {
            invalidReq.focus();
            showNotice('Проверьте обязательные поля', 'error');
            return false;
        }

        return true;
    }

    // ------------------ UI: состояние кнопки ------------------
    function setSendingState(sending) {
        if (sending) {
            submitBtn.disabled = true;
            submitBtn.classList.add(CONFIG.spinnerClass);
            submitBtn.setAttribute('aria-busy', 'true');
            if (submitBtnText) submitBtnText.textContent = 'Отправка...';
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove(CONFIG.spinnerClass);
            submitBtn.removeAttribute('aria-busy');
            if (submitBtnText) submitBtnText.textContent = 'Отправить';
        }
    }

    // ------------------ Отправка формы ------------------
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Защита от двойной отправки
        if (currentController) {
            showNotice('Запрос уже выполняется.', 'info');
            return;
        }

        // Обновляем прогресс и состояние перед submit
        updateFillProgressAndState();
        if (!validateForm()) return;

        // Собираем данные
        const fd = new FormData(form);
        const payload = Object.fromEntries(fd.entries());

        // Создаём и сохраняем контроллер, чтобы можно было отменить
        const controller = new AbortController();
        currentController = controller;

        setSendingState(true);
        showNotice('Отправка данных…', 'info');

        try {
            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            const data = await resp.json();

            // Успех: очищаем форму, обновляем UI
            form.reset();
            updateFillProgressAndState();
            showNotice('Форма успешно отправлена', 'success');

            // Точка интеграции: здесь можно закрывать модалку, отправлять аналитику и т.д.
            // Пример вызова: programmaticClose();
            console.info('Server response:', data);
        } catch (err) {
            if (err.name === 'AbortError') {
                showNotice('Отправка отменена', 'error');
            } else {
                console.error('Ошибка отправки:', err);
                showNotice('Не удалось отправить. Попробуйте позже.', 'error');
            }
        } finally {
            setSendingState(false);
            currentController = null;
        }
    });

    // Экспортируем функцию отмены отправки (например, при закрытии модалки)
    window.modalCancelSend = () => {
        if (currentController) currentController.abort();
    };

    // Пример: точка закрытия модалки — не реализована здесь (зависит от вашей логики)
    window.programmaticCloseModal = () => {
        const modalRoot = form.closest('.modal-root') || form.closest('.modal');
        if (modalRoot) {
            modalRoot.classList.remove('is-open'); // пример
        }
    };
};

document.addEventListener('DOMContentLoaded', scriptSendForm);
// scriptSendForm();
