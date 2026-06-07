// 1. ТОКЕН ВА ID-ҲОИ НАВ БАРОИ ҲАРДУИ ШУМО
const TELEGRAM_TOKEN = '8905985495:AAHk3Sv06_RquIdfPXIkBLMESYtGpyg9AYk'; 
const IQBOL_CHAT_ID = '6555076911'; 
const SHIRIN_CHAT_ID = '6993404562'; 

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

// Функсияи махсус барои баромадан (ки дар телефонҳо ҳам кор кунад)
function sendLeaveNotification() {
    if (CURRENT_USER !== "Меҳмон") {
        const text = `🚶 Баромад аз сайт:\n👤 ${CURRENT_USER} саҳифаро баст ё тарк кард. \n⏰ Вақт: ${new Date().toLocaleTimeString()}`;
        // Истифодаи fetch бо усули синхронӣ барои гум нашудани паём ҳангоми пӯшидан
        fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: IQBOL_CHAT_ID, text: text }),
            keepalive: true
        });
        fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: SHIRIN_CHAT_ID, text: text }),
            keepalive: true
        });
    }
}

// РАМЗҲОИ НАВ ВА МАХФӢ
const USERS = {
    "shirinak": { name: "Ширинмоҳ", role: "shirin" },
    "iqbol": { name: "Иқбол", role: "iqbol" }
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
        
        sendToTelegram(`🚪 Даромад ба сайт:\n👤 ${CURRENT_USER} вориди сайт шуд. \n⏰ Вақт: ${new Date().toLocaleTimeString()}`);
        
        initTimer();
        playMusic();
        initCinematicSystem(); 
    } else {
        const err = document.getElementById('login-error');
        err.classList.remove('hidden');
        setTimeout(() => err.classList.add('hidden'), 3000);
    }
});

// МОНИТОРИНГИ БАРОМАД (ҲАМ БАРОИ ТЕЛЕФОН ВА ҲАМ КОМПЮТЕР)
window.addEventListener('pagehide', sendLeaveNotification);
window.addEventListener('beforeunload', sendLeaveNotification);

// 2. ТАЙМЕРИ ДУРШАВӢ
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


// =========================================================================
// 🎭 ЖУРНАЛИ ЭЛЕКТРОНИИ ЭҲСОСОТ ВА БАЛАНСИ ФОИЗИИ МУҲАББАТ (LOVE JOURNAL)
// =========================================================================
const MOOD_DATA = {
    "хушҳол": { emoji: "😊", title: "Рӯҳияи Дурахшон", desc: "Дар қалби ту нуре ҳаст, ки ҳама ҷоро равшан мекунад.", color: "#ffcbd1", loveScore: 15 },
    "зиқ": { emoji: "😔", title: "Скути Маҳзун", desc: "Нороҳат ва зиқ шудан нишонаи тасаллӣ ва меҳр аст. Ман ҳамеша бо туам.", color: "#a2d2ff", loveScore: 5 },
    "махзун": { emoji: "😢", title: "Ашки Борон", desc: "Бигзор ин маҳзунӣ бирезад ва қалбатро сабук кунад.", color: "#bde0fe", loveScore: 5 },
    "ором": { emoji: "🍃", title: "Гармии Насим", desc: "Оромӣ бузургтарин қувват ва мувозинати қалб аст.", color: "#d8f3dc", loveScore: 10 },
    "ошиқ": { emoji: "💖", title: "Шӯълаи Абдӣ", desc: "Ишқ ягона эҳсосест, ки масофа ва вақтро зуд нест мекунад.", color: "#ff4d6d", loveScore: 25 },
    
    // ЭҲСОСОТИ ОШИҚОНАИ НАВ
    "оғӯш": { emoji: "🤗", title: "Тангии Оғӯш", desc: "Эҳсоси гармие, ки тамоми дардҳоро дар як сония фаромӯш кунонида, оромӣ мебахшад.", color: "#ffd166", loveScore: 20 },
    "бӯса": { emoji: "💋", title: "Нафаси Ширин", desc: "Нишонаи калиди қалбҳо ва изҳори муҳаббати содиқонаву бепоён.", color: "#ff4d6d", loveScore: 20 },
    "ёд кардам": { emoji: "❤️‍🩹", title: "Ёди Дилнавоз", desc: "Вақте дил барои касе танг мешавад, тамоми олам танҳо симои ӯро нишон медиҳад.", color: "#f72585", loveScore: 20 }
};

