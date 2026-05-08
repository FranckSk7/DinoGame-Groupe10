# Dino Game — Chrome Offline · Groupe 10

### ICT4D L2 · Université de Yaoundé I · 2025 – 2026

> Reproduction du jeu du dinosaure de Google Chrome en **HTML + TypeScript**
> avec musique, score, fond dynamique (jour/nuit) et pluie en temps réel.

-----

## Fonctionnalités du jeu

|Fonctionnalité  |Description                                          |
|----------------|-----------------------------------------------------|
|Dinosaure     |Saute avec `Espace` ou `↑`, se baisse avec `↓`       |
|Obstacles     |Cactus au sol + ptérodactyles en hauteur             |
|Score         |Augmente avec le temps, s’affiche en temps réel      |
|Fond nuit/jour|Détecté automatiquement selon l’heure réelle         |
|Pluie         |Affichée si il pleut réellement (météo en temps réel)|
|Musique       |Son de fond + effets sonores (saut, collision)       |
|Responsive    |Jouable sur mobile et desktop                        |

-----

## Structure du projet

```
DinoGame-Groupe10/
│
├── README.md              ← Ce fichier
├── index.html             ← Page principale du jeu
├── style.css              ← Styles visuels (fond, animations)
│
├── src/
│   ├── main.ts            ← Point d'entrée TypeScript
│   ├── dino.ts            ← Classe Dinosaure
│   ├── obstacle.ts        ← Classe Obstacles
│   ├── score.ts           ← Gestion du score
│   ├── meteo.ts           ← Météo en temps réel (pluie + nuit/jour)
│   ├── pluie.ts           ← Animation de la pluie
│   └── musique.ts         ← Gestion de la musique et sons
│
└── assets/
    ├── images/
    │   ├── dino_normal.png
    │   ├── dino_baisse.png
    │   ├── dino_mort.png
    │   ├── cactus.png
    │   ├── pterodactyle.png
    │   ├── nuage.png
    │   └── sol.png
    └── sons/
        ├── musique_fond.mp3
        ├── saut.mp3
        └── collision.mp3
```

-----

## Répartition des tâches — 8 membres

-----

### Membre 1 — Chef technique · `index.html` + `main.ts`

**Rôle :** Mettre en place la structure de base du projet

**Fichiers à créer :**

- `index.html`
- `src/main.ts`

**Ce qu’il doit faire en détail :**

```
Créer le repo GitHub et inviter les 7 autres en collaborateur
Créer la page HTML avec le canvas du jeu
Lier tous les fichiers TypeScript et CSS
Écrire la boucle principale du jeu dans main.ts :
   - Initialiser le jeu
   - Appeler le dinosaure, les obstacles, le score
   - Détecter Game Over
   - Permettre de relancer le jeu
Merger toutes les Pull Requests des membres
Tester le jeu final
```

**Branche Git :** `feature/structure-principale`

-----

### Membre 2 — Dinosaure · `dino.ts`

**Rôle :** Coder le personnage dinosaure et ses mouvements

**Fichiers à créer :**

- `src/dino.ts`

**Ce qu’il doit faire en détail :**

```
Créer la classe Dino avec :
   - Position X et Y sur le canvas
   - Hauteur du saut (gravité simulée)
   - État : normal / baissé / mort
Coder le saut :
   - Appui sur Espace ou flèche Haut → le dino saute
   - Gravité qui le ramène au sol progressivement
Coder la position baissée :
   - Appui sur flèche Bas → dino se baisse
   - Hitbox réduite quand baissé
Coder la collision :
   - Détecter si le dino touche un obstacle
   - Retourner true si collision
Dessiner le dino sur le canvas selon son état
```

**Branche Git :** `feature/dinosaure`

-----

### Membre 3 — Obstacles · `obstacle.ts`

**Rôle :** Coder les cactus et les ptérodactyles

**Fichiers à créer :**

