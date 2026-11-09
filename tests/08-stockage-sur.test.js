/* Stockage sûr : des données abîmées ou incomplètes ne font jamais planter l'app
   et ne sont jamais perdues sans laisser de copie. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer, donner, donnerBrut, lireBrut, lireCle, lancerSeance, finirSeance, cache, lire, CLE_UTILISATEUR, CLE_REPRISE } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

const COPIE = 'fluxe_user_v1_illisible';
const seanceOk = { date: '2026-11-01T10:00:00.000Z', mood: '🔥', count: 3 };

test('progression illisible « {abc » : l’app démarre, le texte brut est copié et gardé', async () => {
  const p = await app.page();
  await donnerBrut(p, { [CLE_UTILISATEUR]: '{abc' });
  assert.equal(await p.textContent('#user-lvl'), '1');
  assert.equal(await lireBrut(p, COPIE), '{abc');
  assert.equal(await lireBrut(p, CLE_UTILISATEUR), '{abc', 'la clé d’origine ne doit pas être écrasée tant que rien n’a été fait');
  await p.click('#nav-log'); // le journal s'ouvre aussi
  assert.deepEqual(p.erreurs, []);

  // Après une vraie séance, la progression repart proprement ; la copie reste
  await p.click('#nav-home');
  await lancerSeance(p);
  await finirSeance(p);
  assert.equal((await lireCle(p, CLE_UTILISATEUR)).xp, 45);
  assert.equal(await lireBrut(p, COPIE), '{abc');
});

test('une copie illisible déjà présente n’est jamais écrasée', async () => {
  const p = await app.page();
  await donnerBrut(p, { [COPIE]: 'premiere-copie', [CLE_UTILISATEUR]: '{abc' });
  assert.equal(await lireBrut(p, COPIE), 'premiere-copie');
});

for (const brut of ['null', '"texte"', '[1,2]', '42']) {
  test(`progression au mauvais format (${brut}) : valeurs par défaut + copie`, async () => {
    const p = await app.page();
    await donnerBrut(p, { [CLE_UTILISATEUR]: brut });
    assert.equal(await p.textContent('#user-lvl'), '1');
    assert.equal(await lireBrut(p, COPIE), brut);
    assert.deepEqual(p.erreurs, []);
  });
}

test('sauvegarde de séance illisible « {abc » : l’app démarre, pas de carte « Reprendre », texte gardé', async () => {
  const p = await app.page();
  await donnerBrut(p, { [CLE_REPRISE]: '{abc' });
  assert.ok(await cache(p, '#resume-card'));
  await p.evaluate(() => resumeWorkout()); // eslint-disable-line no-undef
  assert.ok(await cache(p, '#workout-screen'));
  assert.equal(await lireBrut(p, CLE_REPRISE), '{abc');
  assert.deepEqual(p.erreurs, []);
});

test('« {abc » dans les deux clés à la fois : l’app démarre et fonctionne', async () => {
  const p = await app.page();
  await donnerBrut(p, { [CLE_UTILISATEUR]: '{abc', [CLE_REPRISE]: '{abc' });
  await lancerSeance(p);
  await finirSeance(p);
  assert.equal((await lireCle(p, CLE_UTILISATEUR)).xp, 45);
  assert.deepEqual(p.erreurs, []);
});

const exo = { n: 'Squat', r: 10, d: 'Bases', h: 'Aide' };
const backupsAbimes = {
  'tableau vide': [],
  'workout pas un tableau': { workout: 'x', index: 0, lvl: 'beginner' },
  'workout vide': { workout: [], index: 0, lvl: 'beginner' },
  'index trop grand': { workout: [exo], index: 5, lvl: 'beginner' },
  'index négatif': { workout: [exo], index: -1, lvl: 'beginner' },
  'niveau inconnu': { workout: [exo], index: 0, lvl: 'expert' },
  'exercice incomplet': { workout: [{ n: 'Squat' }], index: 0, lvl: 'beginner' },
};
for (const [nom, b] of Object.entries(backupsAbimes)) {
  test(`sauvegarde de séance mal formée (${nom}) : ignorée sans planter`, async () => {
    const p = await app.page();
    await donner(p, { [CLE_REPRISE]: b });
    assert.ok(await cache(p, '#resume-card'));
    await p.evaluate(() => resumeWorkout()); // eslint-disable-line no-undef
    assert.ok(await cache(p, '#workout-screen'));
    assert.deepEqual(p.erreurs, []);
  });
}

test('une sauvegarde de séance correcte est toujours reprise', async () => {
  const p = await app.page();
  await donner(p, { [CLE_REPRISE]: { workout: [exo, { ...exo, n: 'Fentes' }], index: 1, lvl: 'beginner' } });
  assert.ok(!(await cache(p, '#resume-card')));
  await p.click('#resume-card button');
  assert.equal(await p.textContent('#ex-name'), 'Fentes');
});

test('progression incomplète : champs manquants complétés, champs existants gardés (même inconnus)', async () => {
  const p = await app.page();
  await donner(p, { [CLE_UTILISATEUR]: { lvl: 3, autre: 'gardé' } });
  assert.equal(await p.textContent('#user-lvl'), '3');
  assert.equal(await p.textContent('#streak-counter'), '🔥 0 SESSIONS');
  assert.deepEqual(await p.evaluate(() => userData), { lvl: 3, xp: 0, logs: [], streak: 0, autre: 'gardé' }); // eslint-disable-line no-undef
  assert.deepEqual(await lireCle(p, CLE_UTILISATEUR), { lvl: 3, autre: 'gardé' }, 'rien n’est réécrit avant une séance');
  assert.equal(await lireBrut(p, COPIE), null, 'des champs manquants ne sont pas une erreur');
  await lancerSeance(p);
  await finirSeance(p);
  const u = await lireCle(p, CLE_UTILISATEUR);
  assert.deepEqual([u.lvl, u.xp, u.streak, u.logs.length, u.autre], [3, 45, 1, 1, 'gardé']);
});

test('champ au mauvais type : remplacé, les bonnes lignes du journal gardées, copie brute faite', async () => {
  const p = await app.page();
  const abime = { lvl: 2, xp: 'beaucoup', streak: 4, logs: [seanceOk, { date: 'pas une date', mood: '😃', count: 3 }, 'x'] };
  await donner(p, { [CLE_UTILISATEUR]: abime });
  assert.deepEqual(await p.evaluate(() => userData), { lvl: 2, xp: 0, streak: 4, logs: [seanceOk] }); // eslint-disable-line no-undef
  assert.deepEqual(JSON.parse(await lireBrut(p, COPIE)), abime);
  await p.click('#nav-log');
  assert.deepEqual(p.erreurs, []);
});

test('faute corrigée : « hanches » (et plus « fanches »)', () => {
  assert.ok(lire('index.html').includes('mains derrière les hanches'));
  assert.ok(!lire('index.html').includes('fanches'));
});
