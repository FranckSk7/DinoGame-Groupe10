// ============================================================
//  main.ts — Membre 1 : Boucle principale du jeu
//  Projet DinoGame Groupe 10 · ICT4D L2 · UY1 · 2025-2026
//
//  Ce fichier relie tous les modules :
//  - dino.ts      (Membre 2 — Maxime)
//  - obstacle.ts  (Membre 3 — Franck)
//  - score.ts     (Membre 4)
//  - meteo.ts     (Membre 5)
//  - pluie.ts     (Membre 6)
//  - musique.ts   (Membre 7)
//  - assets/      (Membre 8 — Raissa)
// ============================================================
import { Dino } from "./dino.js";
import { GestionnaireObstacles } from "./obstacle.js";
import { Score } from "./score.js";
import { Pluie } from "./pluie.js";
import { Musique } from "./musique.js";
import { demarrerSurveillanceTheme, getTheme } from "./meteo.js";
// ============================================================
//  ÉLÉMENTS HTML
// ============================================================
const canvas = document.getElementById("canvas-jeu");
const ctx = canvas.getContext("2d");
const ecranAccueil = document.getElementById("ecran-accueil");
const ecranGameover = document.getElementById("ecran-gameover");
const scoreFinalEl = document.getElementById("score-final");
const meilleurEl = document.getElementById("meilleur-score-affichage");
const btnMute = document.getElementById("btn-mute");
// ============================================================
//  TAILLE DU CANVAS
// ============================================================
canvas.width = 800;
canvas.height = 300;
// ============================================================
//  CRÉATION DES OBJETS DU JEU
// ============================================================
const dino = new Dino(canvas);
const obstacles = new GestionnaireObstacles(canvas);
const score = new Score();
const pluie = new Pluie(canvas);
const musique = new Musique();
// ============================================================
//  SOL QUI DÉFILE
// ============================================================
const imgSol = new Image();
imgSol.src = "assets/images/sol.png";
let positionSol = 0;
const VITESSE_SOL = 6;
// ============================================================
//  NUAGES EN ARRIÈRE-PLAN
// ============================================================
const imgNuage = new Image();
imgNuage.src = "assets/images/nuage.png";
const nuages = [
    { x: 150, y: 30, vitesse: 1.2 },
    { x: 400, y: 20, vitesse: 0.9 },
    { x: 650, y: 50, vitesse: 1.5 },
];
let etatJeu = "accueil";
let frameId;
// ============================================================
//  DÉMARRER LA SURVEILLANCE THÈME JOUR/NUIT (Membre 5)
// ============================================================
demarrerSurveillanceTheme();
// ============================================================
//  COULEURS SELON LE THÈME
// ============================================================
function getCouleurs() {
    const estNuit = getTheme() === "nuit";
    return {
        cielHaut: estNuit ? "#0a0a2e" : "#87CEEB",
        cielBas: estNuit ? "#1a1a4e" : "#d4f0ff",
        sol: estNuit ? "#3a3a2e" : "#8B7355",
        herbe: estNuit ? "#2a4a2a" : "#5a8a3a",
        texte: estNuit ? "#e0e0e0" : "#333333",
    };
}
// ============================================================
//  DESSIN DU SOL
// ============================================================
function dessinerSol() {
    positionSol -= VITESSE_SOL;
    if (positionSol <= -canvas.width)
        positionSol = 0;
    if (imgSol.complete && imgSol.naturalWidth > 0) {
        ctx.drawImage(imgSol, positionSol, canvas.height - 20, canvas.width, 20);
        ctx.drawImage(imgSol, positionSol + canvas.width, canvas.height - 20, canvas.width, 20);
    }
    else {
        ctx.fillStyle = getCouleurs().sol;
        ctx.fillRect(0, canvas.height - 20, canvas.width, 4);
    }
}
// ============================================================
//  DESSIN DES NUAGES
// ============================================================
function dessinerNuages() {
    for (const nuage of nuages) {
        nuage.x -= nuage.vitesse;
        if (nuage.x + 80 < 0) {
            nuage.x = canvas.width + 50;
            nuage.y = Math.floor(Math.random() * 60) + 20;
        }
        if (imgNuage.complete && imgNuage.naturalWidth > 0) {
            ctx.drawImage(imgNuage, nuage.x, nuage.y, 80, 30);
        }
    }
}
// ============================================================
//  BOUCLE PRINCIPALE — appelée 60 fois par seconde
// ============================================================
function boucleJeu() {
    // 1 — Effacer le canvas avec la couleur du thème
    const c = getCouleurs();
    const degrade = ctx.createLinearGradient(0, 0, 0, canvas.height);
    degrade.addColorStop(0, c.cielHaut);
    degrade.addColorStop(0.75, c.cielBas);
    degrade.addColorStop(1, c.sol);
    ctx.fillStyle = degrade;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = c.herbe;
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    ctx.fillStyle = c.sol;
    ctx.fillRect(0, canvas.height - 15, canvas.width, 15);
    // 2 — Fond : nuages + sol
    dessinerNuages();
    dessinerSol();
    // 3 — Pluie (Membre 6) — derrière le dino
    pluie.mettreAJour();
    pluie.dessiner(ctx);
    // 4 — Dino (Membre 2)
    dino.mettreAJour();
    dino.dessiner(ctx);
    // 5 — Obstacles (Membre 3)
    obstacles.mettreAJour();
    obstacles.dessiner(ctx);
    // 6 — Score (Membre 4)
    const palierAtteint = score.mettreAJour();
    score.dessiner(ctx, canvas);
    // Augmenter la difficulté tous les 100 points
    if (palierAtteint) {
        obstacles.mettreAJourVitesse(score.getValeur());
    }
    // 7 — Détection des collisions
    for (const obs of obstacles.getObstacles()) {
        if (dino.estEnCollision(obs.getHitbox())) {
            terminerPartie();
            return;
        }
    }
    // 8 — Prochaine frame
    frameId = requestAnimationFrame(boucleJeu);
}
// ============================================================
//  DÉMARRER UNE PARTIE
// ============================================================
function demarrerPartie() {
    // Réinitialiser tous les objets
    score.reinitialiser();
    dino.reinitialiser();
    obstacles.reinitialiser();
    positionSol = 0;
    // Cacher les écrans
    ecranAccueil.style.display = "none";
    ecranGameover.style.display = "none";
    etatJeu = "enCours";
    // Lancer la musique (Membre 7)
    musique.relancer();
    // Lancer la boucle
    frameId = requestAnimationFrame(boucleJeu);
}
// ============================================================
//  TERMINER LA PARTIE
// ============================================================
function terminerPartie() {
    etatJeu = "gameOver";
    // Tuer le dino
    dino.mourir();
    cancelAnimationFrame(frameId);
    // Sauvegarder le meilleur score
    score.sauvegarder();
    // Son de collision + arrêt musique (Membre 7)
    musique.gameOver();
    // Afficher l'écran Game Over
    scoreFinalEl.textContent = `Score : ${score.getValeur()}`;
    meilleurEl.textContent = `Meilleur : ${score.getMeilleurScore()}`;
    ecranGameover.style.display = "flex";
}
// ============================================================
//  CONTRÔLES CLAVIER
// ============================================================
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        if (etatJeu === "accueil" || etatJeu === "gameOver") {
            // Lancer ou relancer la partie
            demarrerPartie();
        }
        else if (etatJeu === "enCours") {
            // Son du saut (Membre 7)
            musique.jouerSonSaut();
        }
    }
});
// Relever le dino quand on relâche la flèche bas
document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowDown") {
        dino.seRelever();
    }
});
// ============================================================
//  CONTRÔLES TACTILE (mobile)
// ============================================================
canvas.addEventListener("touchstart", () => {
    if (etatJeu === "accueil" || etatJeu === "gameOver") {
        demarrerPartie();
    }
    else if (etatJeu === "enCours") {
        dino.sauter();
        musique.jouerSonSaut();
    }
});
// ============================================================
//  BOUTON MUTE (Membre 7)
// ============================================================
btnMute.addEventListener("click", () => {
    const estMuet = musique.basculerMute();
    btnMute.textContent = estMuet ? "Son : OFF" : "Son : ON";
});
// ============================================================
//  AFFICHAGE INITIAL avant que la partie commence
// ============================================================
(function dessinerEcranAttente() {
    const c = getCouleurs();
    const degrade = ctx.createLinearGradient(0, 0, 0, canvas.height);
    degrade.addColorStop(0, c.cielHaut);
    degrade.addColorStop(0.75, c.cielBas);
    degrade.addColorStop(1, c.sol);
    ctx.fillStyle = degrade;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = c.herbe;
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    ctx.fillStyle = c.sol;
    ctx.fillRect(0, canvas.height - 15, canvas.width, 15);
    dino.dessiner(ctx);
})();