function setMood(moodKey) {
    let key = moodKey.toLowerCase();
    if (key === "sad" || key === "норохат") key = "зиқ";

    const mood = MOOD_DATA[key] || { emoji: "🎭", title: "Ҳиссиёт", desc: "Эҳсоси зиндагӣ.", color: "#fff", loveScore: 10 };
    
    // 1. Сабт дар хотираи Журнали сайт
    let history = JSON.parse(localStorage.getItem('mood_history')) || [];
    history.push({ user: CURRENT_USER, mood: key, time: new Date().getTime() });
    localStorage.setItem('mood_history', JSON.stringify(history));

    // 2. ҲИСОБ КАРДАНИ ФОИЗИ УМУМИИ МУҲАББАТ (LOVE PERCENTAGE)
    const userMoods = history.filter(h => h.user === CURRENT_USER);
    
    let totalLovePoints = 0;
    userMoods.forEach(m => {
        const data = MOOD_DATA[m.mood];
        if (data) totalLovePoints += data.loveScore;
    });

    // Фоизро дар доираи 50% то 100% танзим мекунем, то ҳамеша нишондиҳандаи баланди ошиқона дошта бошад
    let lovePercentage = 50 + (totalLovePoints % 51);
    if (lovePercentage > 100) lovePercentage = 100;

    // 3. Таҳлили фоизии табъҳо барои Журнал
    const totalCount = userMoods.length;
    let counts = {};
    userMoods.forEach(m => counts[m.mood] = (counts[m.mood] || 0) + 1);
    
    let analysisText = `📊 ЖУРНАЛИ ЭҲСОСОТ:\n`;
    Object.keys(counts).forEach(k => {
        const percent = Math.round((counts[k] / totalCount) * 100);
        analysisText += `• ${k.toUpperCase()}: ${percent}%\n`;
    });
    
    analysisText += `\n❤️ ДАРАҶАИ МУҲАББАТИ КУНУНИИ ТУ: ${lovePercentage}%`;

    // 4. Намоиши Журнали визуалӣ дар экран
    showMoodAlert(mood, analysisText, lovePercentage);

    // 5. Паёми устувор ба Телеграм
    sendToTelegram(`📖 Сабти Нав дар Журнали Муҳаббат!\n👤 Корбар: ${CURRENT_USER}\n✨ Амал/Эҳсос: ${mood.emoji} ${mood.title}\n\n${analysisText}\n\n⏰ Вақт: ${new Date().toLocaleTimeString()}`);
}

