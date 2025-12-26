const grid = document.getElementById('game-grid');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const timerDisplay = document.getElementById('timer');
const message = document.getElementById('message');
const hintBtn = document.getElementById('hint-btn');
const resetBtn = document.getElementById('reset-btn');

let score = 0;
let level = 1;
let timeLeft = 30;
let timer;
let nodes = [];
let connections = [];
let selectedNode = null;
let gameMode = 'logic';
let gridSize = 4;

function startGame(mode) {
    gameMode = mode;
    level = 1;
    score = 0;
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    generateLevel();
    document.getElementById('mode-selection').classList.add('hidden');
    document.getElementById('game-controls').classList.remove('hidden');
    document.getElementById('game-area').classList.remove('hidden');
}

function generateLevel() {
    grid.innerHTML = '';
    nodes = [];
    connections = [];
    timeLeft = 30;
    timerDisplay.textContent = timeLeft;
    gridSize = level < 3 ? 4 : 5;
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    // Generate nodes with random colors and connection requirements
    for (let i = 0; i < gridSize * gridSize; i++) {
        const node = document.createElement('div');
        node.classList.add('node');
        const connectionsNeeded = Math.floor(Math.random() * 3) + 1;
        node.dataset.index = i;
        node.dataset.connections = connectionsNeeded;
        node.dataset.color = ['red', 'blue', 'green'][Math.floor(Math.random() * 3)];
        node.style.background = node.dataset.color;
        node.textContent = connectionsNeeded;
        node.addEventListener('click', () => selectNode(i));
        grid.appendChild(node);
        nodes.push({ index: i, connections: [], required: connectionsNeeded, color: node.dataset.color });
    }

    if (gameMode === 'memory') {
        setTimeout(() => {
            nodes.forEach((_, idx) => {
                grid.children[idx].textContent = '';
            });
        }, 2000);
    }

    startTimer();
}

function selectNode(index) {
    if (!selectedNode) {
        selectedNode = index;
        grid.children[index].classList.add('active');
    } else {
        const fromNode = nodes[selectedNode];
        const toNode = nodes[index];

        if (isValidConnection(selectedNode, index)) {
            connections.push({ from: selectedNode, to: index });
            fromNode.connections.push(index);
            toNode.connections.push(selectedNode);
            drawConnection(selectedNode, index);
            checkWin();
        }

        grid.children[selectedNode].classList.remove('active');
        selectedNode = null;
    }
}

function isValidConnection(from, to) {
    if (from === to) return false;
    const row1 = Math.floor(from / gridSize);
    const col1 = from % gridSize;
    const row2 = Math.floor(to / gridSize);
    const col2 = to % gridSize;
    return (Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1) && nodes[from].color === nodes[to].color;
}

function drawConnection(from, to) {
    const fromNode = grid.children[from];
    const toNode = grid.children[to];
    const connection = document.createElement('div');
    connection.classList.add('connection');
    const rect1 = fromNode.getBoundingClientRect();
    const rect2 = toNode.getBoundingClientRect();
    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;
    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    connection.style.width = `${length}px`;
    connection.style.transform = `rotate(${angle}deg)`;
    connection.style.left = `${x1}px`;
    connection.style.top = `${y1}px`;
    document.body.appendChild(connection);
}

function checkWin() {
    const allConnected = nodes.every(node => node.connections.length === node.required);
    if (allConnected) {
        clearInterval(timer);
        score += timeLeft * level;
        scoreDisplay.textContent = score;
        message.textContent = `Level ${level} Complete!`;
        message.classList.remove('hidden');
        setTimeout(() => {
            level++;
            levelDisplay.textContent = level;
            message.classList.add('hidden');
            generateLevel();
        }, 2000);
    }
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            message.textContent = 'Time’s Up! Try Again.';
            message.classList.remove('hidden');
            setTimeout(generateLevel, 2000);
        }
    }, 1000);
}

hintBtn.addEventListener('click', () => {
    // Suggest a valid connection
    const unconnectedNode = nodes.find(node => node.connections.length < node.required);
    if (unconnectedNode) {
        const neighbors = [
            unconnectedNode.index - gridSize,
            unconnectedNode.index + gridSize,
            unconnectedNode.index - 1,
            unconnectedNode.index + 1
        ].filter(idx => idx >= 0 && idx < gridSize * gridSize && isValidConnection(unconnectedNode.index, idx));
        if (neighbors.length) {
            message.textContent = `Try connecting node ${unconnectedNode.index + 1} to node ${neighbors[0] + 1}`;
            message.classList.remove('hidden');
            setTimeout(() => message.classList.add('hidden'), 2000);
        }
    }
});

resetBtn.addEventListener('click', generateLevel);
