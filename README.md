# Fluxe App

Fluxe App génère des séances de musculation **au poids du corps** : tu choisis tes groupes musculaires et ton niveau, l'appli te propose les exercices un par un, et tu gagnes de l'expérience (XP) et des niveaux.

> Fluxe App est **distincte de Fluxe Suivi** (le carnet de musculation pour la salle, dépôt `RyoThs/Fluxe-Suivi`). Les deux applis sont publiées sur le même site (`ryoths.github.io`) mais ne partagent aucune donnée, et ne touchent jamais aux données de l'autre.

Version actuelle : **1.7.0**

## Adresse

**https://ryoths.github.io/Mon-Fluxe/**

⚠️ Garde exactement cette adresse (majuscules comprises) : c'est celle de l'icône sur ton écran d'accueil et de la copie hors-ligne. Renommer le dépôt ou déplacer l'appli casserait l'icône et le mode hors-ligne (il faudrait réinstaller l'appli). Tes données (niveau, XP, journal) sont rangées par site (`ryoths.github.io`) et non par dossier, mais par prudence **exporte ta progression avant tout changement de ce genre**. À vérifier une fois dans Safari : l'adresse s'ouvre bien avec cette casse.

## Installer sur iPhone

1. Ouvre l'adresse ci-dessus dans **Safari**.
2. Touche le bouton **Partager** (carré avec une flèche vers le haut).
3. Choisis **Sur l'écran d'accueil**, puis **Ajouter**.

L'appli s'ouvre alors comme une vraie appli, et fonctionne **hors ligne** après la première visite.

## Sauvegarder sa progression (conseillé)

Dans l'écran **Journal**, encadré **Ma progression** :

- **Exporter** crée un fichier `fluxe-progression-AAAA-MM-JJ.json`. Sur iPhone, choisis **Enregistrer dans Fichiers** (ou envoie-le-toi par mail/AirDrop).
- **Importer** remet une progression à partir de ce fichier (une confirmation indique ce qui sera remplacé, et une copie de sécurité est gardée sur le téléphone).

Fais un export de temps en temps : si le téléphone est changé ou réinitialisé, c'est ce fichier qui permet de tout retrouver.

## Pour le développement

Il faut [Node.js](https://nodejs.org/) 22. L'appli elle-même n'a besoin d'aucune installation (fichiers statiques) : ces commandes servent seulement aux vérifications.

```bash
npm install          # installe les outils de test (une seule fois)
npm test             # lance tous les tests automatiques (navigateur Chromium)
npm run lint         # vérifie le code de l'appli (js/), des tests, des outils et de sw.js
```

Les tests tournent aussi automatiquement sur GitHub à chaque proposition de modification (`.github/workflows/tests.yml`).

Organisation des fichiers :

| Fichier | Rôle |
| --- | --- |
| `index.html` | la structure des écrans (aucun code JavaScript dedans) |
| `js/` | le code, rangé par sujet : plan dans `js/README.md` |
| `css/app.css` | toute l'apparence (thème clair seulement, identité Fluxe Suivi) |
| `fonts/` | police Barlow Condensed (+ licence) |
| `sw.js` | fonctionnement hors ligne (service worker) |
| `manifest.json` | nom, icône et couleurs de l'appli installée |
| `tests/` | tests automatiques |
| `outils/captures.js` | ancien outil de comparaison avec la version Tailwind (v1.0.0, n'est plus à jour depuis le nouveau style) |
| `docs/STOCKAGE.md` | toutes les données enregistrées sur le téléphone |
| `docs/TEST-APPAREILS.md` | liste à cocher pour tester sur iPhone |
| `docs/ILLUSTRATIONS.md` | cahier des charges pour faire dessiner les positions par un illustrateur (mannequin anatomique réaliste) |

## Publier une nouvelle version

1. Change le numéro de version **aux 3 endroits** (le même partout, un test le vérifie) :
   - `index.html` : `<meta name="app-version" content="1.1.0">`
   - `sw.js` : `const VERSION = '1.1.0';` (le nom du cache hors ligne en découle, et l'ancien est supprimé automatiquement)
   - `package.json` : `"version": "1.1.0"`
   Nouveau fichier dans `js/` : l'ajouter aussi à `index.html` (balise `<script>`) et à la liste `FICHIERS` de `sw.js` (un test le vérifie).
2. Lance `npm test` et `npm run lint` : tout doit être vert.
3. Publie sur la branche `main` (GitHub Pages met le site à jour en quelques minutes).
4. Sur l'iPhone, ferme et rouvre l'appli, puis vérifie « Fluxe vX.Y.Z » en bas de la fenêtre d'aide (bouton **?** pendant une séance). Suis `docs/TEST-APPAREILS.md`.

⚠️ Ne renomme jamais les clés de stockage `fluxe_user_v1` et `fluxe_backup` (voir `docs/STOCKAGE.md`).

## Historique des versions

- **1.7.0** — Guides « ? » réécrits pour être plus directs : 3 lignes (Position, Mouvement, Attention), tutoiement, phrases courtes, pour les 150 mouvements.

- **1.6.0** — Zoom bloqué sur toutes les pages (balise viewport, double toucher, pincement sur iPhone), comme Fluxe Suivi.

- **1.5.0** — Bibliothèque agrandie : 144 exercices (8 par groupe et par niveau, +54), les nouveaux sans aucun matériel, chacun avec son guide, son dessin et le chrono s'il est tenu.

- **1.4.0** — Rappels de séance : jours + heure → fichier calendrier `fluxe-rappels.ics` (le calendrier du téléphone fait le rappel ; aucun serveur, aucun compte). Passerelle vers Fluxe Suivi au niveau 5 ou après 20 séances.

- **1.3.0** — Donner envie de revenir : semaines d'affilée (carte Niveau), 15 récompenses dans le Journal (sans fenêtre automatique), progression automatique (niveau retenu, proposition de monter après 3 séances 😃 ou de descendre après 2 séances 💀), programme « Débuter en 4 semaines » (12 séances guidées). Cahier des charges des illustrations (`docs/ILLUSTRATIONS.md`).

- **1.2.0** — Mieux guider : chrono pour les exercices tenus (**sans aucun son**), repos de 30 s entre les exercices (+15 s, Passer), option échauffement et étirements, dessins au trait des mouvements, bouton « Trop dur ? Plus facile ». Le surplus d'XP est gardé au passage de niveau, exercices tenus affichés en secondes, petit message à la place de la fenêtre « Choisis au moins un muscle », sécurité renforcée (plus de code en ligne autorisé). Publication automatique du site après chaque fusion aux tests verts.

- **1.1.0** — Nouveau style, identique à Fluxe Suivi (fond clair, dégradé turquoise → violet, cartes à ombre portée, barre du bas en pilule) ; logo inchangé. Code rangé en petits fichiers `js/`. Séance : barre de progression, « À suivre », bouton ✕ (la séance reste à reprendre). Journal : chiffres clés, semaine du lundi au dimanche, dates en français, cloison (« n'a pas pu s'afficher · Réessayer »). Corrections : tirage des exercices équitable, mode Express limité à 6, gras dans le guide.
- **1.0.0** — Feuille de style écrite à la main, polices et hors ligne dans l'appli, export / import de la progression.

## Licence de la police

- **Barlow Condensed** — © The Barlow Project Authors, licence SIL Open Font License 1.1 : `fonts/OFL-Barlow-Condensed.txt`

Fichiers tirés du paquet `@fontsource/barlow-condensed` (version 5.3.0), alphabet latin uniquement.
