/**
 * musique.ts — Gestion de la musique et des effets sonores
 * Jeu du Dinosaure Chrome — Membre 7
 * Branche : feature/musique-sons
 */
export class Musique {
    constructor() {
        this.sourceMusiqueFond = null;
        this.buffers = new Map();
        this.estMuet = false;
        this.musiqueFondActive = false;
        // Chemins vers les fichiers audio
        this.CHEMINS = {
            musiqueFond: "assets/sons/musique_fond.mp3",
            saut: "assets/sons/saut.mp3",
            collision: "assets/sons/collision.mp3",
        };
        // Création du contexte audio (compatible tous navigateurs)
        this.contexteAudio = new (window.AudioContext ||
            window.webkitAudioContext)();
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
    async _chargerSon(cle, chemin) {
        try {
            const reponse = await fetch(chemin);
            if (!reponse.ok) {
                throw new Error(`Fichier introuvable : ${chemin}`);
            }
            const donneesBrutes = await reponse.arrayBuffer();
            const buffer = await this.contexteAudio.decodeAudioData(donneesBrutes);
            this.buffers.set(cle, buffer);
            console.log(`✅ Son chargé : ${cle}`);
        }
        catch (erreur) {
            console.warn(`⚠️ Impossible de charger "${chemin}" :`, erreur);
            // On continue sans bloquer le jeu
        }
    }
    /**
     * Pré-charge tous les sons en parallèle.
     */
    async _prechargerTousSons() {
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
    _jouerBuffer(cle, volume = 1) {
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
    jouerMusiqueFond() {
        if (this.musiqueFondActive)
            return;
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
    arreterMusique() {
        if (this.sourceMusiqueFond) {
            try {
                this.sourceMusiqueFond.stop();
            }
            catch (_) {
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
    jouerSonSaut() {
        this._jouerBuffer("saut", 0.8);
    }
    /**
     * Joue le son de collision / mort du dinosaure.
     */
    jouerSonCollision() {
        this._jouerBuffer("collision", 1.0);
    }
    // ─────────────────────────────────────────────
    //  MUTE / UNMUTE
    // ─────────────────────────────────────────────
    /**
     * Bascule entre muet et son activé.
     * @returns true si le son est maintenant muet
     */
    basculerMute() {
        this.estMuet = !this.estMuet;
        this.gainPrincipal.gain.setTargetAtTime(this.estMuet ? 0 : 1, this.contexteAudio.currentTime, 0.05 // transition douce de 50 ms
        );
        console.log(this.estMuet ? "🔕 Son coupé." : "🔔 Son activé.");
        return this.estMuet;
    }
    /**
     * Indique si le son est actuellement coupé.
     */
    estEnModeMuet() {
        return this.estMuet;
    }
    // ─────────────────────────────────────────────
    //  CYCLE DE VIE DU JEU
    // ─────────────────────────────────────────────
    /**
     * À appeler lors du Game Over :
     * joue le son de collision puis arrête la musique.
     */
    gameOver() {
        this.jouerSonCollision();
        // Petit délai pour laisser le son de collision se finir
        setTimeout(() => this.arreterMusique(), 600);
    }
    /**
     * À appeler quand le joueur relance une partie.
     */
    relancer() {
        this.arreterMusique(); // sécurité : stoppe l'ancienne source
        this.jouerMusiqueFond();
    }
    /**
     * Libère les ressources audio (à appeler si la page est détruite).
     */
    detruire() {
        this.arreterMusique();
        this.contexteAudio.close();
    }
}
