const tg = window.Telegram.WebApp;
const coin = document.getElementById('coin');
const btn = document.getElementById('flipBtn');
const soundYes = document.getElementById('soundYes');
const soundNo = document.getElementById('soundNo');

tg.expand();

let currentRotation = 0;
let isSpinning = false;

btn.addEventListener('click', () => {
    if (isSpinning) return;
    
    isSpinning = true;
    btn.disabled = true;

    // Логика результата
    const isYes = Math.random() < 0.5;
    const extraDegrees = isYes ? 0 : 180; 
    const spins = (Math.floor(Math.random() * 8) + 10) * 360; 
    currentRotation += spins + extraDegrees;

    // Запуск вращения
    coin.style.transform = `rotateY(${currentRotation}deg)`;

    // Продвинутая вибрация
    triggerHapticSequence();

    // Финал через 4 секунды
    setTimeout(() => {
        finishFlip(isYes);
    }, 4000);
});

function triggerHapticSequence() {
    tg.HapticFeedback.notificationOccurred('warning');

    let hapticInterval = setInterval(() => {
        tg.HapticFeedback.impactOccurred('light');
    }, 150);

    setTimeout(() => {
        clearInterval(hapticInterval);
    }, 2500);
}

function finishFlip(isYes) {
    tg.HapticFeedback.notificationOccurred('success');
    
    if (isYes) {
        soundYes.play().catch(e => console.log("Звук не загружен"));
    } else {
        soundNo.play().catch(e => console.log("Звук не загружен"));
    }

    isSpinning = false;
    btn.disabled = false;
}