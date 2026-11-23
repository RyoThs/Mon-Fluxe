/* Échauffement (avant) et étirements (après) : option de l'accueil, retenue dans fluxe_reglages.
   Ces mouvements sont tenus en secondes (chrono) et ne rapportent pas d'XP. */
const ECHAUFFEMENTS = [
    { n: 'Jumping Jacks', r: 30, s: 1, d: 'Réveil du corps', h: '• **Position** : Debout, pieds serrés, bras le long du corps.\n• **Mouvement** : Saute en écartant bras et jambes, puis reviens.\n• **Attention** : Rythme tranquille, juste pour te réchauffer.' },
    { n: 'Rotations des bras', r: 30, s: 1, d: 'Épaules', h: '• **Position** : Debout, bras tendus sur les côtés.\n• **Mouvement** : Fais de grands cercles vers l\'avant, puis vers l\'arrière.\n• **Attention** : Épaules basses.' },
    { n: 'Montées de genoux', r: 30, s: 1, d: 'Cardio doux', h: '• **Position** : Debout, sur place.\n• **Mouvement** : Monte les genoux à hauteur de hanches, en alternant.\n• **Attention** : Reste sur l\'avant des pieds.' },
    { n: 'Rotations des hanches', r: 30, s: 1, d: 'Bassin', h: '• **Position** : Debout, mains sur les hanches.\n• **Mouvement** : Fais de grands cercles avec le bassin, puis change de sens.\n• **Attention** : Mouvement lent et ample.' },
];
const ETIREMENTS = [
    { n: 'Étirement des pectoraux', r: 30, s: 1, d: 'Contre un mur', h: '• **Position** : Avant-bras posé sur un mur, coude à hauteur d\'épaule.\n• **Mouvement** : Tourne doucement le buste à l\'opposé.\n• **Attention** : Change de côté à mi-temps, sans forcer.' },
    { n: 'Étirement des quadriceps', r: 30, s: 1, d: 'Debout', h: '• **Position** : Debout, une main sur un mur.\n• **Mouvement** : Attrape une cheville et ramène le talon vers la fesse.\n• **Attention** : Change de jambe à mi-temps.' },
    { n: 'Posture de l\'enfant', r: 30, s: 1, d: 'Dos et épaules', h: '• **Position** : À genoux, fesses sur les talons.\n• **Mouvement** : Allonge les bras devant toi, front au sol.\n• **Attention** : Respire lentement et relâche le dos.' },
    { n: 'Étirement des ischios', r: 30, s: 1, d: 'Arrière des cuisses', h: '• **Position** : Assis, une jambe tendue devant toi.\n• **Mouvement** : Penche-toi vers le pied, dos droit.\n• **Attention** : Ne force pas. Change de jambe à mi-temps.' },
];

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
