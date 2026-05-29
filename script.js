// ✅ ТОКЕН ВА ID-И СУСТУВОР КАРДАШУД
const TELEGRAM_TOKEN = '8905985495:AAHk3Sv06_RquIdfPXIkBLMESYtGpyg9AYk'; 
const TELEGRAM_CHAT_ID = '6555076911'; 

let CURRENT_USER = ""; 

// 1. СИСТЕМАИ ЛОГИН БО РАМЗҲОИ НАВ (ИҚБОЛ ВА ШИРИНМОҲ)
document.getElementById('start-btn').addEventListener('click', () => {
    const inputPass = document.getElementById('user-password').value.trim();
    const errorEl = document.getElementById('login-error');
    
    if (inputPass === '160205') {
        CURRENT_USER = "Иқбол";
    } else if (inputPass === '100403') {
        CURRENT_USER = "Ширинмоҳ";
    } else {
        errorEl.classList.remove('hidden');
        return;
    }

    errorEl.classList.add('hidden');
    document.getElementById('intro-screen').style.opacity = '0';
    
    setTimeout(() => {
        document.getElementById('intro-screen').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('advanced-player').classList.remove('hidden');
        
        document.getElementById('user-greeting').innerText = `Макони Муҳаббат, Хуш омадӣ: ${CURRENT_USER} ❤️`;
        
        setInterval(createHeart, 250); // Бориши дилҳо тезтар шуд
        if (typeof particlesJS !== 'undefined') initParticles();
        setupFireworks();
        loadForeverMemories(); 
        checkCapsuleStatus();  
        checkSecretStatus();   // Санҷиши дафтари махфӣ
        initTimer();           // Таймери нав аз сонияи аввал
        initAudioPlayer();     // Боркунии плеер
    }, 800);
});

// Бориши дилҳо ва ситораҳо
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('falling-heart');
    heart.innerHTML = ['❤️','💖','✨','🌸','💕','💎'][Math.floor(Math.random() * 6)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    heart.style.opacity = Math.random() * 0.8 + 0.2;
    heart.style.fontSize = Math.random() * 15 + 15 + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
}

// 2. ТАЙМЕРИ АСОСӢ (АЗ СОНИЯИ АВВАЛИНИ ВОРИДШАВИИ АВВАЛИН)
function initTimer() {
    let startTime = localStorage.getItem('sacred_start_time');
    if (!startTime) {
        startTime = new Date().getTime();
        localStorage.setItem('sacred_start_time', startTime);
    }
    setInterval(() => {
        const diff = new Date().getTime() - startTime;
        document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
        document.getElementById('hours').innerText = Math.floor((diff / (1000 * 60 * 60)) % 24);
        document.getElementById('minutes').innerText = Math.floor((diff / 1000 / 60) % 60);
        document.getElementById('seconds').innerText = Math.floor((diff / 1000) % 60);
    }, 1000);
}

// 3. ГЕНЕРАТОРИ КОМПЛИМЕНТҲОИ ОШИҚОНА
function generateCompliment() {
    const compliments = [
        "Ту зеботарин ситора дар осмони ҳаёти ман ҳастӣ! ✨",
        "Овози ту оромбахштарин мелодия барои қалби ман аст. 🎵",
        "Ҳар як сония бо ту будан, қиматтар аз тамоми дунёст. 🪐",
        "Худованд туро барои хушбахтии ман офаридааст, ҷони ман. ❤️",
        "Табассуми ту метавонад ториктарин рӯзи маро равшан кунад! 🌸",
        "Ишқи мо мисли коинот беохир ва устувор аст! 💍"
    ];
    const box = document.getElementById('compliment-box');
    box.innerText = compliments[Math.floor(Math.random() * compliments.length)];
    createHeart();
}

// 4. ТЕЛЕГРАММАҲОИ ОҶИЛ (ТЕЗФИРИСТ)
function sendFastMsg(msgText) {
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: `⚡ Оҷил аз номи ${CURRENT_USER}:\n👉 ${msgText}` })
    });
    alert('Паёми оҷилии ту ба Телеграм рафт! 💞');
    createHeart();
}

// 5. ДЕВОРИ ХОТИРАҲО
function saveForeverMemory() {
    const input = document.getElementById('memory-text-input');
    const text = input.value.trim();
    if(!text) return;
    
    const now = new Date();
    const timeString = `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()} | ${now.getHours()}:${now.getMinutes() < 10 ? '0'+now.getMinutes() : now.getMinutes()}`;
    const newMemory = { author: CURRENT_USER, content: text, time: timeString };
    
    let list = JSON.parse(localStorage.getItem('forever_memories')) || [];
    list.push(newMemory);
    localStorage.setItem('forever_memories', JSON.stringify(list));
    
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: `📝 Паёми Нав дар Девор:\n👤 Муаллиф: ${CURRENT_USER}\n💬 Матн: "${text}"` })
    });
    
    input.value = "";
    loadForeverMemories();
    createHeart();
}

