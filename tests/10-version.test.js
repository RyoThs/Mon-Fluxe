/* Version 1.0.0 : identique aux 3 endroits, et affichée dans la fenêtre d'aide. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer, lire, lancerSeance } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

const versionHtml = () => (lire('index.html').match(/<meta name="app-version" content="([^"]+)">/) || [])[1];
const versionSw = () => (lire('sw.js').match(/const VERSION = '([^']+)';/) || [])[1];
const versionPackage = () => JSON.parse(lire('package.json')).version;

test('la version est 1.0.0 dans index.html, sw.js et package.json', () => {
  assert.equal(versionHtml(), '1.0.0');
  assert.equal(versionSw(), '1.0.0');
  assert.equal(versionPackage(), '1.0.0');
});

test('le nom du cache hors ligne découle de la version (fluxe-app-v1.0.0)', () => {
  const sw = lire('sw.js');
  assert.match(sw, /const PREFIXE = 'fluxe-app-';/);
  assert.match(sw, /const CACHE = PREFIXE \+ 'v' \+ VERSION;/);
});

test('la fenêtre d’aide affiche « Fluxe v1.0.0 »', async () => {
  const p = await app.page();
  await lancerSeance(p);
  await p.click('#workout-screen button:has-text("?")');
  assert.ok(await p.isVisible('#version-app'));
  assert.equal(await p.textContent('#version-app'), `Fluxe v${versionHtml()}`);
  assert.equal(await p.textContent('#version-app'), 'Fluxe v1.0.0');
  assert.deepEqual(p.erreurs, []);
});
