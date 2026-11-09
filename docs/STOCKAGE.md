# Données enregistrées sur le téléphone (Fluxe App)

Fluxe App enregistre tout **sur le téléphone** (rien n'est envoyé sur Internet), dans le stockage du navigateur (`localStorage`) et dans un cache pour le hors-ligne.

⚠️ Fluxe App et Fluxe Suivi sont publiés sur le même site (`ryoths.github.io`) : ils partagent donc le même espace de stockage. Les noms ci-dessous sont choisis pour **ne jamais toucher** aux données de Fluxe Suivi.

## Clés `localStorage`

| Clé | Contenu | Quand elle est écrite |
| --- | --- | --- |
| `fluxe_user_v1` | La progression : `{ lvl, xp, streak, logs }` — niveau, XP, nombre de séances, journal (`logs` = liste de `{ date, mood, count }` : date ISO, humeur 😃/🔥/💀, nombre d'exercices) | À la fin de chaque séance (choix de l'humeur), et après un import accepté |
| `fluxe_backup` | La séance en cours : `{ workout, index, lvl }` — exercices prévus, exercice en cours, niveau choisi | Au lancement d'une séance et à chaque « Suivant » ; **supprimée** à la fin de la séance |
| `fluxe_user_v1_illisible` | Copie du texte brut de `fluxe_user_v1` quand il était illisible ou abîmé | Une seule fois : une copie déjà présente n'est **jamais écrasée** |
| `fluxe_user_v1_avant_import` | La progression **d'origine**, telle qu'elle était avant le tout premier import | Au premier import seulement, **jamais écrasée** ensuite |
| `fluxe_user_v1_avant_dernier_import` | La progression telle qu'elle était juste avant l'import le plus récent | À chaque import (remplacée à chaque fois) |

⚠️ **Ne jamais renommer** `fluxe_user_v1` ni `fluxe_backup` : les utilisateurs perdraient leur progression.

Si une donnée est abîmée, l'appli ne plante pas : elle repart des valeurs par défaut, garde une copie du texte brut (`fluxe_user_v1_illisible`) et ne réécrit `fluxe_user_v1` qu'à la prochaine séance terminée. Une progression incomplète est complétée sans perdre les champs existants.

## Cache hors ligne

| Nom | Contenu |
| --- | --- |
| `fluxe-app-v` + version (ex. `fluxe-app-v1.0.0`) | Copie des fichiers de l'appli : `./`, `index.html`, `css/app.css`, les 4 polices de `fonts/`, `icon.png`, `manifest.json` |

À chaque nouvelle version, `sw.js` supprime **uniquement** les anciens caches dont le nom commence par `fluxe-app-` (par exemple l'ancien `fluxe-app-v1`).

## Ce que Fluxe App ne touche jamais

Les données de **Fluxe Suivi**, même si elles sont sur le même site :

- `muscu-v1` (sa clé de données) ;
- les clés `fx-*` (ses réglages et indicateurs) ;
- ses caches `fluxe-suivi-*` et ses anciens caches (`fluxe-v10`, `muscu-v7`…).

Aucun nom de Fluxe App ne commence par ces préfixes, et le nettoyage du cache ne vise que `fluxe-app-`. Des tests automatiques le vérifient (`tests/04-stockage.test.js`, `tests/07-hors-ligne.test.js`).
