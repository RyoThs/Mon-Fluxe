/* Points d'expérience (XP) et niveaux : comportement actuel de l'app.
   - chaque exercice terminé rapporte 15 XP,
   - quand l'XP atteint « niveau × 100 », on passe au niveau suivant et l'XP repart à 0. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer, donner, lireCle, lancerSeance, finirSeance, CLE_UTILISATEUR, cache } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

const profil = (extra = {}) => ({ lvl: 1, xp: 0, logs: [], streak: 0, ...extra });

test('une séance de N exercices rapporte 15 × N XP', async () => {
  const p = await app.page();
  await lancerSeance(p, ['Pectoraux']); // 1 groupe = 3 exercices
  const n = await finirSeance(p, '😃');
  assert.equal(n, 3);
  const u = await lireCle(p, CLE_UTILISATEUR);
  assert.equal(u.xp, 15 * n);
  assert.equal(u.lvl, 1);
  assert.equal(u.streak, 1);
  assert.equal(u.logs.length, 1);
  assert.equal(u.logs[0].count, n);
  assert.equal(u.logs[0].mood, '😃');
  assert.ok(!Number.isNaN(Date.parse(u.logs[0].date)));
  assert.equal(await p.textContent('#streak-counter'), '🔥 1 SESSIONS');
  assert.deepEqual(p.erreurs, []);
});

test('2 groupes = 6 exercices = 90 XP ; le texte de fin annonce le bon gain', async () => {
  const p = await app.page();
  await lancerSeance(p, ['Dos', 'Jambes']);
  const total = await p.evaluate(() => currentWorkout.length); // eslint-disable-line no-undef
  assert.equal(total, 6);
  for (let i = 0; i < total; i++) await p.click('#workout-screen button:has-text("Suivant")');
  assert.equal(await p.textContent('#xp-gain-text'), '+ 90 XP');
  await p.click('#feedback-screen button:has-text("💀")');
  assert.equal((await lireCle(p, CLE_UTILISATEUR)).xp, 90);
});

test('mode Express : moitié des exercices (arrondi au-dessus), XP en conséquence', async () => {
  const p = await app.page();
  await p.click('#express-toggle');
  await lancerSeance(p, ['Abdos', 'Bras', 'Épaules']); // 9 exercices -> 5
  const n = await finirSeance(p);
  assert.equal(n, 5);
  assert.equal((await lireCle(p, CLE_UTILISATEUR)).xp, 75);
});

test('montée de niveau quand l\'XP dépasse niveau × 100 : XP remise à 0', async () => {
  const p = await app.page();
  await donner(p, { [CLE_UTILISATEUR]: profil({ xp: 60, streak: 4 }) });
  await lancerSeance(p);
  await finirSeance(p); // 60 + 45 = 105 >= 100
  const u = await lireCle(p, CLE_UTILISATEUR);
  assert.equal(u.lvl, 2);
  assert.equal(u.xp, 0); // le surplus (5 XP) est perdu : comportement actuel
  assert.equal(u.streak, 5);
  assert.equal(await p.textContent('#user-lvl'), '2');
});

test('montée de niveau aussi quand l\'XP tombe pile sur niveau × 100', async () => {
  const p = await app.page();
  await donner(p, { [CLE_UTILISATEUR]: profil({ xp: 55 }) });
  await lancerSeance(p);
  await finirSeance(p); // 55 + 45 = 100
  const u = await lireCle(p, CLE_UTILISATEUR);
  assert.deepEqual([u.lvl, u.xp], [2, 0]);
});

test('au niveau 2, il faut 200 XP : pas de montée à 195', async () => {
  const p = await app.page();
  await donner(p, { [CLE_UTILISATEUR]: profil({ lvl: 2, xp: 150 }) });
  await lancerSeance(p);
  await finirSeance(p); // 150 + 45 = 195 < 200
  const u = await lireCle(p, CLE_UTILISATEUR);
  assert.deepEqual([u.lvl, u.xp], [2, 195]);
  assert.equal(await p.getAttribute('#xp-fill', 'style'), 'width: 97.5%;');
});

test('sans groupe musculaire choisi, un message prévient et rien ne démarre', async () => {
  const p = await app.page();
  await p.click('#main-screen button:has-text("Activer le Fluxe")');
  assert.deepEqual(p.messages, ['Choisis au moins un muscle !']);
  assert.ok(await cache(p, '#workout-screen'));
});
