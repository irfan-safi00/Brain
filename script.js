const gym = {
    // --- PERSISTENT DATA ---
    xp: parseInt(localStorage.getItem('nos_xp')) || 0,
    
    // DIFFICULTY SCALING: Level increments every 300 XP
    get lvl() { return Math.floor(this.xp / 300) + 1; },
    
    // NEURAL LOAD: A visual representation of complexity based on Level
    get load() { return Math.min(100, (this.lvl * 8)); },

    // --- SYSTEM CORE ---
    init() {
        this.up();
    },

    up() {
        document.getElementById('xp-display').innerText = this.xp.toLocaleString();
        document.getElementById('lvl-display').innerText = this.lvl;
        document.getElementById('load-fill').style.width = this.load + "%";
        localStorage.setItem('nos_xp', this.xp);
    },

    show(id) {
        document.getElementById('hub-scr').classList.toggle('hidden', id !== 'hub-scr');
        document.getElementById('game-scr').classList.toggle('hidden', id !== 'game-scr');
    },

    exit() { 
        this.show('hub-scr'); 
        this.up(); 
    },

    addXp(v) { 
        // Bonus XP based on Level for higher efficiency
        const bonus = Math.floor(v * (1 + (this.lvl * 0.1)));
        this.xp += bonus; 
        this.up(); 
    },

    reset() { 
        if(confirm("DANGER: This will format your neural progress. Continue?")) { 
            this.xp = 0; 
            this.up(); 
        } 
    },

    // --- NEURAL MODULES (1-9) ---

    // 1. MATH SPRINT (Parietal)
    startMath() {
        this.show('game-scr');
        const range = 5 + (this.lvl * 5);
        let a = Math.floor(Math.random() * range) + 2;
        let b = Math.floor(Math.random() * (this.lvl > 5 ? range : 10)) + 2;
        let op = this.lvl > 4 ? '×' : '+';
        let ans = (op === '+') ? a + b : a * b;

        document.getElementById('content').innerHTML = `
            <p class="label">ARITHMETIC LOAD</p>
            <h1 style="font-size:4rem; margin:20px 0;">${a} ${op} ${b}</h1>
            <input type="number" id="ans" class="input-field" autofocus>
            <button class="btn" onclick="gym.cMath(${ans})">VERIFY</button>`;
    },
    cMath(a) { if(document.getElementById('ans').value == a) { this.addXp(10); this.startMath(); } else this.exit(); },

    // 2. WORD RECALL (Temporal)
    startWord() {
        this.show('game-scr');
        const words = ["DATA", "LOGIC", "CORTEX", "NEURON", "SYNAPSE", "NETWORK", "PROTOCOL", "ALGORITHM", "PLASTICITY", "COGNITIVE"];
        const index = Math.min(this.lvl - 1, words.length - 1);
        let target = words[index];
        let scrambled = target.split('').sort(() => .5 - Math.random()).join('');

        document.getElementById('content').innerHTML = `
            <p class="label">SEMANTIC RETRIEVAL</p>
            <h1 style="letter-spacing:12px; font-size:2.2rem; margin:20px 0;">${scrambled}</h1>
            <input type="text" id="ans" class="input-field" style="text-transform:uppercase">
            <button class="btn" onclick="gym.cWord('${target}')">DECRYPT</button>`;
    },
    cWord(a) { if(document.getElementById('ans').value.toUpperCase() == a) { this.addXp(15); this.startWord(); } else this.exit(); },

    // 3. PATTERN FOCUS (Memory)
    startMem() {
        this.show('game-scr');
        document.getElementById('content').innerHTML = `<p class="label">SPATIAL SEQUENCE</p><div class="memory-grid" style="grid-template-columns:repeat(3,1fr)" id="gr"></div>`;
        for(let i=0; i<9; i++) document.getElementById('gr').innerHTML += `<div class="tile" id="t${i}"></div>`;
        
        let len = 2 + Math.floor(this.lvl / 2);
        let speed = Math.max(200, 800 - (this.lvl * 50));
        let q = Array.from({length: len}, () => Math.floor(Math.random() * 9)), u = [];

        q.forEach((v, i) => {
            setTimeout(() => {
                const t = document.getElementById('t'+v);
                t.classList.add('active-tile');
                setTimeout(() => {
                    t.classList.remove('active-tile');
                    if(i === q.length - 1) this.bindMem(q, u);
                }, speed / 2);
            }, i * speed);
        });
    },
    bindMem(q, u) {
        document.querySelectorAll('.tile').forEach((t, i) => t.onclick = () => {
            u.push(i);
            t.classList.add('active-tile');
            setTimeout(() => t.classList.remove('active-tile'), 200);
            if(u[u.length-1] !== q[u.length-1]) this.exit();
            if(u.length === q.length) { this.addXp(25); this.startMem(); }
        });
    },

    // 4. REACTION (Cerebellum)
    startReact() {
        this.show('game-scr');
        document.getElementById('content').innerHTML = `<div id="box" style="height:220px; border:2px solid #333; border-radius:25px; display:flex; align-items:center; justify-content:center; cursor:pointer;"><b class="label">INITIALIZING...</b></div>`;
        setTimeout(() => {
            const b = document.getElementById('box');
            b.style.background = "var(--accent)";
            b.innerHTML = "<b style='color:#000; font-size:1.5rem;'>ENGAGE!</b>";
            const start = Date.now();
            b.onclick = () => {
                let diff = Date.now() - start;
                this.addXp(Math.max(5, 60 - Math.floor(diff/10)));
                this.startReact();
            };
        }, Math.random() * 3000 + 1000);
    },

    // 5. COLOR LOGIC (Prefrontal)
    startStroop() {
        this.show('game-scr');
        const c = ["RED", "BLUE", "GREEN", "YELLOW"], h = ["#ef4444", "#3b82f6", "#22c55e", "#eab308"];
        let ti = Math.floor(Math.random()*4), ci = Math.floor(Math.random()*4);
        document.getElementById('content').innerHTML = `
            <p class="label">INHIBITION TASK: SELECT TEXT COLOR</p>
            <h1 style="color:${h[ci]}; font-size:4rem; margin:20px 0;">${c[ti]}</h1>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                ${c.map((n, i) => `<button class="btn" style="background:${h[i]}" onclick="gym.cStroop(${i},${ci})">${n}</button>`).join('')}
            </div>`;
    },
    cStroop(g, a) { if(g == a) { this.addXp(15); this.startStroop(); } else this.exit(); },

    // 6. SHAPE MATCH (Visual)
    startShapes() {
        this.show('game-scr');
        const s = ["▲", "■", "●", "★", "♦", "✖", "✦", "🌀"];
        const pool = s.slice(0, Math.min(4 + this.lvl, s.length));
        let t = pool[Math.floor(Math.random() * pool.length)];
        document.getElementById('content').innerHTML = `
            <h1 style="font-size:5rem; margin-bottom:20px;">${t}</h1>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;">
                ${pool.sort(()=>.5-Math.random()).map(x => `<button class="btn" style="background:#111; color:#fff; font-size:1.5rem" onclick="gym.cShape('${x}','${t}')">${x}</button>`).join('')}
            </div>`;
    },
    cShape(g, t) { if(g == t) { this.addXp(10); this.startShapes(); } else this.exit(); },

    // 7. SEQUENCE (Analysis)
    startSequence() {
        this.show('game-scr');
        let step = Math.floor(Math.random()*5)+1, start = Math.floor(Math.random()*20);
        let seq = [start, start+step, start+step*2, "?"];
        document.getElementById('content').innerHTML = `
            <p class="label">PATTERN RECOGNITION</p>
            <h1 style="font-size:3rem; margin:20px 0;">${seq.join(' , ')}</h1>
            <input type="number" id="ans" class="input-field" autofocus>
            <button class="btn" onclick="gym.cSeq(${start+step*3})">SUBMIT</button>`;
    },
    cSeq(a) { if(document.getElementById('ans').value == a) { this.addXp(20); this.startSequence(); } else this.exit(); },

    // 8. GRID SCAN (Working Memory)
    startGrid() {
        this.show('game-scr');
        document.getElementById('content').innerHTML = `<p class="label">MEMORIZE GRID STATE</p><div class="memory-grid" id="gr"></div>`;
        for(let i=0; i<16; i++) document.getElementById('gr').innerHTML += `<div class="tile" id="t${i}"></div>`;
        
        let count = 2 + Math.floor(this.lvl / 3);
        let targets = [];
        while(targets.length < count) {
            let r = Math.floor(Math.random() * 16);
            if(!targets.includes(r)) targets.push(r);
        }

        targets.forEach(idx => document.getElementById('t'+idx).classList.add('active-tile'));
        
        setTimeout(() => {
            targets.forEach(idx => document.getElementById('t'+idx).classList.remove('active-tile'));
            let selected = [];
            document.querySelectorAll('.tile').forEach((t, i) => t.onclick = () => {
                t.classList.add('active-tile');
                if(!targets.includes(i)) this.exit();
                if(!selected.includes(i)) selected.push(i);
                if(selected.length === targets.length) { this.addXp(30); this.startGrid(); }
            });
        }, 1500 - (this.lvl * 50));
    },

    // 9. DIGIT SPAN (Auditory/Seq)
    startDigits() {
        this.show('game-scr');
        let d = ""; 
        for(let i=0; i < 3 + Math.floor(this.lvl/4); i++) d += Math.floor(Math.random()*10);
        
        document.getElementById('content').innerHTML = `<h1 id="d-display" style="font-size:5rem; font-family:'JetBrains Mono';">...</h1>`;
        
        let i = 0;
        let timer = setInterval(() => {
            document.getElementById('d-display').innerText = d[i];
            setTimeout(() => { if(document.getElementById('d-display')) document.getElementById('d-display').innerText = ""; }, 500);
            i++;
            if(i === d.length) {
                clearInterval(timer);
                setTimeout(() => {
                    document.getElementById('content').innerHTML = `
                        <p class="label">RECALL SEQUENCE</p>
                        <input type="number" id="ans" class="input-field" placeholder="----">
                        <button class="btn" onclick="gym.cDigits('${d}')">ENTER</button>`;
                }, 700);
            }
        }, 1200);
    },
    cDigits(a) { if(document.getElementById('ans').value == a) { this.addXp(30); this.startDigits(); } else this.exit(); }
};

// Initialize
gym.init();
    
