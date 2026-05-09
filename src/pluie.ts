// ============================================================
//  pluie.ts — Membre 6 : Pluie en temps réel
//  Projet DinoGame Groupe 10 · ICT4D L2 · UY1 · 2025-2026
// ============================================================

// ============================================================
//  CLASSE GOUTTE — une seule goutte de pluie
// ============================================================

class Goutte {

  x: number;       // position horizontale
  y: number;       // position verticale
  vitesse: number; // vitesse de chute
  longueur: number;// longueur de la goutte
  opacite: number; // transparence

  constructor(largeurCanvas: number, hauteurCanvas: number) {
    // Position aléatoire sur toute la largeur
    this.x = Math.random() * largeurCanvas;

    // Départ depuis le haut (légèrement au-dessus)
    this.y = Math.random() * hauteurCanvas - hauteurCanvas;

    // Vitesse et taille aléatoires pour un effet naturel
    this.vitesse  = 4 + Math.random() * 6;
    this.longueur = 10 + Math.random() * 15;
    this.opacite  = 0.3 + Math.random() * 0.5;
  }

  // ----------------------------------------------------------
  //  Mise à jour — faire tomber la goutte
  // ----------------------------------------------------------
  mettreAJour(hauteurCanvas: number): void {
    this.y += this.vitesse;

    // Remettre en haut quand la goutte sort par le bas
    if (this.y > hauteurCanvas) {
      this.y = -this.longueur;
    }
  }

  // ----------------------------------------------------------
  //  Dessiner la goutte
  // ----------------------------------------------------------
  dessiner(ctx: CanvasRenderingContext2D, estNuit: boolean): void {
    ctx.save();

    // Couleur de la pluie selon le thème
    const couleur = estNuit ? "180, 220, 255" : "100, 150, 200";
    ctx.strokeStyle = `rgba(${couleur}, ${this.opacite})`;
    ctx.lineWidth = 1;

    // Dessiner une ligne légèrement inclinée (vent léger)
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - 2, this.y + this.longueur); // légère inclinaison
    ctx.stroke();

    ctx.restore();
  }
}
// ============================================================
//  CLASSE PLUIE — gère toutes les gouttes + météo en temps réel
// ============================================================

export class Pluie {

  private gouttes: Goutte[];
  private canvas: HTMLCanvasElement;
  private active: boolean;

  // Clé API OpenWeatherMap (gratuite sur openweathermap.org)
  // Remplacer par ta propre clé après inscription
  private readonly CLE_API = "25bfb7dac361fb9dc5e72df87d8a63d1";

  // Ville pour la météo en temps réel
  private readonly VILLE = "Yaounde,CM";

  // Intervalle entre deux vérifications météo (10 minutes)
  private readonly INTERVALLE_METEO_MS = 10 * 60 * 1000;

  // Nombre de gouttes affichées
  private readonly NB_GOUTTES = 150;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.active = false;
    this.gouttes = [];

    // Créer toutes les gouttes (inactives au départ)
    for (let i = 0; i < this.NB_GOUTTES; i++) {
      this.gouttes.push(new Goutte(canvas.width, canvas.height));
    }

    // Vérifier la météo au démarrage
    this.verifierMeteo();

    // Re-vérifier toutes les 10 minutes
    setInterval(() => this.verifierMeteo(), this.INTERVALLE_METEO_MS);
  }

  // ----------------------------------------------------------
  //  Appel à l'API météo OpenWeatherMap
  // ----------------------------------------------------------
  private async verifierMeteo(): Promise<void> {

    // Si pas de clé API valide, ne pas appeler l'API
    if (this.CLE_API === "VOTRE_CLE_API_ICI") {
      console.warn("[pluie.ts] Clé API manquante — pluie désactivée.");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather`
        + `?q=${this.VILLE}`
        + `&appid=${this.CLE_API}`
        + `&lang=fr`;

      const reponse = await fetch(url);

      if (!reponse.ok) {
        throw new Error(`Erreur API : ${reponse.status}`);
      }

      const donnees = await reponse.json();

      // La météo principale est dans weather[0].main
      const meteo: string = donnees.weather[0].main;

      console.log(`[pluie.ts] Météo actuelle : ${meteo}`);

      // Activer la pluie si la météo est de la pluie
      if (meteo === "Rain" || meteo === "Drizzle" || meteo === "Thunderstorm") {
        this.activer();
      } else {
        this.desactiver();
      }

    } catch (erreur) {
      // En cas d'erreur réseau, désactiver la pluie silencieusement
      console.warn("[pluie.ts] Impossible de récupérer la météo :", erreur);
      this.desactiver();
    }
  }

  // ----------------------------------------------------------
  //  Activer la pluie
  // ----------------------------------------------------------
  activer(): void {
    this.active = true;
    console.log("[pluie.ts] Pluie activée.");
  }

  // ----------------------------------------------------------
  //  Désactiver la pluie
  // ----------------------------------------------------------
  desactiver(): void {
    this.active = false;
    console.log("[pluie.ts] Pluie désactivée.");
  }

  // ----------------------------------------------------------
  //  Savoir si la pluie est active (pour main.ts)
  // ----------------------------------------------------------
  estActive(): boolean {
    return this.active;
  }

  // ----------------------------------------------------------
  //  Mise à jour — appelée à chaque frame
  // ----------------------------------------------------------
  mettreAJour(): void {
    if (!this.active) return;

    for (const goutte of this.gouttes) {
      goutte.mettreAJour(this.canvas.height);
    }
  }

  // ----------------------------------------------------------
  //  Dessiner toutes les gouttes
  // ----------------------------------------------------------
  dessiner(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    const estNuit = document.body.classList.contains("theme-nuit");

    for (const goutte of this.gouttes) {
      goutte.dessiner(ctx, estNuit);
    }
  }
}
