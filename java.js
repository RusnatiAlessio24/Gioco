const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Stato del gioco
let isGameOver = false;
let obstacles = [];
let people = []; 
let score = 0;   
let frameCount = 0;

// Stato dei comandi da tastiera
const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// Configurazione Bus
const bus = {
    x: 330, 
    y: 450,
    w: 50, // Ho ingrandito leggermente (da 40 a 50) per adattarsi meglio a un'immagine
    h: 50
};

// DISEGNA IL BUS (Usa l'immagine da Sprite.js)
function drawBus() {
    ctx.drawImage(busImage, bus.x, bus.y, bus.w, bus.h);
}

// Logica Ostacoli (Auto)
function handleObstacles() {
    if (frameCount % 100 === 0) {
        // Manteniamo le dimensioni dinamiche delle auto ostacolo
        const randomW = Math.random() * (100 - 40) + 40;
        const randomH = Math.random() * (80 - 50) + 50;
        const x = Math.random() * (canvas.width - randomW);
        
        obstacles.push({ 
            x: x, 
            y: -randomH, 
            w: randomW, 
            h: randomH 
        });
    }

    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        o.y += 3; 

        // DISEGNA L'OSTACOLO (Usa l'immagine dell'auto da Sprite.js)
        ctx.drawImage(obstacleImage, o.x, o.y, o.w, o.h);

        // Controllo Collisione
        if (bus.x < o.x + o.w && bus.x + bus.w > o.x &&
            bus.y < o.y + o.h && bus.y + bus.h > o.y) {
            isGameOver = true;
        }
    }

    obstacles = obstacles.filter(o => o.y < canvas.height);
}

// Logica Persone (Passeggeri)
function handlePeople() {
    if (frameCount % 120 === 0) {
        const size = 30; // Definiamo una larghezza/altezza fissa per l'immagine della persona
        const radius = size / 2; // Ci serve ancora per il calcolo della collisione circolare
        const x = Math.random() * (canvas.width - size);
        
        people.push({
            x: x,
            y: -size,
            w: size,
            h: size,
            r: radius // Raggio utile al calcolo matematico
        });
    }

    for (let i = people.length - 1; i >= 0; i--) {
        let p = people[i];
        p.y += 3; 

        // DISEGNA LA PERSONA (Usa l'immagine da Sprite.js)
        ctx.drawImage(personImage, p.x, p.y, p.w, p.h);

        // Centro della persona per il calcolo della collisione precedente
        let centerX = p.x + p.r;
        let centerY = p.y + p.r;

        // Controllo Collisione Bus -> Persona
        let closestX = Math.max(bus.x, Math.min(centerX, bus.x + bus.w));
        let closestY = Math.max(bus.y, Math.min(centerY, bus.y + bus.h));
        
        let distanceX = centerX - closestX;
        let distanceY = centerY - closestY;
        let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

        if (distanceSquared < (p.r * p.r)) {
            score++;
            document.getElementById("score").innerText = score; 
            people.splice(i, 1); 
            continue;
        }

        if (p.y > canvas.height) {
            people.splice(i, 1);
        }
    }
}

// --- COMANDI TASTIERA ---
window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k === "arrowup" || k === "w") keys.up = true;
    if (k === "arrowdown" || k === "s") keys.down = true;
    if (k === "arrowleft" || k === "a") keys.left = true;
    if (k === "arrowright" || k === "d") keys.right = true;
});

window.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (k === "arrowup" || k === "w") keys.up = false;
    if (k === "arrowdown" || k === "s") keys.down = false;
    if (k === "arrowleft" || k === "a") keys.left = false;
    if (k === "arrowright" || k === "d") keys.right = false;
});

// --- LOGICA DI MOVIMENTO FLUIDO ---
function moveBus() {
    const smoothSpeed = 6; // Aumentata leggermente la velocità visto che il bus è più grande

    if (keys.up && bus.y > 0) bus.y -= smoothSpeed;
    if (keys.down && bus.y < canvas.height - bus.h) bus.y += smoothSpeed;
    if (keys.left && bus.x > 0) bus.x -= smoothSpeed;
    if (keys.right && bus.x < canvas.width - bus.w) bus.x += smoothSpeed;
}

// Loop Principale
function gameLoop() {
    if (isGameOver) {
        document.getElementById("status").innerText = "Incidente!!!! Rinfresca la pagina per rigiocare.";
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    moveBus(); 
    drawBus();
    handleObstacles();
    handlePeople(); 
    
    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Avvio del gioco
gameLoop();