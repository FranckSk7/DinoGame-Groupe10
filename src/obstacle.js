// ============================================================
//  obstacle.ts — Membre 3 : Classe Obstacles
//  Projet DinoGame Groupe 10 · ICT4D L2 · UY1 · 2025-2026
// ============================================================
export class Obstacle {
    constructor(canvas, vitesse) {
        this.vitesse = vitesse;
        this.imagesChargees = false;
        // Charger les images une seule fois pour toutes les instances
        if (!Obstacle._imgCactus) {
            Obstacle._imgCactus = new Image();
            Obstacle._imgPtero = new Image();
            Obstacle._imgCactus.src = "assets/images/cactus.png";
            Obstacle._imgPtero.src = "assets/images/pterodactyle.png";
            let nbChargees = 0;
            const onLoad = () => { nbChargees++; if (nbChargees === 2)
                Obstacle._imagesChargees = true; };
            Obstacle._imgCactus.onload = onLoad;
            Obstacle._imgPtero.onload = onLoad;
        }
        this.imgCactus = Obstacle._imgCactus;
        this.imgPtero = Obstacle._imgPtero;
        // Choisir aléatoirement le type d'obstacle
        this.type = Math.random() < 0.4 ? "pterodactyle" : "cactus";
        const SOL = canvas.height - 30; // position du sol
        if (this.type === "cactus") {
            // Cactus : taille variable, positionné au sol
            this.largeur = 40;
            this.hauteur = 40 + Math.random() * 30; // entre 40 et 70px
            this.x = canvas.width + 10;
            this.y = SOL - this.hauteur;
        }
        else {
            // Ptérodactyle : taille fixe, hauteur variable
            this.largeur = 80;
            this.hauteur = 50;
            this.x = canvas.width + 10;
            // Hauteur fixe : bas-milieu (oblige à se baisser)
            this.y = SOL - 90;
        }
    }
    // ----------------------------------------------------------
    //  Hitbox pour la détection de collision
    // ----------------------------------------------------------
    getHitbox() {
        const marge = 8;
        return {
            x: this.x + marge,
            y: this.y + marge,
            largeur: this.largeur - marge * 2,
            hauteur: this.hauteur - marge * 2,
        };
    }
    // ----------------------------------------------------------
    //  Mise à jour (appelée à chaque frame)
    // ----------------------------------------------------------
    mettreAJour() {
        this.x -= this.vitesse;
    }
    // ----------------------------------------------------------
    //  Vérifier si l'obstacle est sorti de l'écran
    // ----------------------------------------------------------
    estHorsEcran() {
        return this.x + this.largeur < 0;
    }
    // ----------------------------------------------------------
    //  Mettre à jour la vitesse (quand le score augmente)
    // ----------------------------------------------------------
    setVitesse(nouvelleVitesse) {
        this.vitesse = nouvelleVitesse;
    }
    // ----------------------------------------------------------
    //  Dessin sur le canvas
    // ----------------------------------------------------------
    dessiner(ctx) {
        if (!Obstacle._imagesChargees) {
            // Dessin de secours si les images ne sont pas encore chargées
            if (this.type === "cactus") {
                ctx.fillStyle = "#1D9E75";
                ctx.fillRect(this.x + this.largeur / 2 - 5, this.y, 10, this.hauteur);
                ctx.fillRect(this.x, this.y + this.hauteur * 0.3, this.largeur, 8);
                ctx.fillRect(this.x, this.y + this.hauteur * 0.2, 10, 18);
                ctx.fillRect(this.x + this.largeur - 10, this.y + this.hauteur * 0.35, 10, 14);
            }
            else {
                ctx.fillStyle = "#534AB7";
                ctx.beginPath();
                ctx.ellipse(this.x + this.largeur / 2, this.y + this.hauteur / 2, this.largeur / 2, this.hauteur / 3, 0, 0, Math.PI * 2);
                ctx.fill();
                // Ailes
                ctx.beginPath();
                ctx.moveTo(this.x + 10, this.y + this.hauteur / 2);
                ctx.lineTo(this.x - 15, this.y);
                ctx.lineTo(this.x + 10, this.y + this.hauteur);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(this.x + this.largeur - 10, this.y + this.hauteur / 2);
                ctx.lineTo(this.x + this.largeur + 15, this.y);
                ctx.lineTo(this.x + this.largeur - 10, this.y + this.hauteur);
                ctx.closePath();
                ctx.fill();
            }
            return;
        }
        // Dessin avec les vraies images PNG
        if (this.type === "cactus") {
            ctx.drawImage(this.imgCactus, this.x, this.y, this.largeur, this.hauteur);
        }
        else {
            ctx.drawImage(this.imgPtero, this.x, this.y, this.largeur, this.hauteur);
        }
    }
}
// --- Chargement images (statique, partagé entre toutes les instances) ---
Obstacle._imgCactus = null;
Obstacle._imgPtero = null;
Obstacle._imagesChargees = false;
// ============================================================
//  Gestionnaire d'obstacles
//  Gère la génération, le défilement et la suppression
// ============================================================
export class GestionnaireObstacles {
    constructor(canvas) {
        this.canvas = canvas;
        this.obstacles = [];
        this.vitesse = 4;
        this.frameDepuisDernier = 0;
        this.intervalleMin = 60;
        this.intervalleMax = 120;
        this.prochaineApparition = this.genererIntervalle();
    }
    genererIntervalle() {
        return Math.floor(this.intervalleMin + Math.random() * (this.intervalleMax - this.intervalleMin));
    }
    // ----------------------------------------------------------
    //  Mise à jour selon le score (vitesse + fréquence)
    // ----------------------------------------------------------
    mettreAJourVitesse(score) {
        this.vitesse = 4 + Math.floor(score / 200) * 0.5;
        // Plus le score est élevé, plus les obstacles arrivent vite
        this.intervalleMin = Math.max(40, 60 - Math.floor(score / 500) * 5);
        this.intervalleMax = Math.max(80, 120 - Math.floor(score / 500) * 5);
    }
    // ----------------------------------------------------------
    //  Mise à jour globale (appelée à chaque frame)
    // ----------------------------------------------------------
    mettreAJour() {
        this.frameDepuisDernier++;
        // Générer un nouvel obstacle si le délai est atteint
        if (this.frameDepuisDernier >= this.prochaineApparition) {
            this.obstacles.push(new Obstacle(this.canvas, this.vitesse));
            this.frameDepuisDernier = 0;
            this.prochaineApparition = this.genererIntervalle();
        }
        // Déplacer tous les obstacles
        this.obstacles.forEach((o) => o.mettreAJour());
        // Supprimer les obstacles hors écran
        this.obstacles = this.obstacles.filter((o) => !o.estHorsEcran());
    }
    // ----------------------------------------------------------
    //  Récupérer la liste des obstacles (pour collision)
    // ----------------------------------------------------------
    getObstacles() {
        return this.obstacles;
    }
    // ----------------------------------------------------------
    //  Dessiner tous les obstacles
    // ----------------------------------------------------------
    dessiner(ctx) {
        this.obstacles.forEach((o) => o.dessiner(ctx));
    }
    // ----------------------------------------------------------
    //  Réinitialiser (nouveau jeu)
    // ----------------------------------------------------------
    reinitialiser() {
        this.obstacles = [];
        this.vitesse = 4;
        this.frameDepuisDernier = 0;
        this.prochaineApparition = this.genererIntervalle();
        this.intervalleMin = 60;
        this.intervalleMax = 120;
    }
}
