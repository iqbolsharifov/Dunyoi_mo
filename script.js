// 1. ТОКЕН ВА ID-ҲОИ НАВ БАРОИ ҲАРДУИ ШУМО
const TELEGRAM_TOKEN = '8905985495:AAHk3Sv06_RquIdfPXIkBLMESYtGpyg9AYk'; 
const IQBOL_CHAT_ID = '6555076911'; 
const SHIRIN_CHAT_ID = '6993404562'; // 👈 Айдии Ширинмоҳ бомуваффақият ворид шуд

// Функсияи асосӣ барои фиристодани паём ба Телеграми ҳардуи шумо
function sendToTelegram(messageText) {
    const ids = [IQBOL_CHAT_ID, SHIRIN_CHAT_ID];
    
    ids.forEach(chatId => {
        if(chatId) {
            fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: messageText })
            }).catch(err => console.error("Хатогии Телеграм:", err));
        }
    });
}

// РАМЗҲОИ ВОРИДШАВӢ
const USERS = {
    "1004": { name: "Ширинмоҳ", role: "shirin" },
    "1908": { name: "Иқбол", role: "iqbol" }
};

let CURRENT_USER = "Меҳмон";

// ИДОРАКУНИИ ВОРИДШАВӢ
document.getElementById('start-btn').addEventListener('click', () => {
    const pass = document.getElementById('user-password').value.trim();
    if (USERS[pass]) {
        CURRENT_USER = USERS[pass].name;
        document.getElementById('intro-screen').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('advanced-player').classList.remove('hidden');
        document.getElementById('user-greeting').innerText = `Хуш омадӣ, ${CURRENT_USER}! ✨`;
        
        // Овезаи даромад ба Телеграм
        sendToTelegram(`🚪 Даромад ба сайт:\n👤 ${CURRENT_USER} вориди сайт шуд. \n⏰ Вақт: ${new Date().toLocaleTimeString()}`);
        
        // Ба кор андохтани функсияҳо
        initTimer();
        playMusic();
        startRainEffect(); // 🌧️ Борон маҳз ҳамин ҷо ба таври автоматӣ меборад
    } else {
        const err = document.getElementById('login-error');
        err.classList.remove('hidden');
        setTimeout(() => err.classList.add('hidden'), 3000);
    }
});

// ОВЕЗАИ БАРОМАД АЗ САЙТ
window.addEventListener('beforeunload', () => {
    if (CURRENT_USER !== "Меҳмон") {
        sendToTelegram(`🚶 Баромад аз сайт:\n👤 ${CURRENT_USER} саҳифаро баст ё тарк кард. \n⏰ Вақт: ${new Date().toLocaleTimeString()}`);
    }
});

// 2. ТАЙМЕРИ ДУРШАВӢ (7 ИЮНИ 2026)
function initTimer() {
    const separationDate = new Date(2026, 5, 7, 18, 0, 0); 
    const startTime = separationDate.getTime();

    setInterval(() => {
        const diff = new Date().getTime() - startTime;
        if (diff > 0) {
            if(document.getElementById('days')) document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
            if(document.getElementById('hours')) document.getElementById('hours').innerText = Math.floor((diff / (1000 * 60 * 60)) % 24);
            if(document.getElementById('minutes')) document.getElementById('minutes').innerText = Math.floor((diff / 1000 / 60) % 60);
            if(document.getElementById('seconds')) document.getElementById('seconds').innerText = Math.floor((diff / 1000) % 60);
        }
    }, 1000);
}

// 3. МУСИҚӢ ВА ПЛЕЕР
const audio = document.getElementById('bg-music');
const playBtn = document.getElementById('play-btn');
let isPlaying = false;

function playMusic() {
    audio.play().then(() => {
        isPlaying = true;
        playBtn.innerText = "⏸️";
        const w = document.getElementById('waves');
        if(w) w.classList.add('active');
    }).catch(err => console.log("Авто-плей маҳкам аст"));
}

if(playBtn) {
    playBtn.addEventListener('click', () => {
        const w = document.getElementById('waves');
        if(isPlaying) { audio.pause(); playBtn.innerText = "▶️"; if(w) w.classList.remove('active'); }
        else { audio.play(); playBtn.innerText = "⏸️"; if(w) w.classList.add('active'); }
        isPlaying = !isPlaying;
    });
}

