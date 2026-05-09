// ============================================================
//  score.ts — Membre 4 : Gestion du score
//  Projet DinoGame Groupe 10 · ICT4D L2 · UY1 · 2025-2026
// ============================================================
export class Score {
    constructor() {
        // --- Vitesse d'augmentation du score ---
        this.FRAMES_PAR_POINT = 6; // 1 point toutes les 6 frames
        // --- Clé localStorage pour sauvegarder le meilleur score ---
        this.CLE_STOCKAGE = "dinoGame_meilleurScore";
        this.valeur = 0;
        this.compteurFrames = 0;
        // Charger le meilleur score depuis le stockage local
        const stocke = localStorage.getItem(this.CLE_STOCKAGE);
        this.meilleurScore = stocke ? parseInt(stocke) : 0;
    }
    // ----------------------------------------------------------
    //  Mise à jour — appelée à chaque frame
    //  Retourne true si le score vient de franchir un palier
    // ----------------------------------------------------------
    mettreAJour() {
        this.compteurFrames++;
        if (this.compteurFrames >= this.FRAMES_PAR_POINT) {
            this.valeur++;
            this.compteurFrames = 0;
            // Vérifier si on franchit un palier (100, 200, 300...)
            if (this.valeur % 100 === 0) {
                return true; // signal pour augmenter la difficulté
            }
        }
        return false;
    }
    // ----------------------------------------------------------
    //  Retourner le score actuel
    // ----------------------------------------------------------
    getValeur() {
        return this.valeur;
    }
    // ----------------------------------------------------------
    //  Retourner le meilleur score
    // ----------------------------------------------------------
    getMeilleurScore() {
        return this.meilleurScore;
    }
    // ----------------------------------------------------------
    //  Sauvegarder le meilleur score si battu
    // ----------------------------------------------------------
    sauvegarder() {
        if (this.valeur > this.meilleurScore) {
            this.meilleurScore = this.valeur;
            localStorage.setItem(this.CLE_STOCKAGE, this.meilleurScore.toString());
        }
    }
    // ----------------------------------------------------------
    //  Réinitialiser pour une nouvelle partie
    // ----------------------------------------------------------
    reinitialiser() {
        this.valeur = 0;
        this.compteurFrames = 0;
    }
    // ----------------------------------------------------------
    //  Dessiner le score sur le canvas
    // ----------------------------------------------------------
    dessiner(ctx, canvas) {
        ctx.save(); // sauvegarder le contexte avant modification
        ctx.font = "bold 18px monospace";
        ctx.textAlign = "right";
        // Couleur selon le thème (jour = sombre, nuit = clair)
        const estNuit = document.body.classList.contains("theme-nuit");
        ctx.fillStyle = estNuit ? "#e0e0e0" : "#535353";
        // Score actuel
        ctx.fillText(`Score : ${this.valeur}`, canvas.width - 20, 30);
        // Meilleur score
        ctx.fillText(`Meilleur : ${this.meilleurScore}`, canvas.width - 20, 54);
        ctx.restore(); // restaurer le contexte
    }
}
