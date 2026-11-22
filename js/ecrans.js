/* Écrans : passage de l'accueil au journal, et mise à jour de l'en-tête (niveau, séances, barre d'XP). */
function showScreen(id) {
    document.querySelectorAll('.ecran').forEach(s => s.classList.add('ecran-cache'));
    document.getElementById(id).classList.remove('ecran-cache');
    document.querySelectorAll('.bouton-nav').forEach(n => n.classList.remove('actif'));
    if (id === 'main-screen') document.getElementById('nav-home').classList.add('actif');
    if (id === 'logbook-screen') document.getElementById('nav-log').classList.add('actif');
}

function updateUI() {
    document.getElementById('user-lvl').innerText = userData.lvl;
    document.getElementById('streak-counter').innerText = `🔥 ${userData.streak} SESSIONS`;
    document.getElementById('xp-fill').style.width = `${(userData.xp / (userData.lvl * 100)) * 100}%`;
    document.getElementById('xp-texte').innerText = `${userData.xp} / ${userData.lvl * 100} XP`;
    afficherSemaines();
}