- `src/obstacle.ts`

**Ce qu’il doit faire en détail :**

```
Créer la classe Obstacle avec :
   - Type : cactus (au sol) ou ptérodactyle (en hauteur)
   - Position X qui diminue (défilement vers la gauche)
   - Vitesse qui augmente avec le score
Coder le défilement :
   - L'obstacle avance vers le dino de droite à gauche
   - Quand il sort de l'écran, il est supprimé
Coder la génération aléatoire :
   - Nouveau obstacle toutes les X secondes (aléatoire)
   - Alterner cactus et ptérodactyle aléatoirement
   - Ptérodactyle apparaît à hauteur variable
Dessiner chaque obstacle sur le canvas
```

**Branche Git :** `feature/obstacles`

-----

### Membre 4 — Score · `score.ts`

**Rôle :** Gérer le score et l’affichage

**Fichiers à créer :**

- `src/score.ts`

**Ce qu’il doit faire en détail :**

```
Créer la classe Score avec :
   - Score qui augmente automatiquement avec le temps
   - Meilleur score (High Score) sauvegardé en localStorage
Afficher le score en haut à droite du canvas
Afficher le High Score à côté
Quand le score atteint 100, 500, 1000 :
   - Augmenter la vitesse du jeu
   - Faire clignoter le score brièvement
Réinitialiser le score quand on relance
Sauvegarder le meilleur score entre les parties
```

**Branche Git :** `feature/score`

-----

### Membre 5 — Fond jour/nuit · `style.css` + `meteo.ts` (partie nuit/jour)

**Rôle :** Détecter l’heure réelle et changer le fond

**Fichiers à modifier/créer :**

- `style.css`
- `src/meteo.ts` (partie nuit/jour uniquement)

**Ce qu’il doit faire en détail :**

```
Récupérer l'heure actuelle avec JavaScript :
   - new Date().getHours()
Règle :
   - 6h → 18h  = JOUR  → fond blanc, texte noir
   - 18h → 6h  = NUIT  → fond noir, texte blanc
Appliquer la bonne classe CSS au body au chargement
Dans style.css, créer les deux thèmes :
   - .theme-jour  { background: white; color: black; }
   - .theme-nuit  { background: #1a1a1a; color: white; }
Adapter aussi la couleur du canvas et des éléments
Le thème doit changer automatiquement sans recharger
```

**Branche Git :** `feature/fond-jour-nuit`

-----

### Membre 6 — Pluie en temps réel · `meteo.ts` + `pluie.ts`

**Rôle :** Détecter la météo réelle et animer la pluie

**Fichiers à créer :**

- `src/pluie.ts`
- Compléter `src/meteo.ts`

**Ce qu’il doit faire en détail :**

```
Appeler l'API météo gratuite OpenWeatherMap :
   - URL : https://api.openweathermap.org/data/2.5/weather
   - Paramètre : ville de Yaoundé
   - Clé API gratuite sur openweathermap.org
Détecter si la météo = pluie :
   - Si weather[0].main === "Rain" → activer la pluie
Dans pluie.ts, animer des gouttes :
   - Dessiner des lignes diagonales qui tombent
   - Vitesse et densité des gouttes
   - Les gouttes s'affichent par-dessus le jeu
Activer/désactiver la pluie selon la météo réelle
Si pas de connexion → pas de pluie (gérer l'erreur)
```

**Branche Git :** `feature/pluie-meteo`

-----

### Membre 7 — Musique et sons · `musique.ts`

**Rôle :** Ajouter la musique de fond et les effets sonores

**Fichiers à créer :**

- `src/musique.ts`
- `assets/sons/musique_fond.mp3`
- `assets/sons/saut.mp3`
- `assets/sons/collision.mp3`

**Ce qu’il doit faire en détail :**

