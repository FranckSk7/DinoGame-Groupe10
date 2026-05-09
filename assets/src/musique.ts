/**
 * musique.ts — Gestion de la musique et des effets sonores
 * Jeu du Dinosaure Chrome — Membre 7
 * Branche : feature/musique-sons
 */

export class Musique {
  private contexteAudio: AudioContext;
  private gainPrincipal: GainNode;
  private sourceMusiqueFond: AudioBufferSourceNode | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private estMuet: boolean = false;
  private musiqueFondActive: boolean = false;

  // Chemins vers les fichiers audio
  private readonly CHEMINS = {
    musiqueFond: "assets/sons/musique_fond.mp3",
    saut: "assets/sons/saut.mp3",
    collision: "assets/sons/collision.mp3",
  };

  constructor() {
    // Création du contexte audio (compatible tous navigateurs)
    this.contexteAudio = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    // Nœud de gain principal (contrôle du volume global / mute)
    this.gainPrincipal = this.contexteAudio.createGain();
    this.gainPrincipal.gain.value = 1;
    this.gainPrincipal.connect(this.contexteAudio.destination);

    // Pré-charger tous les sons au démarrage
    this._prechargerTousSons();
  }

  // ─────────────────────────────────────────────
  //  CHARGEMENT
  // ─────────────────────────────────────────────

  /**
   * Charge un fichier audio et le stocke dans le cache.
   */
  private async _chargerSon(cle: string, chemin: string): Promise<void> {
    try {
      const reponse = await fetch(chemin);
      if (!reponse.ok) {
        throw new Error(`Fichier introuvable : ${chemin}`);
      }
      const donneesBrutes = await reponse.arrayBuffer();
      const buffer = await this.contexteAudio.decodeAudioData(donneesBrutes);
      this.buffers.set(cle, buffer);
      console.log(`✅ Son chargé : ${cle}`);
    } catch (erreur) {
      console.warn(`⚠️ Impossible de charger "${chemin}" :`, erreur);
      // On continue sans bloquer le jeu
    }
  }

  /**
   * Pré-charge tous les sons en parallèle.
   */
  private async _prechargerTousSons(): Promise<void> {
    await Promise.all([
      this._chargerSon("musiqueFond", this.CHEMINS.musiqueFond),
      this._chargerSon("saut", this.CHEMINS.saut),
      this._chargerSon("collision", this.CHEMINS.collision),
    ]);
    console.log("🎵 Tous les sons sont prêts.");
  }

  // ─────────────────────────────────────────────
  //  LECTURE
  // ─────────────────────────────────────────────

  /**
   * Joue un son en one-shot (saut, collision…).
   */
  private _jouerBuffer(cle: string, volume: number = 1): void {
    const buffer = this.buffers.get(cle);
    if (!buffer) {
      console.warn(`Son "${cle}" non disponible.`);
      return;
    }

    // Reprendre le contexte si suspendu (politique navigateur)
    if (this.contexteAudio.state === "suspended") {
      this.contexteAudio.resume();
    }

    const source = this.contexteAudio.createBufferSource();
    const gainLocal = this.contexteAudio.createGain();
    gainLocal.gain.value = volume;

    source.buffer = buffer;
    source.connect(gainLocal);
    gainLocal.connect(this.gainPrincipal);
    source.start(0);
  }

  // ─────────────────────────────────────────────
  //  API PUBLIQUE
  // ─────────────────────────────────────────────

  /**
   * Lance la musique de fond en boucle.
   * Si elle est déjà en cours, ne fait rien.
   */
  jouerMusiqueFond(): void {
    if (this.musiqueFondActive) return;

    const buffer = this.buffers.get("musiqueFond");
    if (!buffer) {
      console.warn("Musique de fond non disponible.");
      return;
    }

    if (this.contexteAudio.state === "suspended") {
      this.contexteAudio.resume();
    }

    // Créer une nouvelle source (les sources ne sont pas réutilisables)
    this.sourceMusiqueFond = this.contexteAudio.createBufferSource();
    const gainFond = this.contexteAudio.createGain();
    gainFond.gain.value = 0.4; // Volume musique fond plus discret

    this.sourceMusiqueFond.buffer = buffer;
    this.sourceMusiqueFond.loop = true; // ← boucle infinie
    this.sourceMusiqueFond.connect(gainFond);
    gainFond.connect(this.gainPrincipal);
    this.sourceMusiqueFond.start(0);

    this.musiqueFondActive = true;
    console.log("🎶 Musique de fond lancée.");
  }

  /**
   * Arrête complètement la musique de fond.
   */
  arreterMusique(): void {
    if (this.sourceMusiqueFond) {
      try {
        this.sourceMusiqueFond.stop();
      } catch (_) {
        // Déjà arrêtée
      }
      this.sourceMusiqueFond = null;
    }
    this.musiqueFondActive = false;
    console.log("🔇 Musique arrêtée.");
  }

  /**
   * Joue le son du saut du dinosaure.
   */
  jouerSonSaut(): void {
    this._jouerBuffer("saut", 0.8);
  }

  /**
   * Joue le son de collision / mort du dinosaure.
   */
  jouerSonCollision(): void {
    this._jouerBuffer("collision", 1.0);
  }

  // ─────────────────────────────────────────────
  //  MUTE / UNMUTE
  // ─────────────────────────────────────────────

  /**
   * Bascule entre muet et son activé.
   * @returns true si le son est maintenant muet
   */
  basculerMute(): boolean {
    this.estMuet = !this.estMuet;
    this.gainPrincipal.gain.setTargetAtTime(
      this.estMuet ? 0 : 1,
      this.contexteAudio.currentTime,
      0.05 // transition douce de 50 ms
    );
    console.log(this.estMuet ? "🔕 Son coupé." : "🔔 Son activé.");
    return this.estMuet;
  }

  /**
   * Indique si le son est actuellement coupé.
   */
  estEnModeMuet(): boolean {
    return this.estMuet;
  }

  // ─────────────────────────────────────────────
  //  CYCLE DE VIE DU JEU
  // ─────────────────────────────────────────────

  /**
   * À appeler lors du Game Over :
   * joue le son de collision puis arrête la musique.
   */
  gameOver(): void {
    this.jouerSonCollision();
    // Petit délai pour laisser le son de collision se finir
    setTimeout(() => this.arreterMusique(), 600);
  }

  /**
   * À appeler quand le joueur relance une partie.
   */
  relancer(): void {
    this.arreterMusique(); // sécurité : stoppe l'ancienne source
    this.jouerMusiqueFond();
  }

  /**
   * Libère les ressources audio (à appeler si la page est détruite).
   */
  detruire(): void {
    this.arreterMusique();
    this.contexteAudio.close();
  }
}