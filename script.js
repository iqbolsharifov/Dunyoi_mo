// =========================================================================
// 🌐 СУПЕР-ПЛАТФОРМАИ МУҲАББАТ: ИҚБОЛ ВА ШИРИНМОҲ (SAFE PRO v3.5)
// =========================================================================

const TELEGRAM_TOKEN = '8905985495:AAHk3Sv06_RquIdfPXIkBLMESYtGpyg9AYk'; 
const IQBOL_CHAT_ID = '6555076911'; 
const SHIRIN_CHAT_ID = '6993404562'; 

// 1. СИСТЕМАИ УСТУВОРИ СИГНАЛРАСОНӢ БА ТЕЛЕГРАМ
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

// Функсияи синхронӣ барои баромад (ки дар телефонҳо ҳам кор кунад)
function sendLeaveNotification() {
    if (typeof CURRENT_USER !== 'undefined' && CURRENT_USER !== "МеХмон") {
        const text = `🚨 БАРОМАД АЗ СИСТЕМА:\n👤 Корбар: ${CURRENT_USER}\n🚪 СаХифаро баст ё тарк кард.\n⏰ Вақт: ${new Date().toLocaleTimeString()}`;
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        const data = JSON.stringify({ chat_id: IQBOL_CHAT_ID, text: text });
        const dataShirin = JSON.stringify({ chat_id: SHIRIN_CHAT_ID, text: text });
        
        if (navigator.sendBeacon) {
            navigator.sendBeacon(url, new Blob([data], {type: 'application/json'}));
            navigator.sendBeacon(url, new Blob([dataShirin], {type: 'application/json'}));
        } else {
            fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data, keepalive: true });
            fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: dataShirin, keepalive: true });
        }
    }
}

// РАМЗҲОИ КОНФИДЕНСИАЛӢ
const USERS = {
    "shirinak": { name: "Ширинмоҳ", role: "shirin" },
    "iqbol": { name: "Иқбол", role: "iqbol" }
};

let CURRENT_USER = "Меҳмон";

// ИДОРАКУНИИ ВОРИДШАВӢ (БО ҲИМОЯ)
const startBtn = document.getElementById('start-btn');
if (startBtn) {
    startBtn.addEventListener('click', () => {
        const passEl = document.getElementById('user-password');
        const pass = passEl ? passEl.value.trim() : "";
        if (USERS[pass]) {
            CURRENT_USER = USERS[pass].name;
            
            if(document.getElementById('intro-screen')) document.getElementById('intro-screen').classList.add('hidden');
            if(document.getElementById('main-content')) document.getElementById('main-content').classList.remove('hidden');
            if(document.getElementById('advanced-player')) document.getElementById('advanced-player').classList.remove('hidden');
            if(document.getElementById('user-greeting')) document.getElementById('user-greeting').innerText = `Авторизатсия: ${CURRENT_USER} ✨`;
            
            sendToTelegram(`🔓 ВОРИДШАВӢ БА СИСТЕМА:\n👤 Корбар: ${CURRENT_USER} бо муваффақият даромад.\n⏰ Вақт: ${new Date().toLocaleTimeString()}`);
            
            initTimer();
            playMusic();
            initCinematicSystem();
            updateLoveDashboard();
        } else {
            const err = document.getElementById('login-error');
            if (err) {
                err.classList.remove('hidden');
                setTimeout(() => err.classList.add('hidden'), 3000);
            }
        }
    });
}

// Назорати баромадан аз сайт
window.addEventListener('pagehide', sendLeaveNotification);
window.addEventListener('beforeunload', sendLeaveNotification);

// 2. ТАЙМЕРИ ДУРШАВӢ ВА ҲИСОБКУНАК
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

// 3. МУСИҚӢ ВА АУДИОФАЙЛҲО
const audio = document.getElementById('bg-music');
const playBtn = document.getElementById('play-btn');
let isPlaying = false;

function playMusic() {
    if (audio) {
        audio.play().then(() => {
            isPlaying = true;
            if(playBtn) playBtn.innerText = "⏸️";
            const w = document.getElementById('waves');
            if(w) w.classList.add('active');
        }).catch(err => console.log("Авто-плей маҳкам аст"));
    }
}

if(playBtn) {
    playBtn.addEventListener('click', () => {
        if (!audio) return;
        const w = document.getElementById('waves');
        if(isPlaying) { audio.pause(); playBtn.innerText = "▶️"; if(w) w.classList.remove('active'); }
        else { audio.play(); playBtn.innerText = "⏸️"; if(w) w.classList.add('active'); }
        isPlaying = !isPlaying;
    });
}

