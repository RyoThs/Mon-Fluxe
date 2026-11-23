/* Micro-vidéos réalistes : un homme 3D (personnage MakeHuman, CC0) qui fait le mouvement, capté sur de vraies
   personnes (CMU, voir videos/CREDITS.md). Seulement pour les exercices dont le mouvement est EXACTEMENT celui
   de la vidéo ; les autres gardent leur silhouette animée (dessins.js).
   Deux formats : WebM (Android, ordinateur) puis MP4 (iPhone). */
const VIDEOS = {
    'Pompes Classiques': 'pompes', 'Pompes Tempo': 'pompes', 'Pompes Coudes Serrés': 'pompes',
    'Squat Classique': 'squat', 'Squat Pause': 'squat', 'Squat 1 et Demi': 'squat',
    'Planche': 'gainage', 'Planche RKC': 'gainage',
    'Fentes Avant': 'fente', 'Fentes Marchées': 'fente',
    'Squat Jumps': 'saut',
};

// Nom de la vidéo d'un exercice, ou null
const videoPour = nom => VIDEOS[nom] || null;

// Crée la vidéo (muette, en boucle, dans la page). Si elle ne se charge pas, enCasDErreur() est appelé.
function creerVideo(fichier, enCasDErreur) {
    const video = document.createElement('video');
    const animer = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    Object.assign(video, { muted: true, loop: true, playsInline: true, autoplay: animer, preload: 'auto' });
    video.setAttribute('muted', ''); video.setAttribute('playsinline', ''); video.setAttribute('aria-hidden', 'true');
    if (animer) video.setAttribute('autoplay', ''); else video.controls = true;
    for (const [ext, type] of [['webm', 'video/webm'], ['mp4', 'video/mp4']]) {
        const source = document.createElement('source');
        source.setAttribute('src', `videos/${fichier}.${ext}`);
        source.type = type;
        video.append(source);
    }
    // Cloison : l'erreur arrive sur la dernière source quand aucune n'a pu être lue
    let remplacee = false;
    const echec = () => { if (!remplacee) { remplacee = true; enCasDErreur(); } };
    video.lastChild.addEventListener('error', echec);
    video.addEventListener('error', echec);
    return video;
}
