/* Mieux guider un débutant (v1.2.0) : secondes pour les exercices tenus, chrono (sans bip),
   repos entre les exercices, échauffement et étirements, dessins, bouton « Plus facile ». */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer, donner, lancerSeance, finirSeance, lireCle, lireCode, CLE_REPRISE, CLE_UTILISATEUR } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

// Les exercices qu'on TIENT (en secondes) et non qu'on répète
const TENUS = ['Chaise Murale', 'Planche', 'Superman Iso', 'Planche Latérale', 'L-Sit', 'Maintien Pike', 'Handstand Hold', '90 Degree Hold', 'Cercles Bras',
  // v1.5.0 : nouveaux exercices tenus
  'Planche Haute', 'Planche Inversée', 'Arch Hold Bras Tendus', 'Planche Inversée 1 Jambe', 'Pont Fessier Tenu', 'Planche Genoux', 'Hollow Hold',
  'Planche RKC', 'V-Sit Tenu', 'Ours Tenu', 'Planche Lean Tenu', 'Curl Main Contre Main', 'Curl Sous la Cuisse'];

// Une séance enregistrée (comme si l'app avait été fermée), pour choisir l'exercice affiché
const reprise = (exercices, index = 0) => ({ [CLE_REPRISE]: { workout: exercices, index, lvl: 'beginner' } });
const ex = (n, r, extra = {}) => ({ n, r, d: 'description', h: '• **Mouvement** : test', ...extra });

test('bibliothèque : exactement les exercices tenus sont marqués « en secondes »', async () => {
  const p = await app.page();
  const marques = await p.evaluate(() => { // eslint-disable-next-line no-undef
    const l = []; for (const g of Object.values(exerciseLibrary)) for (const n of Object.values(g)) for (const e of n) if (e.s) l.push(e.n);
    return [...new Set(l)].sort();
  });
  assert.deepEqual(marques, [...TENUS].sort());
});

test('séance : « Secondes » pour un exercice tenu, « Reps » sinon (une ancienne sauvegarde sans marque = Reps)', async () => {
  const p = await app.page();
  await donner(p, reprise([ex('Planche', 30, { s: 1 }), ex('Crunch', 20)]));
  await p.click('#resume-card button:has-text("Reprendre")');
  assert.equal(await p.textContent('.seance-unite'), 'Secondes');
  await p.click('#workout-screen button:has-text("Suivant")');
  assert.equal(await p.textContent('.seance-unite'), 'Reps');
  assert.deepEqual(p.erreurs, []);
});

test('« À suivre » affiche « 30 s » pour un exercice tenu', async () => {
  const p = await app.page();
  await donner(p, reprise([ex('Crunch', 20), ex('Planche', 30, { s: 1 })]));
  await p.click('#resume-card button:has-text("Reprendre")');
  assert.equal(await p.textContent('#a-suivre li span'), '30 s');
});

// Ouvre l'app avec une horloge contrôlée par le test (on avance le temps sans attendre)
async function pageAvecHorloge(donnees) {
  const p = await app.page();
  await p.clock.install();
  await donner(p, donnees);
  await p.click('#resume-card button:has-text("Reprendre")');
  return p;
}

test('chrono : un exercice tenu a un bouton « Démarrer », le compte à rebours descend puis affiche « Terminé »', async () => {
  const p = await pageAvecHorloge(reprise([ex('Planche', 30, { s: 1 }), ex('Crunch', 20)]));
  assert.ok(await p.isVisible('#chrono-bouton'));
  assert.equal(await p.textContent('#chrono-bouton'), 'Démarrer le chrono');
  await p.click('#chrono-bouton');
  await p.clock.runFor(10000);
  assert.equal(await p.textContent('#ex-reps'), '20');
  assert.equal(await p.textContent('#chrono-bouton'), 'Pause');
  await p.click('#chrono-bouton'); // pause
  await p.clock.runFor(5000);
  assert.equal(await p.textContent('#ex-reps'), '20', 'en pause, le temps ne descend plus');
  await p.click('#chrono-bouton'); // reprise
  await p.clock.runFor(21000);
  assert.equal(await p.textContent('#ex-reps'), '0');
  assert.equal(await p.textContent('#chrono-bouton'), 'Terminé ✓');
  assert.ok(await p.$eval('.seance-centre', el => el.classList.contains('chrono-fini')));
  assert.deepEqual(p.erreurs, []);
});