if(audio) {
    audio.addEventListener('timeupdate', () => {
        const cur = Math.floor(audio.currentTime);
        const dur = Math.floor(audio.duration) || 0;
        const cTime = document.getElementById('curr-time');
        const dTime = document.getElementById('dur-time');
        if(cTime) cTime.innerText = `${Math.floor(cur/60)}:${cur%60 < 10 ? '0'+cur%60 : cur%60}`;
        if(dTime) dTime.innerText = `${Math.floor(dur/60)}:${dur%60 < 10 ? '0'+dur%60 : dur%60}`;
    });
}

// 4. ПАЁМҲОИ ОҶИЛ ВА СИГНАЛИ ҚАЛБ
function sendFastMsg(msgText) {
    sendToTelegram(`⚡ ОҶИЛ АЗ НОМИ ${CURRENT_USER}:\n👉 ${msgText}`);
    alert('Паёми оҷилии ту ба Телеграм рафт! 💞');
}

function triggerHeartbeatSOS() {
    sendToTelegram(`💓 СИГНАЛИ ОҶИЛИИ ҚАЛБ!\n👤 Аз номи: ${CURRENT_USER}\n💬 Паём: "Дили ман дар ин сонияҳо ба шиддат туро ёд кардааст ва метапад!" 🔥`);
    alert('Сигнали оҷилии дил ба Телеграм фиристода шуд! ❤️‍🔥');
}