audio.addEventListener('timeupdate', () => {
    const cur = Math.floor(audio.currentTime);
    const dur = Math.floor(audio.duration) || 0;
    const cTime = document.getElementById('curr-time');
    const dTime = document.getElementById('dur-time');
    if(cTime) cTime.innerText = `${Math.floor(cur/60)}:${cur%60 < 10 ? '0'+cur%60 : cur%60}`;
    if(dTime) dTime.innerText = `${Math.floor(dur/60)}:${dur%60 < 10 ? '0'+dur%60 : dur%60}`;
});

// 4. ТЕЛЕГРАММАҲОИ ОҶИЛ
function sendFastMsg(msgText) {
    sendToTelegram(`⚡ Оҷил аз номи ${CURRENT_USER}:\n👉 ${msgText}`);
    alert('Паёми оҷилии ту ба Телеграм рафт! 💞');
}

// 5. ДЕВОРИ ХОТИРАҲО
function saveForeverMemory() {
    const input = document.getElementById('memory-text-input');
    const text = input.value.trim();
    if(!text) return;
    
    const now = new Date();
    const timeString = `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()} | ${now.getHours()}:${now.getMinutes() < 10 ? '0'+now.getMinutes() : now.getMinutes()}`;
    
    sendToTelegram(`📝 Паёми Нав дар Девор:\n👤 Муаллиф: ${CURRENT_USER}\n💬 Матн: "${text}"`);
    
    let list = JSON.parse(localStorage.getItem('forever_memories')) || [];
    list.push({ author: CURRENT_USER, content: text, time: timeString });
    localStorage.setItem('forever_memories', JSON.stringify(list));
    
    input.value = "";
    loadForeverMemories();
}

function loadForeverMemories() {
    const container = document.getElementById('forever-memories-list');
    if(!container) return;
    container.innerHTML = "";
    let list = JSON.parse(localStorage.getItem('forever_memories')) || [];
    list.reverse().forEach(m => {
        container.innerHTML += `<div class="memory-item"><strong>${m.author}:</strong> ${m.content} <span class="time">${m.time}</span></div>`;
    });
}
document.addEventListener("DOMContentLoaded", loadForeverMemories);

// 6. СУХАНИ СЕҲРНОК
const COMPLIMENTS = [
    "Ту зеботарин маликаи дунёӣ! 🌸",
    "Дунёи ман бо ту равшан аст, ҷони ман! ✨",
    "Ҳар сонияе бо ту ҳастам, хушбахтам! 🥰",
    "Хандаҳои ту маро зинда нигоҳ медоранд! 👑",
    "Дили ман танҳо барои ту метапад! ❤️"
];
function generateCompliment() {
    const txt = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    const box = document.getElementById('compliment-box');
    if(box) box.innerText = txt;
}

// 7. САНДУҚИ ОРЗУҲО (КАПСУЛАИ 24-СОАТА)
const capBtn = document.getElementById('capsule-btn');
if(capBtn) {
    capBtn.addEventListener('click', () => {
        const text = document.getElementById('capsule-input').value.trim();
        if(text) {
            localStorage.setItem('capsule_text', text);
            localStorage.setItem('capsule_unlock_time', new Date().getTime() + (24 * 60 * 60 * 1000));
            localStorage.setItem('capsule_owner', CURRENT_USER);
            
            sendToTelegram(`🔒 Капсулаи 24-соат аз ${CURRENT_USER} қуфл шуд!`);
            alert('Орзу ба муддати 24 соат қуфл шуд! 🔒');
            document.getElementById('capsule-input').value = "";
        }
    });
}

// 8. ХАРИТАИ ОРЗУҲО
function activateDream(id, name) {
    sendToTelegram(`✨ ${CURRENT_USER} ба орзуи "${name}" лайки ошиқона монд!`);
    alert(`Орзуи "${name}" лайк гирифт! 💞`);
}

function submitCustomDream() {
    const input = document.getElementById('custom-dream-input');
    const text = input.value.trim();
    if(text) {
        sendToTelegram(`➕ Орзуи нави муштарак аз ${CURRENT_USER}: "${text}"`);
        alert('Орзуи нави мо ба рӯйхат илова шуд! 🚀'); 
        input.value = '';
    }
}

