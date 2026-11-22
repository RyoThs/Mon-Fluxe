# Instructions pour Claude (Fluxe App)

Yoann est débutant : réponds en français, simplement, code complet d'abord puis explications.
Mémoire longue et décisions : coffre `RyoThs/MonCerveau` (fiche `02 - Projets/FLUXE/Fluxe App/Fluxe App.md`). Fluxe App et Fluxe Suivi sont deux applis distinctes.

## Méthode TDD : priorité pour tout le code
Toute demande qui touche au code suit le TDD (détails : fiche `14 - TDD (tests d'abord)` du coffre MonCerveau).
1. 🔴 Écrire d'abord UN test pour UN comportement, le lancer, le voir échouer pour la bonne raison.
2. 🟢 Écrire le code le plus simple qui le fait passer, puis lancer TOUTE la suite (`npm test`).
3. 🔧 Ranger le code ; les tests restent verts.
- Un bug = d'abord un test qui le reproduit, puis la correction.
- Code existant sans test : test de caractérisation (ce qu'il fait aujourd'hui) avant de le modifier.
- Ne jamais modifier ni supprimer un test pour obtenir le vert (si un test semble faux : l'expliquer à Yoann et attendre son accord).
- Montrer à Yoann chaque cycle en une ligne et la preuve finale (commande + résultat).
- Exceptions : maquette jetable, pur style CSS (capture avant/après).

## Tests de ce projet
- Installer une fois : `npm ci` puis `npx playwright install chromium`.
- Lancer : `npm test` (tous les fichiers `tests/*.test.js`, numérotés par thème). GitHub les relance automatiquement (`.github/workflows/tests.yml`).
- Nouveau thème = nouveau fichier numéroté (`14-….test.js`) ; sinon ajouter le test dans le fichier du thème.
- Avant une fusion : `npm run lint` (ESLint).

## Règles
- **Thème clair seulement, identité Fluxe Suivi** (décidé le 2026-11-22) : mêmes couleurs, ombres et formes que Fluxe Suivi ; logo `icon.png` inchangé.
- **Code solide et cloisonné** : un sujet = un fichier dans `js/` (plan : `js/README.md`) ; une zone qui plante affiche « … n'a pas pu s'afficher · Réessayer » sans casser le reste ; aucune erreur silencieuse.
- Ne jamais renommer les clés de stockage `fluxe_user_v1` et `fluxe_backup` (voir `docs/STOCKAGE.md`) ; tout changement de format arrive avec un test qui relit l'ancien format.
- Publier une version : numéro identique aux 3 endroits (un test le vérifie), voir README.
- Toujours une demande de fusion ; attendre l'accord de Yoann et les tests verts avant de fusionner.
- Jamais de mot de passe ni de clé secrète dans le dépôt.
