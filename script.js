const grid = document.getElementById('grid');
const startBtn = document.getElementById('start-btn');
const message = document.getElementById('message');
const levelDisplay = document.getElementById('level');

let sequence = [];
let playerSequence = [];
let level = 1;
let canClick = false;

// Create 9 tiles
for (let i = 0; i < 9; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.id = i;
    tile.addEventListener('click', handleTileClick);
    grid.appendChild(tile);
}

function handleTileClick(e) {
    if (!canClick) return;
    
    const id = parseInt(e.target.dataset.id);
    playerSequence.push(id);
    flashTile(id, 'active');

    if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
        endGame();
        return;
    }

    if (playerSequence.length === sequence.length) {
        canClick = false;
        setTimeout(nextLevel, 1000);
    }
}

function flashTile(id, className) {
    const tile = document.querySelectorAll('.tile')[id];
    tile.classList.add(className);
    setTimeout(() => tile.classList.remove(className), 400);
}

function nextLevel() {
    playerSequence = [];
    level++;
    levelDisplay.innerText = level;
    sequence.push(Math.floor(Math.random() * 9));
    showSequence();
}

function showSequence() {
    canClick = false;
    message.innerText = "Watching...";
    let i = 0;
    const interval = setInterval(() => {
        flashTile(sequence[i], 'active');
        i++;
        if (i >= sequence.length) {
            clearInterval(interval);
            canClick = true;
            message.innerText = "Your Turn!";
        }
    }, 600);
}

function endGame() {
    message.innerText = "LINK SEVERED. Critical Error.";
    document.body.style.backgroundColor = "#2a0000";
    setTimeout(() => {
        document.body.style.backgroundColor = "#0a0b10";
        reset();
    }, 1000);
}

function reset() {
    level = 1;
    sequence = [];
    levelDisplay.innerText = level;
    startBtn.style.display = "inline-block";
}

startBtn.addEventListener('click', () => {
    startBtn.style.display = "none";
    sequence = [Math.floor(Math.random() * 9)];
    showSequence();
});
