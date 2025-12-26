// --- 1. Global State & Initialization ---
let state = {
    xp: parseInt(localStorage.getItem('brainXP')) || 0,
    name: localStorage.getItem('pName') || "",
    level: 1,
    rank: "Novice"
};

// Start the app
window.onload = () => {
    if (!state.name) {
        state.name = prompt("Enter your Pilot Name (No login required):") || "Pilot_" + Math.floor(Math.random()*999);
        localStorage.setItem('pName', state.name);
    }
    updateNeuralStats();
};

// --- 2. Core Logic Engine ---
function updateNeuralStats() {
    // Level formula: Every 100 XP is a new level
    state.level = Math.floor(state.xp / 100) + 1;
    
    const ranks = ["Novice", "Thinker", "Strategist", "Sage", "Genius", "Superhuman"];
    let rankIdx = Math.min(Math.floor((state.level - 1) / 2), ranks.length - 1);
    state.rank = ranks[rankIdx];

    // Update UI Elements
    document.getElementById('total-xp').innerText = state.xp;
    document.getElementById('lvl-circle').innerText = state.level;
    document.getElementById('rank-name').innerText = state.rank;
    document.getElementById('player-name').innerText = state.name;
}

function gainXP(amount) {
    state.xp += amount;
    localStorage.setItem('brainXP', state.xp);
    
    // Save to local history log
    let history = JSON.parse(localStorage.getItem('brainHistory')) || [];
    history.push({ date: new Date().toLocaleTimeString(), xp: amount });
    localStorage.setItem('brainHistory', JSON.stringify(history.slice(-20))); // Keep last 20
    
    updateNeuralStats();
}

// --- 3. Navigation ---
function showScreen(screenId) {
    document.getElementById('home-menu').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('stats-screen').classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
}

function exitGame() {
    showScreen('home-menu');
}

// --- 4. Math Sprint Module ---
function startMathGame() {
    showScreen('game-screen');
    const container = document.getElementById('game-content');
    
    // Difficulty increases with level
    let multiplier = Math.min(state.level, 10);
    let num1 = Math.floor(Math.random() * (5 * multiplier)) + 2;
    let num2 = Math.floor(Math.random() * (5 * multiplier)) + 2;
    let answer = num1 * num2;

    container.innerHTML = `
        <p style="color: #6366f1; font-weight: bold; margin-bottom: 1rem;">MATH MODULE LVL ${state.level}</p>
        <h2 style="font-size: 3.5rem; margin-bottom: 2rem;">${num1} × ${num2}</h2>
        <input type="number" id="mathInput" class="input-field" placeholder="?" autofocus>
        <button onclick="checkMath(${answer})" class="submit-btn">VALIDATE</button>
    `;

    // Allow "Enter" key to submit
    document.getElementById('mathInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkMath(answer);
    });
}

function checkMath(correct) {
    let userAns = document.getElementById('mathInput').value;
    let panel = document.getElementById('main-console');

    if (userAns == correct) {
        gainXP(10 + state.level); // More XP for higher levels
        startMathGame(); // Load next question
    } else {
        panel.classList.add('error-shake');
        setTimeout(() => panel.classList.remove('error-shake'), 400);
    }
}

// --- 5. Word Decipher Module ---
function startWordGame() {
    showScreen('game-screen');
    const container = document.getElementById('game-content');
    
    const words = [
        ["AI", "OS", "UX", "CODE"], // Tier 1
        ["BRAIN", "LOGIC", "THINK", "INPUT"], // Tier 2
        ["STRATEGY", "NEURONS", "DYNAMIC", "OUTPUT"], // Tier 3
        ["COGNITIVE", "ALGORITHM", "EPHEMERAL", "PARADIGM"] // Tier 4
    ];
    
    let tier = Math.min(Math.floor(state.level / 2), words.length - 1);
    let target = words[tier][Math.floor(Math.random() * words[tier].length)];
    let scrambled = target.split('').sort(() => Math.random() - 0.5).join('');

    container.innerHTML = `
        <p style="color: #a855f7; font-weight: bold; margin-bottom: 1rem;">DECIPHER MODULE</p>
        <h2 style="font-size: 2.5rem; letter-spacing: 8px; margin-bottom: 2rem;">${scrambled}</h2>
        <input type="text" id="wordInput" class="input-field" placeholder="Unscramble..." style="text-transform: uppercase;">
        <button onclick="checkWord('${target}')" class="submit-btn" style="background: #a855f7;">SUBMIT</button>
    `;
}

function checkWord(correct) {
    let userAns = document.getElementById('wordInput').value.toUpperCase();
    if (userAns === correct) {
        gainXP(15 + state.level);
        startWordGame();
    } else {
        document.getElementById('main-console').classList.add('error-shake');
        setTimeout(() => document.getElementById('main-console').classList.remove('error-shake'), 400);
    }
}

// --- 6. Stats/Leaderboard ---
function toggleLeaderboard() {
    showScreen('stats-screen');
    const list = document.getElementById('stats-list');
    let history = JSON.parse(localStorage.getItem('brainHistory')) || [];
    
    if (history.length === 0) {
        list.innerHTML = "<p style='color: #71717a;'>No neural activity recorded yet.</p>";
    } else {
        list.innerHTML = history.reverse().map(entry => `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <span style="font-size: 0.8rem; color: #71717a;">${entry.date}</span>
                <span style="color: #6366f1; font-weight: bold;">+${entry.xp} XP</span>
            </div>
        `).join('');
    }
}