function showMoodAlert(mood, analysis, lovePercent) {
    const oldAlert = document.getElementById('mood-popup-alert');
    if(oldAlert) oldAlert.remove();

    const alertBox = document.createElement('div');
    alertBox.id = 'mood-popup-alert';
    alertBox.style.position = 'fixed';
    alertBox.style.top = '25%'; alertBox.style.left = '50%';
    alertBox.style.transform = 'translate(-50%, -50%) scale(0.9)';
    alertBox.style.background = 'rgba(18, 14, 28, 0.9)';
    alertBox.style.backdropFilter = 'blur(15px)';
    alertBox.style.webkitBackdropFilter = 'blur(15px)';
    alertBox.style.border = `1px solid rgba(255, 77, 109, 0.25)`;
    alertBox.style.boxShadow = `0 20px 40px rgba(0,0,0,0.6), 0 0 30px ${mood.color}35`;
    alertBox.style.padding = '30px'; alertBox.style.borderRadius = '24px';
    alertBox.style.color = '#fff'; alertBox.style.width = '340px';
    alertBox.style.zIndex = '1000000'; alertBox.style.textAlign = 'center';
    alertBox.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; alertBox.style.opacity = '0';

    alertBox.innerHTML = `
        <div class="mood-emoji-pulse" style="font-size: 55px; margin-bottom: 12px; filter: drop-shadow(0 0 12px ${mood.color});">${mood.emoji}</div>
        <h3 style="color: ${mood.color}; margin: 5px 0; font-size: 22px; font-weight: 600;">${mood.title}</h3>
        <p style="font-size: 13.5px; color: #e0e0e0; line-height: 1.5; margin-bottom: 15px; font-style: italic;">"${mood.desc}"</p>
        
        <div style="margin: 15px 0 10px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #ff4d6d; margin-bottom: 4px; font-weight: bold;">
                <span>Муҳаббати умумӣ</span>
                <span>${lovePercent}%</span>
            </div>
            <div style="width: 100%; background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="width: ${lovePercent}%; background: linear-gradient(90deg, #ff4d6d, ${mood.color}); height: 100%; border-radius: 4px; transition: width 1s ease-out;"></div>
            </div>
        </div>

        <hr style="border: 0; border-top: 1px dashed rgba(255,255,255,0.15); margin: 12px 0;">
        <div style="font-size: 12px; text-align: left; color: #a2d2ff; white-space: pre-line; font-family: 'Courier New', monospace; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">${analysis}</div>
        <button id='close-mood-btn' style="margin-top: 20px; background: linear-gradient(135deg, #ff4d6d, ${mood.color}); color: #fff; border: none; padding: 10px 30px; border-radius: 30px; cursor: pointer; font-weight: bold; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(255, 77, 109, 0.3);">Олии аҷоиб</button>
    `;

    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.style.transform = 'translate(-50%, -50%) scale(1)';
        alertBox.style.opacity = '1';
    }, 50);

    document.getElementById('close-mood-btn').addEventListener('click', () => {
        alertBox.style.transform = 'translate(-50%, -50%) scale(0.9)';
        alertBox.style.opacity = '0';
        setTimeout(() => alertBox.remove(), 300);
    });
}

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


// ========================================================
// 🌌 СИСТЕМАИ СИНАМОӢ ВА ИНТЕРФЕЙСИ АРТ (CINEMATIC SYSTEM v2)
// ========================================================
function initCinematicSystem() {
    const view = document.createElement('div');
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

    for (let i = 0; i < 45; i++) {
        const star = document.createElement('div');
        star.className = 'cinematic-star';
        star.style.width = Math.random() * 2 + 1 + 'px'; star.style.height = star.style.width;
        star.style.top = Math.random() * 75 + 'vh'; star.style.left = Math.random() * 100 + 'vw';
        star.style.animationDelay = Math.random() * 4 + 's';
        view.appendChild(star);
    }

    setInterval(() => {
        const dropLeft = Math.random() * 100;
        const drop = document.createElement('div');
        drop.className = 'heavy-drop';
        drop.style.left = dropLeft + 'vw';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.6) + 's'; 
        drop.style.opacity = Math.random() * 0.4 + 0.2;
        view.appendChild(drop);

        setTimeout(() => {
            const splash = document.createElement('div');
            splash.className = 'drop-splash';
            splash.style.left = dropLeft + 'vw';
            view.appendChild(splash);
            setTimeout(() => splash.remove(), 400);
            drop.remove();
        }, 1000);
    }, 50);

    setInterval(() => {
        const meteor = document.createElement('div');
        meteor.className = 'dynamic-meteor';
        meteor.style.top = (Math.random() * 30 - 60) + 'px';
        meteor.style.left = (Math.random() * 80 + 10) + 'vw';
        meteor.style.animationDuration = (Math.random() * 1 + 1) + 's';
        
        const mTail = document.createElement('div');
        mTail.className = 'meteor-tail';
        meteor.appendChild(mTail);
        
        view.appendChild(meteor);
        setTimeout(() => meteor.remove(), 1500);
    }, 3000);

    setInterval(() => {
        if(Math.random() > 0.3) {
            const flash = document.createElement('div');
            flash.className = 'lightning-flash';
            view.appendChild(flash);
            setTimeout(() => flash.remove(), 300);
        }
    }, 14000);

    const LEAF_EMOJIS = ['🍂', '🍁'];
    setInterval(() => {
        const leaf = document.createElement('div');
        leaf.className = 'falling-leaf';
        leaf.innerText = LEAF_EMOJIS[Math.floor(Math.random() * LEAF_EMOJIS.length)];
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.fontSize = Math.random() * 12 + 12 + 'px';
        leaf.style.animationDuration = (Math.random() * 4 + 4) + 's'; 
        leaf.style.animationDelay = Math.random() * 2 + 's';
        leaf.style.opacity = Math.random() * 0.5 + 0.3;
        
        view.appendChild(leaf);
        setTimeout(() => leaf.remove(), 8000);
    }, 900);
}