```
Trouver ou créer les fichiers audio :
   - musique_fond.mp3 : musique qui tourne en boucle
   - saut.mp3 : son quand le dino saute
   - collision.mp3 : son quand le dino meurt
Créer la classe Musique avec :
   - jouerMusiqueFond() → lance la musique en boucle
   - arreterMusique() → arrête tout
   - jouerSonSaut() → son du saut
   - jouerSonCollision() → son de la mort
Bouton mute/unmute dans le coin du jeu
La musique s'arrête quand Game Over
La musique reprend quand on relance
```

**Branche Git :** `feature/musique-sons`

-----

### Membre 8 — Images et assets · `assets/`

**Rôle :** Trouver/créer toutes les images du jeu

**Fichiers à créer :**

- Tout le dossier `assets/images/`

**Ce qu’il doit faire en détail :**

```
Trouver ou dessiner ces images (format PNG transparent) :
   - dino_normal.png   → dino debout qui court
   - dino_baisse.png   → dino baissé
   - dino_mort.png     → dino avec les yeux en X
   - cactus.png        → cactus simple
   - pterodactyle.png  → ptérodactyle qui vole
   - nuage.png         → nuage de fond
   - sol.png           → bande du sol qui défile
Taille recommandée :
   - Dino : 80x90px
   - Cactus : 40x60px
   - Ptérodactyle : 80x50px
   - Sol : 2400x20px (pour le défilement)
Mettre toutes les images dans assets/images/
Vérifier que les noms correspondent exactement
Créer aussi une favicon dinosaure pour l'onglet
```

> Tu peux trouver des images libres sur :
> 
> - https://opengameart.org
> - Ou extraire du vrai jeu Chrome (assets libres)

**Branche Git :** `feature/assets-images`

-----

## Workflow Git — Chaque membre suit ces étapes

```bash
# ÉTAPE 1 — Cloner le repo (une seule fois)
git clone https://github.com/CHEF/DinoGame-Groupe10.git
cd DinoGame-Groupe10

# ÉTAPE 2 — Créer sa branche
git checkout -b feature/MA-PARTIE

# ÉTAPE 3 — Faire son travail...

# ÉTAPE 4 — Vérifier ce qu'on a modifié
git status

# ÉTAPE 5 — Ajouter ses fichiers
git add .

# ÉTAPE 6 — Sauvegarder avec un message clair
git commit -m " Ajout : description de ce que j'ai fait"

# ÉTAPE 7 — Envoyer sur GitHub
git push origin feature/MA-PARTIE

# ÉTAPE 8 — Sur GitHub → New Pull Request → prévenir le chef
```

-----

## Suivi global du projet

|#|Membre        |Partie             |Branche                       |Statut |
|-|--------------|-------------------|------------------------------|-------|
|1|Chef technique|Structure + main.ts|`feature/structure-principale`|🔁️     |
|2|Membre 2      |Dinosaure          |`feature/dinosaure`           |✅️     |
|3|Membre 3      |Obstacles          |`feature/obstacles`           |🔁️     |
|4|Membre 4      |Score              |`feature/score`               |⬜     |
|5|Membre 5      |Fond jour/nuit     |`feature/fond-jour-nuit`      |⬜     |
|6|Membre 6      |Pluie météo        |`feature/pluie-meteo`         |⬜     |
|7|Membre 7      |Musique & sons     |`feature/musique-sons`        |⬜     |
|8|Membre 8      |Images & assets    |`feature/assets-images`       |⬜     |


> ✅️Terminé · 🔁️En cours · ◻️Pas commencé

-----

## Règles du groupe

```
Ne jamais pousser directement sur main
Ne pas toucher aux fichiers des autres membres
Ne pas push un fichier vide ou non testé

Créer sa branche AVANT de commencer
Un commit = un message clair en français
Prévenir le chef sur WhatsApp après chaque Pull Request
Poser ses questions dans les Issues GitHub
```
-----

*Projet · Développement Mobile · ICT4D L2 · Groupe 10 · UY1 · 2025-2026*
