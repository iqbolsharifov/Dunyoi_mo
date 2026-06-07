// 1. ТОКЕН ВА ID-ҲОИ НАВ БАРОИ ҲАРДУИ ШУМО
const TELEGRAM_TOKEN = '8905985495:AAHk3Sv06_RquIdfPXIkBLMESYtGpyg9AYk'; 
const IQBOL_CHAT_ID = '6555076911'; 
const SHIRIN_CHAT_ID = '6993404562'; // 👈 Айдии нави Ширинмоҳ бомуваффақият ворид шуд

// Функсияи асосӣ барои фиристодани паём ба ҳарду қалб ҳамзамон
function sendToTelegram(messageText) {
    const ids = [IQBOL_CHAT_ID, SHIRIN_CHAT_ID];
    
    ids.forEach(chatId => {
        if(chatId && chatId !== 'РАҚАМИ_ИД_И_ШИРИНМОҲРО_ИН_ҶО_НАВИС') {
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
    "shirinak": { name: "Ширинмоҳ", role: "shirin" },
    "160205": { name: "Иқбол", role: "iqbol" }
};

let CURRENT_USER = "Меҳмон";

// ИДОРАКУНИИ ВОРИДШАВӢ (БО ОВЕЗАИ ДАРОМАД БА ТЕЛЕГРАМ)
document.getElementById('start-btn').addEventListener('click', () => {
    const pass = document.getElementById('user-password').value.trim();
    if (USERS[pass]) {
        CURRENT_USER = USERS[pass].name;
        document.getElementById('intro-screen').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('advanced-player').classList.remove('hidden');
        document.getElementById('user-greeting').innerText = `Хуш омадӣ, ${CURRENT_USER}! ✨`;
        
        // 🔔 Овезаи даромад ба Телеграми ҳарду
        sendToTelegram(`🚪 Даромад ба сайт:\n👤 Касе бо рамзи ${pass} (${CURRENT_USER}) вориди сайт шуд. \n⏰ Вақт: ${new Date().toLocaleTimeString()}`);
        
        // Ба кор андохтани таймер ва мусиқӣ
        initTimer();
        playMusic();
    } else {
        const err = document.getElementById('login-error');
        err.classList.remove('hidden');
        setTimeout(() => err.classList.add('hidden'), 3000);
    }
});

// ҲАНГОМИ БАРОМАДАН Ё ПӮШИДАНИ САҲИФА (ОВЕЗАИ БАРОМАД)
window.addEventListener('beforeunload', () => {
    if (CURRENT_USER !== "Меҳмон") {
        sendToTelegram(`🚶 Баромад аз сайт:\n👤 ${CURRENT_USER} саҳифаи сайтро баст ё тарк кард. \n⏰ Вақт: ${new Date().toLocaleTimeString()}`);
    }
});

// 2. ТАЙМЕРИ МУҚАДДАС (РӮЗИ ДУРШАВӢ: 7 ИЮНИ 2026)
function initTimer() {
    // Рӯзи дуршавии шумо: 7 Июни соли 2026, соати 18:00:00
    // Эзоҳ: Моҳи Июн дар JavaScript рақами 5 аст!
    const sacredStartDate = new Date(2026, 5, 7, 18, 0, 0); 
    const startTime = sacredStartDate.getTime();

    setInterval(() => {
        const diff = new Date().getTime() - startTime;
        if (diff > 0) {
            document.getElementById('days').innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
            document.getElementById('hours').innerText = Math.floor((diff / (1000 * 60 * 60)) % 24);
            document.getElementById('minutes').innerText = Math.floor((diff / 1000 / 60) % 60);
            document.getElementById('seconds').innerText = Math.floor((diff / 1000) % 60);
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
        document.getElementById('waves').classList.add('active');
    }).catch(err => console.log("Авто-плей дар телефон маҳкам аст"));
}

playBtn.addEventListener('click', () => {
    if(isPlaying) { audio.pause(); playBtn.innerText = "▶️"; document.getElementById('waves').classList.remove('active'); }
    else { audio.play(); playBtn.innerText = "⏸️"; document.getElementById('waves').classList.add('active'); }
    isPlaying = !isPlaying;
});

// АНАЛИТИКАИ ВАҚТИ СУРУД
audio.addEventListener('timeupdate', () => {
    const cur = Math.floor(audio.currentTime);
    const dur = Math.floor(audio.duration) || 0;
    document.getElementById('curr-time').innerText = `${Math.floor(cur/60)}:${cur%60 < 10 ? '0'+cur%60 : cur%60}`;
    document.getElementById('dur-time').innerText = `${Math.floor(dur/60)}:${dur%60 < 10 ? '0'+dur%60 : dur%60}`;
});

// 4. ТЕЛЕГРАММАҲОИ ОҶИЛ
function sendFastMsg(msgText) {
    sendToTelegram(`⚡ Оҷил аз номи ${CURRENT_USER}:\n👉 ${msgText}`);
    alert('Паёми оҷилии ту ба Телеграм рафт! 💞');
}

// 5. DEVOРИ ХОТИРАҲО
function saveForeverMemory() {
    const input = document.getElementById('memory-text-input');
    const text = input.value.trim();
    if(!text) return;
    
    const now = new Date();
    const timeString = `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()} | ${now.getHours()}:${now.getMinutes() < 10 ? '0'+now.getMinutes() : now.getMinutes()}`;
    
    // Фиристодан ба Телеграми ҳарду
    sendToTelegram(`📝 Паёми Нав дар Девор:\n👤 Муаллиф: ${CURRENT_USER}\n💬 Матн: "${text}"`);
    
    let list = JSON.parse(localStorage.getItem('forever_memories')) || [];
    list.push({ author: CURRENT_USER, content: text, time: timeString });
    localStorage.setItem('forever_memories', JSON.stringify(list));
    
    input.value = "";
    loadForeverMemories();
}

function loadForeverMemories() {
    const container = document.getElementById('forever-memories-list');
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
    document.getElementById('compliment-box').innerText = txt;
}

// 7. САНДУҚИ ОРЗУҲО (КАПСУЛАИ 24-СОАТА)
document.getElementById('capsule-btn').addEventListener('click', () => {
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
const SLOTS_EMOJIS = ['❤️', '💎', '👑', '🌸', '✨'];
document.getElementById('spin-slot-btn').addEventListener('click', () => {
    const s1 = SLOTS_EMOJIS[Math.floor(Math.random()*5)];
    const s2 = SLOTS_EMOJIS[Math.floor(Math.random()*5)];
    const s3 = SLOTS_EMOJIS[Math.floor(Math.random()*5)];
    document.getElementById('slot1').innerText = s1;
    document.getElementById('slot2').innerText = s2;
    document.getElementById('slot3').innerText = s3;
    document.getElementById('slot-message').innerText = (s1===s2 && s2===s3) ? "🎉 Ишқи мо 100% соф аст!" : "💞 Тақдири мо якҷоя аст!";
});

// 10. ТЕСТ ВА ДИАГРАММА
document.getElementById('romantic-form').addEventListener('submit', function(e) {
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

// ТАБЪИ ИМРӮЗА, РӮЗНОМА ВА ЧАРХ
function setMood(m) { sendToTelegram(`🎭 Табъи имрӯзаи ${CURRENT_USER}: ${m}`); alert('Табъи ту ба ҷуфтат маълум шуд! 😊'); }
function showMemory(txt) { const b = document.getElementById('calendar-text-box'); b.innerText = txt; b.classList.remove('hidden'); }

// ЧАРХИ СЮРПРИЗҲО
document.getElementById('spin-btn').addEventListener('click', () => {
    const wheel = document.getElementById('wheel');
    const deg = Math.floor(3000 + Math.random() * 3000);
    wheel.style.transform = `rotate(${deg}deg)`;
    setTimeout(() => { alert("🎉 Сюрпризи ту омода шуд!"); }, 5000);
});

// ТУГМАИ ОШИҚОНА
document.getElementById('yes-btn').addEventListener('click', () => { sendToTelegram(`💖 ${CURRENT_USER} тугмаи "ҲА"-ро пахш кард! Ӯ туро дӯст медорад!`); alert("Ман ҳам туро дӯст медорам! 🥰"); });
const noBtn = document.getElementById('no-btn');
noBtn.addEventListener('mouseover', () => { noBtn.style.position = 'absolute'; noBtn.style.top = Math.random()*80 + '%'; noBtn.style.left = Math.random()*80 + '%'; });
