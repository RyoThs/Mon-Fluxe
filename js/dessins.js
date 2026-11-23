/* Dessins des exercices : une silhouette au trait par FAMILLE de mouvement (vue de côté, sol en bas).
   Chaque famille a une position de DÉPART et une d'ARRIVÉE (mêmes traits, mêmes nombres de points) :
   la silhouette passe de l'une à l'autre en boucle pour montrer le mouvement (sauf si le téléphone
   demande de réduire les animations). tete = [x, y] ; traits = lignes brisées [[x, y], …] ; support = décor fixe. */
const P = (tete, ...traits) => ({ tete, traits });
const DESSINS = {
    pompe: { debut: P([20, 33], [[26, 37], [84, 55]], [[26, 37], [26, 47], [26, 58]]), fin: P([22, 45], [[28, 49], [84, 56]], [[28, 49], [38, 53], [26, 58]]) },
    pompeGenoux: { debut: P([20, 33], [[26, 37], [56, 47], [68, 58], [84, 53]], [[26, 37], [26, 47], [26, 58]]), fin: P([22, 45], [[28, 49], [56, 52], [68, 58], [84, 53]], [[28, 49], [38, 53], [26, 58]]) },
    pompeInclinee: { support: 'M16 42H36V58', debut: P([22, 20], [[28, 25], [82, 58]], [[28, 25], [30, 34], [32, 42]]), fin: P([29, 28], [[34, 33], [82, 58]], [[34, 33], [42, 38], [32, 42]]) },
    planche: { debut: P([20, 39], [[26, 44], [55, 50], [84, 56]], [[26, 44], [26, 57], [38, 57]]), fin: P([20, 39], [[26, 44], [55, 48], [84, 56]], [[26, 44], [26, 57], [38, 57]]) },
    plancheLaterale: { debut: P([20, 37], [[26, 43], [55, 51], [84, 56]], [[26, 43], [26, 57], [36, 57]], [[26, 43], [26, 22]]), fin: P([20, 37], [[26, 43], [55, 47], [84, 56]], [[26, 43], [26, 57], [36, 57]], [[26, 43], [26, 22]]) },
    dips: { support: 'M8 34H32V58', debut: P([42, 14], [[42, 20], [42, 44], [64, 44], [64, 58]], [[42, 24], [37, 29], [32, 34]]), fin: P([42, 24], [[42, 30], [42, 52], [64, 48], [64, 58]], [[42, 34], [36, 42], [32, 34]]) },
    superman: { debut: P([18, 50], [[24, 53], [60, 55], [86, 55]], [[24, 53], [8, 54]]), fin: P([18, 42], [[24, 49], [60, 54], [86, 45]], [[24, 49], [8, 41]]) },
    quatrePattes: { debut: P([23, 25], [[30, 30], [62, 30]], [[30, 30], [30, 58]], [[62, 30], [62, 58], [76, 58]], [[30, 30], [30, 58]], [[62, 30], [62, 58], [76, 58]]), fin: P([23, 25], [[30, 30], [62, 30]], [[30, 30], [30, 58]], [[62, 30], [62, 58], [76, 58]], [[30, 30], [8, 25]], [[62, 30], [78, 28], [92, 27]]) },
    pont: { debut: P([13, 52], [[19, 56], [48, 56], [62, 40], [76, 58]], [[19, 56], [34, 58]]), fin: P([13, 52], [[19, 56], [48, 38], [68, 34], [76, 58]], [[19, 56], [34, 58]]) },
    squat: { debut: P([48, 8], [[48, 14], [48, 36], [48, 47], [48, 58]], [[48, 18], [42, 32]]), fin: P([45, 13], [[45, 19], [57, 38], [38, 41], [40, 58]], [[45, 23], [26, 29]]) },
    fente: { debut: P([50, 6], [[50, 12], [50, 32]], [[50, 32], [46, 45], [44, 58]], [[50, 32], [56, 45], [58, 58]], [[50, 16], [44, 29]]), fin: P([50, 9], [[50, 15], [50, 36]], [[50, 36], [34, 42], [32, 58]], [[50, 36], [64, 56], [80, 56]], [[50, 20], [42, 32]]) },
    aGenoux: { debut: P([42, 16], [[72, 58], [42, 58], [42, 22]], [[42, 32], [36, 44]]), fin: P([19, 31], [[72, 58], [42, 58], [23, 35]], [[30, 44], [20, 54]]) },
    saut: { debut: P([50, 20], [[50, 26], [50, 42]], [[50, 42], [42, 48], [44, 58]], [[50, 42], [58, 48], [56, 58]], [[50, 30], [42, 40]], [[50, 30], [58, 40]]), fin: P([50, 9], [[50, 15], [50, 32]], [[50, 32], [44, 41], [44, 50]], [[50, 32], [56, 41], [56, 50]], [[50, 19], [40, 7]], [[50, 19], [60, 7]]) },
    debout: { debut: P([50, 8], [[50, 14], [50, 36]], [[50, 36], [44, 58]], [[50, 36], [56, 58]], [[50, 18], [44, 34]], [[50, 18], [56, 34]]), fin: P([50, 8], [[50, 14], [50, 36]], [[50, 36], [44, 58]], [[50, 36], [56, 58]], [[50, 18], [36, 8]], [[50, 18], [64, 8]]) },
    crunch: { debut: P([18, 52], [[24, 55], [50, 56], [66, 40], [82, 58]], [[24, 55], [36, 51]]), fin: P([24, 35], [[28, 41], [50, 56], [66, 40], [82, 58]], [[28, 41], [42, 39]]) },
    jambesLevees: { debut: P([13, 50], [[19, 54], [54, 56], [86, 56]], [[19, 54], [8, 50]]), fin: P([13, 50], [[19, 54], [54, 56], [80, 30]], [[19, 54], [8, 50]]) },
    pike: { debut: P([27, 45], [[31, 40], [54, 18], [80, 58]], [[31, 40], [28, 49], [24, 58]]), fin: P([26, 52], [[31, 47], [54, 22], [80, 58]], [[31, 47], [38, 52], [24, 58]]) },
    equilibre: { support: 'M72 4V58', debut: P([50, 48], [[50, 42], [50, 8]], [[50, 42], [44, 58]], [[50, 42], [56, 58]]), fin: P([50, 53], [[50, 48], [50, 14]], [[50, 48], [42, 58]], [[50, 48], [58, 58]]) },
    tirage: { support: 'M10 24H60M14 24V58M56 24V58', debut: P([30, 36], [[36, 40], [88, 58]], [[36, 40], [36, 32], [36, 24]]), fin: P([30, 28], [[36, 32], [88, 58]], [[36, 32], [44, 29], [36, 24]]) },
    etirement: { debut: P([34, 45], [[76, 58], [60, 58], [66, 48], [40, 46]], [[40, 48], [14, 56]]), fin: P([30, 51], [[76, 58], [60, 58], [66, 48], [36, 50]], [[38, 52], [12, 58]]) },
};

