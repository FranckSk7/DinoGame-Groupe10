// ============================================================
//  dino.ts — Membre 2 : Classe Dinosaure
//  Projet DinoGame Groupe 10 · ICT4D L2 · UY1 · 2025-2026
// ============================================================
export class Dino {
    constructor(canvas) {
        // Position initiale
        this.x = 80;
        this.solY = canvas.height - 100; // marge depuis le bas du canvas
        this.y = this.solY;
        // Dimensions normales
        this.largeur = 80;
        this.hauteur = 90;
        // Physique du saut
        this.vitesseSaut = 0;
        this.gravite = 0.6;
        this.enAir = false;
        // État initial
        this.etat = "normal";
        // Chargement des images
        this.imagesChargees = false;
        this.imgNormal = new Image();
        this.imgBaisse = new Image();
        this.imgMort = new Image();
        this.imgNormal.src = "assets/images/dino_normal.png";
        this.imgBaisse.src = "assets/images/dino_baisse.png";
        this.imgMort.src = "assets/images/dino_mort.png";
        // Signaler quand toutes les images sont prêtes
        let nbChargees = 0;
        const onLoad = () => {
            nbChargees++;
            if (nbChargees === 3)
                this.imagesChargees = true;
        };
        this.imgNormal.onload = onLoad;
        this.imgBaisse.onload = onLoad;
        this.imgMort.onload = onLoad;
        // Écouter les touches du clavier
        document.addEventListener("keydown", (e) => this.gererTouche(e));
    }
    // ----------------------------------------------------------
    //  Gestion des touches clavier
    // ----------------------------------------------------------
    gererTouche(e) {
        if (this.etat === "mort")
            return; // plus d'action si mort
        if ((e.code === "Space" || e.code === "ArrowUp") && !this.enAir) {
            this.sauter();
        }
        if (e.code === "ArrowDown") {
            this.baisser();
        }
    }
    // ----------------------------------------------------------
    //  Saut
    // ----------------------------------------------------------
    sauter() {
        if (this.enAir || this.etat === "mort")
            return;
        this.vitesseSaut = -15; // vitesse initiale vers le haut (négatif = vers le haut)
        this.enAir = true;
        this.etat = "normal";
    }
    // ----------------------------------------------------------
    //  Position baissée
    // ----------------------------------------------------------
    baisser() {
        if (this.etat === "mort")
            return;
        if (this.enAir) {
            // Chute rapide si en l'air
            this.vitesseSaut = 8;
        }
        else {
            this.etat = "baisse";
        }
    }
    // ----------------------------------------------------------
    //  Se relever (appelé quand ArrowDown est relâché)
    // ----------------------------------------------------------
    seRelever() {
        if (this.etat === "baisse") {
            this.etat = "normal";
        }
    }
    // ----------------------------------------------------------
    //  Mise à jour (appelée à chaque frame)
    // ----------------------------------------------------------
    mettreAJour() {
        if (this.etat === "mort")
            return;
        // Appliquer la gravité si en l'air
        if (this.enAir) {
            this.vitesseSaut += this.gravite;
            this.y += this.vitesseSaut;
            // Touche le sol
            if (this.y >= this.solY) {
                this.y = this.solY;
                this.vitesseSaut = 0;
                this.enAir = false;
                // Revenir à l'état normal si on était en train de descendre baissé
                if (this.etat !== "baisse") {
                    this.etat = "normal";
                }
            }
        }
    }
    // ----------------------------------------------------------
    //  Hitbox selon l'état (pour la détection de collision)
    // ----------------------------------------------------------
    getHitbox() {
        const marge = 10; // marge pour rendre la collision plus indulgente
        if (this.etat === "baisse") {
            // Dino baissé : plus large, moins haut
            return {
                x: this.x + marge,
                y: this.y + this.hauteur / 2, // milieu vertical
                largeur: this.largeur - marge * 2,
                hauteur: this.hauteur / 2 - marge,
            };
        }
        // Dino debout
        return {
            x: this.x + marge,
            y: this.y + marge,
            largeur: this.largeur - marge * 2,
            hauteur: this.hauteur - marge * 2,
        };
    }
    // ----------------------------------------------------------
    //  Détection de collision avec un obstacle
    // ----------------------------------------------------------
    estEnCollision(obstacle) {
        const hb = this.getHitbox();
        return (hb.x < obstacle.x + obstacle.largeur &&
            hb.x + hb.largeur > obstacle.x &&
            hb.y < obstacle.y + obstacle.hauteur &&
            hb.y + hb.hauteur > obstacle.y);
    }
    // ----------------------------------------------------------
    //  Mort du dinosaure
    // ----------------------------------------------------------
    mourir() {
        this.etat = "mort";
    }
    // ----------------------------------------------------------
    //  Réinitialisation pour relancer la partie
    // ----------------------------------------------------------
    reinitialiser() {
        this.y = this.solY;
        this.vitesseSaut = 0;
        this.enAir = false;
        this.etat = "normal";
    }
    // ----------------------------------------------------------
    //  Dessin sur le canvas
    // ----------------------------------------------------------
    dessiner(ctx) {
        if (!this.imagesChargees) {
            // Dessin de secours (rectangle) si les images ne sont pas encore chargées
            ctx.fillStyle = this.etat === "mort" ? "#e74c3c" : "#2ecc71";
            const h = this.etat === "baisse" ? this.hauteur / 2 : this.hauteur;
            const yDraw = this.etat === "baisse" ? this.y + this.hauteur / 2 : this.y;
            ctx.fillRect(this.x, yDraw, this.largeur, h);
            return;
        }
        if (this.etat === "baisse") {
            // Dino baissé : moitié hauteur, positionné en bas
            ctx.drawImage(this.imgBaisse, this.x, this.y + this.hauteur / 2, this.largeur, this.hauteur / 2);
        }
        else if (this.etat === "mort") {
            ctx.drawImage(this.imgMort, this.x, this.y, this.largeur, this.hauteur);
        }
        else {
            ctx.drawImage(this.imgNormal, this.x, this.y, this.largeur, this.hauteur);
        }
    }
}
