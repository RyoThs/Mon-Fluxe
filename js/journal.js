/* Écran Journal : liste des séances et graphique d'activité. */

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

    // 2. Graphique de la semaine en cours, du lundi (index 0) au dimanche (index 6)
    const stats = new Array(7).fill(0);
    const lundi = debutDeSemaine();
    let totalEx = 0;
    userData.logs.forEach(log => {
        const logDate = new Date(log.date);
        if (logDate < lundi) return; // semaine précédente (ou plus ancienne) : pas dans ce graphique
        stats[(logDate.getDay() + 6) % 7] += log.count;
        totalEx += log.count;
    });
    const maxEx = Math.max(...stats, 10); // Minimum 10 pour l'échelle
    document.getElementById('total-week-ex').innerText = `${totalEx} exos cette semaine`;
    chartContainer.innerHTML = stats.map(val => {
        const height = (val / maxEx) * 100;
        const opacity = val > 0 ? 1 : 0.2;
        return `<div class="barre-graphique" style="height: ${height}%; opacity: ${opacity}"></div>`;
    }).join('');
}
