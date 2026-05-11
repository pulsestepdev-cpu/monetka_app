const tg = window.Telegram.WebApp;
const coin = document.getElementById('coin');
const btn = document.getElementById('flipBtn');
const soundYes = document.getElementById('soundYes');
const soundNo = document.getElementById('soundNo');

const soundSpin = new Audio('assets/spinning.mp3');
soundSpin.loop = true;

tg.expand();

let currentRotation = 0;
let isSpinning = false;

const reactionGifs = [
    'assets/win1.gif',
    'assets/win2.gif',
    'assets/win3.gif'
];

btn.addEventListener('click', () => {
    if (isSpinning) return;
    
    // Удаляем старые гифки перед началом
    document.querySelectorAll('.reaction-gif').forEach(el => el.remove());
    
    isSpinning = true;
    btn.disabled = true;

    // 1. Генерируем результат
    const isYes = Math.random() < 0.5; 
    
    // 2. ЛОГИКА ВРАЩЕНИЯ:
    // Нам нужно, чтобы монета всегда крутилась вперед.
    // Прибавляем минимум 10 полных оборотов (3600 градусов)
    let extraDegrees = isYes ? 0 : 180; 
    
    // Важный момент: чтобы не было рассинхрона, мы всегда докручиваем 
    // до ближайшего нужного угла в зависимости от текущего положения.
    const newRotation = currentRotation + (3600 - (currentRotation % 360)) + extraDegrees;
    currentRotation = newRotation;

    console.log("Программный результат: " + (isYes ? "ДА" : "НЕТ"));

    soundSpin.play().catch(e => console.log("Sound error"));
    coin.style.transform = `rotateY(${currentRotation}deg)`;

    triggerHapticSequence();

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
        showRandomGif(); 
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
    gif.className = 'reaction-gif';
    gif.src = randomGifName + '?t=' + Date.now();
    
    gif.style.position = 'fixed';
    gif.style.width = '120px'; 
    gif.style.zIndex = '1000';
    gif.style.borderRadius = '15px';
    gif.style.pointerEvents = 'none'; 
    
    const x = Math.random() * 60 + 10;
    const y = Math.random() * 20 + 10;
    gif.style.left = x + '%';
    gif.style.top = y + '%';
    
    document.body.appendChild(gif);

    setTimeout(() => {
        gif.style.opacity = '0';
        gif.style.transition = 'opacity 0.5s ease';
        setTimeout(() => gif.remove(), 500);
    }, 2500);
}

function triggerHapticSequence() {
    tg.HapticFeedback.notificationOccurred('warning');
    let hapticInterval = setInterval(() => {
        tg.HapticFeedback.impactOccurred('light');
    }, 150);
    setTimeout(() => clearInterval(hapticInterval), 3000);
}