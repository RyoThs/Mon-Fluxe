/* Nouveautés v1.1.0 (façon Fluxe Suivi) :
   - séance : barre de progression, liste « À suivre », bouton « Quitter » (la séance reste à reprendre) ;
   - journal : bandeau de chiffres (séances, exercices, XP gagnés) ;
   - cloison : si le journal plante, seul le journal affiche « n'a pas pu s'afficher · Réessayer ». */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer, donner, lireCle, lancerSeance, cache, CLE_UTILISATEUR, CLE_REPRISE, JOUR } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

const largeurBarre = p => p.$eval('#seance-progression i', el => Math.round(parseFloat(el.style.width)));
const noms = p => p.evaluate(() => currentWorkout.map(e => e.n)); // eslint-disable-line no-undef

test('séance : la barre de progression avance à chaque exercice', async () => {
  const p = await app.page();
  await lancerSeance(p, ['Pectoraux']); // 3 exercices
  assert.equal(await largeurBarre(p), 33);
  await p.click('#workout-screen button:has-text("Suivant")');
  assert.equal(await largeurBarre(p), 67);
  await p.click('#workout-screen button:has-text("Suivant")');
  assert.equal(await largeurBarre(p), 100);
  assert.deepEqual(p.erreurs, []);
});

test('séance : « À suivre » montre les exercices restants, puis « Dernier exercice »', async () => {
  const p = await app.page();
  await lancerSeance(p, ['Dos']);
  const n = await noms(p);
  assert.deepEqual(await p.$$eval('#a-suivre li b', els => els.map(e => e.textContent)), [n[1], n[2]]);
  await p.click('#workout-screen button:has-text("Suivant")');
  assert.deepEqual(await p.$$eval('#a-suivre li b', els => els.map(e => e.textContent)), [n[2]]);
  await p.click('#workout-screen button:has-text("Suivant")');
  assert.equal(await p.locator('#a-suivre li').count(), 0);
  assert.match(await p.textContent('#a-suivre'), /Dernier exercice/);
});

test('séance : « Quitter » ferme la séance et la garde à reprendre', async () => {
  const p = await app.page();
  await lancerSeance(p, ['Jambes']);
  await p.click('#workout-screen button:has-text("Suivant")');
  await p.click('#workout-screen button[aria-label="Quitter la séance"]');
  assert.ok(await cache(p, '#workout-screen'));
  assert.ok(!(await cache(p, '#resume-card')));
  assert.equal((await lireCle(p, CLE_REPRISE)).index, 1);
  await p.click('#resume-card button:has-text("Reprendre")');
  assert.equal(await p.textContent('#step-counter-text'), 'Flux 2/3');
  assert.deepEqual(p.erreurs, []);
});

test('journal : bandeau Séances / Exercices / XP gagnés', async () => {
  const p = await app.page();
  const d = Date.now();
  await donner(p, { [CLE_UTILISATEUR]: { lvl: 2, xp: 10, streak: 3, logs: [
    { date: new Date(d - 20 * JOUR).toISOString(), mood: '😃', count: 6 },
    { date: new Date(d - 2 * JOUR).toISOString(), mood: '🔥', count: 3 },
    { date: new Date(d).toISOString(), mood: '💀', count: 5 },
  ] } });
  await p.click('#nav-log');
  const chiffres = await p.$$eval('#chiffres-journal > div', els => els.map(e => [e.querySelector('b').textContent, e.querySelector('span').textContent]));
  assert.deepEqual(chiffres, [['3', 'Séances'], ['14', 'Exercices'], ['210', 'XP gagnés']]);
});