// 5. ДЕВОРИ ХОТИРАҲОИ АБИДӢ
function saveForeverMemory() {
    const input = document.getElementById('memory-text-input');
    if (!input) return;
    const text = input.value.trim();
    if(!text) return;
    
    const now = new Date();
    const timeString = `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()} | ${now.getHours()}:${now.getMinutes() < 10 ? '0'+now.getMinutes() : now.getMinutes()}`;
    
    sendToTelegram(`📝 БЕҲТАРИН ХОТИРАИ НАВ:\n👤 Муаллиф: ${CURRENT_USER}\n💬 Матн: "${text}"`);
    
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


// =========================================================================
// 📊 БАХШИ МУҲИМ: ЖУРНАЛИ СЕРФУНКСИЯ ВА ТАҲЛИЛИ ЭҲСОСОТ (LOVE DASHBOARD)
// =========================================================================
const MOOD_DATA = {
    "хушҳол": { emoji: "😊", title: "Рӯҳияи Дурахшон", desc: "Дар қалби ту нуре ҳаст, ки ҳама ҷоро равшан мекунад.", color: "#ffcbd1", score: 15 },
    "зиқ": { emoji: "😔", title: "Скути Маҳзун", desc: "Нороҳат ва зиқ шудан нишонаи он аст, ки қалбат ба меҳр ниёз дорад. Ман бо туам.", color: "#a2d2ff", score: 5 },
    "махзун": { emoji: "😢", title: "Ашки Борон", desc: "Бигзор ин маҳзунӣ бирезад ва қалбатро сабук кунад.", color: "#bde0fe", score: 5 },
    "ором": { emoji: "🍃", title: "Гармии Насим", desc: "Оромӣ бузургтарин қувват ва мувозинати қалб аст.", color: "#d8f3dc", score: 10 },
    "ошиқ": { emoji: "💖", title: "Шӯълаи Абдӣ", desc: "Ишқ ягона эҳсосест, ки масофа ва вақтро зуд нест мекунад.", color: "#ff4d6d", score: 25 },
    "оғӯш": { emoji: "🤗", title: "Тангии Оғӯш", desc: "Эҳсоси гармие, ки тамоми дардҳоро дар як сония фаромӯш кунонида, оромӣ мебахшад.", color: "#ffd166", score: 20 },
    "бӯса": { emoji: "💋", title: "Нафаси Ширин", desc: "Нишонаи калиди қалбҳо ва изҳори муҳаббати содиқонаву бепоён.", color: "#ff4d6d", score: 20 },
    "ёд кардам": { emoji: "❤️‍🩹", title: "Ёди Дилнавоз", desc: "Вақте дил барои касе танг мешавад, тамоми олам танҳо симои ӯро нишон медиҳад.", color: "#f72585", score: 25 }
};

function setMood(moodKey) {
    let key = moodKey.toLowerCase();
    if (key === "sad" || key === "норохат") key = "зиқ";

    const mood = MOOD_DATA[key] || { emoji: "🎭", title: "Ҳиссиёт", desc: "Эҳсос.", color: "#fff", score: 10 };
    
    let history = JSON.parse(localStorage.getItem('mood_history')) || [];
    history.push({ user: CURRENT_USER, mood: key, timestamp: new Date().getTime() });
    localStorage.setItem('mood_history', JSON.stringify(history));

    updateLoveDashboard(mood);
}

function updateLoveDashboard(activeMood = null) {
    let history = JSON.parse(localStorage.getItem('mood_history')) || [];
    const userMoods = history.filter(h => h.user === CURRENT_USER);
    const totalCount = userMoods.length;
    
    let totalPoints = 0;
    let counts = { "оғӯш": 0, "бӯса": 0, "ёд кардам": 0, "зиқ": 0, "ошиқ": 0, "хушҳол": 0, "махзун": 0, "ором": 0 };
    
    userMoods.forEach(m => {
        if(MOOD_DATA[m.mood]) {
            totalPoints += MOOD_DATA[m.mood].score;
            if(counts[m.mood] !== undefined) counts[m.mood]++;
        }
    });

    let lovePercentage = 60 + (totalPoints % 41);
    if (lovePercentage > 100 || totalPoints > 500) lovePercentage = 100;

    let analysisText = `📊 САТҲИ ЖУРНАЛИ КУНУНӢ:\n`;
    Object.keys(counts).forEach(k => {
        const count = counts[k];
        const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
        analysisText += `• ${k.toUpperCase()}: ${pct}% (${count} бор)\n`;
    });

    if (activeMood) {
        showMoodAlert(activeMood, analysisText, lovePercentage);
        sendToTelegram(`📖 САБТИ НАВ ДАР ЖУРНАЛИ МУҲАББАТ:\n👤 Корбар: ${CURRENT_USER}\n✨ Амал: ${activeMood.emoji} ${activeMood.title}\n\n${analysisText}\n❤️ ФОИЗИ МУҲАББАТ: ${lovePercentage}%\n⏰ Вақт: ${new Date().toLocaleTimeString()}`);
    }
}

function showMoodAlert(mood, analysis, lovePercent) {
    const oldAlert = document.getElementById('mood-popup-alert');
    if(oldAlert) oldAlert.remove();

    const alertBox = document.createElement('div');
    alertBox.id = 'mood-popup-alert';
    alertBox.className = 'cyber-romantic-popup';
    
    alertBox.innerHTML = `
        <div class="mood-emoji-pulse" style="font-size: 60px; margin-bottom: 10px; filter: drop-shadow(0 0 15px ${mood.color});">${mood.emoji}</div>
        <h3 style="color: ${mood.color}; margin: 5px 0; font-size: 24px; font-weight: 700; text-transform: uppercase;">${mood.title}</h3>
        <p style="font-size: 14px; color: #f0f0f0; line-height: 1.5; margin-bottom: 15px;">"${mood.desc}"</p>
        
        <div style="margin: 18px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #ff4d6d; margin-bottom: 5px; font-weight: bold;">
                <span>📊 БАЛАНСИ МУҲАББАТ</span>
                <span>${lovePercent}%</span>
            </div>
            <div style="width: 100%; background: rgba(255,255,255,0.08); height: 10px; border-radius: 5px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                <div style="width: ${lovePercent}%; background: linear-gradient(90deg, #ff4d6d, ${mood.color}, #f72585); height: 100%; border-radius: 5px; transition: width 1.2s ease-out;"></div>
            </div>
        </div>

        <hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.15); margin: 15px 0;">
        <div style="font-size: 11.5px; text-align: left; color: #e0f1ff; white-space: pre-line; font-family: monospace; background: rgba(5, 5, 15, 0.5); padding: 12px; border-radius: 12px; max-height: 120px; overflow-y: auto;">${analysis}</div>
        <button id='close-mood-btn' style="margin-top: 20px; background: linear-gradient(135deg, #ff4d6d, ${mood.color}); color: #fff; border: none; padding: 10px 35px; border-radius: 30px; cursor: pointer; font-weight: bold; font-size: 12px;">Тасдиқ кардан</button>
    `;

    document.body.appendChild(alertBox);
    setTimeout(() => { alertBox.style.transform = 'translate(-50%, -50%) scale(1)'; alertBox.style.opacity = '1'; }, 50);

    const closeBtn = document.getElementById('close-mood-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            alertBox.style.transform = 'translate(-50%, -50%) scale(0.9)'; alertBox.style.opacity = '0';
            setTimeout(() => alertBox.remove(), 300);
        });
    }
}

