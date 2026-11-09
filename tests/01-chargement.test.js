/* L'application s'ouvre sans erreur JavaScript, sur un téléphone neuf. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

test('la page se charge sans erreur JavaScript', async () => {
  const p = await app.page();
  await p.waitForSelector('#main-screen');
  assert.equal(await p.textContent('#user-lvl'), '1');
  assert.match(await p.textContent('#streak-counter'), /0 SESSIONS/);
  assert.deepEqual(p.erreurs, []);
});

test('en mode sombre aussi, aucune erreur', async () => {
  const p = await app.page({ colorScheme: 'dark' });
  await p.waitForSelector('#main-screen');
  assert.deepEqual(p.erreurs, []);
});

test('le journal s\'ouvre sans erreur', async () => {
  const p = await app.page();
  await p.click('#nav-log');
  assert.ok(await p.isVisible('#logbook-screen'));
  assert.equal(await p.locator('#activity-chart .chart-bar').count(), 7);
  assert.deepEqual(p.erreurs, []);
});