// 9. СЛОТ-МАШИНАИН ТАҚДИР
const spinSlot = document.getElementById('spin-slot-btn');
if(spinSlot) {
    spinSlot.addEventListener('click', () => {
        const SLOTS_EMOJIS = ['❤️', '💎', '👑', '🌸', '✨'];
        const s1 = SLOTS_EMOJIS[Math.floor(Math.random()*5)];
        const s2 = SLOTS_EMOJIS[Math.floor(Math.random()*5)];
        const s3 = SLOTS_EMOJIS[Math.floor(Math.random()*5)];
        if(document.getElementById('slot1')) document.getElementById('slot1').innerText = s1;
        if(document.getElementById('slot2')) document.getElementById('slot2').innerText = s2;
        if(document.getElementById('slot3')) document.getElementById('slot3').innerText = s3;
        if(document.getElementById('slot-message')) document.getElementById('slot-message').innerText = (s1===s2 && s2===s3) ? "🎉 Ишқи мо 100% соф аст!" : "💞 Тақдири мо якҷоя аст!";
    });
}

// 10. ТЕСТ ВА ДИАГРАММА
const rForm = document.getElementById('romantic-form');
if(rForm) {
    rForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let msg = `🔮 Ҷавобҳои Тест аз номи ${CURRENT_USER}:\n`;
        for(let i=1; i<=5; i++) { msg += `${i}. ${document.getElementById('q'+i).value}\n`; }
        
        sendToTelegram(msg);
        
        document.getElementById('romantic-form').classList.add('hidden');
        document.getElementById('quiz-result-block').classList.remove('hidden');
        
        if (typeof Chart !== 'undefined') {
            new Chart(document.getElementById('compatibilityChart').getContext('2d'), {
                type: 'radar',
                data: {
                    labels: ['Вафодорӣ', 'Мутобиқат', 'Энергетика', 'Ишқ', 'Эътимод'],
                    datasets: [{ data: [100, 100, 100, 100, 100], backgroundColor: 'rgba(255, 77, 109, 0.25)', borderColor: '#ff4d6d', borderWidth: 2 }]
                },
                options: { scales: { r: { max: 100, min: 0, ticks: { display: false } } }, plugins: { legend: { display: false } } }
            });
        }
    });
}

function setMood(m) { sendToTelegram(`🎭 Табъи имрӯзаи ${CURRENT_USER}: ${m}`); alert('Табъи ту ба ҷуфтат маълум шуд! 😊'); }
function showMemory(txt) { const b = document.getElementById('calendar-text-box'); b.innerText = txt; b.classList.remove('hidden'); }

const spinBtn = document.getElementById('spin-btn');
if(spinBtn) {
    spinBtn.addEventListener('click', () => {
        const wheel = document.getElementById('wheel');
        const deg = Math.floor(3000 + Math.random() * 3000);
        wheel.style.transform = `rotate(${deg}deg)`;
        setTimeout(() => { alert("🎉 Сюрпризи ту омода шуд!"); }, 5000);
    });
}

const yBtn = document.getElementById('yes-btn');
if(yBtn) { yBtn.addEventListener('click', () => { sendToTelegram(`💖 ${CURRENT_USER} тугмаи "ҲА"-ро пахш кард!`); alert("Ман ҳам туро дӯст медорам! 🥰"); }); }
const noBtn = document.getElementById('no-btn');
if(noBtn) { noBtn.addEventListener('mouseover', () => { noBtn.style.position = 'absolute'; noBtn.style.top = Math.random()*80 + '%'; noBtn.style.left = Math.random()*80 + '%'; }); }

// 🌧️ СИСТЕМАИ БОРОНИ РАҚАМӢ
function startRainEffect() {
    const rainContainer = document.createElement('div');
    rainContainer.style.position = 'fixed';
    rainContainer.style.top = '0'; rainContainer.style.left = '0';
    rainContainer.style.width = '100vw'; rainContainer.style.height = '100vh';
    rainContainer.style.pointerEvents = 'none'; rainContainer.style.zIndex = '999999';
    rainContainer.style.overflow = 'hidden';
    document.body.appendChild(rainContainer);

    setInterval(() => {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + 'vw';
        drop.style.animationDuration = (Math.random() * 1.2 + 0.8) + 's';
        drop.style.opacity = Math.random() * 0.5 + 0.2;
        rainContainer.appendChild(drop);
        setTimeout(() => { drop.remove(); }, 2000);
    }, 120);
}
