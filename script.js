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

// Настройки реакций
const reactionGifs = ['assets/win1.gif', 'assets/win2.gif', 'assets/win3.gif'];
const looseImage = 'assets/lose_test.png'; // ТВОЯ КАРТИНКА ДЛЯ "НЕТ"

btn.addEventListener('click', () => {
    if (isSpinning) return;
    
    // Удаляем всё старое (и гифки, и фото)
    document.querySelectorAll('.reaction-media').forEach(el => el.remove());
    
    isSpinning = true;
    btn.disabled = true;

    const isYes = Math.random() < 0.5; 
    
    // Математика поворота (из прошлой версии)
    let extraDegrees = isYes ? 0 : 180; 
    const newRotation = currentRotation + (3600 - (currentRotation % 360)) + extraDegrees;
    currentRotation = newRotation;

    soundSpin.play().catch(e => console.log("Sound error"));
    coin.style.transform = `rotateY(${currentRotation}deg)`;

    triggerHapticSequence();

    setTimeout(() => {
        soundSpin.pause();
        soundSpin.currentTime = 0;
        tg.HapticFeedback.notificationOccurred('success');

        if (isYes === true) {
            soundYes.play().catch(e => console.log("Sound error"));
            // Выбираем рандомную гифку
            const randomGif = reactionGifs[Math.floor(Math.random() * reactionGifs.length)];
            showMedia(randomGif); 
        } else {
            soundNo.play().catch(e => console.log("Sound error"));
            // ПОКАЗЫВАЕМ КАРТИНКУ ДЛЯ "НЕТ"
            showMedia(looseImage); 
        }

        isSpinning = false;
        btn.disabled = false;
    }, 4000);
});

// Универсальная функция для показа и гифок, и картинок
function showMedia(src) {
    const media = document.createElement('img');
    media.className = 'reaction-media';
    media.src = src + '?nocache=' + Math.random();
    
    media.style.position = 'fixed';
    media.style.width = '130px'; 
    media.style.zIndex = '1000';
    media.style.borderRadius = '15px';
    media.style.pointerEvents = 'none'; 
    
    // Рандомные координаты
    const x = Math.random() * 60 + 10;
    const y = Math.random() * 25 + 5;
    
    media.style.left = x + '%';
    media.style.top = y + '%';
    
    document.body.appendChild(media);

    // Исчезновение через 2.5 секунды
    setTimeout(() => {
        media.style.opacity = '0';
        media.style.transition = 'opacity 0.5s ease';
        setTimeout(() => media.remove(), 500);
    }, 2500);
}

function triggerHapticSequence() {
    tg.HapticFeedback.notificationOccurred('warning');
    let hapticInterval = setInterval(() => {
        tg.HapticFeedback.impactOccurred('light');
    }, 150);
    setTimeout(() => clearInterval(hapticInterval), 3000);
}