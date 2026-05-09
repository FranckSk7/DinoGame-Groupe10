/* ============================================================
   src/meteo.ts — Détection heure réelle & thème jour/nuit
   Membre 5 : Fond jour/nuit
   Branche Git : feature/fond-jour-nuit

   ── Comment fonctionne ce fichier ──
   1. On lit l'heure actuelle avec new Date().getHours()
   2. On décide si c'est le JOUR (6h–18h) ou la NUIT (18h–6h)
   3. On applique la bonne classe CSS sur le <body>
   4. On met à jour un label visible dans l'UI
   5. Un intervalle vérifie le thème toutes les 60 secondes
      → le thème change automatiquement SANS recharger la page
   ============================================================ */
/* ============================================================
   FONCTION 1 : getTheme()
   ──────────────────────────────────────────────────────────
   Rôle : Déterminer le thème à partir de l'heure actuelle.

   Fonctionnement :
   - new Date()          → crée un objet Date avec la date/heure locale
   - .getHours()         → renvoie l'heure sous forme d'entier (0 à 23)
   - Si l'heure est entre 6 (inclus) et 18 (exclu) → JOUR
   - Sinon (18h à 5h59)                             → NUIT

   Retour : "jour" | "nuit"
   ============================================================ */
function getTheme() {
    const heureActuelle = new Date().getHours();
    // 6h → 17h59 = jour | 18h → 5h59 = nuit
    return heureActuelle >= 6 && heureActuelle < 18 ? "jour" : "nuit";
}
/* ============================================================
   FONCTION 2 : appliquerTheme(theme)
   ──────────────────────────────────────────────────────────
   Rôle : Appliquer la classe CSS correspondante sur <body>
          et mettre à jour le label d'affichage.

   Paramètre : theme — "jour" ou "nuit"

   Fonctionnement :
   - document.body.classList.remove(...)
       → Retire les deux classes pour repartir proprement
         et éviter qu'elles coexistent sur le body.
   - document.body.classList.add(`theme-${theme}`)
       → Ajoute la classe "theme-jour" ou "theme-nuit"
         (définie dans style.css) sur la balise <body>.
         C'est ce changement de classe qui déclenche les styles.
   - getElementById("modeLabel")
       → Sélectionne l'élément HTML qui affiche le mode actif.
   - modeLabel.textContent
       → Met à jour le texte visible (ex. "🌞 Mode JOUR" ou "🌙 Mode NUIT").
   ============================================================ */
function appliquerTheme(theme) {
    // 1. Retirer les anciennes classes de thème
    document.body.classList.remove("theme-jour", "theme-nuit");
    // 2. Ajouter la nouvelle classe
    document.body.classList.add(`theme-${theme}`);
    // 3. Mettre à jour le label dans l'UI (optionnel mais recommandé)
    const modeLabel = document.getElementById("modeLabel");
    if (modeLabel) {
        modeLabel.textContent =
            theme === "jour" ? "🌞 Mode JOUR" : "🌙 Mode NUIT";
    }
    // 4. Log en console pour le débogage
    console.log(`[meteo.ts] Thème appliqué : ${theme.toUpperCase()} — Heure : ${new Date().getHours()}h`);
}
/* ============================================================
   FONCTION 3 : mettreAJourTheme()
   ──────────────────────────────────────────────────────────
   Rôle : Orchestrer la détection et l'application du thème.
          C'est la fonction "chef d'orchestre" appelée
          au chargement ET toutes les 60 secondes.

   Fonctionnement :
   - Appelle getTheme() pour connaître le thème approprié.
   - Appelle appliquerTheme() pour l'appliquer visuellement.
   ============================================================ */
function mettreAJourTheme() {
    const theme = getTheme();
    appliquerTheme(theme);
}
/* ============================================================
   FONCTION 4 : demarrerSurveillanceTheme()
   ──────────────────────────────────────────────────────────
   Rôle : Lancer la surveillance automatique du thème.
          Le thème se met à jour SANS recharger la page.

   Fonctionnement :
   - mettreAJourTheme()
       → Applique le thème immédiatement au chargement.
   - setInterval(callback, delai)
       → Exécute `callback` toutes les `delai` millisecondes.
       → 60 000 ms = 60 secondes = 1 minute.
       → Permet de détecter automatiquement le passage 6h/18h.
   ============================================================ */
function demarrerSurveillanceTheme() {
    // Application immédiate dès le chargement de la page
    mettreAJourTheme();
    // Vérification automatique toutes les 60 secondes
    setInterval(mettreAJourTheme, 60000);
}
/* ============================================================
   POINT D'ENTRÉE
   ──────────────────────────────────────────────────────────
   - "DOMContentLoaded" est l'événement déclenché quand le HTML
     est entièrement chargé et analysé par le navigateur.
   - On démarre la surveillance seulement à ce moment-là
     pour être sûr que le <body> et le #modeLabel existent.
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    demarrerSurveillanceTheme();
});
/* ── Exports (pour les autres modules TypeScript du projet) ── */
export { getTheme, appliquerTheme, mettreAJourTheme, demarrerSurveillanceTheme };
