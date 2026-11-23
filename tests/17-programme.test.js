/* Programme « Débuter en 4 semaines » (v1.3.0) : 12 séances guidées (3 par semaine), qui avancent
   seulement quand une séance du programme est terminée. Clé de stockage : fluxe_programme. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer, donner, lireCle, finirSeance, cache } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

test('accueil : le programme est proposé, et rien n’est enregistré tant qu’on ne le commence pas', async () => {
  const p = await app.page();
  assert.match(await p.textContent('#programme'), /Débuter en 4 semaines/);
  assert.ok(await p.isVisible('#programme button:has-text("Commencer")'));
  assert.equal(await lireCle(p, 'fluxe_programme'), null);
});

test('commencer puis lancer la séance 1 : groupes et niveau imposés par le programme', async () => {
  const p = await app.page();
  await p.click('#programme button:has-text("Commencer")');
  assert.match(await p.textContent('#programme'), /Séance 1\/12/);
  assert.deepEqual(await lireCle(p, 'fluxe_programme'), { id: 'debuter4', faites: 0 });
  await p.click('#programme button:has-text("Lancer")');
  assert.ok(!(await cache(p, '#workout-screen')));
  const r = await p.evaluate(() => ({ niveau: levelKey, groupes: [...new Set(currentWorkout.filter(e => !e.t).map(e => e.m))].sort() })); // eslint-disable-line no-undef
  assert.deepEqual(r, { niveau: 'beginner', groupes: ['Bras', 'Dos', 'Pectoraux'] });
});

test('une séance du programme terminée fait avancer le programme ; une séance libre non', async () => {
  const p = await app.page();
  await donner(p, { fluxe_programme: { id: 'debuter4', faites: 0 } });
  await p.click('#programme button:has-text("Lancer")');
  await finirSeance(p);
  assert.deepEqual(await lireCle(p, 'fluxe_programme'), { id: 'debuter4', faites: 1 });
  assert.match(await p.textContent('#programme'), /Séance 2\/12/);
  // séance libre
  await p.click('#main-screen .puce-muscle:text-is("Abdos")');
  await p.click('#main-screen button:has-text("Activer le Fluxe")');
  await finirSeance(p);
  assert.equal((await lireCle(p, 'fluxe_programme')).faites, 1);
});

test('séance interrompue puis reprise : elle compte quand même pour le programme', async () => {
  const p = await app.page();
  await donner(p, { fluxe_programme: { id: 'debuter4', faites: 3 } });
  await p.click('#programme button:has-text("Lancer")');
  await p.click('#workout-screen button[aria-label="Quitter la séance"]');
  await p.reload();
  await p.click('#resume-card button:has-text("Reprendre")');
  await finirSeance(p);
  assert.equal((await lireCle(p, 'fluxe_programme')).faites, 4);
});

test('après la 12e séance : « Programme terminé », et on peut arrêter ou recommencer', async () => {
  const p = await app.page();
  await donner(p, { fluxe_programme: { id: 'debuter4', faites: 12 } });
  assert.match(await p.textContent('#programme'), /Programme terminé/);
  await p.click('#programme button:has-text("Recommencer")');
  assert.equal((await lireCle(p, 'fluxe_programme')).faites, 0);
  await p.click('#programme button:has-text("Arrêter")');
  assert.equal(await lireCle(p, 'fluxe_programme'), null);
  assert.ok(await p.isVisible('#programme button:has-text("Commencer")'));
});

test('programme abîmé dans le stockage : ignoré sans planter', async () => {
  const p = await app.page();
  await donner(p, { fluxe_programme: { id: 'inconnu', faites: 'beaucoup' } });
  assert.ok(await p.isVisible('#programme button:has-text("Commencer")'));
  assert.deepEqual(p.erreurs, []);
});
