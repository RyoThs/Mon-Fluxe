/* Écran Journal : chiffres clés, graphique de la semaine et liste des séances.
   Cloison : si l'affichage plante, seul le journal montre « n'a pas pu s'afficher · Réessayer » ;
   le reste de l'app continue de marcher. */

function renderLogbook() {
    const panne = document.getElementById('journal-panne');
    const contenu = document.getElementById('journal-contenu');
    try {
        afficherJournal();
        panne.classList.add('cache');
        contenu.classList.remove('cache');
    } catch (e) {
        panne.classList.remove('cache');
        contenu.classList.add('cache');
    }
}

function afficherJournal() {
    afficherChiffres();
    afficherListe();
    afficherSemaine();
    afficherRecompenses();
}

// Bandeau : nombre de séances, d'exercices, et XP gagnés (15 XP par exercice)
function afficherChiffres() {
    const exercices = userData.logs.reduce((total, l) => total + l.count, 0);
    const case_ = (nombre, legende) => { const d = element('div'); d.append(element('b', '', String(nombre)), element('span', '', legende)); return d; };
    document.getElementById('chiffres-journal').replaceChildren(
        case_(userData.logs.length, 'Séances'), case_(exercices, 'Exercices'), case_(exercices * 15, 'XP gagnés'));
}

// Liste des séances, la plus récente en haut (textContent seulement : aucun texte importé n'est pris pour du code)
function afficherListe() {
    document.getElementById('log-list').replaceChildren(...userData.logs.slice().reverse().map(l => {
        const carte = element('div', 'carte carte-seance');
        const textes = element('div');
        textes.append(element('p', 'carte-seance-date', dateLisible(new Date(l.date))), element('p', 'carte-seance-nombre', `${l.count} Exercices`));
        carte.append(textes, element('span', 'carte-seance-humeur', l.mood));
        return carte;
    }));
}

// Graphique de la semaine en cours, du lundi (index 0) au dimanche (index 6)
function afficherSemaine() {
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
    document.getElementById('activity-chart').innerHTML = stats.map(val => {
        const height = (val / maxEx) * 100;
        const opacity = val > 0 ? 1 : 0.2;
        return `<div class="barre-graphique" style="height: ${height}%; opacity: ${opacity}"></div>`;
    }).join('');
}