// ========================================================
// 🌌 СИСТЕМАИ СИНАМОӢ ВА ИНТЕРФЕЙСИ АРТ (CINEMATIC SYSTEM)
// ========================================================
function initCinematicSystem() {
    let view = document.getElementById('cinematic-viewport');
    if (view) view.remove(); // Агар пештар сохта шуда бошад, тоза мекунем

    view = document.createElement('div');
    view.id = 'cinematic-viewport';
    view.style.position = 'fixed';
    view.style.top = '0'; view.style.left = '0';
    view.style.width = '100vw'; view.style.height = '100vh';
    view.style.pointerEvents = 'none'; view.style.zIndex = '999997';
    view.style.overflow = 'hidden';
    document.body.appendChild(view);

    for(let f=1; f<=2; f++) {
        const fog = document.createElement('div');
        fog.className = `fog-layer-${f}`;
        view.appendChild(fog);
    }

    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.className = 'cinematic-star';
        star.style.width = Math.random() * 2 + 1 + 'px'; star.style.height = star.style.width;
        star.style.top = Math.random() * 75 + 'vh'; star.style.left = Math.random() * 100 + 'vw';
        star.style.animationDelay = Math.random() * 4 + 's';
        view.appendChild(star);
    }

    // Борон
    setInterval(() => {
        if (!document.getElementById('cinematic-viewport')) return;
        const dropLeft = Math.random() * 100;
        const drop = document.createElement('div');
        drop.className = 'heavy-drop';
        drop.style.left = dropLeft + 'vw';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.6) + 's'; 
        drop.style.opacity = Math.random() * 0.3 + 0.1;
        view.appendChild(drop);

        setTimeout(() => {
            if (!view) return;
            const splash = document.createElement('div');
            splash.className = 'drop-splash';
            splash.style.left = dropLeft + 'vw';
            view.appendChild(splash);
            setTimeout(() => splash.remove(), 400);
            drop.remove();
        }, 1000);
    }, 80);

    // Баргҳои тирамоҳӣ
    const LEAF_EMOJIS = ['🍂', '🍁'];
    setInterval(() => {
        if (!document.getElementById('cinematic-viewport')) return;
        const leaf = document.createElement('div');
        leaf.className = 'falling-leaf';
        leaf.innerText = LEAF_EMOJIS[Math.floor(Math.random() * LEAF_EMOJIS.length)];
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.fontSize = Math.random() * 12 + 12 + 'px';
        leaf.style.animationDuration = (Math.random() * 4 + 4) + 's'; 
        leaf.style.opacity = Math.random() * 0.4 + 0.2;
        view.appendChild(leaf);
        setTimeout(() => leaf.remove(), 8000);
    }, 1200);
}

// Иловаи стилҳо
const dynamicStyles = document.createElement("style");
dynamicStyles.innerText = `
.cyber-romantic-popup {
    position: fixed; top: 25%; left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    background: rgba(14, 11, 22, 0.9);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 25px 50px rgba(0,0,0,0.7);
    padding: 35px; border-radius: 28px;
    color: #fff; width: 340px; z-index: 1000000;
    text-align: center; transition: all 0.4s ease-out; opacity: 0;
}
.cinematic-star { position: absolute; background: #fff; border-radius: 50%; opacity: 0.4; animation: twinkleC 4s infinite ease-in-out; }
@keyframes twinkleC { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.7; } }
.heavy-drop { position: absolute; top: -40px; width: 1.5px; height: 35px; background: linear-gradient(transparent, rgba(255,255,255,0.4)); animation: fallC linear forwards; }
@keyframes fallC { 0% { transform: translateY(0); } 100% { transform: translateY(102vh); } }
.drop-splash { position: absolute; bottom: 0; width: 6px; height: 3px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); border-bottom: none; animation: splashAnim 0.4s ease-out forwards; }
@keyframes splashAnim { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
.falling-leaf { position: absolute; top: -20px; pointer-events: none; user-select: none; animation: leafFallAnim linear forwards; }
@keyframes leafFallAnim {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(105vh) rotate(360deg); }
}
.mood-emoji-pulse { animation: emojiPulse 2s infinite ease-in-out; }
@keyframes emojiPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
`;
document.head.appendChild(dynamicStyles);
