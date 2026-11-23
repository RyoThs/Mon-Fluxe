# Plan du code de Fluxe App

Depuis la v1.1.0, le code est rangé en petits fichiers, chargés **dans cet ordre** par `index.html`
(des scripts classiques : chacun peut utiliser ce que les fichiers d'avant ont déclaré).

| Fichier | Rôle |
|---|---|
| `zoom.js` | Écran fixe : pincement et double toucher sans zoom (chargé en premier) |
| `outils.js` | Petites fonctions communes : mélange équitable, création d'éléments sûrs, gras du guide, dates en français, petit message, début de semaine |
| `stockage.js` | Lecture sûre du téléphone et vérification des données (clés `fluxe_user_v1` et `fluxe_backup` : **ne jamais renommer**) |
| `exercices.js` | Les 144 exercices (6 groupes × 3 niveaux × 8) |
| `dessins.js` | Silhouettes animées des mouvements (une par famille d'exercices, départ → arrivée en boucle) |
| `echauffement.js` | Échauffement et étirements (option retenue dans `fluxe_reglages`) |
| `chrono.js` | Chrono des exercices tenus et repos entre les exercices (**aucun son**) |
| `motivation.js` | Semaines d'affilée, 15 récompenses, proposition de changer de niveau |
| `ecrans.js` | Passage Accueil ↔ Journal, en-tête (niveau, séances, barre d'XP) |
| `journal.js` | Écran Journal : chiffres, graphique de la semaine, liste ; cloison si l'affichage plante |
| `seance.js` | Séance : choix, génération, exercice suivant, « À suivre », Plus facile, Quitter, fin (XP, niveau), reprise, guide « ? » |
| `programme.js` | Programme « Débuter en 4 semaines » (clé `fluxe_programme`) |
| `sauvegarde.js` | Export / import de la progression (fichier JSON), partage d'un fichier |
| `rappels.js` | Rappels (fichier calendrier .ics) et passerelle vers Fluxe Suivi |
| `actions.js` | Aiguillage : chaque bouton porte un `data-act`, ce fichier dit quoi faire |
| `main.js` | Démarrage (chargé en dernier) : version, en-tête, carte « Reprendre », hors ligne |

## Règles
1. **Nouveau bouton** : lui donner un `data-act`, puis écrire son geste dans `actions.js` (un test vérifie qu'aucun n'est oublié).
2. **Nouveau fichier** : l'ajouter dans `index.html` (avant `main.js`) ET dans la liste `FICHIERS` de `sw.js`. Les tests le vérifient.
3. **Un fichier = un sujet**, 250 lignes au plus (un test le vérifie).
4. Pas de `onclick="…"` ni de code dans `index.html` (un test le vérifie).
5. Avant de fusionner : `npm test` et `npm run lint` doivent être ✅.