// Famille de chaque exercice (par son nom)
const FAMILLES = {
    pompe: ['Pompes Classiques', 'Pompes Diamant', 'Pompes Larges', 'Pompes Spiderman', 'Pompes Décalées', 'Pompes Archer', 'Pompes Explosives', 'Pompes 1 Bras', 'Pompes Claquées', 'Pseudo Planche', 'Pompes Hautes', 'Pompes Triceps Pure', 'Mains Inversées', 'Planche Lean', 'Tap Épaules', 'Mountain Climber lent', '90 Degree Hold', 'Dips Épaules', 'Pompes Déclinées', 'Planche Haute', 'Pompes Tempo', 'Pompes Larges Pause', 'Pompes Superman', 'Pompes Typewriter', 'Pompes Doigts', 'Mountain Climber Rapide', 'Planche Lean Tenu', 'Pompes Coudes Serrés', 'Pompes Diamant Explosives'],
    pompeGenoux: ['Pompes Genoux', 'Pompes Négatives Genoux', 'Pompes Diamant Genoux'],
    pompeInclinee: ['Pompes Inclinées', 'Pompes au Mur', 'Triceps au Mur', 'Extension 1 bras', 'Pompes Mur Larges', 'Triceps Mur Serré'],
    planche: ['Planche', 'Rotation Planche', 'Planche Commando', 'Extension Sol', 'Pompes Sphinx', 'Planche Genoux', 'Planche RKC', 'Planche Haute-Basse', 'Pompes Tigre'],
    plancheLaterale: ['Planche Latérale'],
    dips: ['Dips Chaise', 'Dips Banc', 'Dips au sol', 'Dips Profonds', 'Dips Explosifs', 'Crab Walk', 'Dips au Sol 1 Jambe'],
    superman: ['Superman', 'Superman Iso', 'Superman Arqué', 'Nageur', 'Anges au sol', 'Pompes Cobra', 'Superman Alterné', 'Y-T-W au Sol', 'Superman Tirage', 'Arch Hold Bras Tendus'],
    quatrePattes: ['Bird Dog', 'Chat-Vache', 'Bird Dog Coude-Genou', 'Kickback Fessier', 'Ours Tenu', 'Bear Crawl'],
    pont: ['Glute Bridge', 'Pont 1 jambe', 'Back Bridge', 'Planche Inversée', 'Planche Inversée 1 Jambe', 'Pont Fessier Tenu'],
    squat: ['Squat Classique', 'Squat Sumo', 'Cossack Squats', 'Pistol Squat', 'Chaise Murale', 'Squat Pause', 'Squat 1 et Demi', 'Sissy Squat'],
    fente: ['Fentes Arrière', 'Fentes Bulgares', 'Fentes Latérales', 'Fentes Avant', 'Fentes Marchées', 'Skater Squat'],
    aGenoux: ['Nordic Curl Sol'],
    saut: ['Squat Jumps', 'Sauts Groupés', 'Fentes Sautant', 'Jumping Jacks', 'Montées de genoux', 'Squat Sauté 180°'],
    debout: ['Montée Mollets', 'Good Morning', 'Shrugs', 'Cercles Bras', 'I-Y-T Mouvement', 'Wall Slide', 'Rotations des bras', 'Rotations des hanches', 'Curl Bouteilles', 'Biceps Serviette', 'Tirage Serviette', 'Étirement des pectoraux', 'Étirement des quadriceps', 'Good Morning 1 Jambe', 'Élévations en Y', 'Curl Main Contre Main'],
    crunch: ['Crunch', 'Toucher Chevilles', 'V-Ups', 'Russian Twists', 'Dead Bug', 'Crunch Croisé', 'Bicycle Crunch', 'Curl Sous la Cuisse'],
    jambesLevees: ['Flutter Kicks', 'Hollow Rock', 'Essuie-glaces', 'Dragon Flag', 'L-Sit', 'Étirement des ischios', 'Relevés de Bassin', 'Ciseaux', 'Hollow Hold', 'V-Sit Tenu'],
    pike: ['Pike Pushups', 'Pike Pushups Elevé', 'Maintien Pike', 'Pike Walk', 'Wall Walk', 'Pompes Hindoues', 'Pike Genoux', 'Pike Tempo', 'Planche Chien Tête en Bas'],
    equilibre: ['HSPU au Mur', 'Handstand Hold', 'Marche Mains', 'Taps Épaules en Équilibre', 'HSPU Négatives'],
    tirage: ['Pompes Australiennes', 'Tirage 1 bras table', 'Tirage Porte'],
    etirement: ['Posture de l\'enfant'],
};
const FAMILLE_DE = Object.fromEntries(Object.entries(FAMILLES).flatMap(([f, noms]) => noms.map(n => [n, f])));

