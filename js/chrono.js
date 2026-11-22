/* Chronos de la séance, SANS AUCUN SON (demande de Yoann) :
   - chrono d'exercice : compte à rebours pour un exercice tenu (planche 30 s…), Démarrer / Pause ;
   - repos : 30 s entre deux exercices, +15 s ou Passer ; il ne bloque rien (« Suivant » reste possible). */
const REPOS_SECONDES = 30;
let chronoRestant = 0, chronoMinuteur = null;
let reposRestant = 0, reposMinuteur = null;

// « 0:30 » à partir d'un nombre de secondes
const minutesSecondes = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/* ----- Chrono d'exercice ----- */
function preparerChrono(ex) {
    arreterChrono();
    const bouton = document.getElementById('chrono-bouton');
    document.querySelector('.seance-centre').classList.remove('chrono-fini');
    bouton.classList.toggle('cache', !ex.s);
    bouton.textContent = 'Démarrer le chrono';
    chronoRestant = Number(ex.r) || 0;
}

function basculerChrono() {
    if (chronoRestant <= 0) return; // déjà terminé
    const bouton = document.getElementById('chrono-bouton');
    if (chronoMinuteur) { arreterChrono(); bouton.textContent = 'Reprendre le chrono'; return; }
    bouton.textContent = 'Pause';
    chronoMinuteur = setInterval(() => {
        chronoRestant--;
        document.getElementById('ex-reps').innerText = chronoRestant;
        if (chronoRestant <= 0) {
            arreterChrono();
            bouton.textContent = 'Terminé ✓';
            document.querySelector('.seance-centre').classList.add('chrono-fini');
        }
    }, 1000);
}

function arreterChrono() { clearInterval(chronoMinuteur); chronoMinuteur = null; }

/* ----- Repos entre deux exercices ----- */
function demarrerRepos() {
    arreterRepos();
    reposRestant = REPOS_SECONDES;
    afficherRepos();
    document.getElementById('repos').classList.remove('cache');
    reposMinuteur = setInterval(() => {
        reposRestant--;
        if (reposRestant <= 0) arreterRepos(); else afficherRepos();
    }, 1000);
}

function ajouterRepos(secondes) { reposRestant += secondes; afficherRepos(); }

function afficherRepos() {
    document.getElementById('repos-temps').textContent = minutesSecondes(reposRestant);
    document.querySelector('#repos i').style.width = `${Math.min(100, (reposRestant / REPOS_SECONDES) * 100)}%`;
}

function arreterRepos() {
    clearInterval(reposMinuteur);
    reposMinuteur = null;
    document.getElementById('repos').classList.add('cache');
}
