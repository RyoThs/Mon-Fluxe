/* Reprise d'une séance interrompue grâce à la clé fluxe_backup. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer, lireCle, lancerSeance, finirSeance, CLE_REPRISE, cache } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

test('la séance est sauvegardée dès le départ puis à chaque exercice', async () => {
  const p = await app.page();
  await lancerSeance(p, ['Jambes']);
  let b = await lireCle(p, CLE_REPRISE);
  assert.equal(b.index, 0);
  assert.equal(b.lvl, 'intermediate');
  assert.equal(b.workout.length, 3);
  await p.click('#workout-screen button:has-text("Suivant")');
  b = await lireCle(p, CLE_REPRISE);
  assert.equal(b.index, 1);
});

test('après fermeture, la carte « Reprendre » apparaît et relance au bon exercice', async () => {
  const p = await app.page();
  await p.click('#main-screen button:has-text("Débutant")');
  await lancerSeance(p, ['Dos']);
  await p.click('#workout-screen button:has-text("Suivant")');
  const b = await lireCle(p, CLE_REPRISE);

  await p.reload(); // l'utilisateur ferme puis rouvre l'app
  assert.ok(!(await cache(p, '#resume-card')));
  assert.ok(await cache(p, '#workout-screen'));
  await p.click('#resume-card button:has-text("Reprendre")');
  assert.ok(!(await cache(p, '#workout-screen')));
  assert.ok(await cache(p, '#resume-card'));
  assert.equal(await p.textContent('#ex-name'), b.workout[1].n);
  assert.equal(await p.textContent('#step-counter-text'), 'Flux 2/3');
  assert.equal(await p.evaluate(() => levelKey), 'beginner'); // eslint-disable-line no-undef
  assert.deepEqual(p.erreurs, []);
});

test('sans sauvegarde, pas de carte « Reprendre »', async () => {
  const p = await app.page();
  assert.ok(await cache(p, '#resume-card'));
});

test('fluxe_backup est supprimé à la fin de la séance', async () => {
  const p = await app.page();
  await lancerSeance(p);
  assert.notEqual(await lireCle(p, CLE_REPRISE), null);
  const total = await p.evaluate(() => currentWorkout.length); // eslint-disable-line no-undef
  for (let i = 0; i < total; i++) await p.click('#workout-screen button:has-text("Suivant")');
  // supprimé dès l'écran « Flux Terminé », avant même le choix de l'humeur
  assert.equal(await lireCle(p, CLE_REPRISE), null);
  await p.click('#feedback-screen button:has-text("🔥")');
  await p.reload();
  assert.ok(await cache(p, '#resume-card'));
});

test('une séance reprise puis terminée efface aussi la sauvegarde', async () => {
  const p = await app.page();
  await lancerSeance(p);
  await p.reload();
  await p.click('#resume-card button:has-text("Reprendre")');
  await finirSeance(p);
  assert.equal(await lireCle(p, CLE_REPRISE), null);
});
