/* Séance : choix (niveau, groupes, mode Express), génération, passage d'un exercice à l'autre,
   fin de séance (XP, niveau, journal) et reprise d'une séance interrompue. */
let selectedMuscles = [], currentWorkout = [], currentStepIndex = 0, isExpress = false;
// Niveau choisi : celui de la dernière fois (fluxe_reglages), sinon Intermédiaire
let levelKey = NIVEAUX.includes(lireReglages().niveau) ? lireReglages().niveau : 'intermediate';
let userData = chargerProgression();
const EXPRESS_MAX = 6; // annoncé sur l'accueil : « 6 exercices max »

// Garde la séance en cours (pour le bouton « Reprendre » si l'app est fermée)
function saveProgress() {
    Storage.set('fluxe_backup', { workout: currentWorkout, index: currentStepIndex, lvl: levelKey });
}

function checkBackup() {
    if (lireSauvegardeSeance()) document.getElementById('resume-card').classList.remove('cache');
}

function resumeWorkout() {
    const backup = lireSauvegardeSeance();
    if (!backup) { document.getElementById('resume-card').classList.add('cache'); return; } // sauvegarde absente ou abîmée : ignorée
    currentWorkout = backup.workout;
    currentStepIndex = backup.index;
    levelKey = backup.lvl;
    document.getElementById('resume-card').classList.add('cache');
    document.getElementById('workout-screen').classList.remove('cache');
    updateStep();
}

function toggleMuscle(m, btn) {
    if (selectedMuscles.includes(m)) {
        selectedMuscles = selectedMuscles.filter(x => x !== m);
        btn.classList.remove('actif');
    } else {
        selectedMuscles.push(m);
        btn.classList.add('actif');
    }
}

function setLevel(key) {
    if (!NIVEAUX.includes(key)) return;
    levelKey = key;
    ecrireReglage('niveau', key);
    afficherNiveau();
}

// Allume le bouton du niveau choisi et met à jour la proposition de changer de niveau
function afficherNiveau() {
    document.querySelectorAll('.bouton-niveau').forEach(b => b.classList.toggle('actif', b.dataset.niveau === levelKey));
    afficherSuggestion();
}

function toggleExpress() {
    isExpress = !isExpress;
    document.getElementById('express-toggle').classList.toggle('actif');
}

function generateWorkout() {
    if (selectedMuscles.length === 0) return afficherMessage('Choisis au moins un groupe musculaire');
    currentWorkout = [];
    // Pour chaque muscle sélectionné, on pioche 3 exercices
    selectedMuscles.forEach(m => {
        // m = groupe et niv = niveau : servent au bouton « Plus facile »
        currentWorkout.push(...melanger(exerciseLibrary[m][levelKey]).slice(0, 3).map(e => ({ ...e, m, niv: levelKey })));
    });
    // Mélange pour ne pas faire tous les exercices du même muscle à la suite
    currentWorkout = melanger(currentWorkout);
    // Mode Express : moitié de la séance (arrondi au supérieur), 6 exercices au maximum
    if (isExpress) currentWorkout = currentWorkout.slice(0, Math.min(Math.ceil(currentWorkout.length / 2), EXPRESS_MAX));
    currentWorkout = ajouterEchauffement(currentWorkout);
    currentStepIndex = 0;
    saveProgress();
    updateStep();
    document.getElementById('workout-screen').classList.remove('cache');
}

function updateStep() {
    const ex = currentWorkout[currentStepIndex];
    document.getElementById('ex-name').innerText = ex.n;
    document.getElementById('ex-desc').innerText = ex.d;
    document.getElementById('ex-reps').innerText = ex.r;
    document.querySelector('.seance-unite').innerText = ex.s ? 'Secondes' : 'Reps';
    preparerChrono(ex);
    afficherDessin(ex);
    document.getElementById('plus-facile').classList.toggle('cache', !versionPlusFacile(ex));
    const etape = document.getElementById('ex-etape');
    etape.textContent = ex.t === 'echauffement' ? 'Échauffement' : ex.t === 'etirement' ? 'Étirement' : '';
    etape.classList.toggle('cache', !ex.t);
    document.getElementById('step-counter-text').innerText = `Flux ${currentStepIndex + 1}/${currentWorkout.length}`;
    document.querySelector('#seance-progression i').style.width = `${((currentStepIndex + 1) / currentWorkout.length) * 100}%`;
    afficherASuivre();
}