// Traits d'une pose → chemin SVG (« M x y L x y … » pour chaque ligne brisée)
const chemin = pose => pose.traits.map(t => t.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')).join(' ');

// Renvoie le dessin (élément SVG) d'un exercice, ou null s'il n'en a pas. Animé en boucle si le téléphone le permet.
function dessinPour(nom) {
    const d = DESSINS[FAMILLE_DE[nom]];
    if (!d) return null;
    const NS = 'http://www.w3.org/2000/svg';
    const animer = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const creer = (balise, attributs) => { const el = document.createElementNS(NS, balise); for (const [k, v] of Object.entries(attributs)) el.setAttribute(k, v); return el; };
    // aller-retour départ → arrivée → départ en 2,4 s, en douceur
    const boucle = (attribut, a, b) => creer('animate', { attributeName: attribut, values: `${a};${b};${a}`, dur: '2.4s', repeatCount: 'indefinite', calcMode: 'spline', keyTimes: '0;0.5;1', keySplines: '0.45 0 0.55 1;0.45 0 0.55 1' });
    const svg = creer('svg', { viewBox: '0 0 100 64', 'aria-hidden': 'true' });
    svg.append(creer('path', { d: 'M4 58H96', class: 'dessin-sol' }));
    if (d.support) svg.append(creer('path', { d: d.support, class: 'dessin-support' }));
    const corps = creer('path', { d: chemin(d.debut), class: 'dessin-corps' });
    const tete = creer('circle', { cx: d.debut.tete[0], cy: d.debut.tete[1], r: 5, class: 'dessin-tete' });
    if (animer) {
        corps.append(boucle('d', chemin(d.debut), chemin(d.fin)));
        tete.append(boucle('cx', d.debut.tete[0], d.fin.tete[0]), boucle('cy', d.debut.tete[1], d.fin.tete[1]));
    }
    svg.append(corps, tete);
    return svg;
}

function afficherDessin(ex) {
    const zone = document.getElementById('ex-dessin');
    const svg = dessinPour(ex.n);
    zone.replaceChildren(...(svg ? [svg] : []));
    zone.classList.toggle('cache', !svg);
}
