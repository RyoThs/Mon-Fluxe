/* Écran Journal : liste des séances et graphique d'activité. */

// Crée un élément avec textContent : un texte venant d'un fichier importé ne peut jamais être pris pour du code
function element(balise, classe, texte) {
    const el = document.createElement(balise);
    if (classe) el.className = classe;
    if (texte !== undefined) el.textContent = texte;
    return el;
}

function renderLogbook() {
    const logList = document.getElementById('log-list');
    const chartContainer = document.getElementById('activity-chart');

    // 1. Liste des séances, la plus récente en haut
    logList.replaceChildren(...userData.logs.slice().reverse().map(l => {
        const carte = element('div', 'carte carte-seance');
        const textes = element('div');
        textes.append(element('p', 'carte-seance-date', new Date(l.date).toLocaleDateString()), element('p', 'carte-seance-nombre', `${l.count} Exercices`));
        carte.append(textes, element('span', 'carte-seance-humeur', l.mood));
        return carte;
    }));

    // 2. Graphique (7 derniers jours), index 0 = lundi
    const stats = new Array(7).fill(0);
    const today = new Date();
    let totalEx = 0;
    userData.logs.forEach(log => {
        const logDate = new Date(log.date);
        const diffDays = Math.ceil(Math.abs(today - logDate) / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
            let dayIdx = logDate.getDay() - 1;
            if (dayIdx === -1) dayIdx = 6;
            stats[dayIdx] += log.count;
            totalEx += log.count;
        }
    });
    const maxEx = Math.max(...stats, 10); // Minimum 10 pour l'échelle
    document.getElementById('total-week-ex').innerText = `${totalEx} exos cette semaine`;
    chartContainer.innerHTML = stats.map(val => {
        const height = (val / maxEx) * 100;
        const opacity = val > 0 ? 1 : 0.2;
        return `<div class="barre-graphique" style="height: ${height}%; opacity: ${opacity}"></div>`;
    }).join('');
}