test('cloison : si le journal plante, seul le journal affiche un message, et « Réessayer » le répare', async () => {
  const p = await app.page();
  await donner(p, { [CLE_UTILISATEUR]: { lvl: 1, xp: 0, streak: 1, logs: [{ date: new Date().toISOString(), mood: '🔥', count: 3 }] } });
  // Panne volontaire : l'affichage des dates casse
  await p.evaluate(() => { window.__dateOk = Date.prototype.toLocaleDateString; Date.prototype.toLocaleDateString = () => { throw new Error('panne volontaire'); }; });
  await p.click('#nav-log');
  assert.ok(await p.isVisible('#journal-panne'));
  assert.match(await p.innerText('#logbook-screen'), /Le journal n’a pas pu s’afficher/);
  assert.ok(await p.isVisible('#logbook-screen .encadre-sauvegarde'), 'la sauvegarde reste utilisable');
  assert.deepEqual(p.erreurs, [], 'la panne ne doit pas remonter en erreur non gérée');
  // Le reste de l'app marche toujours
  await p.click('#nav-home');
  await lancerSeance(p, ['Abdos']);
  assert.ok(!(await cache(p, '#workout-screen')));
  await p.click('#workout-screen button[aria-label="Quitter la séance"]');
  // Panne réparée : « Réessayer » réaffiche le journal
  await p.evaluate(() => { Date.prototype.toLocaleDateString = window.__dateOk; });
  await p.click('#nav-log');
  await p.evaluate(() => { Date.prototype.toLocaleDateString = () => { throw new Error('panne volontaire'); }; });
  await p.click('#nav-log');
  await p.evaluate(() => { Date.prototype.toLocaleDateString = window.__dateOk; });
  await p.click('#logbook-screen button:has-text("Réessayer")');
  assert.ok(!(await p.isVisible('#journal-panne')));
  assert.equal(await p.locator('#log-list .carte-seance').count(), 1);
});

test('journal : dates en français (« mercredi 18 novembre »), même si le téléphone est réglé en anglais', async () => {
  const p = await app.page({ locale: 'en-US' });
  await donner(p, { [CLE_UTILISATEUR]: { lvl: 1, xp: 0, streak: 1, logs: [{ date: new Date(2026, 10, 18, 10).toISOString(), mood: '🔥', count: 3 }] } });
  await p.click('#nav-log');
  assert.equal(await p.textContent('#log-list .carte-seance-date'), 'mercredi 18 novembre');
});

test('petit écran (iPhone SE) : barre de progression et bouton « Suivant » visibles sans faire défiler', async () => {
  const p = await app.page({ viewport: { width: 320, height: 568 } });
  await lancerSeance(p, ['Pectoraux', 'Bras']);
  const barre = await p.$eval('#seance-progression', el => el.getBoundingClientRect().height);
  assert.ok(barre >= 5, `barre écrasée (${barre}px)`);
  const bas = await p.$eval('#workout-screen button:has-text("Suivant")', el => el.getBoundingClientRect().bottom);
  assert.ok(bas <= 568, `bouton Suivant hors de l'écran (bas à ${bas}px)`);
});

test('petit écran (iPhone SE) : « Suivant » reste visible même pendant un repos, avec dessin et échauffement', async () => {
  const p = await app.page({ viewport: { width: 320, height: 568 } });
  await donner(p, { fluxe_reglages: { echauffement: true } });
  await lancerSeance(p, ['Abdos']);
  await p.click('#workout-screen button:has-text("Suivant")'); // repos affiché + exercice tenu (chrono)
  assert.ok(await p.isVisible('#repos'));
  const bas = await p.$eval('#workout-screen .bouton-suivant', el => el.getBoundingClientRect().bottom);
  assert.ok(bas <= 568, `bouton Suivant hors de l'écran (bas à ${bas}px)`);
  const chrono = await p.$eval('#chrono-bouton', el => el.getBoundingClientRect().bottom);
  const haut = await p.$eval('#workout-screen .bouton-suivant', el => el.getBoundingClientRect().top);
  assert.ok(chrono <= haut, `le bouton du chrono est caché sous Suivant (${chrono} > ${haut})`);
});
