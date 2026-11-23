# Cahier des charges : illustrations des exercices (Fluxe App)

Document à donner à un illustrateur pour obtenir des devis. Rédigé le 2026-11-22.

## Le projet
Fluxe App est une appli web gratuite de séances de musculation **au poids du corps, à la maison, pour débutants** (https://ryoths.github.io/Mon-Fluxe/).
Pendant la séance, chaque exercice s'affiche sur une carte. On veut une illustration qui montre **la position du corps** et **les muscles qui travaillent**.

## Le style attendu
- **Mannequin anatomique réaliste**, sans visage ni vêtements, muscles dessinés avec leurs **fibres** et un léger relief (lumière en haut à gauche).
- Référence de style : le mannequin de Fluxe Suivi (l'autre appli de la marque) : corps gris clair (#eef0f5 → #d3d8e3), sillons entre les muscles en gris (#5d6580, 45 %).
- **Muscles travaillés** colorés avec le dégradé de la marque : turquoise #5eead4 → indigo #818cf8 → violet #c084fc. Muscles secondaires en indigo clair #c7d2fe. Ces couleurs doivent être faciles à changer (calques ou groupes séparés).
- Fond **transparent**, un trait de sol gris clair (#dfe4f1). Thème clair uniquement.
- Sobre et adulte : pas de style dessin animé ni de couleurs vives en dehors du dégradé.

## Format à livrer
- **SVG** (vectoriel), un fichier par position, nommé comme dans le tableau (ex. `pompe.svg`), cadre **100 × 64** (format paysage 25:16), vue de côté sauf indication.
- Chaque muscle dans un **groupe nommé** (`pectoraux`, `triceps`, `quadriceps`, `fessiers`, `ischios`, `abdos`, `epaules`, `dos`, `mollets`, `biceps`, `avant-bras`, `obliques`, `trapezes`) : l'appli colorera elle-même les muscles selon l'exercice.
- Fichier léger (moins de 60 Ko chacun), sans texte, sans image intégrée (pas de PNG dans le SVG).
- Cession des droits : utilisation dans l'appli et sur ses pages de présentation, sans limite de durée.

## Les 20 positions (couvrent les 152 exercices : 144 + 4 échauffements + 4 étirements)
| # | Fichier | Position | Exercices concernés |
| --- | --- | --- | --- |
| 1 | `pompe.svg` | Pompe (corps gainé, bras tendus) | Pompes Classiques, Pompes Diamant, Pompes Larges, Pompes Spiderman, Pompes Décalées, Pompes Archer, Pompes Explosives, Pompes 1 Bras, Pompes Claquées, Pseudo Planche, Pompes Hautes, Pompes Triceps Pure, Mains Inversées, Planche Lean, Tap Épaules, Mountain Climber lent, 90 Degree Hold, Dips Épaules, Pompes Déclinées, Planche Haute, Pompes Tempo, Pompes Larges Pause, Pompes Superman, Pompes Typewriter, Pompes Doigts, Mountain Climber Rapide, Planche Lean Tenu, Pompes Coudes Serrés, Pompes Diamant Explosives |
| 2 | `pompeGenoux.svg` | Pompe sur les genoux | Pompes Genoux, Pompes Négatives Genoux, Pompes Diamant Genoux |
| 3 | `pompeInclinee.svg` | Pompe mains surélevées / au mur | Pompes Inclinées, Pompes au Mur, Triceps au Mur, Extension 1 bras, Pompes Mur Larges, Triceps Mur Serré |
| 4 | `planche.svg` | Planche sur les avant-bras | Planche, Rotation Planche, Planche Commando, Extension Sol, Pompes Sphinx, Planche Genoux, Planche RKC, Planche Haute-Basse, Pompes Tigre |
| 5 | `plancheLaterale.svg` | Planche latérale | Planche Latérale |
| 6 | `dips.svg` | Dips (mains sur une chaise, dos au support) | Dips Chaise, Dips Banc, Dips au sol, Dips Profonds, Dips Explosifs, Crab Walk, Dips au Sol 1 Jambe |
| 7 | `superman.svg` | Allongé sur le ventre, bras et jambes décollés | Superman, Superman Iso, Superman Arqué, Nageur, Anges au sol, Pompes Cobra, Superman Alterné, Y-T-W au Sol, Superman Tirage, Arch Hold Bras Tendus |
| 8 | `quatrePattes.svg` | À quatre pattes, bras et jambe opposés tendus | Bird Dog, Chat-Vache, Bird Dog Coude-Genou, Kickback Fessier, Ours Tenu, Bear Crawl |
| 9 | `pont.svg` | Pont (dos au sol, bassin levé) | Glute Bridge, Pont 1 jambe, Back Bridge, Planche Inversée, Planche Inversée 1 Jambe, Pont Fessier Tenu |
| 10 | `squat.svg` | Squat (cuisses parallèles au sol) | Squat Classique, Squat Sumo, Cossack Squats, Pistol Squat, Chaise Murale, Squat Pause, Squat 1 et Demi, Sissy Squat |
| 11 | `fente.svg` | Fente (genou arrière près du sol) | Fentes Arrière, Fentes Bulgares, Fentes Latérales, Fentes Avant, Fentes Marchées, Skater Squat |
| 12 | `aGenoux.svg` | À genoux, buste penché en avant (nordic) | Nordic Curl Sol |
| 13 | `saut.svg` | Saut (en l'air, bras levés) | Squat Jumps, Sauts Groupés, Fentes Sautant, Jumping Jacks, Montées de genoux, Squat Sauté 180° |
| 14 | `debout.svg` | Debout (mouvement des bras ou des épaules) | Montée Mollets, Good Morning, Shrugs, Cercles Bras, I-Y-T Mouvement, Wall Slide, Rotations des bras, Rotations des hanches, Curl Bouteilles, Biceps Serviette, Tirage Serviette, Étirement des pectoraux, Étirement des quadriceps, Good Morning 1 Jambe, Élévations en Y, Curl Main Contre Main |
| 15 | `crunch.svg` | Dos au sol, buste relevé (abdos) | Crunch, Toucher Chevilles, V-Ups, Russian Twists, Dead Bug, Crunch Croisé, Bicycle Crunch, Curl Sous la Cuisse |
| 16 | `jambesLevees.svg` | Dos au sol, jambes levées | Flutter Kicks, Hollow Rock, Essuie-glaces, Dragon Flag, L-Sit, Étirement des ischios, Relevés de Bassin, Ciseaux, Hollow Hold, V-Sit Tenu |
| 17 | `pike.svg` | V inversé (fesses hautes) | Pike Pushups, Pike Pushups Elevé, Maintien Pike, Pike Walk, Wall Walk, Pompes Hindoues, Pike Genoux, Pike Tempo, Planche Chien Tête en Bas |
| 18 | `equilibre.svg` | Équilibre sur les mains contre un mur | HSPU au Mur, Handstand Hold, Marche Mains, Taps Épaules en Équilibre, HSPU Négatives |
| 19 | `tirage.svg` | Tirage sous une table (corps incliné) | Pompes Australiennes, Tirage 1 bras table, Tirage Porte |
| 20 | `etirement.svg` | Posture de l'enfant (étirement) | Posture de l'enfant |

## Pour aller plus loin (option du devis)
- Une 2e image par position (début / fin du mouvement) pour animer le passage de l'une à l'autre.
- Une illustration par exercice (98) au lieu d'une par position (20).

## Intégration
Quand les fichiers arrivent : les mettre dans `illustrations/` ; Claude les branche à la place des silhouettes (avec tests et ajout à la liste hors ligne `sw.js`).
