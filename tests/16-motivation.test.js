/* Donner envie de revenir (v1.3.0) : semaines d'affilée, récompenses, progression automatique, programme. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer, donner, lireCle, lancerSeance, finirSeance, CLE_UTILISATEUR, JOUR } = require('./outils'); // eslint-disable-line no-unused-vars

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

// Lundi 10 h de la semaine « il y a n semaines » (n = 0 : cette semaine)
function lundi(n) {
  const d = new Date(); d.setHours(10, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) - 7 * n);
  return d;
}
const seance = (date, extra = {}) => ({ date: date.toISOString(), mood: '🔥', count: 6, ...extra });
const profil = (logs, extra = {}) => ({ [CLE_UTILISATEUR]: { lvl: 1, xp: 0, streak: logs.length, logs, ...extra } });

test('semaines d’affilée : 3 semaines de suite jusqu’à cette semaine = 3', async () => {
  const p = await app.page();
  await donner(p, profil([seance(lundi(2)), seance(lundi(1)), seance(lundi(0))]));
  assert.equal(await p.textContent('#semaines'), '🔥 3 semaines d’affilée');
});

test('semaines d’affilée : la série tient encore si la semaine en cours n’a pas encore de séance', async () => {
  const p = await app.page();
  await donner(p, profil([seance(lundi(3)), seance(lundi(2)), seance(lundi(1))]));
  assert.equal(await p.textContent('#semaines'), '🔥 3 semaines d’affilée');
});

test('semaines d’affilée : une semaine sans séance casse la série', async () => {
  const p = await app.page();
  await donner(p, profil([seance(lundi(4)), seance(lundi(3)), seance(lundi(1)), seance(lundi(0))]));
  assert.equal(await p.textContent('#semaines'), '🔥 2 semaines d’affilée');
  const q = await app.page();
  await donner(q, profil([seance(lundi(3))]));
  assert.equal(await q.textContent('#semaines'), 'Fais une séance cette semaine pour lancer ta série');
});

test('semaines d’affilée : 1 semaine au singulier, et mise à jour juste après une séance', async () => {
  const p = await app.page();
  await lancerSeance(p, ['Abdos']);
  await finirSeance(p);
  assert.equal(await p.textContent('#semaines'), '🔥 1 semaine d’affilée');
});

test('récompenses : 15 dans le journal, gagnées selon l’historique (séances, exercices, semaines, niveau)', async () => {
  const p = await app.page();
  // 10 séances de 12 exercices (120 exos) sur 4 semaines de suite, niveau 5
  const logs = [];
  for (let s = 3; s >= 0; s--) for (let i = 0; i < (s === 0 ? 1 : 3); i++) logs.push(seance(new Date(lundi(s).getTime() + i * JOUR), { count: 12 }));
  await donner(p, profil(logs, { lvl: 5 }));
  await p.click('#nav-log');
  assert.equal(await p.locator('#recompenses .recompense').count(), 15);
  const gagnees = await p.$$eval('#recompenses .recompense.gagnee b', els => els.map(e => e.textContent));
  assert.deepEqual(gagnees, ['Première séance', '5 séances', '10 séances', '100 exercices', '2 semaines d’affilée', '4 semaines d’affilée', 'Niveau 5']);
  assert.equal(await p.textContent('#recompenses-titre'), 'Récompenses · 7/15');
  assert.deepEqual(p.messages, [], 'aucune fenêtre automatique');
});

test('récompenses : aucune au départ, toutes visibles en grisé', async () => {
  const p = await app.page();
  await p.click('#nav-log');
  assert.equal(await p.locator('#recompenses .recompense.gagnee').count(), 0);
  assert.equal(await p.textContent('#recompenses-titre'), 'Récompenses · 0/15');
});

module.exports = { lundi, seance, profil, JOUR };
