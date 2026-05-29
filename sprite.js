// Creazione degli oggetti immagine
const busImage = new Image();
const obstacleImage = new Image();
const personImage = new Image();

// --- INSERISCI QUI I TUOI LINK DI IMGBB ---
// NOTA: Assicurati che i link finiscano con .png o .jpg (Link diretti)
busImage.src = "https://i.ibb.co/8DmYw431/Gemini-Generated-Image-nd9v8qnd9v8qnd9v.png";       
obstacleImage.src = "https://i.ibb.co/G1v5QHc/png-clipart-car-car-sedan-car.png";   
personImage.src = "https://i.ibb.co/jPcrzHR3/pngtree-2d-cartoon-character-boy-vector-images-png-image-15201837.png"; 

// Gestione errori (opzionale, ti aiuta a capire se i link sono corretti nella console del browser)
busImage.onerror = () => console.error("Errore nel caricamento dell'immagine del Bus");
obstacleImage.onerror = () => console.error("Errore nel caricamento dell'immagine dell'Ostacolo");
personImage.onerror = () => console.error("Errore nel caricamento dell'immagine della Persona");
