/* v1.4.0 : rappels de séance (fichier calendrier .ics, sans serveur ni compte) et passerelle vers Fluxe Suivi. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { demarrer, donner, CLE_UTILISATEUR } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

test('rappels : le fichier calendrier répète la séance chaque semaine aux jours choisis, avec une alerte', async () => {
  const p = await app.page();
  const ics = await p.evaluate(() => calendrierRappel(['MO', 'WE', 'FR'], '18:30')); // eslint-disable-line no-undef
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /\r\nRRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR\r\n/);
  assert.match(ics, /\r\nDTSTART:\d{8}T183000\r\n/);
  assert.match(ics, /\r\nSUMMARY:Séance Fluxe\r\n/);
  assert.match(ics, /\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\n/);
  assert.match(ics, /\r\nEND:VCALENDAR\r\n$/);
});

test('rappels : choisir les jours et l’heure puis « Ajouter à mon calendrier » télécharge fluxe-rappels.ics', async () => {
  const p = await app.page({ acceptDownloads: true });
  await p.click('#nav-log');
  await p.click('#rappel-jours button:has-text("Mar")');
  await p.click('#rappel-jours button:has-text("Jeu")');
  await p.fill('#rappel-heure', '07:15');
  const [telechargement] = await Promise.all([p.waitForEvent('download'), p.click('#rappel-ajouter')]);
  assert.equal(telechargement.suggestedFilename(), 'fluxe-rappels.ics');
  const texte = fs.readFileSync(await telechargement.path(), 'utf8');
  assert.match(texte, /RRULE:FREQ=WEEKLY;BYDAY=TU,TH/);
  assert.match(texte, /DTSTART:\d{8}T071500/);
  assert.deepEqual(p.erreurs, []);
});

test('rappels : sans jour choisi, un petit message prévient et rien n’est téléchargé', async () => {
  const p = await app.page();
  await p.click('#nav-log');
  await p.click('#rappel-ajouter');
  assert.equal(await p.textContent('#message'), 'Choisis au moins un jour');
});

test('passerelle : cachée au début, proposée au niveau 5, avec un lien vers Fluxe Suivi (même site)', async () => {
  const p = await app.page();
  await p.click('#nav-log');
  assert.ok(!(await p.isVisible('#passerelle')));
  await donner(p, { [CLE_UTILISATEUR]: { lvl: 5, xp: 0, streak: 3, logs: [] } });
  await p.click('#nav-log');
  assert.ok(await p.isVisible('#passerelle'));
  assert.match(await p.textContent('#passerelle'), /Prêt pour la salle/);
  assert.equal(await p.getAttribute('#passerelle a', 'href'), '../Fluxe-Suivi/');
});