function loadForeverMemories() {
    const feed = document.getElementById('forever-memories-list');
    if(!feed) return; feed.innerHTML = "";
    let list = JSON.parse(localStorage.getItem('forever_memories')) || [];
    list.forEach(item => {
        const card = document.createElement('div');
        card.className = `memory-card-post ${item.author === 'Иқбол' ? 'author-iqbol' : ''}`;
        card.innerHTML = `<p class="post-text"></p><div class="post-meta"><span class="post-author">✍️ ${item.author}</span><span class="post-date">${item.time}</span></div>`;
        card.querySelector('.post-text').innerText = item.content;
        feed.appendChild(card);
    });
    feed.scrollTop = feed.scrollHeight;
}

// 6. ДАФТАРИ ЭЪТИРОФИ ИШҚИ СЕҲРНОК (МАНТИҚИ ДУНАФАРА)
function saveSecretMessage() {
    const text = document.getElementById('secret-input').value.trim();
    if(!text) return;
    localStorage.setItem('secret_shared_text', text);
    localStorage.setItem('secret_app_iqbol', 'false');
    localStorage.setItem('secret_app_shirin', 'false');
    document.getElementById('secret-input').value = "";
    checkSecretStatus();
}

function checkSecretStatus() {
    const text = localStorage.getItem('secret_shared_text');
    if(!text) {
        document.getElementById('secret-write-zone').classList.remove('hidden');
        document.getElementById('secret-status-zone').classList.add('hidden');
        document.getElementById('secret-result-zone').classList.add('hidden');
        return;
    }
    document.getElementById('secret-write-zone').classList.add('hidden');
    
    const iqbolApp = localStorage.getItem('secret_app_iqbol') === 'true';
    const shirinApp = localStorage.getItem('secret_app_shirin') === 'true';
    
    document.getElementById('badge-iqbol').innerText = `Иқбол: ${iqbolApp ? '✅ Тасдиқ' : '❌ Интизор'}`;
    document.getElementById('badge-shirin').innerText = `Ширинмоҳ: ${shirinApp ? '✅ Тасдиқ' : '❌ Интизор'}`;
    
    if(iqbolApp && shirinApp) {
        document.getElementById('secret-status-zone').classList.add('hidden');
        document.getElementById('secret-result-zone').classList.remove('hidden');
        document.getElementById('secret-text-display').innerText = text;
    } else {
        document.getElementById('secret-status-zone').classList.remove('hidden');
        document.getElementById('secret-result-zone').classList.add('hidden');
    }
}

function approveSecret() {
    if(CURRENT_USER === 'Иқбол') localStorage.setItem('secret_app_iqbol', 'true');
    if(CURRENT_USER === 'Ширинмоҳ') localStorage.setItem('secret_app_shirin', 'true');
    checkSecretStatus();
}

function resetSecret() {
    localStorage.removeItem('secret_shared_text');
    localStorage.removeItem('secret_app_iqbol');
    localStorage.removeItem('secret_app_shirin');
    checkSecretStatus();
}

// 7. САНДУҚИ ОРЗУҲОИ 24-СОАТА
document.getElementById('capsule-btn').addEventListener('click', () => {
    const text = document.getElementById('capsule-input').value.trim();
    if(text) {
        localStorage.setItem('capsule_text', text);
        localStorage.setItem('capsule_unlock_time', new Date().getTime() + (24 * 60 * 60 * 1000));
        localStorage.setItem('capsule_owner', CURRENT_USER);
        fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: `🔒 Капсулаи 24-соат аз ${CURRENT_USER}: "${text}"` })
        });
        checkCapsuleStatus();
    }
});