test('chrono : pas de bouton pour un exercice à répétitions', async () => {
  const p = await pageAvecHorloge(reprise([ex('Crunch', 20), ex('Planche', 30, { s: 1 })]));
  assert.ok(!(await p.isVisible('#chrono-bouton')));
  await p.click('#workout-screen button:has-text("Suivant")');
  assert.ok(await p.isVisible('#chrono-bouton'));
  assert.equal(await p.textContent('#ex-reps'), '30', 'le chrono repart du temps prévu');
});

test('chrono : aucun son (pas de bip), à la demande de Yoann', () => {
  assert.doesNotMatch(lireCode(), /new Audio|AudioContext|createOscillator|\.play\(/);
});

test('repos : après « Suivant », un repos de 30 s s’affiche sans bloquer, et disparaît tout seul', async () => {
  const p = await pageAvecHorloge(reprise([ex('Crunch', 20), ex('Squat Classique', 20), ex('Planche', 30, { s: 1 })]));
  assert.ok(!(await p.isVisible('#repos')));
  await p.click('#workout-screen button:has-text("Suivant")');
  assert.ok(await p.isVisible('#repos'));
  assert.match(await p.textContent('#repos-temps'), /^0:30$/);
  await p.clock.runFor(10000);
  assert.equal(await p.textContent('#repos-temps'), '0:20');
  await p.click('#repos button:has-text("+15 s")');
  assert.equal(await p.textContent('#repos-temps'), '0:35');
  await p.clock.runFor(36000);
  assert.ok(!(await p.isVisible('#repos')), 'le repos se termine tout seul');
  assert.deepEqual(p.erreurs, []);
});

test('repos : « Passer » le ferme, et « Suivant » pendant le repos passe à l’exercice d’après', async () => {
  const p = await pageAvecHorloge(reprise([ex('Crunch', 20), ex('Squat Classique', 20), ex('Planche', 30, { s: 1 })]));
  await p.click('#workout-screen button:has-text("Suivant")');
  await p.click('#repos button:has-text("Passer")');
  assert.ok(!(await p.isVisible('#repos')));
  await p.click('#workout-screen button:has-text("Suivant")');
  assert.equal(await p.textContent('#step-counter-text'), 'Flux 3/3');
  assert.ok(await p.isVisible('#repos'));
  await p.click('#workout-screen button:has-text("Suivant")'); // pendant le repos : on avance quand même
  assert.ok(await p.isVisible('#feedback-screen'));
  assert.ok(!(await p.isVisible('#repos')));
});

test('repos : jamais après le dernier exercice (on arrive directement à la fin)', async () => {
  const p = await app.page();
  await lancerSeance(p, ['Pectoraux']);
  for (let i = 0; i < 3; i++) await p.click('#workout-screen button:has-text("Suivant")');
  assert.ok(await p.isVisible('#feedback-screen'));
  assert.ok(!(await p.isVisible('#repos')));
});

test('échauffement et étirements : option sur l’accueil, 2 mouvements avant et 2 après, ils ne comptent pas en XP', async () => {
  const p = await app.page();
  await p.click('#echauffement-toggle');
  await lancerSeance(p, ['Pectoraux']);
  const types = await p.evaluate(() => currentWorkout.map(e => e.t || 'exercice')); // eslint-disable-line no-undef
  assert.deepEqual(types, ['echauffement', 'echauffement', 'exercice', 'exercice', 'exercice', 'etirement', 'etirement']);
  assert.equal(await p.textContent('#ex-etape'), 'Échauffement');
  assert.ok(await p.isVisible('#ex-etape'));
  const n = await finirSeance(p);
  assert.equal(n, 7);
  const u = await lireCle(p, CLE_UTILISATEUR);
  assert.equal(u.xp, 45, '3 vrais exercices × 15 XP');
  assert.equal(u.logs[0].count, 3);
});

test('échauffement : l’option est retenue d’une fois sur l’autre, et désactivée par défaut', async () => {
  const p = await app.page();
  assert.ok(!(await p.$eval('#echauffement-toggle', el => el.classList.contains('actif'))));
  await p.click('#echauffement-toggle');
  await p.reload();
  assert.ok(await p.$eval('#echauffement-toggle', el => el.classList.contains('actif')));
  assert.deepEqual(await lireCle(p, 'fluxe_reglages'), { echauffement: true });
});

test('échauffement : un exercice normal n’a pas d’étiquette', async () => {
  const p = await app.page();
  await lancerSeance(p, ['Dos']);
  assert.ok(!(await p.isVisible('#ex-etape')));
});

test('dessins : chaque exercice, échauffement et étirement a son dessin', async () => {
  const p = await app.page();
  const sansDessin = await p.evaluate(() => { // eslint-disable-next-line no-undef
    const tous = [...Object.values(exerciseLibrary).flatMap(g => Object.values(g).flat()), ...ECHAUFFEMENTS, ...ETIREMENTS];
    return [...new Set(tous.map(e => e.n))].filter(n => !dessinPour(n)); // eslint-disable-line no-undef
  });
  assert.deepEqual(sansDessin, []);
});

test('dessins : affiché pendant la séance (décoratif), caché pour un exercice inconnu sans planter', async () => {
  const p = await app.page();
  await donner(p, reprise([ex('Glute Bridge', 20), ex('Exercice venu d’une vieille version', 10)])); // exercice sans vidéo (v1.9.0)
  await p.click('#resume-card button:has-text("Reprendre")');
  assert.ok(await p.isVisible('#ex-dessin svg'));
  assert.equal(await p.getAttribute('#ex-dessin svg', 'aria-hidden'), 'true');
  await p.click('#workout-screen button:has-text("Suivant")');
  assert.ok(!(await p.isVisible('#ex-dessin')));
  assert.deepEqual(p.erreurs, []);
});

test('« Plus facile » : remplace l’exercice par un du niveau en dessous, même groupe, et la séance le retient', async () => {
  const p = await app.page();
  await p.click('#main-screen button:has-text("Avancé")');
  await lancerSeance(p, ['Jambes']);
  const avant = await p.textContent('#ex-name');
  assert.ok(await p.isVisible('#plus-facile'));
  await p.click('#plus-facile');
  const apres = await p.textContent('#ex-name');
  const intermediaires = await p.evaluate(() => exerciseLibrary['Jambes'].intermediate.map(e => e.n)); // eslint-disable-line no-undef
  assert.notEqual(apres, avant);
  assert.ok(intermediaires.includes(apres), `${apres} n'est pas un exercice Jambes intermédiaire`);
  assert.match(await p.textContent('#message'), /plus facile/i);
  assert.equal((await lireCle(p, CLE_REPRISE)).workout[0].n, apres, 'la séance enregistrée a l’exercice remplacé');
  assert.equal(await p.evaluate(() => currentWorkout.length), 3); // eslint-disable-line no-undef
});

test('« Plus facile » : absent au niveau Débutant, pour l’échauffement et pour une ancienne séance sans groupe', async () => {
  const p = await app.page();
  await p.click('#main-screen button:has-text("Débutant")');
  await lancerSeance(p, ['Dos']);
  assert.ok(!(await p.isVisible('#plus-facile')));
  const q = await app.page();
  await donner(q, reprise([ex('Pompes Classiques', 15)]));
  await q.click('#resume-card button:has-text("Reprendre")');
  assert.ok(!(await q.isVisible('#plus-facile')));
});

module.exports = { reprise, ex, TENUS };
