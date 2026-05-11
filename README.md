# 🧺 GestionPressing — Application de gestion de pressing
 
> Application web de gestion complète d'un pressing : clients, vêtements, statuts, paiements, stock et tableau de bord.
> Développée en **React + TypeScript**, avec stockage local via **IndexedDB**.
 
---
 
## 👥 Équipe (8 membres)
 
| Rôle | Responsabilité |
|------|----------------|
| 👤 Chef de projet | Coordination, Git/GitHub, tests finaux, documentation |
| 👤 Dev IndexedDB | Schéma IndexedDB, stores, hooks de données |
| 👤 Dev logique métier | Services TypeScript, types/interfaces, CRUD |
| 👤 Dev Clients + Vêtements | Pages et formulaires clients et vêtements |
| 👤 Dev Statuts + Paiements | Workflow statuts, factures, modes de paiement |
| 👤 Dev Dashboard + Stock | Graphiques, statistiques, alertes stock |
| 👤 UI / Design | Login, navigation, design responsive, composants partagés |
 
---
 
## 📦 Modules de l'application
 
### 1. Gestion des clients
- Ajouter, modifier, supprimer un client
- Rechercher un client
- Voir l'historique des vêtements d'un client
### 2. Gestion des vêtements
- Enregistrer un vêtement (type, couleur, description)
- Associer un vêtement à un client
- Date de dépôt automatique
### 3. Statuts des vêtements
- Workflow : **En attente → En lavage → Prêt → Récupéré**
- Modifier le statut d'un vêtement
- Historique des changements de statut
### 4. Paiements
- Enregistrer un paiement (montant, mode, date)
- Générer une facture
- Visualiser les vêtements payés / non payés
### 5. Dashboard / Statistiques
- Nombre de vêtements en cours
- Revenus du jour / de la semaine
- Clients récents
- Activité globale avec graphiques
### 6. Gestion du stock
- Liste des produits de lavage
- Quantités disponibles
- Alertes de stock faible
---
 
## 🗃️ Modèle de données — IndexedDB
 
Les données sont stockées directement dans le navigateur via IndexedDB (pas de serveur, pas de base SQL).
 
```typescript
// src/db/schema.ts
 
interface Client {
  id: string;           // UUID généré côté frontend
  nom: string;
  telephone: string;
  adresse: string;
}
 
interface Vetement {
  id: string;
  type: string;
  couleur: string;
  description: string;
  dateDepot: string;
  idClient: string;
  idStatut: StatutVetement;
}
 
type StatutVetement = 'en_attente' | 'en_lavage' | 'pret' | 'recupere';
 
interface Paiement {
  id: string;
  montant: number;
  datePaiement: string;
  modePaiement: 'Espèces' | 'Mobile Money' | 'Carte';
  idVetement: string;
}
 
interface ProduitStock {
  id: string;
  nomProduit: string;
  quantite: number;
  seuilAlerte: number;
}
```
 
---
 
## 🏗️ Structure du projet
 
```
gestion-pressing/
├── public/
├── src/
│   ├── db/                    ← Couche IndexedDB
│   │   ├── index.ts           ← Initialisation de la base
│   │   ├── schema.ts          ← Types et interfaces
│   │   └── hooks/             ← Hooks React pour lire/écrire les données
│   │       ├── useClients.ts
│   │       ├── useVetements.ts
│   │       ├── usePaiements.ts
│   │       └── useStock.ts
│   ├── components/            ← Composants réutilisables
│   │   ├── Layout/
│   │   ├── Navbar/
│   │   └── ui/
│   ├── pages/                 ← Une page par module
│   │   ├── Clients/
│   │   ├── Vetements/
│   │   ├── Statuts/
│   │   ├── Paiements/
│   │   ├── Stock/
│   │   ├── Dashboard/
│   │   └── Login/
│   ├── types/
│   │   └── index.ts           ← Types TypeScript partagés
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```
 
---
 
## 🚀 Installation et démarrage
 
### Prérequis
- Node.js version 18 ou plus → https://nodejs.org
- Git → https://git-scm.com
### Cloner et démarrer
 
```bash
# 1. Cloner le dépôt
git clone https://github.com/proeyebe-dev/gestion-pressing.git
 
# 2. Entrer dans le dossier
cd gestion-pressing
 
# 3. Installer les dépendances
npm install
 
# 4. Lancer en développement
npm run dev
```
 
L'application sera disponible sur http://localhost:5173
 
---
 
## 🛠️ Technologies utilisées
 
| Couche | Technologie |
|--------|-------------|
| Framework | React 18 |
| Langage | TypeScript |
| Stockage | IndexedDB (navigateur) |
| Lib IndexedDB | idb |
| Routing | React Router DOM |
| Graphiques | Recharts |
| Styles | Tailwind CSS |
| Build | Vite |
| Versioning | Git + GitHub |
 
### Installer toutes les dépendances du projet
 
```bash
npm install idb react-router-dom recharts
npm install -D tailwindcss @types/recharts
```
 
---
 
## 🌿 Branches Git — une branche par membre
 
```bash
git checkout -b feature/gestion-clients
git checkout -b feature/gestion-vetements
git checkout -b feature/gestion-statuts
git checkout -b feature/gestion-paiements
git checkout -b feature/dashboard-stock
git checkout -b feature/ui-design
git checkout -b feature/indexeddb-schema
git checkout -b feature/logique-metier
```
 
---
 
## 🔄 Workflow quotidien
 
```bash
# 1. Mettre à jour depuis main
git pull origin main
 
# 2. Aller sur sa branche
git checkout feature/ma-branche
 
# 3. Sauvegarder son travail
git add .
git commit -m "Description claire du travail fait"
 
# 4. Envoyer sur GitHub
git push origin feature/ma-branche
 
# 5. Créer une Pull Request sur GitHub quand le module est prêt
```
 
---
 
## ✅ Règles de l'équipe
 
- Ne jamais coder directement sur `main`
- Toute fusion dans `main` passe par une Pull Request validée par le chef de projet
- Les types partagés sont définis dans `src/types/index.ts` — ne pas dupliquer les interfaces
- Commits clairs : `Ajout formulaire client`, `Fix bug statut`, `Feat: alertes stock`, etc.
- Réunion de suivi 2 fois par semaine
---
 
## 📅 Planning
 
| Semaine | Objectif |
|---------|----------|
| S1 | Setup, schéma IndexedDB, structure du projet |
| S2 | Modules clients + vêtements |
| S3 | Statuts + paiements |
| S4 | Dashboard + stock |
| S5 | Intégration et tests |
| S6 | Finalisation et présentation |
 
---
 
*Projet réalisé dans le cadre d'un cours — Équipe de 8 étudiants*
 