function checkCapsuleStatus() {
    const text = localStorage.getItem('capsule_text');
    const time = localStorage.getItem('capsule_unlock_time');
    const owner = localStorage.getItem('capsule_owner') || "Малика";
    if (!text) return;
    document.getElementById('capsule-write-zone').classList.add('hidden');
    const interval = setInterval(() => {
        const dist = time - new Date().getTime();
        if (dist <= 0) {
            clearInterval(interval);
            document.getElementById('capsule-lock-zone').classList.add('hidden');
            document.getElementById('capsule-open-zone').classList.remove('hidden');
            document.getElementById('capsule-saved-text').innerText = text;
        } else {
            document.getElementById('capsule-lock-zone').classList.remove('hidden');
            const h = Math.floor((dist % (1000*60*60*24)) / (1000*60*60));
            const m = Math.floor((dist % (1000*60*60)) / (1000*60));
            const s = Math.floor((dist % (1000*60)) / 1000);
            document.getElementById('capsule-timer').innerText = `${h<10?'0'+h:h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
        }
    }, 1000);
}

// 8. ХАРИТАИ ОРЗУҲО
function activateDream(id, name) {
    document.getElementById(`dream-${id}`).querySelector('.btn-dream-heart').innerHTML = `💖 ${CURRENT_USER} лайк монд`;
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: `✨ ${CURRENT_USER} ба орзуи "${name}" лайки ошиқона монд!` })
    });
    createHeart();
}

function submitCustomDream() {
    const input = document.getElementById('custom-dream-input');
    if(input.value.trim()) {
        fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: `➕ Орзуи нави муштарак аз ${CURRENT_USER}: "${input.value.trim()}"` })
        });
        alert('Орзуи нав ба осмони тақдир парвоз кард! 🚀'); input.value = '';
    }
}

// 9. ТАБЪИ ИМРӮЗА
function setMood(mood) {
    const res = document.getElementById('mood-result'); res.classList.remove('hidden');
    const msgs = {
        happy: `Хурсандии ту ҷаҳони маро пур аз нур мекунад, ҳамеша биханд! 🥰`,
        sad: `Ҳеҷ гоҳ дилгир нашав, ман дар ҳар сония бо туям... 🥺❤️`,
        tired: `Имрӯз бисёр хаста шудӣ, истироҳат кун азизи қалбам... 😴✨`,
        romantic: `Ишқи мо ҷовидона ва бузургтарин мӯъҷизаи ҳаёт аст! 🌹💍`
    };
    res.innerText = msgs[mood];
}

// 10. ТЕСТ ВА ДИАГРАММА
document.getElementById('romantic-form').addEventListener('submit', function(e) {
    e.preventDefault();
    let msg = `🔮 Ҷавобҳои Тест аз номи ${CURRENT_USER}:\n`;
    for(let i=1; i<=5; i++) { msg += `${i}. ${document.getElementById('q'+i).value}\n`; }
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg })
    });
    document.getElementById('romantic-form').classList.add('hidden');
    document.getElementById('quiz-result-block').classList.remove('hidden');
    if (typeof Chart !== 'undefined') {
        new Chart(document.getElementById('compatibilityChart').getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Вафодорӣ', 'Мутобиқат', 'Энергетика', 'Ишқ', 'Эътимод'],
                datasets: [{ data: [100, 100, 99, 100, 100], backgroundColor: 'rgba(255, 77, 109, 0.25)', borderColor: '#ff4d6d', borderWidth: 2 }]
            },
            options: { scales: { r: { max: 100, min: 0, ticks: { display: false }, grid: { color: 'rgba(255,255,255,0.1)' } } }, plugins: { legend: { display: false } } }
        });
    }
});

// 11. СЛОТ МАШИНА
document.getElementById('spin-slot-btn').addEventListener('click', () => {
    const btn = document.getElementById('spin-slot-btn'); const msg = document.getElementById('slot-message');
    btn.disabled = true; msg.innerText = 'Қалбҳо дар ҳаракатанд... 🎰'; let count = 0;
    const interval = setInterval(() => {
        document.getElementById('slot1').innerText = ['❤️', '👑', '💎'][Math.floor(Math.random() * 3)];
        document.getElementById('slot2').innerText = ['❤️', '👑', '💎'][Math.floor(Math.random() * 3)];
        document.getElementById('slot3').innerText = ['❤️', '👑', '💎'][Math.floor(Math.random() * 3)];
        if(++count > 10) { clearInterval(interval); document.getElementById('slot1').innerText = '❤️'; document.getElementById('slot2').innerText = '❤️'; document.getElementById('slot3').innerText = '❤️'; msg.innerText = `Ҷекпоти Муҳаббат! Мо якҷояем! 🎉`; btn.disabled = false; }
    }, 100);
});

function showMemory(text) { const box = document.getElementById('calendar-text-box'); box.innerText = text; box.classList.remove('hidden'); }

// 12. ЧАРХИ БАХТ
let rotation = 0;
document.getElementById('spin-btn').addEventListener('click', () => {
    const wheel = document.getElementById('wheel'); const prizes = ["Оғӯш 🤗", "Кафе ☕", "Туҳфа 🎁", "Шоколуд 🍫", "Ба Кино 🍿", "Бӯса 💋"];
    rotation += 1440 + Math.floor(Math.random() * 360); wheel.style.transform = `rotate(${rotation}deg)`;
    setTimeout(() => { const idx = Math.floor(((360 - (rotation % 360) + 30) % 360) / 60); document.getElementById('wheel-result').innerText = `Тӯҳфаи ту: ${prizes[idx]}! 🎉`; document.getElementById('wheel-result').classList.remove('hidden'); }, 4000);
});

// 13. ТУГМАИ ГУРЕЗОН
const noBtn = document.getElementById('no-btn');
noBtn.addEventListener('mouseover', () => { noBtn.style.left = Math.random() * 75 + '%'; noBtn.style.top = Math.random() * 50 + 'px'; });
document.getElementById('yes-btn').addEventListener('click', () => { alert('Ман ба ин ҳеҷ гоҳ шак надоштам! 💍💞'); });

// 🎵 СИСТЕМАИ ПЛЕЕРИ МУСИҚӢ (АВТОМАТӢ ГУЗАШТАН)
const playlist = [
    { name: "Оҳанги Муҳаббати Мо ✨", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { name: "Мелодияи Қалбҳо 🎵", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { name: "Османӣ Ишқ 🌌", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];
let currentTrack = 0; const audio = document.getElementById('bg-music');
function initAudioPlayer() {
    audio.addEventListener('timeupdate', () => {
        const curM = Math.floor(audio.currentTime / 60); const curS = Math.floor(audio.currentTime % 60);
        const durM = Math.floor(audio.duration / 60) || 0; const durS = Math.floor(audio.duration % 60) || 0;
        document.getElementById('curr-time').innerText = `${curM}:${curS < 10 ? '0'+curS : curS}`;
        document.getElementById('dur-time').innerText = `${durM}:${durS < 10 ? '0'+durS : durS}`;
    });
    audio.addEventListener('ended', () => { currentTrack = (currentTrack + 1) % playlist.length; loadTrack(); });
}
function playMusic() { audio.play().catch(()=>{}); document.getElementById('play-btn').innerText = '⏸️'; document.getElementById('waves').classList.add('playing'); }
function pauseMusic() { audio.pause(); document.getElementById('play-btn').innerText = '▶️'; document.getElementById('waves').classList.remove('playing'); }
document.getElementById('play-btn').addEventListener('click', () => { if(audio.paused) playMusic(); else pauseMusic(); });
document.getElementById('next-btn').addEventListener('click', () => { currentTrack = (currentTrack + 1) % playlist.length; loadTrack(); });
document.getElementById('prev-btn').addEventListener('click', () => { currentTrack = (currentTrack - 1 + playlist.length) % playlist.length; loadTrack(); });
function loadTrack() { audio.src = playlist[currentTrack].src; document.getElementById('track-name').innerText = playlist[currentTrack].name; playMusic(); }

// ЭФФЕКТҲО
function initParticles() { try { particlesJS('particles-js', { "particles": { "number": { "value": 45 }, "color": { "value": "#ff758f" }, "shape": { "type": "circle" }, "opacity": { "value": 0.35 }, "size": { "value": 3 }, "line_linked": { "enable": true, "distance": 120, "color": "#b5179e", "opacity": 0.2 }, "move": { "enable": true, "speed": 1.3 } } }); } catch(e){} }
let canvas, ctx, fParticles = [];
function setupFireworks() {
    try {
        canvas = document.getElementById('fireworks-canvas'); ctx = canvas.getContext('2d'); canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        document.addEventListener('click', (e) => { if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') createExplosion(e.clientX, e.clientY); });
        setInterval(() => { ctx.clearRect(0,0,canvas.width,canvas.height); for(let i=fParticles.length-1;i>=0;i--){ let p=fParticles[i]; p.x+=p.vX; p.y+=p.vY; p.alpha-=0.02; if(p.alpha<=0){fParticles.splice(i,1);continue;} ctx.globalAlpha=p.alpha; ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); } }, 20);
    } catch(e){}
}
function createExplosion(x, y) { for (let i = 0; i < 15; i++) { fParticles.push({ x: x, y: y, vX: (Math.random()-0.5)*5, vY: (Math.random()-0.5)*5, alpha: 1, color: ['#ff4d6d','#ff758f','#4cc9f0','#b5179e'][Math.floor(Math.random()*4)], size: Math.random()*2+1.5 }); } }