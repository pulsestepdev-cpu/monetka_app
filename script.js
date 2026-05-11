const tg = window.Telegram.WebApp;
const coin = document.getElementById('coin');
const btn = document.getElementById('flipBtn');
const soundYes = document.getElementById('soundYes');
const soundNo = document.getElementById('soundNo');

// Новые ресурсы для комбо
const soundSpin = new Audio('assets/spinning.mp3');
const soundSuper = new Audio('assets/super_win.mp3'); 
soundSpin.loop = true;

tg.expand();

let currentRotation = 0;
let isSpinning = false;
let yesCount = 0; // Счетчик побед подряд

const reactionGifs = ['assets/win1.gif', 'assets/win2.gif', 'assets/win3.gif'];
const looseImage = 'assets/lose_test.png';
const superGif = 'assets/super_win.gif';

btn.addEventListener('click', () => {
    if (isSpinning) return;
    
    // Сброс эффектов и старых медиа
    document.querySelectorAll('.reaction-media').forEach(el => el.remove());
    coin.classList.remove('super-win-active');
    
    isSpinning = true;
    btn.disabled = true;

    // Математика результата
    const isYes = Math.random() < 0.5; 
    
    if (isYes) {
        yesCount++;
    } else {
        yesCount = 0; 
    }

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

        if (isYes) {
            if (yesCount >= 2) {
                // ЛОГИКА СУПЕР-КОМБО
                soundSuper.play().catch(e => console.log("Super sound error"));
                coin.classList.add('super-win-active'); 
                showMedia(superGif, true); 
            } else {
                // ОБЫЧНОЕ ДА
                soundYes.play().catch(e => console.log("Sound error"));
                showMedia(reactionGifs[Math.floor(Math.random() * reactionGifs.length)], false);
            }
        } else {
            // РЕЗУЛЬТАТ НЕТ
            soundNo.play().catch(e => console.log("Sound error"));
            showMedia(looseImage, false);
        }

        isSpinning = false;
        btn.disabled = false;
    }, 4000);
});

function showMedia(src, isSuper) {
    const media = document.createElement('img');
    media.className = 'reaction-media';
    media.src = src + '?nocache=' + Math.random();
    
    media.style.position = 'fixed';
    // Супер-гифку делаем чуть больше
    media.style.width = isSuper ? '180px' : '130px'; 
    media.style.zIndex = '1000';
    media.style.borderRadius = '15px';
    media.style.pointerEvents = 'none'; 
    
    const x = Math.random() * 50 + 15;
    const y = Math.random() * 20 + 10;
    
    media.style.left = x + '%';
    media.style.top = y + '%';
    
    document.body.appendChild(media);

    setTimeout(() => {
        media.style.opacity = '0';
        media.style.transition = 'opacity 0.5s ease';
        setTimeout(() => media.remove(), 500);
    }, isSuper ? 4000 : 2500); // Супер-гифка висит дольше
}

function triggerHapticSequence() {
    tg.HapticFeedback.notificationOccurred('warning');
    let hapticInterval = setInterval(() => {
        tg.HapticFeedback.impactOccurred('light');
    }, 150);
    setTimeout(() => clearInterval(hapticInterval), 3000);
}