// « À suivre » : les 3 prochains exercices (nom + répétitions), ou « Dernier exercice » à la fin
function afficherASuivre() {
    const zone = document.getElementById('a-suivre');
    const suivants = currentWorkout.slice(currentStepIndex + 1, currentStepIndex + 4);
    if (suivants.length === 0) { zone.replaceChildren(element('p', 'a-suivre-fin', 'Dernier exercice, à fond !')); return; }
    const liste = element('ul');
    liste.append(...suivants.map(ex => {
        const li = element('li');
        li.append(element('b', '', ex.n), element('span', '', ex.s ? `${ex.r} s` : `${ex.r}`));
        return li;
    }));
    const reste = currentWorkout.length - currentStepIndex - 1 - suivants.length;
    zone.replaceChildren(element('p', 'a-suivre-titre', 'À suivre'), liste, ...(reste > 0 ? [element('p', 'a-suivre-reste', `+ ${reste} autre${reste > 1 ? 's' : ''}`)] : []));
}

// « Plus facile » : un exercice du même groupe, au niveau du dessous, pas déjà dans la séance
const NIVEAU_DESSOUS = { intermediate: 'beginner', advanced: 'intermediate' };
function versionPlusFacile(ex) {
    const dessous = NIVEAU_DESSOUS[ex.niv];
    if (ex.t || !dessous || !exerciseLibrary[ex.m]) return null; // échauffement, débutant ou ancienne séance
    const dejaLa = currentWorkout.map(e => e.n);
    const choix = exerciseLibrary[ex.m][dessous].filter(e => !dejaLa.includes(e.n));
    return choix.length ? { ...melanger(choix)[0], m: ex.m, niv: dessous } : null;
}

function rendrePlusFacile() {
    const facile = versionPlusFacile(currentWorkout[currentStepIndex]);
    if (!facile) return;
    currentWorkout[currentStepIndex] = facile;
    saveProgress();
    updateStep();
    afficherMessage(`Plus facile : ${facile.n}`);
}

// « Quitter » : ferme la séance sans rien perdre (elle reste à reprendre depuis l'accueil)
function quitterSeance() {
    arreterRepos();
    arreterChrono();
    saveProgress();
    document.getElementById('workout-screen').classList.add('cache');
    checkBackup();
}

function nextStep() {
    if (currentStepIndex < currentWorkout.length - 1) {
        currentStepIndex++;
        saveProgress();
        updateStep();
        demarrerRepos();
    } else {
        arreterRepos();
        arreterChrono();
        Storage.remove('fluxe_backup');
        document.getElementById('workout-screen').classList.add('cache');
        document.getElementById('feedback-screen').classList.remove('cache');
        document.getElementById('xp-gain-text').innerText = `+ ${vraisExercices(currentWorkout) * 15} XP`;
    }
}

function finishWithFeedback(mood) {
    const faits = vraisExercices(currentWorkout); // l'échauffement et les étirements ne comptent pas
    userData.xp += faits * 15;
    // Passage de niveau : il faut « niveau × 100 » XP ; le surplus est gardé (plusieurs niveaux d'un coup possibles)
    while (userData.xp >= userData.lvl * 100) { userData.xp -= userData.lvl * 100; userData.lvl++; }
    userData.logs.push({ date: new Date().toISOString(), mood: mood, count: faits, niveau: levelKey });
    userData.streak++;
    Storage.set('fluxe_user_v1', userData);
    document.getElementById('feedback-screen').classList.add('cache');
    updateUI();
    afficherSuggestion();
    showScreen('main-screen');
}

// Fenêtre d'aide (bouton « ? ») de l'exercice affiché
function showInfo() {
    const ex = currentWorkout[currentStepIndex];
    document.getElementById('modal-title').innerText = ex.n;
    document.getElementById('modal-text').replaceChildren(...texteAvecGras(ex.h));
    document.getElementById('info-modal').classList.remove('cache');
}

function closeInfo() { document.getElementById('info-modal').classList.add('cache'); }
