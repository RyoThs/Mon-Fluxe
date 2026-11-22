/* Dessins des exercices : une silhouette au trait par FAMILLE de mouvement (vue de côté, sol en bas).
   Chaque dessin = une tête (cercle) + des traits. Le dessin est décoratif : le nom et le guide restent la référence. */
const DESSINS = {
    pompe: { tete: [20, 33], traits: 'M26 37L84 55M26 37L26 58' },
    pompeGenoux: { tete: [20, 33], traits: 'M26 37L56 47L68 58L84 53M26 37L26 58' },
    pompeInclinee: { tete: [22, 20], traits: 'M28 25L82 58M28 25L32 42', support: 'M16 42H36V58' },
    planche: { tete: [20, 39], traits: 'M26 44L84 56M26 44L26 57L38 57' },
    plancheLaterale: { tete: [20, 37], traits: 'M26 43L84 56M26 43L26 57L36 57M26 43L26 22' },
    dips: { tete: [42, 14], traits: 'M42 20L42 44L64 44L64 58M42 24L32 34', support: 'M8 34H32V58' },
    superman: { tete: [18, 42], traits: 'M24 49L60 54L86 45M24 49L8 41' },
    quatrePattes: { tete: [23, 25], traits: 'M30 30L62 30M30 30L30 58M62 30L62 58L76 58M30 30L8 25M62 30L92 27' },
    pont: { tete: [13, 52], traits: 'M19 56L48 38L68 34L76 58M19 56L34 58' },
    squat: { tete: [45, 13], traits: 'M45 19L57 38L38 41L40 58M45 23L26 29' },
    fente: { tete: [50, 9], traits: 'M50 15L50 36L34 42L32 58M50 36L64 56L80 56M50 20L42 32' },
    aGenoux: { tete: [26, 16], traits: 'M72 58L42 58L29 22M33 32L20 46' },
    saut: { tete: [50, 9], traits: 'M50 15L50 34L42 47M50 34L58 47M50 19L38 6M50 19L62 6M36 56H64' },
    debout: { tete: [50, 8], traits: 'M50 14L50 36L44 58M50 36L56 58M50 18L36 30M50 18L64 30' },
    crunch: { tete: [24, 35], traits: 'M28 41L50 56L66 40L82 58M28 41L42 39' },
    jambesLevees: { tete: [13, 50], traits: 'M19 54L54 56L84 36M19 54L8 46' },
    pike: { tete: [27, 45], traits: 'M31 40L54 18L80 58M31 40L24 58' },
    equilibre: { tete: [50, 48], traits: 'M50 42L50 8M50 42L44 58M50 42L56 58M72 4V58' },
    tirage: { tete: [30, 30], traits: 'M36 35L88 58M36 35L36 24M10 24H60M14 24V58M56 24V58' },
    etirement: { tete: [30, 51], traits: 'M76 58L60 58L66 48L36 50M38 52L12 58' },
};

// Famille de chaque exercice (par son nom)
const FAMILLES = {
    pompe: ['Pompes Classiques', 'Pompes Diamant', 'Pompes Larges', 'Pompes Spiderman', 'Pompes Décalées', 'Pompes Archer', 'Pompes Explosives', 'Pompes 1 Bras', 'Pompes Claquées', 'Pseudo Planche', 'Pompes Hautes', 'Pompes Triceps Pure', 'Mains Inversées', 'Planche Lean', 'Tap Épaules', 'Mountain Climber lent', '90 Degree Hold', 'Dips Épaules', 'Pompes Déclinées'],
    pompeGenoux: ['Pompes Genoux'],
    pompeInclinee: ['Pompes Inclinées', 'Pompes au Mur', 'Triceps au Mur', 'Extension 1 bras'],
    planche: ['Planche', 'Rotation Planche', 'Planche Commando', 'Extension Sol', 'Pompes Sphinx'],
    plancheLaterale: ['Planche Latérale'],
    dips: ['Dips Chaise', 'Dips Banc', 'Dips au sol', 'Dips Profonds', 'Dips Explosifs', 'Crab Walk'],
    superman: ['Superman', 'Superman Iso', 'Superman Arqué', 'Nageur', 'Anges au sol', 'Pompes Cobra'],
    quatrePattes: ['Bird Dog'],
    pont: ['Glute Bridge', 'Pont 1 jambe', 'Back Bridge'],
    squat: ['Squat Classique', 'Squat Sumo', 'Cossack Squats', 'Pistol Squat', 'Chaise Murale'],
    fente: ['Fentes Arrière', 'Fentes Bulgares', 'Fentes Latérales'],
    aGenoux: ['Nordic Curl Sol'],
    saut: ['Squat Jumps', 'Sauts Groupés', 'Fentes Sautant', 'Jumping Jacks', 'Montées de genoux'],
    debout: ['Montée Mollets', 'Good Morning', 'Shrugs', 'Cercles Bras', 'I-Y-T Mouvement', 'Wall Slide', 'Rotations des bras', 'Rotations des hanches', 'Curl Bouteilles', 'Biceps Serviette', 'Tirage Serviette', 'Étirement des pectoraux', 'Étirement des quadriceps'],
    crunch: ['Crunch', 'Toucher Chevilles', 'V-Ups', 'Russian Twists', 'Dead Bug'],
    jambesLevees: ['Flutter Kicks', 'Hollow Rock', 'Essuie-glaces', 'Dragon Flag', 'L-Sit', 'Étirement des ischios'],
    pike: ['Pike Pushups', 'Pike Pushups Elevé', 'Maintien Pike', 'Pike Walk', 'Wall Walk'],
    equilibre: ['HSPU au Mur', 'Handstand Hold', 'Marche Mains'],
    tirage: ['Pompes Australiennes', 'Tirage 1 bras table', 'Tirage Porte'],
    etirement: ['Posture de l\'enfant'],
};
const FAMILLE_DE = Object.fromEntries(Object.entries(FAMILLES).flatMap(([f, noms]) => noms.map(n => [n, f])));

// Renvoie le dessin (élément SVG) d'un exercice, ou null s'il n'en a pas
function dessinPour(nom) {
    const d = DESSINS[FAMILLE_DE[nom]];
    if (!d) return null;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 64');
    svg.setAttribute('aria-hidden', 'true');
    const trait = (chemin, classe) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', chemin); p.setAttribute('class', classe); svg.append(p); };
    trait('M4 58H96', 'dessin-sol');
    if (d.support) trait(d.support, 'dessin-support');
    trait(d.traits, 'dessin-corps');
    const tete = document.createElementNS(NS, 'circle');
    tete.setAttribute('cx', d.tete[0]); tete.setAttribute('cy', d.tete[1]); tete.setAttribute('r', 5);
    tete.setAttribute('class', 'dessin-tete');
    svg.append(tete);
    return svg;
}

function afficherDessin(ex) {
    const zone = document.getElementById('ex-dessin');
    const svg = dessinPour(ex.n);
    zone.replaceChildren(...(svg ? [svg] : []));
    zone.classList.toggle('cache', !svg);
}
