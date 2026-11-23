/* Bibliothèque des exercices au poids du corps : 6 groupes × 3 niveaux × 8 exercices (144), tous faisables à la maison.
   Chaque exercice : n = nom, r = répétitions (ou secondes si s:1 = exercice tenu), d = description courte,
   h = guide du bouton « ? » : 3 lignes Position / Mouvement / Attention, tutoiement, 80 caractères max par ligne (un test le vérifie). */
const exerciseLibrary = {
    'Pectoraux': {
        beginner: [
            {n:'Pompes Genoux', r:12, d:'Genoux posés', h:'• **Position** : Genoux au sol, mains un peu plus larges que les épaules.\n• **Mouvement** : Descends la poitrine près du sol, puis pousse.\n• **Attention** : Hanches et dos bien alignés, pas les fesses en l\'air.'},
            {n:'Pompes Inclinées', r:15, d:'Mains surélevées', h:'• **Position** : Mains sur un meuble stable (canapé, table basse).\n• **Mouvement** : Descends la poitrine vers le meuble, puis pousse.\n• **Attention** : Plus le meuble est haut, plus c\'est facile.'},
            {n:'Pompes au Mur', r:20, d:'Debout face au mur', h:'• **Position** : Debout face au mur, mains à hauteur d\'épaules.\n• **Mouvement** : Approche le nez du mur, puis repousse.\n• **Attention** : Corps droit comme une planche, ne plie pas les hanches.'},
            {n:'Dips au sol', r:12, d:'Triceps & Bas Pecs', h:'• **Position** : Assis, mains au sol derrière les fesses, doigts vers toi.\n• **Mouvement** : Lève les fesses, plie les bras, puis tends-les fort.\n• **Attention** : Garde les épaules loin des oreilles.'},
            {n:'Pompes Larges', r:10, d:'Focus Pectoraux', h:'• **Position** : Mains très écartées, une fois et demie tes épaules.\n• **Mouvement** : Descends lentement, puis pousse.\n• **Attention** : Arrête plus haut si l\'épaule tire.'},
            {n:'Pompes Négatives Genoux', r:8, d:'Descente lente', h:'• **Position** : Genoux au sol, mains un peu plus larges que les épaules.\n• **Mouvement** : Descends en 3 secondes, puis remonte comme tu peux.\n• **Attention** : La descente lente prépare aux vraies pompes.'},
            {n:'Pompes Mur Larges', r:15, d:'Debout face au mur', h:'• **Position** : Debout face au mur, mains bien plus larges que les épaules.\n• **Mouvement** : Approche la poitrine du mur, puis repousse.\n• **Attention** : Sens l\'étirement des pectoraux en bas.'},
            {n:'Planche Haute', r:25, s:1, d:'Gainage bras tendus', h:'• **Position** : Position haute de pompe, mains sous les épaules.\n• **Mouvement** : Tiens le corps droit, sans bouger.\n• **Attention** : Fessiers et ventre serrés, respire calmement.'}
        ],
        intermediate: [
            {n:'Pompes Classiques', r:15, d:'Standard', h:'• **Position** : Mains sous les épaules, corps droit, fessiers serrés.\n• **Mouvement** : Descends la poitrine près du sol, puis pousse.\n• **Attention** : Ne laisse pas le bas du dos se creuser.'},
            {n:'Pompes Diamant', r:12, d:'Mains serrées', h:'• **Position** : Mains rapprochées, pouces et index en forme de losange.\n• **Mouvement** : Descends la poitrine sur tes mains, puis pousse.\n• **Attention** : Coudes le long du corps.'},
            {n:'Pompes Déclinées', r:12, d:'Pieds surélevés', h:'• **Position** : Pieds surélevés (marche, canapé), mains au sol.\n• **Mouvement** : Descends la poitrine près du sol, puis pousse.\n• **Attention** : Regarde le sol, la nuque reste droite.'},
            {n:'Pompes Spiderman', r:10, d:'Gainage actif', h:'• **Position** : Position de pompe classique.\n• **Mouvement** : En descendant, amène le genou vers le coude du même côté.\n• **Attention** : Change de côté à chaque pompe.'},
            {n:'Pompes Décalées', r:12, d:'Asymétriques', h:'• **Position** : Une main près du visage, l\'autre près des côtes.\n• **Mouvement** : Fais tes pompes, puis inverse les mains à la série suivante.\n• **Attention** : Le corps reste droit, sans tourner.'},
            {n:'Pompes Tempo', r:10, d:'3 s en descente', h:'• **Position** : Position de pompe classique.\n• **Mouvement** : Descends en 3 secondes, remonte en 1 seconde.\n• **Attention** : Le corps reste droit du début à la fin.'},
            {n:'Pompes Hindoues', r:10, d:'Vague du corps', h:'• **Position** : Départ en V à l\'envers, fesses en l\'air, mains au sol.\n• **Mouvement** : Plonge la poitrine en avant près du sol, finis buste relevé.\n• **Attention** : Mouvement fluide, sans secousse.'},
            {n:'Pompes Larges Pause', r:10, d:'Pause en bas', h:'• **Position** : Mains très écartées.\n• **Mouvement** : Descends, tiens 2 secondes en bas, puis pousse.\n• **Attention** : Arrête plus haut si l\'épaule tire.'}
        ],
        advanced: [
            {n:'Pompes Archer', r:10, d:'Bras tendu latéral', h:'• **Position** : Mains très écartées.\n• **Mouvement** : Descends sur un bras, l\'autre bras reste tendu sur le côté.\n• **Attention** : Alterne les côtés, garde le corps gainé.'},
            {n:'Pompes Explosives', r:12, d:'Puissance', h:'• **Position** : Position de pompe classique.\n• **Mouvement** : Pousse si fort que tes mains décollent du sol.\n• **Attention** : Atterris bras légèrement pliés pour amortir.'},
            {n:'Pompes 1 Bras', r:5, d:'Force pure', h:'• **Position** : Pieds très écartés, une main dans le dos.\n• **Mouvement** : Descends sur un seul bras, puis pousse.\n• **Attention** : Garde les épaules parallèles au sol.'},
            {n:'Pompes Claquées', r:8, d:'Saut avec clap', h:'• **Position** : Position de pompe classique.\n• **Mouvement** : Pousse fort, tape dans tes mains, puis reprends appui.\n• **Attention** : Atterris en douceur, bras légèrement pliés.'},
            {n:'Pseudo Planche', r:8, d:'Épaules en avant', h:'• **Position** : Mains tournées vers l\'extérieur, au niveau de la taille.\n• **Mouvement** : Bascule le poids vers l\'avant et fais une pompe.\n• **Attention** : Très dur pour les poignets : chauffe-les avant.'},
            {n:'Pompes Superman', r:8, d:'Envol complet', h:'• **Position** : Position de pompe classique.\n• **Mouvement** : Pousse fort : mains et pieds décollent, bras tendus devant.\n• **Attention** : Maîtrise d\'abord les pompes claquées.'},
            {n:'Pompes Typewriter', r:8, d:'Glissé latéral', h:'• **Position** : Mains très écartées.\n• **Mouvement** : Descends sur un bras, glisse vers l\'autre bras en restant bas.\n• **Attention** : La poitrine reste près du sol pendant le glissé.'},
            {n:'Pompes Doigts', r:8, d:'Sur le bout des doigts', h:'• **Position** : Appui sur le bout des doigts écartés, paumes en l\'air.\n• **Mouvement** : Fais des pompes lentes.\n• **Attention** : Commence sur les genoux si les doigts fatiguent.'}
        ]
    },
    'Dos': {
        beginner: [
            {n:'Superman', r:20, d:'Lombaires', h:'• **Position** : Allongé sur le ventre, bras tendus devant.\n• **Mouvement** : Décolle en même temps le buste et les jambes.\n• **Attention** : Regarde le sol pour protéger la nuque.'},
            {n:'Bird Dog', r:12, d:'Équilibre & Dos', h:'• **Position** : À quatre pattes, mains sous les épaules.\n• **Mouvement** : Tends un bras et la jambe opposée, tiens 2 secondes.\n• **Attention** : Le bassin reste bien à plat.'},
            {n:'Anges au sol', r:15, d:'Mobilité omoplates', h:'• **Position** : Sur le ventre, front au sol, bras en V devant.\n• **Mouvement** : Décolle les bras et fais un grand arc jusqu\'aux fesses.\n• **Attention** : Bras tendus, ils ne touchent jamais le sol.'},
            {n:'Wall Slide', r:12, d:'Posture', h:'• **Position** : Dos, fesses et tête contre le mur, bras en W.\n• **Mouvement** : Fais glisser les bras vers le haut, puis redescends.\n• **Attention** : Les poignets restent collés au mur.'},
            {n:'Tirage Serviette', r:15, d:'Contraction dos', h:'• **Position** : Debout, serviette tendue devant toi, une main à chaque bout.\n• **Mouvement** : Tire la serviette vers ta poitrine en écartant les coudes.\n• **Attention** : Imagine que tu veux la déchirer.'},
            {n:'Superman Alterné', r:20, d:'Bras et jambe opposés', h:'• **Position** : Allongé sur le ventre, bras tendus devant.\n• **Mouvement** : Lève un bras et la jambe opposée, puis change.\n• **Attention** : Regarde le sol.'},
            {n:'Y-T-W au Sol', r:12, d:'Haut du dos', h:'• **Position** : Allongé sur le ventre, front près du sol.\n• **Mouvement** : Décolle les bras en Y, puis en T, puis en W.\n• **Attention** : Serre les omoplates à chaque lettre.'},
            {n:'Chat-Vache', r:12, d:'Mobilité du dos', h:'• **Position** : À quatre pattes, mains sous les épaules.\n• **Mouvement** : Arrondis le dos en soufflant, puis creuse-le en inspirant.\n• **Attention** : Mouvement lent, sans forcer.'}
        ],
        intermediate: [
            {n:'Nageur', r:40, d:'Endurance dorsale', h:'• **Position** : Allongé sur le ventre, bras et jambes tendus.\n• **Mouvement** : Bats des bras et des jambes en alterné, comme en nageant.\n• **Attention** : Ne touche plus le sol pendant l\'exercice.'},
            {n:'Tirage Porte', r:15, d:'Traction horizontale', h:'• **Position** : Mains sur l\'encadrement d\'une porte ouverte.\n• **Mouvement** : Penche-toi en arrière, puis tire ta poitrine vers la porte.\n• **Attention** : Serre les omoplates à la fin du tirage.'},
            {n:'Pompes Australiennes', r:12, d:'Sous table', h:'• **Position** : Allongé sous une table solide, mains sur le bord.\n• **Mouvement** : Tire ta poitrine vers la table, corps bien droit.\n• **Attention** : Vérifie d\'abord que la table ne bouge pas.'},
            {n:'Superman Iso', r:30, s:1, d:'Gainage dorsal', h:'• **Position** : Allongé sur le ventre, bras tendus devant.\n• **Mouvement** : Décolle buste et jambes et tiens la position.\n• **Attention** : Continue de respirer calmement.'},
            {n:'Good Morning', r:20, d:'Chaîne postérieure', h:'• **Position** : Debout, mains derrière la tête.\n• **Mouvement** : Penche le buste en avant, dos plat, jambes presque tendues.\n• **Attention** : Tu dois sentir l\'arrière des cuisses tirer.'},
            {n:'Superman Tirage', r:15, d:'Tirage sans matériel', h:'• **Position** : Sur le ventre, bras tendus devant, buste un peu décollé.\n• **Mouvement** : Ramène les coudes vers les côtes, puis tends les bras.\n• **Attention** : Imagine glisser tes coudes dans tes poches arrière.'},
            {n:'Planche Inversée', r:30, s:1, d:'Dos et fessiers', h:'• **Position** : Assis, jambes tendues, mains au sol derrière les hanches.\n• **Mouvement** : Lève le bassin : épaules, hanches et talons alignés. Tiens.\n• **Attention** : Pousse la poitrine vers le plafond.'},
            {n:'Bird Dog Coude-Genou', r:12, d:'Gainage dynamique', h:'• **Position** : À quatre pattes, mains sous les épaules.\n• **Mouvement** : Tends bras et jambe opposés, puis ramène coude et genou.\n• **Attention** : Le bassin ne bascule pas.'}
        ],
        advanced: [
            {n:'Wall Walk', r:5, d:'Gainage total', h:'• **Position** : En position de pompe, pieds contre le mur.\n• **Mouvement** : Monte les pieds le long du mur en reculant les mains.\n• **Attention** : Ventre serré, redescends tranquillement.'},
            {n:'Hollow Rock', r:30, d:'Bascule gainée', h:'• **Position** : Sur le dos, bras et jambes tendus et décollés.\n• **Mouvement** : Balance-toi d\'avant en arrière sans casser la forme.\n• **Attention** : Si le dos décolle, plie un peu les jambes.'},
            {n:'Tirage 1 bras table', r:8, d:'Force unilatérale', h:'• **Position** : Sous une table solide, une seule main sur le bord.\n• **Mouvement** : Tire ta poitrine vers la table, corps droit.\n• **Attention** : Serre le ventre pour ne pas tourner.'},
            {n:'Back Bridge', r:15, d:'Le Pont', h:'• **Position** : Sur le dos, mains au sol près des oreilles, pieds à plat.\n• **Mouvement** : Pousse sur mains et pieds pour arquer tout le corps.\n• **Attention** : Monte doucement, sans forcer le bas du dos.'},
            {n:'Superman Arqué', r:20, d:'Amplitude', h:'• **Position** : Allongé sur le ventre, bras tendus devant.\n• **Mouvement** : Fais un Superman en décollant les cuisses au maximum.\n• **Attention** : Fessiers serrés, nuque dans l\'alignement.'},
            {n:'Arch Hold Bras Tendus', r:30, s:1, d:'Banane inversée', h:'• **Position** : Allongé sur le ventre, bras tendus au-dessus de la tête.\n• **Mouvement** : Décolle bras, buste et jambes, et tiens.\n• **Attention** : Fessiers serrés, regarde le sol.'},
            {n:'Planche Inversée 1 Jambe', r:20, s:1, d:'Gainage arrière', h:'• **Position** : Assis, mains derrière les hanches, bassin levé.\n• **Mouvement** : Lève une jambe tendue et tiens. Change à mi-temps.\n• **Attention** : Le bassin ne descend pas.'},
            {n:'Good Morning 1 Jambe', r:12, d:'Chaîne postérieure', h:'• **Position** : Debout sur une jambe, mains derrière la tête.\n• **Mouvement** : Penche le buste, l\'autre jambe tendue derrière, puis remonte.\n• **Attention** : Dos plat, prends ton temps pour l\'équilibre.'}
        ]
    },
    'Jambes': {
        beginner: [
            {n:'Squat Classique', r:20, d:'Bases', h:'• **Position** : Debout, pieds largeur d\'épaules.\n• **Mouvement** : Descends les fesses en arrière comme pour t\'asseoir, puis remonte.\n• **Attention** : Dos droit, talons collés au sol.'},
            {n:'Glute Bridge', r:20, d:'Fessiers', h:'• **Position** : Sur le dos, genoux pliés, pieds à plat.\n• **Mouvement** : Monte le bassin vers le plafond, puis redescends.\n• **Attention** : Serre fort les fessiers en haut.'},
            {n:'Fentes Arrière', r:12, d:'Équilibre', h:'• **Position** : Debout, pieds serrés.\n• **Mouvement** : Fais un grand pas en arrière, genou arrière vers le sol, puis reviens.\n• **Attention** : Le genou avant reste au-dessus de la cheville.'},
            {n:'Chaise Murale', r:30, s:1, d:'Isométrie', h:'• **Position** : Dos contre le mur, cuisses à l\'horizontale.\n• **Mouvement** : Ne bouge plus et tiens.\n• **Attention** : Appuie bien les talons dans le sol.'},
            {n:'Montée Mollets', r:25, d:'Cheville', h:'• **Position** : Debout, pieds à plat.\n• **Mouvement** : Monte sur la pointe des pieds le plus haut possible.\n• **Attention** : Redescends lentement.'},
            {n:'Fentes Avant', r:12, d:'Pas en avant', h:'• **Position** : Debout, pieds serrés.\n• **Mouvement** : Grand pas en avant, genou arrière vers le sol, puis reviens.\n• **Attention** : Buste droit, genou avant au-dessus de la cheville.'},
            {n:'Pont Fessier Tenu', r:30, s:1, d:'Fessiers', h:'• **Position** : Sur le dos, genoux pliés, pieds à plat.\n• **Mouvement** : Monte le bassin et tiens en serrant les fessiers.\n• **Attention** : Ne creuse pas le bas du dos.'},
            {n:'Kickback Fessier', r:15, d:'À quatre pattes', h:'• **Position** : À quatre pattes.\n• **Mouvement** : Pousse un talon vers le plafond, genou plié, puis redescends.\n• **Attention** : Dos plat. Change de jambe à mi-série.'}
        ],
        intermediate: [
            {n:'Squat Jumps', r:15, d:'Explosif', h:'• **Position** : Debout, pieds largeur d\'épaules.\n• **Mouvement** : Fais un squat, puis saute le plus haut possible.\n• **Attention** : Atterris en souplesse, genoux un peu pliés.'},
            {n:'Fentes Bulgares', r:12, d:'Unilatéral', h:'• **Position** : Dos à une chaise, un pied posé dessus derrière toi.\n• **Mouvement** : Descends sur la jambe avant, puis remonte.\n• **Attention** : Buste droit. Change de jambe à mi-série.'},
            {n:'Fentes Latérales', r:16, d:'Adducteurs', h:'• **Position** : Debout, pieds serrés.\n• **Mouvement** : Grand pas sur le côté, descends sur cette jambe, l\'autre tendue.\n• **Attention** : Garde le buste le plus droit possible.'},
            {n:'Pont 1 jambe', r:12, d:'Fessier intense', h:'• **Position** : Sur le dos, un pied au sol, l\'autre jambe tendue en l\'air.\n• **Mouvement** : Monte le bassin en poussant sur un seul talon.\n• **Attention** : Change de jambe à mi-série.'},
            {n:'Squat Sumo', r:20, d:'Intérieur cuisses', h:'• **Position** : Pieds très écartés, pointes vers l\'extérieur.\n• **Mouvement** : Descends bas en ouvrant bien les genoux.\n• **Attention** : Les genoux suivent la direction des pieds.'},
            {n:'Squat Pause', r:15, d:'Pause en bas', h:'• **Position** : Debout, pieds largeur d\'épaules.\n• **Mouvement** : Descends en squat, tiens 3 secondes en bas, puis remonte.\n• **Attention** : Talons au sol, poitrine haute.'},
            {n:'Fentes Marchées', r:20, d:'En avançant', h:'• **Position** : Debout, pieds serrés.\n• **Mouvement** : Enchaîne les fentes en avançant, une jambe puis l\'autre.\n• **Attention** : Pas de place ? Avance d\'un pas puis reviens.'},
            {n:'Squat 1 et Demi', r:12, d:'Double descente', h:'• **Position** : Debout, pieds largeur d\'épaules.\n• **Mouvement** : Descends, remonte à moitié, redescends, puis remonte : ça fait 1.\n• **Attention** : Ça brûle dans les cuisses, c\'est normal.'}
        ],
        advanced: [
            {n:'Pistol Squat', r:8, d:'Équilibre & Force', h:'• **Position** : Debout sur une jambe, l\'autre tendue devant.\n• **Mouvement** : Descends sur une jambe, puis remonte.\n• **Attention** : Tiens un mur au début pour l\'équilibre.'},
            {n:'Nordic Curl Sol', r:8, d:'Ischios', h:'• **Position** : À genoux, pieds coincés sous un meuble lourd.\n• **Mouvement** : Penche-toi en avant le plus lentement possible.\n• **Attention** : Mets les mains devant toi pour amortir.'},
            {n:'Sauts Groupés', r:12, d:'Pliométrie', h:'• **Position** : Debout, pieds largeur d\'épaules.\n• **Mouvement** : Saute et ramène les deux genoux contre la poitrine.\n• **Attention** : Rebondis vite, atterris en souplesse.'},
            {n:'Fentes Sautant', r:20, d:'Cardio Force', h:'• **Position** : En position de fente.\n• **Mouvement** : Saute et change de jambe en l\'air.\n• **Attention** : Le buste reste droit et gainé.'},
            {n:'Cossack Squats', r:16, d:'Mobilité', h:'• **Position** : Pieds très écartés.\n• **Mouvement** : Descends sur une jambe jusqu\'en bas, l\'autre reste tendue.\n• **Attention** : Alterne les côtés, talon au sol.'},
            {n:'Skater Squat', r:8, d:'Squat sur une jambe', h:'• **Position** : Debout sur une jambe, l\'autre pliée derrière toi.\n• **Mouvement** : Descends jusqu\'à frôler le sol avec le genou arrière.\n• **Attention** : Bras devant pour l\'équilibre. Change à mi-série.'},
            {n:'Squat Sauté 180°', r:12, d:'Saut avec demi-tour', h:'• **Position** : Debout, pieds largeur d\'épaules.\n• **Mouvement** : Squat, puis saute en faisant un demi-tour.\n• **Attention** : Atterris en souplesse, repars dans l\'autre sens.'},
            {n:'Sissy Squat', r:10, d:'Quadriceps', h:'• **Position** : Debout sur la pointe des pieds.\n• **Mouvement** : Penche-toi en arrière en avançant les genoux vers le sol.\n• **Attention** : Descends peu au début.'}
        ]
    },
    'Abdos': {
        beginner: [
            {n:'Planche', r:30, s:1, d:'Gainage', h:'• **Position** : Sur les avant-bras et la pointe des pieds.\n• **Mouvement** : Tiens le corps droit comme une planche.\n• **Attention** : Ne laisse pas tomber le bassin.'},
            {n:'Crunch', r:20, d:'Haut des abdos', h:'• **Position** : Sur le dos, genoux pliés, mains aux tempes.\n• **Mouvement** : Enroule le buste pour décoller les omoplates.\n• **Attention** : Regarde le plafond, ne tire pas sur la nuque.'},
            {n:'Dead Bug', r:16, d:'Dos protégé', h:'• **Position** : Sur le dos, bras vers le plafond, genoux pliés en l\'air.\n• **Mouvement** : Descends un bras et la jambe opposée, puis change.\n• **Attention** : Le bas du dos reste collé au sol.'},
            {n:'Toucher Chevilles', r:30, d:'Obliques', h:'• **Position** : Sur le dos, genoux pliés, épaules décollées.\n• **Mouvement** : Touche un talon avec la main, puis l\'autre.\n• **Attention** : Les épaules restent décollées.'},
            {n:'Mountain Climber lent', r:20, d:'Contrôle', h:'• **Position** : Position haute de pompe.\n• **Mouvement** : Ramène un genou vers la poitrine, puis l\'autre.\n• **Attention** : Souffle fort à chaque genou, le corps ne bouge pas.'},
            {n:'Relevés de Bassin', r:15, d:'Bas des abdos', h:'• **Position** : Sur le dos, genoux pliés au-dessus des hanches.\n• **Mouvement** : Décolle un peu le bassin en ramenant les genoux vers toi.\n• **Attention** : Petit mouvement, sans élan.'},
            {n:'Planche Genoux', r:30, s:1, d:'Gainage facile', h:'• **Position** : Sur les avant-bras et les genoux.\n• **Mouvement** : Aligne tête, dos et genoux, et tiens.\n• **Attention** : Rentre le ventre.'},
            {n:'Crunch Croisé', r:20, d:'Obliques', h:'• **Position** : Sur le dos, genoux pliés, mains aux tempes.\n• **Mouvement** : Amène un coude vers le genou opposé, puis change.\n• **Attention** : Ne tire pas sur la nuque.'}
        ],
        intermediate: [
            {n:'V-Ups', r:15, d:'Complet', h:'• **Position** : Sur le dos, bras et jambes tendus.\n• **Mouvement** : Lève buste et jambes ensemble pour toucher tes pieds.\n• **Attention** : Redescends doucement, sans tomber.'},
            {n:'Russian Twists', r:30, d:'Rotation', h:'• **Position** : Assis, pieds décollés, mains jointes.\n• **Mouvement** : Touche le sol à gauche, puis à droite.\n• **Attention** : Suis tes mains du regard.'},
            {n:'Planche Latérale', r:30, s:1, d:'Taille', h:'• **Position** : Sur un avant-bras, de profil, jambes tendues.\n• **Mouvement** : Aligne tête, hanches et pieds, et tiens.\n• **Attention** : Change de côté à mi-temps.'},
            {n:'Flutter Kicks', r:40, d:'Bas des abdos', h:'• **Position** : Sur le dos, mains sous les fesses, jambes tendues.\n• **Mouvement** : Fais de petits battements de jambes près du sol.\n• **Attention** : Le bas du dos reste collé au sol.'},
            {n:'Rotation Planche', r:20, d:'Mobilité', h:'• **Position** : Planche sur les avant-bras.\n• **Mouvement** : Tourne le bassin pour toucher le sol d\'une hanche, puis l\'autre.\n• **Attention** : Mouvement contrôlé, sans élan.'},
            {n:'Bicycle Crunch', r:30, d:'Pédalage', h:'• **Position** : Sur le dos, mains aux tempes, jambes en l\'air.\n• **Mouvement** : Pédale en amenant chaque coude vers le genou opposé.\n• **Attention** : Lentement, en tournant bien les épaules.'},
            {n:'Ciseaux', r:30, d:'Jambes tendues', h:'• **Position** : Sur le dos, mains sous les fesses, jambes tendues et levées.\n• **Mouvement** : Croise et décroise les jambes.\n• **Attention** : Le bas du dos reste collé au sol.'},
            {n:'Hollow Hold', r:30, s:1, d:'Banane tenue', h:'• **Position** : Sur le dos, bras et jambes tendus et décollés.\n• **Mouvement** : Tiens la position, dos plaqué au sol.\n• **Attention** : Plie les genoux si le dos décolle.'}
        ],
        advanced: [
            {n:'L-Sit', r:20, s:1, d:'Statique', h:'• **Position** : Assis, mains au sol près des hanches.\n• **Mouvement** : Pousse pour décoller fesses et pieds, jambes tendues.\n• **Attention** : Pose les mains sur des livres pour gagner de la hauteur.'},
            {n:'Hollow Rock', r:30, d:'Banane dynamique', h:'• **Position** : Sur le dos, bras et jambes tendus et décollés.\n• **Mouvement** : Balance-toi d\'avant en arrière sans casser la forme.\n• **Attention** : Si le dos décolle, plie un peu les jambes.'},
            {n:'Essuie-glaces', r:12, d:'Obliques force', h:'• **Position** : Sur le dos, jambes tendues vers le plafond.\n• **Mouvement** : Descends les jambes d\'un côté, puis de l\'autre.\n• **Attention** : Les pieds ne touchent pas le sol.'},
            {n:'Dragon Flag', r:8, d:'Levier', h:'• **Position** : Allongé, mains accrochées à un meuble lourd derrière la tête.\n• **Mouvement** : Lève tout le corps droit, puis redescends d\'un bloc.\n• **Attention** : Exercice très dur : descends lentement.'},
            {n:'Planche Commando', r:20, d:'Dynamique', h:'• **Position** : Planche sur les avant-bras.\n• **Mouvement** : Monte sur une main, puis l\'autre, puis redescends.\n• **Attention** : Le bassin bouge le moins possible.'},
            {n:'Planche RKC', r:20, s:1, d:'Gainage maximal', h:'• **Position** : Planche sur les avant-bras, coudes un peu en avant.\n• **Mouvement** : Serre tout : poings, ventre, fessiers, cuisses. Tiens.\n• **Attention** : 20 secondes très intenses, respire.'},
            {n:'V-Sit Tenu', r:20, s:1, d:'Équilibre en V', h:'• **Position** : Assis, bras devant toi.\n• **Mouvement** : Lève les jambes tendues pour former un V, et tiens.\n• **Attention** : Plie les genoux au début.'},
            {n:'Mountain Climber Rapide', r:30, d:'Cardio gainage', h:'• **Position** : Position haute de pompe.\n• **Mouvement** : Ramène les genoux vers la poitrine, vite, en alternant.\n• **Attention** : Les hanches restent basses.'}
        ]
    },
    'Épaules': {
        beginner: [
            {n:'Cercles Bras', r:45, s:1, d:'Endurance', h:'• **Position** : Debout, bras tendus sur les côtés.\n• **Mouvement** : Fais de petits cercles rapides avec les bras.\n• **Attention** : Garde les épaules basses, loin des oreilles.'},
            {n:'I-Y-T Mouvement', r:15, d:'Posture', h:'• **Position** : Debout, buste un peu penché en avant.\n• **Mouvement** : Fais un I (bras en haut), un Y, puis un T avec tes bras.\n• **Attention** : Serre fort les omoplates sur le T.'},
            {n:'Tap Épaules', r:20, d:'Stabilité', h:'• **Position** : Position haute de pompe.\n• **Mouvement** : Touche une épaule avec la main opposée, puis change.\n• **Attention** : Le bassin ne doit pas bouger.'},
            {n:'Pompes Hautes', r:12, d:'Deltoïdes', h:'• **Position** : Position de pompe, mains loin devant toi.\n• **Mouvement** : Fais une petite descente, le poids sur les épaules.\n• **Attention** : Corps gainé du début à la fin.'},
            {n:'Shrugs', r:20, d:'Trapèzes', h:'• **Position** : Debout, bras le long du corps.\n• **Mouvement** : Monte les épaules vers les oreilles, tiens 2 secondes.\n• **Attention** : Relâche doucement.'},
            {n:'Pike Genoux', r:10, d:'V inversé facile', h:'• **Position** : À genoux, mains au sol devant toi, fesses hautes.\n• **Mouvement** : Plie les bras pour approcher le front du sol, puis pousse.\n• **Attention** : Les coudes restent près du corps.'},
            {n:'Élévations en Y', r:15, d:'Debout', h:'• **Position** : Debout, buste un peu penché en avant.\n• **Mouvement** : Lève les bras tendus en Y au-dessus de la tête, puis redescends.\n• **Attention** : Lentement, épaules basses.'},
            {n:'Ours Tenu', r:20, s:1, d:'Genoux décollés', h:'• **Position** : À quatre pattes, mains sous les épaules, genoux sous les hanches.\n• **Mouvement** : Décolle les genoux de quelques centimètres et tiens.\n• **Attention** : Dos plat, pousse le sol.'}
        ],
        intermediate: [
            {n:'Pike Pushups', r:10, d:'Force verticale', h:'• **Position** : En V à l\'envers : fesses hautes, mains et pieds au sol.\n• **Mouvement** : Descends le haut de la tête devant tes mains, puis pousse.\n• **Attention** : Les coudes restent près du corps.'},
            {n:'Maintien Pike', r:30, s:1, d:'Isométrie', h:'• **Position** : En V à l\'envers, tête juste au-dessus du sol.\n• **Mouvement** : Tiens la position basse.\n• **Attention** : Pousse fort dans le sol avec les mains.'},
            {n:'Dips Épaules', r:15, d:'Scapula', h:'• **Position** : Position haute de pompe, bras tendus.\n• **Mouvement** : Laisse descendre le buste entre les épaules, puis remonte.\n• **Attention** : Les bras restent tendus tout le temps.'},
            {n:'Planche Lean', r:20, d:'Force avant', h:'• **Position** : Position haute de pompe.\n• **Mouvement** : Avance les épaules loin devant les mains, puis reviens.\n• **Attention** : Ça tire fort à l\'avant des épaules, c\'est normal.'},
            {n:'Pike Walk', r:8, d:'Marche ours', h:'• **Position** : En V à l\'envers, bras et jambes tendus.\n• **Mouvement** : Avance en bougeant une main et le pied opposé.\n• **Attention** : Les fesses restent hautes.'},
            {n:'Pike Tempo', r:8, d:'Descente lente', h:'• **Position** : En V à l\'envers, fesses hautes.\n• **Mouvement** : Descends la tête vers le sol en 3 secondes, puis pousse.\n• **Attention** : La tête passe devant les mains.'},
            {n:'Bear Crawl', r:20, d:'Marche de l\'ours', h:'• **Position** : À quatre pattes, genoux décollés.\n• **Mouvement** : Avance main et pied opposés, puis recule (20 pas).\n• **Attention** : Dos plat, genoux bas.'},
            {n:'Planche Chien Tête en Bas', r:12, d:'Planche vers V inversé', h:'• **Position** : Position haute de pompe.\n• **Mouvement** : Monte les fesses en V à l\'envers, puis reviens en planche.\n• **Attention** : Pousse fort dans les mains.'}
        ],
        advanced: [
            {n:'HSPU au Mur', r:5, d:'Handstand Pushup', h:'• **Position** : En équilibre sur les mains, dos au mur.\n• **Mouvement** : Descends la tête vers le sol, puis repousse.\n• **Attention** : Coudes légèrement vers l\'intérieur.'},
            {n:'Handstand Hold', r:30, s:1, d:'Équilibre', h:'• **Position** : En équilibre sur les mains, contre le mur.\n• **Mouvement** : Tiens la position.\n• **Attention** : Pousse le sol, ne t\'écrase pas dans les épaules.'},
            {n:'Pike Pushups Elevé', r:10, d:'V Inversé +', h:'• **Position** : Pieds sur une chaise, mains au sol près de la chaise.\n• **Mouvement** : Descends la tête vers le sol, puis pousse.\n• **Attention** : Les fesses restent au-dessus des épaules.'},
            {n:'90 Degree Hold', r:10, s:1, d:'Statique', h:'• **Position** : En bas d\'une pompe.\n• **Mouvement** : Bascule en avant et tiens le corps parallèle au sol.\n• **Attention** : Exercice très dur : quelques secondes suffisent.'},
            {n:'Marche Mains', r:5, d:'Agilité', h:'• **Position** : En équilibre sur les mains, ou contre un mur.\n• **Mouvement** : Avance sur les mains sur 1 ou 2 mètres.\n• **Attention** : Fais-le sur un sol dégagé.'},
            {n:'Taps Épaules en Équilibre', r:10, d:'Contre le mur', h:'• **Position** : En équilibre sur les mains, ventre face au mur.\n• **Mouvement** : Touche une épaule avec la main opposée, puis l\'autre.\n• **Attention** : Corps gainé, bouge doucement.'},
            {n:'HSPU Négatives', r:5, d:'Descente contrôlée', h:'• **Position** : En équilibre sur les mains, dos au mur.\n• **Mouvement** : Descends la tête vers le sol en 5 secondes.\n• **Attention** : Repose les pieds au sol pour remonter.'},
            {n:'Planche Lean Tenu', r:20, s:1, d:'Avant des épaules', h:'• **Position** : Position haute de pompe.\n• **Mouvement** : Avance les épaules loin devant les mains et tiens.\n• **Attention** : Bras tendus, corps gainé.'}
        ]
    },
    'Bras': {
        beginner: [
            {n:'Dips Chaise', r:12, d:'Triceps', h:'• **Position** : Mains sur le bord d\'une chaise, jambes pliées.\n• **Mouvement** : Plie les bras pour descendre les fesses, puis remonte.\n• **Attention** : Le dos reste près de la chaise.'},
            {n:'Pompes Cobra', r:15, d:'Extension', h:'• **Position** : Allongé sur le ventre, mains sous les épaules.\n• **Mouvement** : Tends les bras pour relever le buste, bassin au sol.\n• **Attention** : Serre l\'arrière des bras en haut.'},
            {n:'Triceps au Mur', r:15, d:'Extension mur', h:'• **Position** : Face au mur, avant-bras posés dessus, pieds reculés.\n• **Mouvement** : Repousse avec les mains pour tendre les bras.\n• **Attention** : Les coudes restent serrés.'},
            {n:'Curl Bouteilles', r:20, d:'Biceps', h:'• **Position** : Debout, une bouteille d\'eau dans chaque main.\n• **Mouvement** : Plie les bras pour monter les bouteilles, puis redescends.\n• **Attention** : Seuls les avant-bras bougent, pas le dos.'},
            {n:'Crab Walk', r:30, d:'Bras dynamique', h:'• **Position** : Assis, mains et pieds au sol, fesses levées.\n• **Mouvement** : Avance ou recule dans cette position.\n• **Attention** : Les fesses ne touchent pas le sol.'},
            {n:'Pompes Diamant Genoux', r:10, d:'Triceps facile', h:'• **Position** : Sur les genoux, mains rapprochées en losange.\n• **Mouvement** : Descends la poitrine vers les mains, puis pousse.\n• **Attention** : Coudes le long du corps.'},
            {n:'Curl Main Contre Main', r:20, s:1, d:'Biceps isométrique', h:'• **Position** : Debout, coude plié, l\'autre main sur le poignet.\n• **Mouvement** : Essaie de plier le bras, l\'autre main résiste. Tiens.\n• **Attention** : Change de bras à mi-temps, respire.'},
            {n:'Triceps Mur Serré', r:12, d:'Debout face au mur', h:'• **Position** : Face au mur, mains serrées à hauteur de poitrine.\n• **Mouvement** : Plie les bras, coudes collés au corps, puis repousse.\n• **Attention** : Ce sont les bras qui poussent.'}
        ],
        intermediate: [
            {n:'Pompes Diamant', r:12, d:'Triceps focus', h:'• **Position** : Mains rapprochées, pouces et index en forme de losange.\n• **Mouvement** : Descends la poitrine sur tes mains, puis pousse.\n• **Attention** : Coudes le long du corps.'},
            {n:'Extension Sol', r:10, d:'Skullcrusher BW', h:'• **Position** : Planche sur les avant-bras.\n• **Mouvement** : Pousse sur les paumes pour décoller les deux coudes.\n• **Attention** : Petit mouvement, contrôlé.'},
            {n:'Biceps Serviette', r:15, d:'Isométrie active', h:'• **Position** : Assis, serviette passée sous la cuisse, un bout par main.\n• **Mouvement** : Tire vers le haut comme un curl, la jambe résiste.\n• **Attention** : Crée toi-même la résistance avec ta jambe.'},
            {n:'Dips Banc', r:15, d:'Charge +', h:'• **Position** : Mains sur une chaise, jambes tendues devant toi.\n• **Mouvement** : Plie les bras pour descendre, puis remonte.\n• **Attention** : Plus les jambes sont loin, plus c\'est dur.'},
            {n:'Pompes Sphinx', r:10, d:'Triceps isolés', h:'• **Position** : Planche sur les avant-bras.\n• **Mouvement** : Monte en planche bras tendus avec la force des bras.\n• **Attention** : Les mains restent à plat.'},
            {n:'Pompes Coudes Serrés', r:12, d:'Triceps', h:'• **Position** : Mains sous les épaules.\n• **Mouvement** : Descends en frôlant les côtes avec les coudes, puis pousse.\n• **Attention** : Les coudes ne s\'écartent pas.'},
            {n:'Planche Haute-Basse', r:12, d:'Coudes puis mains', h:'• **Position** : Planche sur les avant-bras.\n• **Mouvement** : Monte bras tendus, une main puis l\'autre, puis redescends.\n• **Attention** : Le bassin ne bouge pas.'},
            {n:'Curl Sous la Cuisse', r:20, s:1, d:'Biceps isométrique', h:'• **Position** : Assis, une jambe pliée, mains jointes sous la cuisse.\n• **Mouvement** : Tire vers le haut, la jambe résiste. Tiens.\n• **Attention** : Dos droit. Change de jambe à mi-temps.'}
        ],
        advanced: [
            {n:'Extension 1 bras', r:8, d:'Force triceps', h:'• **Position** : Face au mur, une main posée dessus.\n• **Mouvement** : Fais l\'extension des bras avec un seul bras.\n• **Attention** : Change de bras à mi-série.'},
            {n:'Dips Profonds', r:12, d:'Étirement', h:'• **Position** : Entre deux chaises stables, une main sur chacune.\n• **Mouvement** : Descends plus bas que tes mains, puis remonte.\n• **Attention** : Vérifie que les chaises ne glissent pas.'},
            {n:'Mains Inversées', r:10, d:'Pompes Biceps', h:'• **Position** : Mains au sol, doigts tournés vers tes pieds.\n• **Mouvement** : Fais une pompe : les biceps travaillent.\n• **Attention** : Descends peu, les poignets doivent être à l\'aise.'},
            {n:'Dips Explosifs', r:8, d:'Puissance bras', h:'• **Position** : Mains sur un support stable.\n• **Mouvement** : Pousse si fort que tes mains quittent le support.\n• **Attention** : Réceptionne-toi bras légèrement pliés.'},
            {n:'Pompes Triceps Pure', r:10, d:'Coudes fermés', h:'• **Position** : Mains près des hanches, coudes serrés contre les côtes.\n• **Mouvement** : Fais une pompe en gardant les coudes collés.\n• **Attention** : Ce sont les bras qui poussent.'},
            {n:'Pompes Diamant Explosives', r:8, d:'Puissance triceps', h:'• **Position** : Mains rapprochées en losange.\n• **Mouvement** : Pousse assez fort pour décoller les mains.\n• **Attention** : Atterris bras légèrement pliés.'},
            {n:'Pompes Tigre', r:8, d:'Triceps intenses', h:'• **Position** : Planche sur les avant-bras, mains à plat.\n• **Mouvement** : Pousse sur les mains pour tendre les bras, puis redescends.\n• **Attention** : Lentement, avec contrôle.'},
            {n:'Dips au Sol 1 Jambe', r:10, d:'Une jambe tendue', h:'• **Position** : Assis, mains au sol derrière toi, fesses levées, une jambe tendue.\n• **Mouvement** : Plie et tends les bras.\n• **Attention** : Change de jambe à mi-série.'}
        ]
    }
};
