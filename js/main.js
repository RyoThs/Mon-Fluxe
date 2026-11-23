/* Point de départ (chargé en dernier) : version affichée, en-tête, carte « Reprendre », mode hors ligne. */

// Version affichée en bas de la fenêtre d'aide (lue dans la balise app-version)
document.getElementById('version-app').textContent = `Fluxe v${document.querySelector('meta[name="app-version"]').content}`;

updateUI();
afficherOptionEchauffement();
afficherNiveau();
checkBackup();

// Hors ligne : enregistre le service worker (sw.js), qui garde une copie de l'app
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {}));
}
