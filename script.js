let state = { xp: 0, name: "", level: 1, passcode: "" };
let memorySequence = [];
let userSequence = [];

// --- LOGIN LOGIC ---
function handleLogin() {
    const pass = document.getElementById('pass-input').value;
    if (pass.length < 4) return alert("Passcode must be 4+ digits");

    const savedData = localStorage.getItem('cogData_' + pass);
    
    if (savedData) {
        state = JSON.parse(savedData); // Load old account
    } else {
        state.name = prompt("New account detected! Enter Pilot Name:") || "Pilot";
        state.passcode = pass;
        saveToLocal(); // Create new account
    }
    
    document.getElementById('login-gate').classList.add('hidden');
    document.getElementById('app-body').classList.remove('hidden');
    updateUI();
}

function saveToLocal() {
    localStorage.setItem('cogData_' + state.passcode, JSON.stringify(state));
}

// --- NEW GAME: PATTERN RECALL ---
function startMemoryGame() {
    showScreen('game-screen');
    const container = document.getElementById('game-content');
    container.innerHTML = `<p class="text-dim">Watch the sequence...</p><div class="memory-grid" id="mGrid"></div>`;
    
    const grid = document.getElementById('mGrid');
    for(let i=0; i<9; i++) grid.innerHTML += `<div class="memory-tile" id="tile-${i}" onclick="handleTileClick(${i})"></div>`;
    
    generateSequence();
}

function generateSequence() {
    memorySequence = [];
    userSequence = [];
    let length = Math.min(3 + Math.floor(state.xp/200), 8); // Gets longer as you level up
    for(let i=0; i<length; i++) memorySequence.push(Math.floor(Math.random()*9));
    playSequence();
}

async function playSequence() {
    document.getElementById('mGrid').style.pointerEvents = "none";
    for(let tileId of memorySequence) {
        await new Promise(r => setTimeout(r, 600));
        const el = document.getElementById(`tile-${tileId}`);
        el.classList.add('tile-active');
        await new Promise(r => setTimeout(r, 400));
        el.classList.remove('tile-active');
    }
    document.getElementById('mGrid').style.pointerEvents = "auto";
}

function handleTileClick(id) {
    userSequence.push(id);
    const el = document.getElementById(`tile-${id}`);
    el.classList.add('tile-active');
    setTimeout(() => el.classList.remove('tile-active'), 200);

    if(userSequence[userSequence.length-1] !== memorySequence[userSequence.length-1]) {
        alert("Sequence Broken!");
        exitGame();
        return;
    }

    if(userSequence.length === memorySequence.length) {
        gainXP(20);
        setTimeout(generateSequence, 1000);
    }
}

// (Keep your existing Math and Word game functions here, just ensure gainXP calls saveToLocal())
function gainXP(amount) {
    state.xp += amount;
    updateUI();
    saveToLocal();
}

function updateUI() {
    state.level = Math.floor(state.xp / 100) + 1;
    document.getElementById('total-xp').innerText = state.xp;
    document.getElementById('lvl-circle').innerText = state.level;
    document.getElementById('player-name').innerText = state.name;
}

function showScreen(id) {
    ['home-menu', 'game-screen', 'stats-screen'].forEach(s => document.getElementById(s).classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function exitGame() { showScreen('home-menu'); }
