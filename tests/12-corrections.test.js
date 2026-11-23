/* Bugs trouvés lors de l'analyse du code (v1.1.0) : chaque test reproduit le bug, puis vérifie la correction. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer, donner, lancerSeance, CLE_UTILISATEUR, JOUR } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

test('tirage équitable : chaque exercice d’un groupe a autant de chances d’être choisi', async () => {
  // Avant : mélange par sort(() => 0.5 - Math.random()), très déséquilibré (un exercice sortait 3 fois moins qu'un autre)
  const p = await app.page();
  await p.click('#main-screen button:text-is("Pectoraux")');
  const { compte, taille } = await p.evaluate(() => {
    const c = {};
    for (let i = 0; i < 4000; i++) { generateWorkout(); currentWorkout.forEach(e => { c[e.n] = (c[e.n] || 0) + 1; }); } // eslint-disable-line no-undef
    return { compte: c, taille: exerciseLibrary['Pectoraux'].intermediate.length }; // eslint-disable-line no-undef
  });
  // 3 exercices tirés parmi « taille » (5 jusqu'à la v1.4.0, 8 depuis la v1.5.0) :
  // chacun attendu 4000 × 3/taille fois (marge large : ± 1/6 de l'attendu)
  const attendu = 4000 * 3 / taille;
  assert.equal(Object.keys(compte).length, taille);
  for (const [nom, n] of Object.entries(compte)) assert.ok(n > attendu * 5 / 6 && n < attendu * 7 / 6, `${nom} tiré ${n} fois sur 4000 (attendu ≈ ${attendu})`);
});

test('mode Express : jamais plus de 6 exercices (comme annoncé), même avec les 6 groupes', async () => {
  const p = await app.page();
  await p.click('#express-toggle');
  await lancerSeance(p, ['Pectoraux', 'Dos', 'Jambes', 'Abdos', 'Épaules', 'Bras']); // 18 exercices, moitié = 9
  assert.equal(await p.evaluate(() => currentWorkout.length), 6); // eslint-disable-line no-undef
});

test('fenêtre d’aide : le texte en **gras** est affiché en gras, sans les étoiles', async () => {
  const p = await app.page();
  await lancerSeance(p);
  await p.click('#workout-screen button:has-text("?")');
  const texte = await p.textContent('#modal-text');
  assert.ok(!texte.includes('**'), `étoiles visibles : ${texte.slice(0, 60)}`);
  assert.ok(await p.locator('#modal-text strong').count() >= 1);
  assert.deepEqual(p.erreurs, []);
});

test('graphique de la semaine : une séance d’il y a 7 jours ne compte pas dans la barre d’aujourd’hui', async () => {
  // Avant : « 7 derniers jours » rangés par jour de la semaine → la séance du même jour, 7 jours plus tôt, s'ajoutait à aujourd'hui
  const p = await app.page();
  const maintenant = Date.now();
  const ilYA7Jours = new Date(maintenant - 7 * JOUR);
  ilYA7Jours.setHours(23, 59, 0, 0); // même jour de la semaine, mais plus tard dans la journée qu'en ce moment
  await donner(p, { [CLE_UTILISATEUR]: { lvl: 1, xp: 0, streak: 2, logs: [
    { date: ilYA7Jours.toISOString(), mood: '😃', count: 9 },
    { date: new Date(maintenant).toISOString(), mood: '🔥', count: 3 },
  ] } });
  await p.click('#nav-log');
  assert.equal(await p.textContent('#total-week-ex'), '3 exos cette semaine');
  const jour = (new Date(maintenant).getDay() + 6) % 7; // 0 = lundi
  const hauteurs = await p.$$eval('#activity-chart > div', els => els.map(e => e.style.height));
  assert.equal(hauteurs.filter(h => h !== '0%').length, 1);
  assert.equal(hauteurs[jour], '30%'); // 3 exos sur une échelle de 10
});
