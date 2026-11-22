/* Aiguillage des boutons : chaque bouton porte data-act="…" ; ce fichier dit quoi faire pour chacun.
   Ajouter un bouton = lui donner un data-act + écrire son geste ici (un test vérifie qu'aucun n'est oublié). */
const gestes = {
    accueil: () => showScreen('main-screen'),
    journal: () => { showScreen('logbook-screen'); renderLogbook(); },
    reprendre: () => resumeWorkout(),
    express: () => toggleExpress(),
    niveau: el => setLevel(el.dataset.niveau, el),
    muscle: el => toggleMuscle(el.dataset.muscle, el),
    activer: () => generateWorkout(),
    aide: () => showInfo(),
    suivant: () => nextStep(),
    quitter: () => quitterSeance(),
    chrono: () => basculerChrono(),
    echauffement: () => basculerEchauffement(),
    reposPlus: () => ajouterRepos(15),
    reposPasser: () => arreterRepos(),
    humeur: el => finishWithFeedback(el.dataset.humeur),
    fermerAide: () => closeInfo(),
    exporter: () => exporterProgression(),
};

// Gestes déclenchés quand un champ change (et non au toucher)
const gestesChangement = {
    importer: champ => importerProgression(champ),
};

document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (el && gestes[el.dataset.act]) gestes[el.dataset.act](el, e);
});
document.addEventListener('change', e => {
    const el = e.target.closest('[data-act]');
    if (el && gestesChangement[el.dataset.act]) gestesChangement[el.dataset.act](el, e);
});
