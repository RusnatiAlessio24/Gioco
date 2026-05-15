const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Stato del gioco
let isGameOver = false;
let obstacles = [];
let frameCount = 0;

// Stato dei comandi (vale sia per tasti che per pulsanti)
const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// Configurazione Bus
const bus = {
    x: 180,
    y: 400,
    w: 40,
    h: 40,
    speed: 1 // Spostamento per ogni click
};

// Disegna il bus (Quadrato Rosso)
function drawBus() {
    ctx.fillStyle = "red";
    ctx.fillRect(bus.x, bus.y, bus.w, bus.h);
}

// Logica Ostacoli
function handleObstacles() {
    // Crea un nuovo ostacolo ogni 100 frame
    if (frameCount % 100 === 0) {
        // --- MODIFICA QUI PER DIMENSIONI DINAMICHE ---
        
        // Genera una larghezza casuale tra 30 e 120 pixel
        const randomW = Math.random() * (120 - 30) + 30;
        
        // Genera un'altezza casuale tra 20 e 60 pixel
        const randomH = Math.random() * (60 - 20) + 20;
        
        // Genera una posizione X casuale assicurandosi che l'ostacolo non esca dal bordo destro
        const x = Math.random() * (canvas.width - randomW);
        
        // Aggiungiamo l'ostacolo con le sue dimensioni uniche
        obstacles.push({ 
            x: x, 
            y: -randomH, // Parte appena sopra il canvas in base alla sua altezza
            w: randomW, 
            h: randomH 
        });
    }

    ctx.fillStyle = "white";
    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        o.y += 3; // Velocità di scorrimento

        // Disegna l'ostacolo usando le sue dimensioni dinamiche
        ctx.fillRect(o.x, o.y, o.w, o.h);

        // Controllo Collisione (resta invariato, ma usa le nuove w e h)
        if (bus.x < o.x + o.w && bus.x + bus.w > o.x &&
            bus.y < o.y + o.h && bus.y + bus.h > o.y) {
            isGameOver = true;
        }
    }
}

// --- CONTROLLI TASTIERA (WASD e Frecce) ---
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

// --- CONTROLLI PULSANTI A SCHERMO ---
const setupButton = (id, direction) => {
    const btn = document.getElementById(id);
    
    // Mouse
    btn.addEventListener("mousedown", () => { keys[direction] = true; });
    btn.addEventListener("mouseup", () => { keys[direction] = false; });
    btn.addEventListener("mouseleave", () => { keys[direction] = false; });
    
    // Touch (per smartphone)
    btn.addEventListener("touchstart", (e) => { 
        e.preventDefault(); 
        keys[direction] = true; 
    });
    btn.addEventListener("touchend", () => { keys[direction] = false; });
};

setupButton("up", "up");
setupButton("down", "down");
setupButton("left", "left");
setupButton("right", "right");

// --- LOGICA DI MOVIMENTO FLUIDO ---
function moveBus() {
    const smoothSpeed = 5; // Regola questo valore per la velocità del bus

    if (keys.up && bus.y > 0) bus.y -= smoothSpeed;
    if (keys.down && bus.y < canvas.height - bus.h) bus.y += smoothSpeed;
    if (keys.left && bus.x > 0) bus.x -= smoothSpeed;
    if (keys.right && bus.x < canvas.width - bus.w) bus.x += smoothSpeed;
}

// Funzione principale di rendering
function gameLoop() {
    if (isGameOver) {
        document.getElementById("status").innerText = "INCIDENTE! Dovevi girare lo scambio in Vittorio Veneto!!!";
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    moveBus(); // <--- IMPORTANTE
    drawBus();
    handleObstacles();
    
    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Avvio
gameLoop();