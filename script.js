const gym = {
    // --- APP STATE ---
    data: { xp: 0, pin: "", name: "", startTime: Date.now(), trainedToday: 0 },
    timerInterval: null,
    
    // --- AUTHENTICATION ---
    login() {
        const pin = document.getElementById('pass').value;
        if(pin.length < 4) return alert("PIN must be 4 digits");
        
        const stored = localStorage.getItem('cog_gym_' + pin);
        if(stored) {
            this.data = JSON.parse(stored);
            // Reset daily timer if it's a new day
            const lastLog = new Date(this.data.lastActive || 0).toDateString();
            if(lastLog !== new Date().toDateString()) this.data.trainedToday = 0;
        } else {
            this.data.name = prompt("IDENTIFY PILOT (Name):") || "Pilot";
            this.data.pin = pin;
            this.save();
        }
        
        this.show('hub-scr');
        this.updateUI();
        this.loadLeaderboard();
        this.startDailyTracker();
    },

    save() {
        this.data.lastActive = Date.now();
        localStorage.setItem('cog_gym_' + this.data.pin, JSON.stringify(this.data));
    },

    // --- UI ENGINE ---
    updateUI() {
        document.getElementById('xp-val').innerText = this.data.xp;
        document.getElementById('p-name').innerText = this.data.name;
        
        const ranks = ["Novice", "Strategist", "Sage", "Mastermind", "Overlord"];
        const rankIdx = Math.min(Math.floor(this.data.xp / 1000), 4);
        document.getElementById('rank').innerText = "Rank: " + ranks[rankIdx];
        
        // Update Goal Bar (10 mins = 600 seconds)
        const progress = Math.min((this.data.trainedToday / 600) * 100, 100);
        document.getElementById('goal-bar').style.width = progress + "%";
        document.getElementById('goal-percent').innerText = Math.floor(progress) + "%";
    },

    show(id) {
        ['login-scr', 'hub-scr', 'game-scr'].forEach(s => document.getElementById(s).classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
    },

    exit() {
        this.show('hub-scr');
        this.loadLeaderboard();
    },

    // --- TRACKING ---
    startDailyTracker() {
        setInterval(() => {
            if(!document.getElementById('hub-scr').classList.contains('hidden') || 
               !document.getElementById('game-scr').classList.contains('hidden')) {
                this.data.trainedToday += 1;
                if(this.data.trainedToday % 30 === 0) { // Save every 30 seconds
                    this.save();
                    this.updateUI();
                }
            }
        }, 1000);
    },

    loadLeaderboard() {
        const leaders = [
            {n: "Neuro_Max", x: 15200},
            {n: "Logic_Queen", x: 11000},
            {n: "Cortex_01", x: 8400},
            {n: this.data.name + " (YOU)", x: this.data.xp}
        ].sort((a,b) => b.x - a.x);
        
        document.getElementById('leaderboard-data').innerHTML = leaders.map((l, i) => `
            <div class="leader-entry">
                <span>[${i+1}] ${l.n}</span>
                <span>${l.x} XP</span>
            </div>
        `).join('');
    },

    // --- MINI GAMES ---

    // 1. Math Sprint (Parietal Lobe)
    startMath() {
        this.show('game-scr');
        let a = Math.floor(Math.random() * 12) + 4, b = Math.floor(Math.random() * 12) + 4;
        let ans = a * b;
        document.getElementById('content').innerHTML = `
            <h2 class="white-text" style="font-size:3.5rem; margin:10px 0;">${a} × ${b}</h2>
            <input type="number" id="mathAns" class="input-field" autofocus>
            <button class="btn" onclick="gym.checkMath(${ans})">VERIFY LOGIC</button>
        `;
    },
    checkMath(ans) {
        if(document.getElementById('mathAns').value == ans) {
            this.data.xp += 10; this.save(); this.updateUI(); this.startMath();
        } else { this.exit(); }
    },

    // 2. Word Recall (Temporal Lobe)
    startWord() {
        this.show('game-scr');
        const list = ["NEURON", "SYNAPSE", "PLASTICITY", "FRONTAL", "COGNITION", "NETWORK"];
        let target = list[Math.floor(Math.random()*list.length)];
        let scrambled = target.split('').sort(() => .5 - Math.random()).join('');
        document.getElementById('content').innerHTML = `
            <h2 class="white-text" style="letter-spacing:8px; font-size:2rem; margin:20px 0;">${scrambled}</h2>
            <input type="text" id="wordAns" class="input-field" style="text-transform:uppercase" placeholder="DECRYPT...">
            <button class="btn" onclick="gym.checkWord('${target}')">RESTORE DATA</button>
        `;
    },
    checkWord(ans) {
        if(document.getElementById('wordAns').value.toUpperCase() == ans) {
            this.data.xp += 15; this.save(); this.updateUI(); this.startWord();
        } else { this.exit(); }
    },

    // 3. Pattern Focus (Parietal/Occipital)
    startMem() {
        this.show('game-scr');
        document.getElementById('content').innerHTML = `<p class="text-dim">Memorize the sequence...</p><div class="memory-grid" id="mGrid"></div>`;
        const grid = document.getElementById('mGrid');
        for(let i=0; i<9; i++) grid.innerHTML += `<div class="tile" id="t${i}"></div>`;
        
        let seq = Array.from({length: 3}, () => Math.floor(Math.random()*9)), user = [];
        seq.forEach((val, i) => {
            setTimeout(() => {
                document.getElementById('t'+val).classList.add('active-tile');
                setTimeout(() => {
                    document.getElementById('t'+val).classList.remove('active-tile');
                    if(i === 2) this.activateTiles(seq, user);
                }, 400);
            }, i * 700);
        });
    },
    activateTiles(seq, user) {
        document.querySelectorAll('.tile').forEach((tile, id) => {
            tile.onclick = () => {
                tile.classList.add('active-tile');
                setTimeout(() => tile.classList.remove('active-tile'), 200);
                user.push(id);
                if(user[user.length-1] !== seq[user.length-1]) this.exit();
                if(user.length === seq.length) { this.data.xp += 20; this.save(); this.updateUI(); this.startMem(); }
            };
        });
    },

    // 4. Reaction (Cerebellum)
    startReact() {
        this.show('game-scr');
        document.getElementById('content').innerHTML = `
            <div id="react-box" style="height:200px; border:2px solid #333; border-radius:20px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                <b class="white-text">WAIT FOR GREEN...</b>
            </div>`;
        const box = document.getElementById('react-box');
        setTimeout(() => {
            box.style.background = "#22c55e";
            box.innerHTML = "<b class='white-text'>HIT NOW!</b>";
            const start = Date.now();
            box.onclick = () => {
                let diff = Date.now() - start;
                this.data.xp += Math.max(5, 35 - Math.floor(diff/50));
                this.save(); this.updateUI(); this.startReact();
            };
        }, Math.random() * 3000 + 1000);
    },

    // 5. Color Logic (Prefrontal Cortex)
    startStroop() {
        this.show('game-scr');
        const colors = ["RED", "BLUE", "GREEN", "YELLOW"];
        const hex = ["#ef4444", "#3b82f6", "#22c55e", "#eab308"];
        let textIdx = Math.floor(Math.random()*4), colorIdx = Math.floor(Math.random()*4);
        document.getElementById('content').innerHTML = `
            <p class="text-dim">IDENTIFY THE COLOR OF THE TEXT</p>
            <h1 style="color:${hex[colorIdx]}; font-size:3.5rem; margin:20px 0;">${colors[textIdx]}</h1>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                ${colors.map((c, i) => `<button class="btn" style="background:${hex[i]}" onclick="gym.checkStroop(${i}, ${colorIdx})">${c}</button>`).join('')}
            </div>
        `;
    },
    checkStroop(guess, actual) {
        if(guess === actual) {
            this.data.xp += 15; this.save(); this.updateUI(); this.startStroop();
        } else { this.exit(); }
    }
};
        
