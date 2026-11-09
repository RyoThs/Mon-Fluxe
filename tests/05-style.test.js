/* Feuille de style : l'app n'utilise plus Tailwind en ligne, mais css/app.css (écrit à la main). */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer, lire } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

test('aucune adresse cdn.tailwindcss.com dans index.html', () => {
  assert.ok(!lire('index.html').includes('cdn.tailwindcss.com'));
});

test('index.html charge css/app.css', () => {
  assert.match(lire('index.html'), /<link rel="stylesheet" href="css\/app\.css">/);
  assert.ok(lire('css/app.css').includes('prefers-color-scheme: dark'));
});

test('les écrans cachés le sont vraiment (classe « cache »)', async () => {
  const p = await app.page();
  for (const id of ['#resume-card', '#workout-screen', '#feedback-screen', '#info-modal', '#logbook-screen']) {
    assert.equal(await p.$eval(id, el => getComputedStyle(el).display), 'none', id);
  }
  assert.ok(await p.isVisible('#main-screen'));
});

test('thème clair et sombre : le fond suit le réglage du téléphone', async () => {
  const clair = await app.page({ colorScheme: 'light' });
  const sombre = await app.page({ colorScheme: 'dark' });
  const fond = p => p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  assert.equal(await fond(clair), 'rgb(250, 248, 242)');
  assert.equal(await fond(sombre), 'rgb(18, 20, 20)');
});

test('les boutons de choix changent bien d\'aspect quand on les touche', async () => {
  const p = await app.page();
  await p.addStyleTag({ content: '* { transition: none !important; }' }); // pas d'animation : on lit la couleur finale
  const fond = sel => p.$eval(sel, el => getComputedStyle(el).backgroundColor);
  await p.click('#main-screen button:text-is("Dos")');
  assert.equal(await fond('#main-screen button:text-is("Dos")'), 'rgb(45, 155, 124)');
  await p.click('#express-toggle');
  assert.equal(await fond('#express-toggle'), 'rgb(45, 155, 124)');
  await p.click('#main-screen button:has-text("Avancé")');
  assert.equal(await fond('#main-screen button:has-text("Avancé")'), 'rgb(45, 155, 124)');
  assert.equal(await p.$eval('#main-screen button:has-text("Débutant")', el => getComputedStyle(el).opacity), '0.5');
});
