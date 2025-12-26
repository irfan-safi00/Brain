// Replace with your Firebase Config from the Firebase Console
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    databaseURL: "YOUR_DB_URL",
    projectId: "YOUR_PROJECT_ID",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Generate a random Squad Code
function generateCode() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

// ACTION: Create Room
function createRoom() {
    const squadCode = generateCode();
    const roomRef = db.ref('rooms/' + squadCode);
    
    roomRef.set({
        status: 'active',
        board: Array(64).fill('neutral'),
        score: { blue: 0, pink: 0 },
        timestamp: Date.now()
    }).then(() => {
        window.location.href = `game.html?squad=${squadCode}&team=blue`;
    });
}

// ACTION: Join Room
function joinRoom() {
    const code = document.getElementById('joinInput').value.trim();
    if (!code) return alert("Enter a code!");

    db.ref('rooms/' + code).once('value', (snapshot) => {
        if (snapshot.exists()) {
            window.location.href = `game.html?squad=${code}&team=pink`;
        } else {
            alert("Squad not found. Check the code.");
        }
    });
}
