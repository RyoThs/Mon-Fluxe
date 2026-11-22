/* Séance : choix (niveau, groupes, mode Express), génération, passage d'un exercice à l'autre,
   fin de séance (XP, niveau, journal) et reprise d'une séance interrompue. */
let selectedMuscles = [], currentWorkout = [], currentStepIndex = 0, levelKey = 'intermediate', isExpress = false;
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

function setLevel(key, btn) {
    levelKey = key;
    document.querySelectorAll('.bouton-niveau').forEach(b => b.classList.remove('actif'));
    btn.classList.add('actif');
}

function toggleExpress() {
    isExpress = !isExpress;
    document.getElementById('express-toggle').classList.toggle('actif');
}

function generateWorkout() {
    if (selectedMuscles.length === 0) return alert("Choisis au moins un muscle !");
    currentWorkout = [];
    // Pour chaque muscle sélectionné, on pioche 3 exercices
    selectedMuscles.forEach(m => {
        currentWorkout.push(...melanger(exerciseLibrary[m][levelKey]).slice(0, 3));
    });
    // Mélange pour ne pas faire tous les exercices du même muscle à la suite
    currentWorkout = melanger(currentWorkout);
    // Mode Express : moitié de la séance (arrondi au supérieur), 6 exercices au maximum
    if (isExpress) currentWorkout = currentWorkout.slice(0, Math.min(Math.ceil(currentWorkout.length / 2), EXPRESS_MAX));
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
        li.append(element('b', '', ex.n), element('span', '', `${ex.r}`));
        return li;
    }));
    const reste = currentWorkout.length - currentStepIndex - 1 - suivants.length;
    zone.replaceChildren(element('p', 'a-suivre-titre', 'À suivre'), liste, ...(reste > 0 ? [element('p', 'a-suivre-reste', `+ ${reste} autre${reste > 1 ? 's' : ''}`)] : []));
}

// « Quitter » : ferme la séance sans rien perdre (elle reste à reprendre depuis l'accueil)
function quitterSeance() {
    saveProgress();
    document.getElementById('workout-screen').classList.add('cache');
    checkBackup();
}

function nextStep() {
    if (currentStepIndex < currentWorkout.length - 1) {
        currentStepIndex++;
        saveProgress();
        updateStep();
    } else {
        Storage.remove('fluxe_backup');
        document.getElementById('workout-screen').classList.add('cache');
        document.getElementById('feedback-screen').classList.remove('cache');
        document.getElementById('xp-gain-text').innerText = `+ ${currentWorkout.length * 15} XP`;
    }
}

function finishWithFeedback(mood) {
    userData.xp += currentWorkout.length * 15;
    if (userData.xp >= userData.lvl * 100) { userData.xp = 0; userData.lvl++; }
    userData.logs.push({ date: new Date().toISOString(), mood: mood, count: currentWorkout.length });
    userData.streak++;
    Storage.set('fluxe_user_v1', userData);
    document.getElementById('feedback-screen').classList.add('cache');
    updateUI();
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
