/**
 * NEURAL OS ZENITH v6.0
 * Core Logic Engine
 */

const gym = {
    // --- STATE MANAGEMENT ---
    xp: parseInt(localStorage.getItem('zenith_xp')) || 0,
    activeGame: null,
    
    // Scaling: Difficulty increases every 500 XP
    get lvl() { return Math.floor(this.xp / 500) + 1; },

    init() {
        this.render();
        console.log("Neural OS Zenith Initialized. Current Level:", this.lvl);
    },

    // Sync UI with Internal State
    render() {
        const xpDisplay = document.getElementById('xp-val');
        const loadBar = document.getElementById('load-bar');
        
        // Animated XP counter
        xpDisplay.innerText = this.xp.toLocaleString();
        
        // Update Load Bar based on Level progress
        const nextLevelXp = this.lvl * 500;
        const currentLevelXp = (this.lvl - 1) * 500;
        const progress = ((this.xp - currentLevelXp) / 500) * 100;
        
        loadBar.style.width = `${Math.min(100, progress)}%`;
        localStorage.setItem('zenith_xp', this.xp);
    },

    show(id) {
        document.getElementById('hub-scr').classList.toggle('hidden', id !== 'hub-scr');
        document.getElementById('game-scr').classList.toggle('hidden', id !== 'game-scr');
    },

    exit() {
        this.show('hub-scr');
        this.render();
    },

    addXp(base) {
        // Multiplier based on level difficulty
        const multiplier = 1 + (this.lvl * 0.1);
        this.xp += Math.round(base * multiplier);
        this.render();
    },

    // --- LOGIC MODULE: SCENT TRACK (INDUCTIVE REASONING) ---
    startNose() {
        this.show('game-scr');
        const database = [
            { s: ["🌸", "🐝", "🍯", "👃🏼"], a: "🥞", label: "Biological Production" },
            { s: ["🌲", "🪵", "🔥", "👃🏼"], a: "💨", label: "State Transformation" },
            { s: ["🍋", "🍬", "🍭", "👃🏼"], a: "🦷", label: "Semantic Decay" },
            { s: ["☕", "🌅", "🍳", "👃🏼"], a: "🍞", label: "Time-based Association" },
            { s: ["☁️", "⚡", "🌧️", "👃🏼"], a: "🌱", label: "Causal Sequence" }
        ];

        let round = database[Math.floor(Math.random() * database.length)];
        let options = [round.a, "🧊", "🌋", "🍕", "🎭", "🛸"].sort(() => Math.random() - 0.5);

        document.getElementById('stage-content').innerHTML = `
            <label>LOGIC: ${round.label}</label>
            <div style="font-size:3.5rem; margin:30px 0; letter-spacing:12px; filter: drop-shadow(0 0 10px var(--accent));">
                ${round.s.join('')}
            </div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; width:100%;">
                ${options.map(emoji => `
                    <button class="n-btn" style="background:var(--card); font-size:2rem; border:1px solid var(--border);" 
                            onclick="gym.cNose('${emoji}', '${round.a}')">${emoji}</button>
                `).join('')}
            </div>
        `;
    },

    cNose(guess, actual) {
        if (guess === actual) {
            this.addXp(50);
            this.startNose();
        } else this.exit();
    },

    // --- EXECUTIVE MODULE: CARD SHIFT (SET-SHIFTING) ---
    startCards() {
        this.show('game-scr');
        // Rules swap every time to force cognitive flexibility
        const ruleSet = ['COLOR', 'SHAPE'];
        const activeRule = ruleSet[Math.floor(Math.random() * 2)];
        
        const cardDeck = [
            { id: 'A', color: 'CYAN', shape: '💎', hex: 'var(--cyan)' },
            { id: 'B', color: 'PURPLE', shape: '💎', hex: 'var(--accent)' },
            { id: 'C', color: 'CYAN', shape: '🌀', hex: 'var(--cyan)' }
        ];

        let target = cardDeck[0]; // The anchor
        let choices = [cardDeck[1], cardDeck[2]].sort(() => Math.random() - 0.5);

        document.getElementById('stage-content').innerHTML = `
            <label>EXECUTIVE RULE: MATCH ${activeRule}</label>
            <div style="font-size:4.5rem; width:140px; height:180px; border:4px solid ${target.hex}; border-radius:24px; display:flex; align-items:center; justify-content:center; margin-bottom:40px; background:rgba(255,255,255,0.05);">
                ${target.shape}
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; width:100%;">
                ${choices.map(choice => `
                    <button class="n-btn" style="background:var(--card); border:2px solid ${choice.hex}; height:120px;" 
                            onclick="gym.cCards('${activeRule}', '${choice.id}')">
                        <span style="font-size:2.5rem">${choice.shape}</span>
                    </button>
                `).join('')}
            </div>
        `;
    },

    cCards(rule, selectedId) {
        // Logic: If rule is Color, target 'A' matches 'C' (both Cyan). 
        // If rule is Shape, target 'A' matches 'B' (both Diamonds).
        const isCorrect = (rule === 'COLOR' && selectedId === 'C') || (rule === 'SHAPE' && selectedId === 'B');
        if (isCorrect) {
            this.addXp(60);
            this.startCards();
        } else this.exit();
    },

    // --- MEMORY MODULE: DIGIT LOOP (PHONOLOGICAL) ---
    startDigits() {
        this.show('game-scr');
        let length = 3 + Math.floor(this.lvl / 2);
        let sequence = Array.from({length}, () => Math.floor(Math.random() * 10)).join('');
        
        let display = document.getElementById('stage-content');
        display.innerHTML = `<label>MEMORIZE SEQUENCE</label><h1 id="digit-flow" style="font-size:6rem; font-family:var(--font-mono); color:var(--cyan);">---</h1>`;
        
        let i = 0;
        let interval = setInterval(() => {
            document.getElementById('digit-flow').innerText = sequence[i];
            // Flash effect
            setTimeout(() => { if(document.getElementById('digit-flow')) document.getElementById('digit-flow').innerText = ""; }, 600);
            i++;
            if (i >= sequence.length) {
                clearInterval(interval);
                setTimeout(() => this.promptDigits(sequence), 800);
            }
        }, 1200);
    },

    promptDigits(correct) {
        document.getElementById('stage-content').innerHTML = `
            <label>INPUT RETRIEVED DATA</label>
            <input type="number" id="digit-input" class="n-input" autofocus>
            <button class="n-btn" onclick="gym.cDigits('${correct}')">SUBMIT RECALL</button>
        `;
    },

    cDigits(correct) {
        const val = document.getElementById('digit-input').value;
        if (val === correct) {
            this.addXp(100);
            this.startDigits();
        } else this.exit();
    },

    // --- QUANTITATIVE: MATH SPRINT ---
    startMath() {
        this.show('game-scr');
        const range = 10 * this.lvl;
        let a = Math.floor(Math.random() * range) + 5;
        let b = Math.floor(Math.random() * range) + 5;
        let ans = a + b;

        document.getElementById('stage-content').innerHTML = `
            <label>NUMERIC PROCESSING</label>
            <h1 style="font-size:5rem; margin-bottom:30px;">${a}<span style="color:var(--accent)">+</span>${b}</h1>
            <input type="number" id="math-input" class="n-input" autofocus>
            <button class="n-btn" onclick="gym.cMath(${ans})">VERIFY</button>
        `;
    },

    cMath(correct) {
        if (parseInt(document.getElementById('math-input').value) === correct) {
            this.addXp(30);
            this.startMath();
        } else this.exit();
    },

    // --- VISUAL: SHAPE RECOGNITION ---
    startShapes() {
        this.show('game-scr');
        const pool = ["💠", "🌀", "⬢", "▲", "◼️", "⭐", "⭕"];
        const target = pool[Math.floor(Math.random() * pool.length)];
        const shuffle = [...pool].sort(() => Math.random() - 0.5);

        document.getElementById('stage-content').innerHTML = `
            <label>VISUAL DISCRIMINATION</label>
            <div style="font-size:6rem; margin:30px 0; animation: fadeIn 0.3s;">${target}</div>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; width:100%;">
                ${shuffle.map(s => `
                    <button class="n-btn" style="background:var(--card); font-size:1.5rem; padding:15px;" 
                            onclick="gym.cShape('${s}', '${target}')">${s}</button>
                `).join('')}
            </div>
        `;
    },

    cShape(guess, actual) {
        if (guess === actual) {
            this.addXp(20);
            this.startShapes();
        } else this.exit();
    }
};

// Start the engine
window.onload = () => gym.init();
            
