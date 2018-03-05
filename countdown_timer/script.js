
let countdown;

const leftTime = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
const customForm = document.customForm;

function timer(interval) {
    clearInterval(countdown);

    const now = Date.now();
    const end = new Date(now + interval * 1000);
    displayEndTime(end);
    displayLeftTime(interval);

    countdown = setInterval(() => {
        const time = Math.ceil((end - Date.now()) / 1000);
        if (time < 0) {
            clearInterval(countdown);
            return;
        }
        displayLeftTime(time);
    }, 1000);
}

function displayLeftTime(time) {
    const minute = formatTime(Math.floor(time / 60));
    const sec = formatTime(time % 60);
    const display = `${minute}:${sec}`;
    leftTime.textContent = display;
    document.title = display;
}

function displayEndTime(end) {
    const hour = formatTime(end.getHours());
    const minute = formatTime(end.getMinutes());
    const sec = formatTime(end.getSeconds());
    endTime.textContent = `Be back at ${hour}:${minute}:${sec}`;
}

function formatTime(time) {
    return time < 10 ? '0' + time : time;
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        timer(button.dataset.time);
    });
});

customForm.addEventListener('submit', e => {
    e.preventDefault();
    timer(customForm.minutes.value * 60);
    customForm.reset();
});
