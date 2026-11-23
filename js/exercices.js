/* Bibliothèque des exercices au poids du corps : 6 groupes × 3 niveaux × 8 exercices (144), tous faisables à la maison.
   Chaque exercice : n = nom, r = répétitions (ou secondes si s:1 = exercice tenu), d = description courte,
   h = guide détaillé (affiché par le bouton « ? » ; **texte** = en gras). */
const exerciseLibrary = {
    'Pectoraux': {
        beginner: [
            {n:'Pompes Genoux', r:12, d:'Genoux posés', h:'• **Placement** : Mains plus larges que les épaules, genoux reculés pour aligner hanches et buste.\n• **Mouvement** : Descendez la poitrine au ras du sol en gardant les coudes à 45° du corps.\n• **Respiration** : Inspirez en descendant, expirez en poussant.'},
            {n:'Pompes Inclinées', r:15, d:'Mains surélevées', h:'• **Placement** : Mains sur un meuble stable (canapé, table basse).\n• **Mouvement** : Gardez le corps parfaitement droit (gainage).\n• **Astuce** : Plus le support est haut, plus c\'est facile.'},
            {n:'Pompes au Mur', r:20, d:'Debout face au mur', h:'• **Placement** : Mains à hauteur d\'épaules sur le mur.\n• **Mouvement** : Amenez le nez près du mur en contrôlant le retour.\n• **Focus** : Idéal pour l\'échauffement ou les débutants complets.'},
            {n:'Dips au sol', r:12, d:'Triceps & Bas Pecs', h:'• **Placement** : Assis, mains derrière les hanches, doigts vers les pieds.\n• **Mouvement** : Décollez les fesses, pliez les bras pour effleurer le sol, puis tendez vigoureusement.'},
            {n:'Pompes Larges', r:10, d:'Focus Pectoraux', h:'• **Placement** : Mains très écartées (1,5x largeur épaules).\n• **Mouvement** : Descente lente pour sentir l\'étirement du grand pectoral.\n• **Sécurité** : Ne descendez pas trop bas si vous sentez une tension dans l\'épaule.'},
            {n:'Pompes Négatives Genoux', r:8, d:'Descente lente', h:'• **Placement** : En appui sur les genoux, mains un peu plus larges que les épaules.\n• **Mouvement** : Descendez la poitrine vers le sol en 3 secondes, puis remontez comme vous pouvez.\n• **Focus** : La descente lente construit la force pour les vraies pompes.'},
            {n:'Pompes Mur Larges', r:15, d:'Debout face au mur', h:'• **Placement** : Mains au mur, nettement plus larges que les épaules.\n• **Mouvement** : Approchez la poitrine du mur, coudes ouverts, puis repoussez.\n• **Focus** : Sentez l\'étirement des pectoraux en bas.'},
            {n:'Planche Haute', r:25, s:1, d:'Gainage bras tendus', h:'• **Placement** : Position haute de pompe, mains sous les épaules.\n• **Mouvement** : Tenez le corps bien droit, fessiers et abdos serrés.\n• **Respiration** : Respirez calmement, sans bloquer.'}
        ],
        intermediate: [
            {n:'Pompes Classiques', r:15, d:'Standard', h:'• **Placement** : Mains sous les épaules, corps en planche (fessiers serrés).\n• **Mouvement** : Touchez presque le sol avec le nez ou la poitrine.\n• **Focus** : Ne laissez pas le bas du dos se creuser.'},
            {n:'Pompes Diamant', r:12, d:'Mains serrées', h:'• **Placement** : Formez un triangle avec vos index et pouces au sol.\n• **Mouvement** : Amenez le centre de la poitrine sur vos mains.\n• **Focus** : Intense pour l\'intérieur des pecs et les triceps.'},
            {n:'Pompes Déclinées', r:12, d:'Pieds surélevés', h:'• **Placement** : Pieds sur un banc ou une chaise, mains au sol.\n• **Mouvement** : Cible le haut des pectoraux.\n• **Sécurité** : Regardez le sol pour garder la nuque neutre.'},
            {n:'Pompes Spiderman', r:10, d:'Gainage actif', h:'• **Mouvement** : En descendant, ramenez le genou droit vers le coude droit.\n• **Focus** : Travaille la poitrine et les obliques simultanément.'},
            {n:'Pompes Décalées', r:12, d:'Asymétriques', h:'• **Placement** : Une main haute (niveau visage), une main basse (niveau côtes).\n• **Mouvement** : Alternez la position des mains à chaque série.'},
            {n:'Pompes Tempo', r:10, d:'3 s en descente', h:'• **Mouvement** : Pompe classique, mais descendez en 3 secondes et remontez en 1 seconde.\n• **Focus** : Contrôle total, le corps reste gainé du début à la fin.'},
            {n:'Pompes Hindoues', r:10, d:'Vague du corps', h:'• **Placement** : Départ en V inversé, fesses hautes, mains au sol.\n• **Mouvement** : Plongez la poitrine vers l\'avant en frôlant le sol, finissez buste relevé, puis revenez en V.\n• **Focus** : Mouvement fluide, sans à-coups.'},
            {n:'Pompes Larges Pause', r:10, d:'Pause en bas', h:'• **Placement** : Mains très écartées.\n• **Mouvement** : Descendez, tenez 2 secondes poitrine près du sol, puis poussez.\n• **Sécurité** : Arrêtez la descente si l\'épaule tire.'}
        ],
        advanced: [
            {n:'Pompes Archer', r:10, d:'Bras tendu latéral', h:'• **Mouvement** : Descendez sur le bras gauche pendant que le bras droit se tend complètement sur le côté.\n• **Astuce** : Imaginez que vous tirez à l\'arc.\n• **Focus** : Énorme tension sur un seul bras.'},
            {n:'Pompes Explosives', r:12, d:'Puissance', h:'• **Mouvement** : Poussez si fort que vos mains décollent du sol.\n• **Réception** : Atterrissez avec les bras légèrement fléchis pour amortir.'},
            {n:'Pompes 1 Bras', r:5, d:'Force pure', h:'• **Placement** : Pieds très écartés pour la stabilité, une main dans le dos.\n• **Mouvement** : Gardez l\'épaule parallèle au sol autant que possible.'},
            {n:'Pompes Claquées', r:8, d:'Saut avec clap', h:'• **Mouvement** : Décollez et tapez dans vos mains devant la poitrine avant de retomber.\n• **Focus** : Vitesse de poussée maximale.'},
            {n:'Pseudo Planche', r:8, d:'Épaules en avant', h:'• **Placement** : Mains retournées vers l\'extérieur, basculez le poids du corps très en avant.\n• **Mouvement** : Les mains doivent se retrouver au niveau de votre taille lors de la descente.'},
            {n:'Pompes Superman', r:8, d:'Envol complet', h:'• **Mouvement** : Poussez si fort que mains et pieds décollent, bras tendus devant vous, puis réceptionnez-vous en douceur.\n• **Sécurité** : Maîtrisez d\'abord les pompes claquées.'},
            {n:'Pompes Typewriter', r:8, d:'Glissé latéral', h:'• **Placement** : Mains très larges.\n• **Mouvement** : Descendez sur le bras droit, glissez la poitrine vers le bras gauche sans remonter, puis poussez.\n• **Focus** : Le corps reste près du sol pendant le glissé.'},
            {n:'Pompes Doigts', r:8, d:'Sur le bout des doigts', h:'• **Placement** : En appui sur les doigts écartés, paumes décollées du sol.\n• **Mouvement** : Pompes lentes et contrôlées.\n• **Sécurité** : Commencez sur les genoux si les doigts fatiguent.'}
        ]
    },
    'Dos': {
        beginner: [
            {n:'Superman', r:20, d:'Lombaires', h:'• **Placement** : Allongé sur le ventre, bras devant.\n• **Mouvement** : Décollez buste et jambes en contractant le bas du dos.\n• **Focus** : Regardez le sol pour ne pas casser la nuque.'},
            {n:'Bird Dog', r:12, d:'Équilibre & Dos', h:'• **Placement** : À quatre pattes.\n• **Mouvement** : Tendez bras droit et jambe gauche. Tenez 2 sec.\n• **Focus** : Gardez le bassin bien horizontal, ne cambrez pas.'},
            {n:'Anges au sol', r:15, d:'Mobilité omoplates', h:'• **Placement** : Ventre au sol, front posé, bras en "V".\n• **Mouvement** : Décollez les mains et décrivez un grand arc de cercle jusqu\'aux fesses.\n• **Focus** : Gardez les bras tendus et ne touchez jamais le sol.'},
            {n:'Wall Slide', r:12, d:'Posture', h:'• **Placement** : Dos, fesses et tête contre le mur.\n• **Mouvement** : Faites glisser vos bras en "W" contre le mur jusqu\'à tendre au-dessus de la tête.\n• **Focus** : Gardez les poignets collés au mur.'},
            {n:'Tirage Serviette', r:15, d:'Contraction dos', h:'• **Mouvement** : Tenez une serviette tendue devant vous, tirez-la vers votre poitrine en écartant les coudes.\n• **Focus** : Imaginez que vous voulez déchirer la serviette en deux.'},
            {n:'Superman Alterné', r:20, d:'Bras et jambe opposés', h:'• **Placement** : Allongé sur le ventre, bras tendus devant.\n• **Mouvement** : Levez bras droit et jambe gauche, reposez, puis changez de côté.\n• **Focus** : Gardez le regard vers le sol.'},
            {n:'Y-T-W au Sol', r:12, d:'Haut du dos', h:'• **Placement** : Allongé sur le ventre, front près du sol.\n• **Mouvement** : Décollez les bras en Y, puis en T, puis en W (coudes vers les côtes).\n• **Focus** : Serrez les omoplates à chaque lettre.'},
            {n:'Chat-Vache', r:12, d:'Mobilité du dos', h:'• **Placement** : À quatre pattes, mains sous les épaules.\n• **Mouvement** : Arrondissez le dos en expirant, puis creusez-le doucement en inspirant.\n• **Focus** : Mouvement lent, sans forcer.'}
        ],
        intermediate: [
            {n:'Nageur', r:40, d:'Endurance dorsale', h:'• **Placement** : Ventre au sol.\n• **Mouvement** : Battements alternés rapides bras/jambes comme si vous nagiez.\n• **Focus** : Ne touchez plus le sol durant tout l\'exercice.'},
            {n:'Tirage Porte', r:15, d:'Traction horizontale', h:'• **Placement** : Saisissez les cadres d\'une porte ouverte.\n• **Mouvement** : Laissez-vous partir en arrière bras tendus, puis tirez pour ramener la poitrine entre les mains.\n• **Focus** : Serrez les omoplates en fin de tirage.'},
            {n:'Pompes Australiennes', r:12, d:'Sous table', h:'• **Placement** : Sous une table solide, saisissez le bord.\n• **Mouvement** : Tirez votre buste vers le haut de la table. Corps bien droit.\n• **Sécurité** : Vérifiez la stabilité de la table !'},
            {n:'Superman Iso', r:30, s:1, d:'Gainage dorsal', h:'• **Mouvement** : Maintenez la position haute du Superman sans bouger.\n• **Respiration** : Continuez de respirer calmement malgré la contraction.'},
            {n:'Good Morning', r:20, d:'Chaîne postérieure', h:'• **Placement** : Debout, mains derrière la tête.\n• **Mouvement** : Penchez le buste en avant en gardant le dos plat et les jambes presque tendues.\n• **Focus** : Vous devez sentir l\'étirement derrière les cuisses.'},
            {n:'Superman Tirage', r:15, d:'Tirage sans matériel', h:'• **Placement** : Allongé sur le ventre, bras tendus devant, buste légèrement décollé.\n• **Mouvement** : Ramenez les coudes vers les côtes en serrant les omoplates, puis tendez à nouveau.\n• **Focus** : Imaginez glisser vos coudes dans vos poches arrière.'},
            {n:'Planche Inversée', r:30, s:1, d:'Dos et fessiers', h:'• **Placement** : Assis, jambes tendues, mains au sol derrière les hanches.\n• **Mouvement** : Levez le bassin pour aligner épaules, hanches et talons, et tenez.\n• **Focus** : Poussez la poitrine vers le plafond.'},
            {n:'Bird Dog Coude-Genou', r:12, d:'Gainage dynamique', h:'• **Placement** : À quatre pattes.\n• **Mouvement** : Tendez bras droit et jambe gauche, puis ramenez coude et genou l\'un vers l\'autre sous le ventre.\n• **Focus** : Le bassin ne bascule pas.'}
        ],
        advanced: [
            {n:'Wall Walk', r:5, d:'Gainage total', h:'• **Mouvement** : En position de pompe, posez les pieds au mur et montez progressivement pour finir en équilibre.\n• **Focus** : Gainez les abdos au maximum.'},
            {n:'Hollow Rock', r:30, d:'Bascule gainée', h:'• **Placement** : Sur le dos, bras et jambes tendus décollés (forme de banane).\n• **Mouvement** : Basculez d\'avant en arrière sans casser la forme.'},
            {n:'Tirage 1 bras table', r:8, d:'Force unilatérale', h:'• **Placement** : Même que pompes australiennes mais avec une seule main.\n• **Focus** : Gainez pour éviter que le corps ne pivote.'},
            {n:'Back Bridge', r:15, d:'Le Pont', h:'• **Mouvement** : Allongé sur le dos, poussez sur mains et pieds pour arquer tout le corps vers le haut.\n• **Focus** : Ouverture de poitrine et souplesse dorsale.'},
            {n:'Superman Arqué', r:20, d:'Amplitude', h:'• **Mouvement** : Superman classique mais cherchez à décoller les cuisses au maximum.'},
            {n:'Arch Hold Bras Tendus', r:30, s:1, d:'Banane inversée', h:'• **Placement** : Allongé sur le ventre, bras tendus au-dessus de la tête.\n• **Mouvement** : Décollez bras, buste et jambes en même temps et tenez la position.\n• **Focus** : Fessiers serrés, nuque dans l\'alignement.'},
            {n:'Planche Inversée 1 Jambe', r:20, s:1, d:'Gainage arrière', h:'• **Mouvement** : Planche inversée (bassin levé, bras tendus), puis levez une jambe tendue. Changez de jambe à mi-temps.\n• **Focus** : Le bassin ne descend pas.'},
            {n:'Good Morning 1 Jambe', r:12, d:'Chaîne postérieure', h:'• **Placement** : Debout sur une jambe, mains derrière la tête.\n• **Mouvement** : Penchez le buste en avant en tendant l\'autre jambe derrière vous, dos plat, puis remontez.\n• **Focus** : Équilibre et contrôle.'}
        ]
    },
    'Jambes': {
        beginner: [
            {n:'Squat Classique', r:20, d:'Bases', h:'• **Placement** : Pieds largeur d\'épaules.\n• **Mouvement** : Descendez les fesses en arrière comme pour vous asseoir.\n• **Focus** : Gardez le dos droit et les talons cloués au sol.'},
            {n:'Glute Bridge', r:20, d:'Fessiers', h:'• **Placement** : Sur le dos, genoux pliés.\n• **Mouvement** : Levez le bassin vers le plafond.\n• **Focus** : Contractez volontairement les fessiers en haut du mouvement.'},
            {n:'Fentes Arrière', r:12, d:'Équilibre', h:'• **Mouvement** : Faites un grand pas en arrière et descendez le genou arrière vers le sol.\n• **Focus** : Le genou avant ne doit pas dépasser la pointe du pied.'},
            {n:'Chaise Murale', r:30, s:1, d:'Isométrie', h:'• **Placement** : Dos contre un mur, jambes pliées à 90°.\n• **Mouvement** : Ne bougez plus.\n• **Focus** : Pressez les talons dans le sol.'},
            {n:'Montée Mollets', r:25, d:'Cheville', h:'• **Mouvement** : Montez sur la pointe des pieds le plus haut possible.\n• **Focus** : Redescendez lentement pour contrôler le mouvement.'},
            {n:'Fentes Avant', r:12, d:'Pas en avant', h:'• **Mouvement** : Faites un grand pas en avant, descendez le genou arrière près du sol, puis revenez.\n• **Focus** : Buste droit, genou avant au-dessus de la cheville.'},
            {n:'Pont Fessier Tenu', r:30, s:1, d:'Fessiers', h:'• **Placement** : Sur le dos, genoux pliés, pieds à plat.\n• **Mouvement** : Levez le bassin et tenez en serrant fort les fessiers.\n• **Focus** : Ne cambrez pas le bas du dos.'},
            {n:'Kickback Fessier', r:15, d:'À quatre pattes', h:'• **Placement** : À quatre pattes.\n• **Mouvement** : Poussez un talon vers le plafond, genou plié à 90°, puis redescendez. Changez de jambe à mi-série.\n• **Focus** : Le dos reste plat.'}
        ],
        intermediate: [
            {n:'Squat Jumps', r:15, d:'Explosif', h:'• **Mouvement** : Faites un squat puis sautez le plus haut possible.\n• **Sécurité** : Atterrissez "souple" sur l\'avant du pied puis le talon.'},
            {n:'Fentes Bulgares', r:12, d:'Unilatéral', h:'• **Placement** : Pied arrière posé sur une chaise ou un canapé.\n• **Mouvement** : Descendez sur la jambe avant.\n• **Focus** : Très intense pour les quadriceps et fessiers.'},
            {n:'Fentes Latérales', r:16, d:'Adducteurs', h:'• **Mouvement** : Faites un grand pas sur le côté et descendez sur cette jambe, l\'autre reste tendue.\n• **Focus** : Gardez le buste le plus droit possible.'},
            {n:'Pont 1 jambe', r:12, d:'Fessier intense', h:'• **Placement** : Glute bridge mais avec une jambe tendue vers le ciel.\n• **Mouvement** : Poussez sur un seul talon.'},
            {n:'Squat Sumo', r:20, d:'Intérieur cuisses', h:'• **Placement** : Pieds très larges, pointes vers l\'extérieur.\n• **Mouvement** : Descendez profond en ouvrant bien les genoux.'},
            {n:'Squat Pause', r:15, d:'Pause en bas', h:'• **Mouvement** : Squat classique, tenez 3 secondes en bas, puis remontez.\n• **Focus** : Talons au sol, poitrine haute.'},
            {n:'Fentes Marchées', r:20, d:'En avançant', h:'• **Mouvement** : Enchaînez les fentes en avançant, une jambe après l\'autre.\n• **Astuce** : Pas de place ? Faites un pas en avant puis revenez.'},
            {n:'Squat 1 et Demi', r:12, d:'Double descente', h:'• **Mouvement** : Descendez en bas, remontez à mi-hauteur, redescendez, puis remontez complètement. Ça compte pour 1.\n• **Focus** : Les cuisses brûlent, c\'est normal.'}
        ],
        advanced: [
            {n:'Pistol Squat', r:8, d:'Équilibre & Force', h:'• **Mouvement** : Squat sur une seule jambe, l\'autre jambe est tendue devant vous.\n• **Astuce** : Tenez un support au début pour l\'équilibre.'},
            {n:'Nordic Curl Sol', r:8, d:'Ischios', h:'• **Placement** : À genoux, pieds coincés sous un meuble lourd.\n• **Mouvement** : Penchez-vous en avant le plus lentement possible en retenant avec vos jambes.\n• **Sécurité** : Posez les mains devant vous pour amortir la chute.'},
            {n:'Sauts Groupés', r:12, d:'Pliométrie', h:'• **Mouvement** : Sautez et ramenez les deux genoux contre la poitrine en l\'air.\n• **Focus** : Réactivité maximale au sol.'},
            {n:'Fentes Sautant', r:20, d:'Cardio Force', h:'• **Mouvement** : Changez de jambe en fente via un saut explosif.\n• **Focus** : Stabilité du tronc.'},
            {n:'Cossack Squats', r:16, d:'Mobilité', h:'• **Mouvement** : Fente latérale très profonde, en descendant jusqu\'à ce que la fesse touche presque le talon.'},
            {n:'Skater Squat', r:8, d:'Squat sur une jambe', h:'• **Placement** : Debout sur une jambe, l\'autre pliée derrière vous.\n• **Mouvement** : Descendez jusqu\'à effleurer le sol avec le genou arrière, puis remontez. Changez de jambe à mi-série.\n• **Astuce** : Bras devant vous pour l\'équilibre.'},
            {n:'Squat Sauté 180°', r:12, d:'Saut avec demi-tour', h:'• **Mouvement** : Squat puis saut avec un demi-tour en l\'air ; réceptionnez-vous en squat et repartez dans l\'autre sens.\n• **Sécurité** : Atterrissez souple.'},
            {n:'Sissy Squat', r:10, d:'Quadriceps', h:'• **Placement** : Debout, sur la pointe des pieds.\n• **Mouvement** : Penchez le buste en arrière en avançant les genoux vers le sol, puis remontez.\n• **Sécurité** : Amplitude réduite au début.'}
        ]
    },
    'Abdos': {
        beginner: [
            {n:'Planche', r:30, s:1, d:'Gainage', h:'• **Placement** : Appui sur les coudes et orteils.\n• **Mouvement** : Contractez abdos et fessiers pour former une ligne droite.\n• **Erreur** : Ne laissez pas le bassin tomber vers le sol.'},
            {n:'Crunch', r:20, d:'Haut des abdos', h:'• **Placement** : Sur le dos, mains aux tempes.\n• **Mouvement** : Enroulez le buste pour décoller les omoplates.\n• **Focus** : Regardez le plafond, ne tirez pas sur la nuque.'},
            {n:'Dead Bug', r:16, d:'Dos protégé', h:'• **Mouvement** : Sur le dos, descendez bras droit et jambe gauche sans que le bas du dos ne décolle du sol.\n• **Focus** : Contrôle et lenteur.'},
            {n:'Toucher Chevilles', r:30, d:'Obliques', h:'• **Mouvement** : Jambes pliées, alternez pour toucher votre talon gauche puis droit avec vos mains.\n• **Focus** : Gardez les épaules décollées.'},
            {n:'Mountain Climber lent', r:20, d:'Contrôle', h:'• **Mouvement** : En planche, ramenez un genou vers la poitrine sans bouger le reste du corps.\n• **Focus** : Expirez fort à chaque montée de genou.'},
            {n:'Relevés de Bassin', r:15, d:'Bas des abdos', h:'• **Placement** : Sur le dos, genoux pliés au-dessus des hanches.\n• **Mouvement** : Décollez légèrement le bassin du sol en ramenant les genoux vers la poitrine.\n• **Focus** : Petit mouvement, sans élan.'},
            {n:'Planche Genoux', r:30, s:1, d:'Gainage facile', h:'• **Placement** : Sur les avant-bras et les genoux.\n• **Mouvement** : Alignez tête, dos et genoux, et tenez.\n• **Focus** : Rentrez le ventre.'},
            {n:'Crunch Croisé', r:20, d:'Obliques', h:'• **Placement** : Sur le dos, genoux pliés, mains aux tempes.\n• **Mouvement** : Amenez le coude droit vers le genou gauche, puis l\'inverse.\n• **Focus** : Ne tirez pas sur la nuque.'}
        ],
        intermediate: [
            {n:'V-Ups', r:15, d:'Complet', h:'• **Mouvement** : Levez simultanément buste et jambes pour former un "V" et toucher vos pieds.\n• **Focus** : Redescendez en contrôlant, ne tombez pas au sol.'},
            {n:'Russian Twists', r:30, d:'Rotation', h:'• **Placement** : Assis, pieds décollés.\n• **Mouvement** : Touchez le sol à gauche puis à droite avec vos deux mains jointes.\n• **Focus** : Suivez vos mains du regard.'},
            {n:'Planche Latérale', r:30, s:1, d:'Taille', h:'• **Placement** : Sur un seul coude, de profil.\n• **Mouvement** : Alignez tête, hanches et pieds. Tenez la position.'},
            {n:'Flutter Kicks', r:40, d:'Bas des abdos', h:'• **Placement** : Mains sous les fesses pour protéger le dos.\n• **Mouvement** : Petits battements de jambes rapides près du sol.'},
            {n:'Rotation Planche', r:20, d:'Mobilité', h:'• **Mouvement** : En planche coudes, pivotez le bassin pour toucher le sol avec la hanche gauche, puis droite.'},
            {n:'Bicycle Crunch', r:30, d:'Pédalage', h:'• **Mouvement** : Sur le dos, pédalez en amenant chaque coude vers le genou opposé.\n• **Focus** : Lentement, en tournant bien les épaules.'},
            {n:'Ciseaux', r:30, d:'Jambes tendues', h:'• **Placement** : Sur le dos, mains sous les fesses, jambes tendues un peu décollées.\n• **Mouvement** : Croisez et décroisez les jambes.\n• **Focus** : Le bas du dos reste collé au sol.'},
            {n:'Hollow Hold', r:30, s:1, d:'Banane tenue', h:'• **Placement** : Sur le dos, bras et jambes tendus et décollés.\n• **Mouvement** : Tenez la position, dos plaqué au sol.\n• **Astuce** : Pliez les genoux si le dos décolle.'}
        ],
        advanced: [
            {n:'L-Sit', r:20, s:1, d:'Statique', h:'• **Placement** : Mains au sol au niveau des hanches.\n• **Mouvement** : Poussez pour décoller fesses et pieds du sol, jambes tendues devant.\n• **Astuce** : Utilisez des livres sous vos mains pour gagner de la hauteur.'},
            {n:'Hollow Rock', r:30, d:'Banane dynamique', h:'• **Mouvement** : Dos plaqué, bras et jambes tendus, basculez comme un balancier.\n• **Focus** : Si le dos décolle, pliez un peu les jambes.'},
            {n:'Essuie-glaces', r:12, d:'Obliques force', h:'• **Placement** : Sur le dos, jambes tendues vers le ciel à 90°.\n• **Mouvement** : Descendez les jambes vers la gauche, puis la droite sans toucher le sol.'},
            {n:'Dragon Flag', r:8, d:'Levier', h:'• **Placement** : Allongé, agrippez un support solide derrière votre tête.\n• **Mouvement** : Levez tout le corps en chandelle et redescendez d\'un bloc sans casser l\'alignement.'},
            {n:'Planche Commando', r:20, d:'Dynamique', h:'• **Mouvement** : Passez de la position coudes à la position mains, un bras après l\'autre.\n• **Focus** : Gardez le bassin le plus fixe possible.'},
            {n:'Planche RKC', r:20, s:1, d:'Gainage maximal', h:'• **Placement** : Planche sur les avant-bras, coudes un peu plus avancés.\n• **Mouvement** : Serrez tout : poings, fessiers, abdos, cuisses, comme pour rapprocher coudes et pieds.\n• **Focus** : 20 secondes très intenses.'},
            {n:'V-Sit Tenu', r:20, s:1, d:'Équilibre en V', h:'• **Placement** : Assis, mains en l\'air.\n• **Mouvement** : Levez les jambes tendues pour former un V avec le buste et tenez.\n• **Astuce** : Genoux pliés au début.'},
            {n:'Mountain Climber Rapide', r:30, d:'Cardio gainage', h:'• **Placement** : Position haute de pompe.\n• **Mouvement** : Ramenez les genoux vers la poitrine en alternant, le plus vite possible.\n• **Focus** : Les hanches restent basses.'}
        ]
    },
    'Épaules': {
        beginner: [
            {n:'Cercles Bras', r:45, s:1, d:'Endurance', h:'• **Mouvement** : Bras tendus sur les côtés, décrivez de tout petits cercles rapides.\n• **Focus** : Gardez les épaules basses (ne les montez pas aux oreilles).'},
            {n:'I-Y-T Mouvement', r:15, d:'Posture', h:'• **Mouvement** : Formez un I (bras en haut), un Y (diagonale) et un T (côtés) avec vos bras.\n• **Focus** : Serrez fort les omoplates sur le T.'},
            {n:'Tap Épaules', r:20, d:'Stabilité', h:'• **Mouvement** : En position de planche mains, touchez votre épaule opposée.\n• **Focus** : Le bassin ne doit absolument pas bouger.'},
            {n:'Pompes Hautes', r:12, d:'Deltoïdes', h:'• **Placement** : Mains très loin devant vous en position de pompe.\n• **Mouvement** : Descente courte axée sur les épaules.'},
            {n:'Shrugs', r:20, d:'Trapèzes', h:'• **Mouvement** : Montez les épaules vers les oreilles le plus haut possible.\n• **Focus** : Tenez 2 sec en haut avant de relâcher.'},
            {n:'Pike Genoux', r:10, d:'V inversé facile', h:'• **Placement** : À genoux, mains au sol devant vous, fesses hautes.\n• **Mouvement** : Pliez les bras pour approcher le front du sol, puis repoussez.\n• **Focus** : Les coudes restent près du corps.'},
            {n:'Élévations en Y', r:15, d:'Debout', h:'• **Placement** : Debout, buste un peu penché en avant.\n• **Mouvement** : Levez les bras tendus en Y au-dessus de la tête, pouces vers le ciel, puis redescendez.\n• **Focus** : Mouvement lent, épaules basses.'},
            {n:'Ours Tenu', r:20, s:1, d:'Genoux décollés', h:'• **Placement** : À quatre pattes, mains sous les épaules, genoux sous les hanches.\n• **Mouvement** : Décollez les genoux de quelques centimètres et tenez.\n• **Focus** : Dos plat, poussez le sol.'}
        ],
        intermediate: [
            {n:'Pike Pushups', r:10, d:'Force verticale', h:'• **Placement** : Position de pompe, mais avancez les pieds pour avoir les fesses très hautes (V inversé).\n• **Mouvement** : Amenez le sommet du crâne devant vos mains au sol.'},
            {n:'Maintien Pike', r:30, s:1, d:'Isométrie', h:'• **Mouvement** : Tenez la position basse du Pike Pushup, tête juste au-dessus du sol.\n• **Focus** : Poussez activement dans le sol.'},
            {n:'Dips Épaules', r:15, d:'Scapula', h:'• **Placement** : Position de planche mains.\n• **Mouvement** : Laissez votre buste descendre entre vos épaules (bras tendus), puis remontez en arrondissant le haut du dos.'},
            {n:'Planche Lean', r:20, d:'Force avant', h:'• **Mouvement** : En planche mains, basculez le poids du corps le plus possible vers l\'avant sur les pointes de pieds.\n• **Focus** : Énorme tension sur l\'avant de l\'épaule.'},
            {n:'Pike Walk', r:8, d:'Marche ours', h:'• **Mouvement** : Gardez bras et jambes tendus, fesses hautes, et avancez en déplaçant main/pied opposés.'},
            {n:'Pike Tempo', r:8, d:'Descente lente', h:'• **Mouvement** : Pike pushup (fesses hautes) en descendant la tête en 3 secondes.\n• **Focus** : Contrôle, la tête passe devant les mains.'},
            {n:'Bear Crawl', r:20, d:'Marche de l\'ours', h:'• **Placement** : Position de l\'ours, genoux décollés.\n• **Mouvement** : Avancez main et pied opposés, puis reculez (20 pas).\n• **Focus** : Le dos reste plat, les genoux bas.'},
            {n:'Planche Chien Tête en Bas', r:12, d:'Planche vers V inversé', h:'• **Placement** : Position haute de pompe.\n• **Mouvement** : Poussez les fesses vers le haut pour former un V, puis revenez en planche.\n• **Focus** : Poussez fort dans les mains.'}
        ],
        advanced: [
            {n:'HSPU au Mur', r:5, d:'Handstand Pushup', h:'• **Placement** : Équilibre contre le mur, dos au mur.\n• **Mouvement** : Descendez la tête au sol et repoussez.\n• **Focus** : Gardez les coudes légèrement vers l\'intérieur.'},
            {n:'Handstand Hold', r:30, s:1, d:'Équilibre', h:'• **Mouvement** : Tenez l\'équilibre sur les mains contre le mur.\n• **Focus** : Repoussez activement le sol, ne vous "écrasez" pas dans vos épaules.'},
            {n:'Pike Pushups Elevé', r:10, d:'V Inversé +', h:'• **Placement** : Pieds sur une chaise, mains au sol proche de la chaise.\n• **Mouvement** : Descente verticale du buste.'},
            {n:'90 Degree Hold', r:10, s:1, d:'Statique', h:'• **Mouvement** : En bas d\'une pompe, basculez vers l\'avant et essayez de tenir le corps parallèle au sol.'},
            {n:'Marche Mains', r:5, d:'Agilité', h:'• **Mouvement** : Essayez de marcher sur les mains sur 1 ou 2 mètres (ou contre un mur).'},
            {n:'Taps Épaules en Équilibre', r:10, d:'Contre le mur', h:'• **Placement** : En équilibre sur les mains, ventre face au mur.\n• **Mouvement** : Touchez une épaule avec la main opposée, puis l\'autre.\n• **Sécurité** : Gardez le corps gainé.'},
            {n:'HSPU Négatives', r:5, d:'Descente contrôlée', h:'• **Placement** : Équilibre dos au mur.\n• **Mouvement** : Descendez la tête vers le sol en 4 à 5 secondes, puis redescendez les pieds.\n• **Focus** : Construit la force pour les HSPU complètes.'},
            {n:'Planche Lean Tenu', r:20, s:1, d:'Avant des épaules', h:'• **Placement** : Position haute de pompe.\n• **Mouvement** : Basculez les épaules loin devant les mains et tenez.\n• **Focus** : Bras tendus, corps gainé.'}
        ]
    },
    'Bras': {
        beginner: [
            {n:'Dips Chaise', r:12, d:'Triceps', h:'• **Placement** : Mains sur le bord d\'un support, jambes pliées.\n• **Mouvement** : Descendez les fesses vers le sol en pliant les bras.\n• **Focus** : Gardez le dos collé au support.'},
            {n:'Pompes Cobra', r:15, d:'Extension', h:'• **Placement** : Allongé sur le ventre, mains sous les épaules.\n• **Mouvement** : Poussez pour tendre les bras en gardant le bassin au sol.\n• **Focus** : Contractez les triceps en haut.'},
            {n:'Triceps au Mur', r:15, d:'Extension mur', h:'• **Placement** : Mains au mur, reculez les pieds.\n• **Mouvement** : Posez les avant-bras sur le mur puis repoussez avec les mains.'},
            {n:'Curl Bouteilles', r:20, d:'Biceps', h:'• **Mouvement** : Flexion de bras classique.\n• **Astuce** : Ne balancez pas le corps, seuls les avant-bras bougent.'},
            {n:'Crab Walk', r:30, d:'Bras dynamique', h:'• **Placement** : Assis, mains et pieds au sol, levez les fesses.\n• **Mouvement** : Avancez ou reculez dans cette position.'},
            {n:'Pompes Diamant Genoux', r:10, d:'Triceps facile', h:'• **Placement** : Sur les genoux, mains rapprochées en losange.\n• **Mouvement** : Descendez la poitrine vers les mains, puis poussez.\n• **Focus** : Coudes le long du corps.'},
            {n:'Curl Main Contre Main', r:20, s:1, d:'Biceps isométrique', h:'• **Placement** : Debout, coude plié à 90°, l\'autre main posée sur le poignet.\n• **Mouvement** : Tentez de plier le bras pendant que l\'autre main résiste. Changez de bras à mi-temps.\n• **Focus** : Poussez fort, sans bloquer la respiration.'},
            {n:'Triceps Mur Serré', r:12, d:'Debout face au mur', h:'• **Placement** : Mains au mur, serrées, à hauteur de poitrine.\n• **Mouvement** : Pliez les bras en gardant les coudes collés au corps, puis repoussez.\n• **Focus** : Ce sont les triceps qui poussent.'}
        ],
        intermediate: [
            {n:'Pompes Diamant', r:12, d:'Triceps focus', h:'• **Mouvement** : Pompes mains serrées.\n• **Focus** : Les coudes doivent rester proches du corps.'},
            {n:'Extension Sol', r:10, d:'Skullcrusher BW', h:'• **Placement** : En planche coudes.\n• **Mouvement** : Poussez sur vos paumes pour décoller les coudes du sol simultanément.'},
            {n:'Biceps Serviette', r:15, d:'Isométrie active', h:'• **Mouvement** : Passez une serviette sous votre cuisse. Saisissez les bouts et tirez vers le haut comme un curl biceps.\n• **Focus** : Créez votre propre résistance avec votre jambe.'},
            {n:'Dips Banc', r:15, d:'Charge +', h:'• **Placement** : Même que beginner mais avec les jambes tendues devant vous.'},
            {n:'Pompes Sphinx', r:10, d:'Triceps isolés', h:'• **Mouvement** : Depuis la planche coudes, montez en planche mains en utilisant uniquement la force des triceps.'},
            {n:'Pompes Coudes Serrés', r:12, d:'Triceps', h:'• **Placement** : Mains sous les épaules.\n• **Mouvement** : Descendez en frôlant les côtes avec les coudes, puis poussez.\n• **Focus** : Les coudes ne s\'écartent pas.'},
            {n:'Planche Haute-Basse', r:12, d:'Coudes puis mains', h:'• **Mouvement** : Passez de la planche sur les avant-bras à la planche bras tendus, un bras après l\'autre, puis redescendez.\n• **Focus** : Le bassin reste immobile.'},
            {n:'Curl Sous la Cuisse', r:20, s:1, d:'Biceps isométrique', h:'• **Placement** : Assis, une jambe pliée, mains jointes sous la cuisse.\n• **Mouvement** : Tirez vers le haut avec les bras pendant que la jambe résiste. Changez de jambe à mi-temps.\n• **Focus** : Gardez le dos droit.'}
        ],
        advanced: [
            {n:'Extension 1 bras', r:8, d:'Force triceps', h:'• **Mouvement** : Faites l\'extension triceps au mur ou au sol avec un seul bras.'},
            {n:'Dips Profonds', r:12, d:'Étirement', h:'• **Mouvement** : Dips entre deux supports (ex: deux chaises stables) pour descendre plus bas que les mains.'},
            {n:'Mains Inversées', r:10, d:'Pompes Biceps', h:'• **Placement** : Mains au sol avec les doigts pointés vers vos pieds.\n• **Mouvement** : En descendant, le focus bascule sur les biceps.'},
            {n:'Dips Explosifs', r:8, d:'Puissance bras', h:'• **Mouvement** : Poussez si fort en dips que vos mains quittent le support.'},
            {n:'Pompes Triceps Pure', r:10, d:'Coudes fermés', h:'• **Placement** : Mains très basses, proches des hanches, coudes serrés contre les côtes.\n• **Focus** : Isolation maximale.'},
            {n:'Pompes Diamant Explosives', r:8, d:'Puissance triceps', h:'• **Mouvement** : Pompe diamant poussée assez fort pour décoller les mains.\n• **Sécurité** : Réception bras légèrement pliés.'},
            {n:'Pompes Tigre', r:8, d:'Triceps intenses', h:'• **Placement** : Planche sur les avant-bras, mains à plat.\n• **Mouvement** : Poussez sur les mains pour décoller les coudes et tendre les bras, puis redescendez sur les avant-bras.\n• **Focus** : Mouvement lent et contrôlé.'},
            {n:'Dips au Sol 1 Jambe', r:10, d:'Une jambe tendue', h:'• **Placement** : Assis, mains au sol derrière les hanches, fesses décollées, une jambe tendue en l\'air.\n• **Mouvement** : Pliez et tendez les bras.\n• **Focus** : Changez de jambe à mi-série.'}
        ]
    }
};
