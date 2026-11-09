# Fluxe App

Fluxe App génère des séances de musculation **au poids du corps** : tu choisis tes groupes musculaires et ton niveau, l'appli te propose les exercices un par un, et tu gagnes de l'expérience (XP) et des niveaux.

> Fluxe App est **distincte de Fluxe Suivi** (le carnet de musculation pour la salle, dépôt `RyoThs/Fluxe-Suivi`). Les deux applis sont publiées sur le même site (`ryoths.github.io`) mais ne partagent aucune donnée, et ne touchent jamais aux données de l'autre.

Version actuelle : **1.0.0**

## Adresse

**https://ryoths.github.io/Mon-Fluxe/**

⚠️ Garde exactement cette adresse (majuscules comprises). Sur iPhone, les données de l'appli (niveau, XP, journal) sont rangées par adresse : **changer l'adresse (renommer le dépôt, changer la casse, déplacer l'appli) ferait repartir l'appli de zéro**. Exporte ta progression avant tout changement de ce genre.

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
npm run lint         # vérifie le code des tests, des outils et de sw.js
npm run captures -- <dossier-hors-du-depot>   # captures avant/après et comparaison pixel
```

Les tests tournent aussi automatiquement sur GitHub à chaque proposition de modification (`.github/workflows/tests.yml`).

Organisation des fichiers :

| Fichier | Rôle |
| --- | --- |
| `index.html` | l'appli (page + code JavaScript) |
| `css/app.css` | toute l'apparence (thème clair et sombre) |
| `fonts/` | polices Inter et Barlow Condensed (+ licences) |
| `sw.js` | fonctionnement hors ligne (service worker) |
| `manifest.json` | nom, icône et couleurs de l'appli installée |
| `tests/` | tests automatiques |
| `outils/captures.js` | captures d'écran avant/après |
| `docs/STOCKAGE.md` | toutes les données enregistrées sur le téléphone |
| `docs/TEST-APPAREILS.md` | liste à cocher pour tester sur iPhone |

## Publier une nouvelle version

1. Change le numéro de version **aux 3 endroits** (le même partout, un test le vérifie) :
   - `index.html` : `<meta name="app-version" content="1.0.0">`
   - `sw.js` : `const VERSION = '1.0.0';` (le nom du cache hors ligne en découle, et l'ancien est supprimé automatiquement)
   - `package.json` : `"version": "1.0.0"`
2. Lance `npm test` et `npm run lint` : tout doit être vert.
3. Publie sur la branche `main` (GitHub Pages met le site à jour en quelques minutes).
4. Sur l'iPhone, ferme et rouvre l'appli, puis vérifie « Fluxe vX.Y.Z » en bas de la fenêtre d'aide (bouton **?** pendant une séance). Suis `docs/TEST-APPAREILS.md`.

⚠️ Ne renomme jamais les clés de stockage `fluxe_user_v1` et `fluxe_backup` (voir `docs/STOCKAGE.md`).

## Licences des polices

- **Inter** — © The Inter Project Authors, licence SIL Open Font License 1.1 : `fonts/OFL-Inter.txt`
- **Barlow Condensed** — © The Barlow Project Authors, licence SIL Open Font License 1.1 : `fonts/OFL-Barlow-Condensed.txt`

Fichiers tirés des paquets `@fontsource/inter` et `@fontsource/barlow-condensed` (version 5.3.0), alphabet latin uniquement.
