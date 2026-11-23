/* Motivation : semaines d'affilée (une semaine compte si elle a au moins une séance, du lundi au dimanche). */

// Nombre de semaines de suite avec au moins une séance, en finissant par cette semaine
// (ou par la semaine dernière, si aucune séance n'a encore été faite cette semaine : la série tient encore)
function semainesAffilee(logs, maintenant = new Date()) {
    const SEMAINE = 7 * 864e5;
    const lundi = debutDeSemaine(maintenant).getTime();
    // numéro de semaine en arrière : 0 = cette semaine, 1 = la semaine dernière…
    const faites = new Set(logs.map(l => Math.ceil((lundi - debutDeSemaine(new Date(l.date)).getTime()) / SEMAINE - 0.01)));
    let depart = faites.has(0) ? 0 : 1, n = 0;
    while (faites.has(depart + n)) n++;
    return n;
}

function afficherSemaines() {
    const n = semainesAffilee(userData.logs);
    document.getElementById('semaines').textContent = n === 0
        ? 'Fais une séance cette semaine pour lancer ta série'
        : `🔥 ${n} semaine${n > 1 ? 's' : ''} d’affilée`;
}

/* Récompenses : calculées à chaque affichage à partir de l'historique (rien n'est stocké en plus).
   Elles sont visibles dans le Journal ; jamais de fenêtre automatique. */
const RECOMPENSES = [
    { nom: 'Première séance', icone: '🌱', ok: s => s.seances >= 1 },
    { nom: '5 séances', icone: '💪', ok: s => s.seances >= 5 },
    { nom: '10 séances', icone: '⚡', ok: s => s.seances >= 10 },
    { nom: '25 séances', icone: '🏅', ok: s => s.seances >= 25 },
    { nom: '50 séances', icone: '🥈', ok: s => s.seances >= 50 },
    { nom: '100 séances', icone: '🥇', ok: s => s.seances >= 100 },
    { nom: '100 exercices', icone: '🎯', ok: s => s.exercices >= 100 },
    { nom: '500 exercices', icone: '🚀', ok: s => s.exercices >= 500 },
    { nom: '1 000 exercices', icone: '🏆', ok: s => s.exercices >= 1000 },
    { nom: '2 semaines d’affilée', icone: '🔥', ok: s => s.meilleureSerie >= 2 },
    { nom: '4 semaines d’affilée', icone: '📅', ok: s => s.meilleureSerie >= 4 },
    { nom: '8 semaines d’affilée', icone: '🗓️', ok: s => s.meilleureSerie >= 8 },
    { nom: '12 semaines d’affilée', icone: '👑', ok: s => s.meilleureSerie >= 12 },
    { nom: 'Niveau 5', icone: '⭐', ok: s => s.niveau >= 5 },
    { nom: 'Niveau 10', icone: '🌟', ok: s => s.niveau >= 10 },
];

// Plus longue série de semaines d'affilée de tout l'historique (une récompense gagnée le reste)
function meilleureSerie(logs) {
    const SEMAINE = 7 * 864e5;
    const semaines = [...new Set(logs.map(l => Math.round(debutDeSemaine(new Date(l.date)).getTime() / SEMAINE)))].sort((a, b) => a - b);
    let meilleure = 0, n = 0;
    semaines.forEach((s, i) => { n = i > 0 && s === semaines[i - 1] + 1 ? n + 1 : 1; meilleure = Math.max(meilleure, n); });
    return meilleure;
}

function afficherRecompenses() {
    const stats = {
        seances: userData.logs.length,
        exercices: userData.logs.reduce((t, l) => t + l.count, 0),
        meilleureSerie: meilleureSerie(userData.logs),
        niveau: userData.lvl,
    };
    const cases = RECOMPENSES.map(r => {
        const gagnee = r.ok(stats);
        const c = element('div', `recompense${gagnee ? ' gagnee' : ''}`);
        c.append(element('span', 'recompense-icone', r.icone), element('b', '', r.nom));
        return c;
    });
    document.getElementById('recompenses').replaceChildren(...cases);
    document.getElementById('recompenses-titre').textContent = `Récompenses · ${cases.filter(c => c.classList.contains('gagnee')).length}/${RECOMPENSES.length}`;
}

/* Progression automatique : propose de monter après 3 séances 😃 de suite au même niveau,
   ou de descendre après 2 séances 💀 de suite. Seulement une proposition (rien ne change sans toucher). */
const NOM_NIVEAU = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' };
function niveauPropose(logs, niveauActuel) {
    const derniers = n => logs.slice(-n);
    const memes = (liste, humeur) => liste.length > 0 && liste.every(l => l.niveau === niveauActuel && l.mood === humeur);
    const i = NIVEAUX.indexOf(niveauActuel);
    if (logs.length >= 3 && memes(derniers(3), '😃') && i < 2) return { niveau: NIVEAUX[i + 1], texte: `Prêt pour ${NOM_NIVEAU[NIVEAUX[i + 1]]} ? Tes 3 dernières séances étaient faciles.` };
    if (logs.length >= 2 && memes(derniers(2), '💀') && i > 0) return { niveau: NIVEAUX[i - 1], texte: `Un peu dur ? Essaie ${NOM_NIVEAU[NIVEAUX[i - 1]]} quelques séances.` };
    return null;
}

function afficherSuggestion() {
    const zone = document.getElementById('suggestion');
    const p = niveauPropose(userData.logs, levelKey);
    zone.classList.toggle('cache', !p);
    if (!p) return;
    const bouton = element('button', 'bouton-reprendre', `Passer à ${NOM_NIVEAU[p.niveau]}`);
    bouton.dataset.act = 'niveau';
    bouton.dataset.niveau = p.niveau;
    zone.replaceChildren(element('p', 'suggestion-texte', p.texte), bouton);
}