const dynamicStyles = document.createElement("style");
dynamicStyles.innerText = `
.cinematic-star { position: absolute; background: #fff; border-radius: 50%; opacity: 0.4; animation: twinkleC 4s infinite ease-in-out; }
@keyframes twinkleC { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.7; } }

.heavy-drop { position: absolute; top: -40px; width: 1.5px; height: 35px; background: linear-gradient(transparent, rgba(255,255,255,0.5)); animation: fallC linear forwards; }
@keyframes fallC { 0% { transform: translateY(0) rotate(8deg); } 100% { transform: translateY(102vh) rotate(8deg); } }

.drop-splash { position: absolute; bottom: 0; width: 6px; height: 3px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.4); border-bottom: none; animation: splashAnim 0.4s ease-out forwards; }
@keyframes splashAnim { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }

.dynamic-meteor { position: absolute; width: 3px; height: 3px; background: #fff; border-radius: 50%; boxShadow: 0 0 15px #fff; animation: meteorAnim linear forwards; }
.meteor-tail { position: absolute; top: 0; left: 0; width: 110px; height: 1px; background: linear-gradient(to left, rgba(255,255,255,0.6), transparent); transform: rotate(-40deg) translateX(-110px); }
@keyframes meteorAnim { 0% { transform: translate(0, 0) rotate(40deg); opacity: 1; } 100% { transform: translate(-600px, 600px) rotate(40deg); opacity: 0; } }

.fog-layer-1, .fog-layer-2 { position: absolute; top: 0; left: 0; width: 200%; height: 100%; background: radial-gradient(circle at 50% 80%, rgba(255,255,255,0.03), transparent 60%); pointer-events: none; }
.fog-layer-1 { animation: fogMove 60s linear infinite; }
.fog-layer-2 { background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.02), transparent 50%); animation: fogMove 45s linear infinite reverse; }
@keyframes fogMove { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

.lightning-flash { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.07); animation: lightningAnim 0.35s ease-out forwards; }
@keyframes lightningAnim { 0%, 100% { opacity: 0; } 20%, 40% { opacity: 1; } 30% { opacity: 0.3; } }

.falling-leaf { position: absolute; top: -20px; pointer-events: none; user-select: none; animation: leafFallAnim linear forwards; }
@keyframes leafFallAnim {
    0% { transform: translateY(0) translateX(0) rotate(0deg); }
    50% { transform: translateY(50vh) translateX(30px) rotate(180deg); }
    100% { transform: translateY(105vh) translateX(-20px) rotate(360deg); }
}

.mood-emoji-pulse { animation: emojiPulse 2s infinite ease-in-out; }
@keyframes emojiPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
`;
document.head.appendChild(dynamicStyles);
