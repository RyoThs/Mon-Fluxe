/* Feuille de style : css/app.css (écrit à la main, plus de Tailwind en ligne).
   Depuis la v1.1.0 : style de Fluxe Suivi (fond gris-bleu clair, dégradé turquoise → indigo → violet,
   cartes à ombre portée), thème clair seulement (jamais de thème sombre). */
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
  assert.ok(!lire('css/app.css').includes('prefers-color-scheme'), 'thème clair fixe : pas de règle de thème sombre');
});

test('les écrans cachés le sont vraiment (classe « cache »)', async () => {
  const p = await app.page();
  for (const id of ['#resume-card', '#workout-screen', '#feedback-screen', '#info-modal', '#logbook-screen']) {
    assert.equal(await p.$eval(id, el => getComputedStyle(el).display), 'none', id);
  }
  assert.ok(await p.isVisible('#main-screen'));
});

test('thème clair fixe : même fond gris-bleu clair, que le téléphone soit en mode clair ou sombre', async () => {
  const clair = await app.page({ colorScheme: 'light' });
  const sombre = await app.page({ colorScheme: 'dark' });
  const fond = p => p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  assert.equal(await fond(clair), 'rgb(243, 245, 251)');
  assert.equal(await fond(sombre), 'rgb(243, 245, 251)');
});

test('identité Fluxe Suivi : titre en dégradé, cartes à ombre portée, barre du bas en pilule flottante', async () => {
  const p = await app.page();
  const logo = await p.$eval('.logo', el => { const s = getComputedStyle(el); return { image: s.backgroundImage, clip: s.webkitBackgroundClip || s.backgroundClip, couleur: s.color }; });
  assert.match(logo.image, /linear-gradient/);
  assert.equal(logo.clip, 'text');
  assert.equal(logo.couleur, 'rgba(0, 0, 0, 0)');
  const carte = await p.$eval('.carte', el => { const s = getComputedStyle(el); return { fond: s.backgroundColor, rayon: s.borderRadius, ombre: s.boxShadow }; });
  assert.equal(carte.fond, 'rgb(255, 255, 255)');
  assert.equal(carte.rayon, '24px');
  assert.notEqual(carte.ombre, 'none');
  const nav = await p.$eval('.barre-nav', el => { const s = getComputedStyle(el); return { position: s.position, rayon: s.borderRadius }; });
  assert.deepEqual(nav, { position: 'fixed', rayon: '999px' });
  assert.match(await p.$eval('#nav-home', el => getComputedStyle(el).backgroundImage), /linear-gradient/);
  assert.equal(await p.$eval('#nav-log', el => getComputedStyle(el).backgroundImage), 'none');
});

test('les boutons de choix changent bien d\'aspect quand on les touche', async () => {
  const p = await app.page();
  await p.addStyleTag({ content: '* { transition: none !important; }' }); // pas d'animation : on lit la couleur finale
  const degrade = sel => p.$eval(sel, el => getComputedStyle(el).backgroundImage);
  assert.equal(await degrade('#main-screen button:text-is("Dos")'), 'none');
  await p.click('#main-screen button:text-is("Dos")');
  assert.match(await degrade('#main-screen button:text-is("Dos")'), /linear-gradient/);
  await p.click('#express-toggle');
  assert.match(await degrade('#express-toggle'), /linear-gradient/);
  await p.click('#main-screen button:has-text("Avancé")');
  assert.match(await degrade('#main-screen button:has-text("Avancé")'), /linear-gradient/);
  assert.equal(await degrade('#main-screen button:has-text("Débutant")'), 'none');
});
