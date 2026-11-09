/* Noms des clés de stockage : ils ne doivent JAMAIS changer.
   Fluxe Suivi vit à la même adresse (même origine) : ses données ne doivent pas être touchées. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer, donner, lireCle, cles, lancerSeance, finirSeance, lire, CLE_UTILISATEUR, CLE_REPRISE } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

test('le code utilise toujours les clés fluxe_user_v1 et fluxe_backup', () => {
  const html = lire('index.html');
  assert.equal(CLE_UTILISATEUR, 'fluxe_user_v1');
  assert.equal(CLE_REPRISE, 'fluxe_backup');
  assert.ok(html.includes("'fluxe_user_v1'"));
  assert.ok(html.includes("'fluxe_backup'"));
});

test('après une séance, seule la clé fluxe_user_v1 reste, avec la même forme', async () => {
  const p = await app.page();
  await lancerSeance(p);
  assert.deepEqual(await cles(p), ['fluxe_backup']);
  await finirSeance(p);
  assert.deepEqual(await cles(p), ['fluxe_user_v1']);
  assert.deepEqual(Object.keys(await lireCle(p, CLE_UTILISATEUR)).sort(), ['logs', 'lvl', 'streak', 'xp']);
});

test('un profil existant est relu tel quel', async () => {
  const p = await app.page();
  const profil = { lvl: 3, xp: 120, logs: [{ date: new Date().toISOString(), mood: '😃', count: 3 }], streak: 7 };
  await donner(p, { [CLE_UTILISATEUR]: profil });
  assert.equal(await p.textContent('#user-lvl'), '3');
  assert.equal(await p.textContent('#streak-counter'), '🔥 7 SESSIONS');
  assert.equal(await p.getAttribute('#xp-fill', 'style'), 'width: 40%;');
  assert.deepEqual(await lireCle(p, CLE_UTILISATEUR), profil);
  await p.click('#nav-log');
  assert.equal(await p.locator('#log-list > div').count(), 1);
  assert.match(await p.textContent('#log-list'), /3 Exercices/);
});

test('les données de Fluxe Suivi (même adresse) ne sont pas touchées', async () => {
  const p = await app.page();
  const suivi = { sessions: [{ id: 1 }], routines: [] };
  await donner(p, { 'muscu-v1': suivi });
  await lancerSeance(p);
  await finirSeance(p);
  assert.deepEqual(await lireCle(p, 'muscu-v1'), suivi);
  assert.deepEqual(await cles(p), ['fluxe_user_v1', 'muscu-v1']);
});
