// ============================================================
//  dino.ts — Membre 2 : Classe Dinosaure
//  Projet DinoGame Groupe 10 · ICT4D L2 · UY1 · 2025-2026
// ============================================================

/** États possibles du dinosaure */
type EtatDino = "normal" | "baisse" | "mort";

export class Dino {
  // --- Position ---
  x: number;
  y: number;

  // --- Dimensions ---
  largeur: number;
  hauteur: number;

  // --- Saut ---
  private vitesseSaut: number;
  private gravite: number;
  private enAir: boolean;
  private solY: number; // position Y du sol (bas du dino)

  // --- État ---
  etat: EtatDino;

  // --- Images ---
  private imgNormal: HTMLImageElement;
  private imgBaisse: HTMLImageElement;
  private imgMort: HTMLImageElement;
  private imagesChargees: boolean;

  constructor(canvas: HTMLCanvasElement) {
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
      if (nbChargees === 3) this.imagesChargees = true;
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
  private gererTouche(e: KeyboardEvent): void {
    if (this.etat === "mort") return; // plus d'action si mort

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
  sauter(): void {
    if (this.enAir || this.etat === "mort") return;
    this.vitesseSaut = -15; // vitesse initiale vers le haut (négatif = vers le haut)
    this.enAir = true;
    this.etat = "normal";
  }

  // ----------------------------------------------------------
  //  Position baissée
  // ----------------------------------------------------------
  baisser(): void {
    if (this.etat === "mort") return;

    if (this.enAir) {
      // Chute rapide si en l'air
      this.vitesseSaut = 8;
    } else {
      this.etat = "baisse";
    }
  }

  // ----------------------------------------------------------
  //  Se relever (appelé quand ArrowDown est relâché)
  // ----------------------------------------------------------
  seRelever(): void {
    if (this.etat === "baisse") {
      this.etat = "normal";
    }
  }

  // ----------------------------------------------------------
  //  Mise à jour (appelée à chaque frame)
  // ----------------------------------------------------------
  mettreAJour(): void {
    if (this.etat === "mort") return;

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
  getHitbox(): { x: number; y: number; largeur: number; hauteur: number } {
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
  estEnCollision(obstacle: {
    x: number;
    y: number;
    largeur: number;
    hauteur: number;
  }): boolean {
    const hb = this.getHitbox();

    return (
      hb.x < obstacle.x + obstacle.largeur &&
      hb.x + hb.largeur > obstacle.x &&
      hb.y < obstacle.y + obstacle.hauteur &&
      hb.y + hb.hauteur > obstacle.y
    );
  }

  // ----------------------------------------------------------
  //  Mort du dinosaure
  // ----------------------------------------------------------
  mourir(): void {
    this.etat = "mort";
  }

  // ----------------------------------------------------------
  //  Réinitialisation pour relancer la partie
  // ----------------------------------------------------------
  reinitialiser(): void {
    this.y = this.solY;
    this.vitesseSaut = 0;
    this.enAir = false;
    this.etat = "normal";
  }

  // ----------------------------------------------------------
  //  Dessin sur le canvas
  // ----------------------------------------------------------
  dessiner(ctx: CanvasRenderingContext2D): void {
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
      ctx.drawImage(
        this.imgBaisse,
        this.x,
        this.y + this.hauteur / 2,
        this.largeur,
        this.hauteur / 2
      );
    } else if (this.etat === "mort") {
      ctx.drawImage(this.imgMort, this.x, this.y, this.largeur, this.hauteur);
    } else {
      ctx.drawImage(this.imgNormal, this.x, this.y, this.largeur, this.hauteur);
    }
  }
}

// ca la c'est ce que tu vas ajouter dans le main.ts pour l'integration


/* import { Dino } from "./dino";

const dino = new Dino(canvas);

// Dans la boucle de jeu :
dino.mettreAJour();
dino.dessiner(ctx);

// Pour détecter la collision avec un obstacle :
if (dino.estEnCollision(obstacle.getHitbox())) {
    dino.mourir();
}

// Pour relancer :
dino.reinitialiser(); */