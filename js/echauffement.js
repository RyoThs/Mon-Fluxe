/* Échauffement (avant) et étirements (après) : option de l'accueil, retenue dans fluxe_reglages.
   Ces mouvements sont tenus en secondes (chrono) et ne rapportent pas d'XP. */
const ECHAUFFEMENTS = [
    { n: 'Jumping Jacks', r: 30, s: 1, d: 'Réveil du corps', h: '• **Mouvement** : Sautez en écartant bras et jambes, puis revenez pieds joints.\n• **Rythme** : Tranquille, juste pour faire monter le cœur.' },
    { n: 'Rotations des bras', r: 30, s: 1, d: 'Épaules', h: '• **Mouvement** : Grands cercles avec les bras tendus, vers l\'avant puis vers l\'arrière.\n• **Focus** : Gardez les épaules basses.' },
    { n: 'Montées de genoux', r: 30, s: 1, d: 'Cardio doux', h: '• **Mouvement** : Sur place, montez les genoux à hauteur de hanches en alternant.\n• **Focus** : Restez sur l\'avant des pieds.' },
    { n: 'Rotations des hanches', r: 30, s: 1, d: 'Bassin', h: '• **Placement** : Debout, mains sur les hanches.\n• **Mouvement** : Grands cercles avec le bassin, dans un sens puis dans l\'autre.' },
];
const ETIREMENTS = [
    { n: 'Étirement des pectoraux', r: 30, s: 1, d: 'Contre un mur', h: '• **Placement** : Avant-bras posé sur un mur, coude à hauteur d\'épaule.\n• **Mouvement** : Tournez doucement le buste à l\'opposé. Changez de côté à mi-temps.' },
    { n: 'Étirement des quadriceps', r: 30, s: 1, d: 'Debout', h: '• **Mouvement** : Attrapez une cheville derrière vous et ramenez le talon vers la fesse.\n• **Astuce** : Tenez un mur pour l\'équilibre. Changez de jambe à mi-temps.' },
    { n: 'Posture de l\'enfant', r: 30, s: 1, d: 'Dos et épaules', h: '• **Placement** : À genoux, fesses sur les talons.\n• **Mouvement** : Allongez les bras devant vous, front au sol, et respirez lentement.' },
    { n: 'Étirement des ischios', r: 30, s: 1, d: 'Arrière des cuisses', h: '• **Placement** : Assis, une jambe tendue devant vous.\n• **Mouvement** : Penchez-vous vers le pied, dos droit, sans forcer. Changez de jambe à mi-temps.' },
];

// Réglages de l'appli (clé fluxe_reglages) : écrits seulement quand on change une option
const lireReglages = () => { const r = Storage.get('fluxe_reglages', {}); return estObjet(r) ? r : {}; };
const ecrireReglage = (cle, valeur) => Storage.set('fluxe_reglages', { ...lireReglages(), [cle]: valeur });
let avecEchauffement = lireReglages().echauffement === true;

function basculerEchauffement() {
    avecEchauffement = !avecEchauffement;
    ecrireReglage('echauffement', avecEchauffement);
    afficherOptionEchauffement();
}

function afficherOptionEchauffement() {
    document.getElementById('echauffement-toggle').classList.toggle('actif', avecEchauffement);
}

// Ajoute 2 mouvements d'échauffement avant et 2 étirements après (si l'option est active)
function ajouterEchauffement(exercices) {
    if (!avecEchauffement) return exercices;
    const avant = melanger(ECHAUFFEMENTS).slice(0, 2).map(e => ({ ...e, t: 'echauffement' }));
    const apres = melanger(ETIREMENTS).slice(0, 2).map(e => ({ ...e, t: 'etirement' }));
    return [...avant, ...exercices, ...apres];
}

// Nombre de vrais exercices (ceux qui rapportent de l'XP)
const vraisExercices = liste => liste.filter(e => !e.t).length;
