const tg = window.Telegram.WebApp;
const coin = document.getElementById('coin');
const btn = document.getElementById('flipBtn');
const soundYes = document.getElementById('soundYes');
const soundNo = document.getElementById('soundNo');

// Звук вращения
const soundSpin = new Audio('assets/spinning.mp3');
soundSpin.loop = true;

tg.expand();

let currentRotation = 0;
let isSpinning = false;

// МАССИВ ГИФОК ДЛЯ "ДА"
const reactionGifs = [
    'assets/win1.gif',
    'assets/win2.gif',
    'assets/win3.gif'
    // Можешь добавлять сюда новые названия файлов через запятую
];

btn.addEventListener('click', () => {
    if (isSpinning) return;
    
    isSpinning = true;
    btn.disabled = true;

    const isYes = Math.random() < 0.5; // Честный шанс 50/50
    const extraDegrees = isYes ? 0 : 180; 
    const spins = (Math.floor(Math.random() * 8) + 10) * 360; 
    currentRotation += spins + extraDegrees;

    // Включаем звук и запускаем анимацию
    soundSpin.play().catch(e => console.log("Sound error"));
    coin.style.transform = `rotateY(${currentRotation}deg)`;

    triggerHapticSequence();

    // Ждем 4 секунды (время вращения в CSS)
    setTimeout(() => {
        finishFlip(isYes);
    }, 4000);
});

function finishFlip(isYes) {
    soundSpin.pause();
    soundSpin.currentTime = 0;

    tg.HapticFeedback.notificationOccurred('success');
    
    if (isYes === true) {
        soundYes.play().catch(e => console.log("Play error"));
        showRandomGif(); // Показываем гифку только при "ДА"
    } else {
        soundNo.play().catch(e => console.log("Play error"));
    }

    isSpinning = false;
    btn.disabled = false;
}

function showRandomGif() {
    if (reactionGifs.length === 0) return;

    const randomGifName = reactionGifs[Math.floor(Math.random() * reactionGifs.length)];
    const gif = document.createElement('img');
    
    gif.src = randomGifName + '?' + Math.random();
    
    // Стили для размера и позиции (примерно 1/8 экрана)
    gif.style.position = 'absolute';
    gif.style.width = '120px'; 
    gif.style.zIndex = '100';
    gif.style.borderRadius = '12px';
    gif.style.pointerEvents = 'none'; 
    
    // Рандом в верхней части экрана (чтобы не перекрывать кнопку "Погнали, сладенькая")
    const x = Math.random() * 60 + 10; // от 10% до 70% ширины
    const y = Math.random() * 15 + 5;  // от 5% до 20% высоты
    
    gif.style.left = x + '%';
    gif.style.top = y + '%';
    
    document.body.appendChild(gif);

    // Удаляем через 2.5 секунды с плавным исчезновением
    setTimeout(() => {
        gif.style.opacity = '0';
        gif.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        gif.style.transform = 'scale(0.5)';
        setTimeout(() => gif.remove(), 500);
    }, 2500);
}

function triggerHapticSequence() {
    // Начальный толчок
    tg.HapticFeedback.notificationOccurred('warning');

    // Мелкая вибрация "кручения"
    let hapticInterval = setInterval(() => {
        tg.HapticFeedback.impactOccurred('light');
    }, 150);

    // Затихает чуть раньше остановки
    setTimeout(() => {
        clearInterval(hapticInterval);
    }, 3000);
}