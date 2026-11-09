/* Polices hébergées dans l'app (plus de Google Fonts) et politique de sécurité (CSP) :
   l'app ne contacte aucun autre site. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { demarrer, lire, lancerSeance, finirSeance, RACINE } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

const violations = p => p.evaluate(() => window.__violationsCSP);

test('aucune adresse vers un autre site dans index.html et css/app.css', () => {
  for (const f of ['index.html', 'css/app.css']) {
    assert.doesNotMatch(lire(f), /https?:\/\//, f);
    assert.ok(!lire(f).includes('fonts.googleapis'), f);
  }
});

test('la politique de sécurité (CSP) est présente, en tête de page, avec les bonnes règles', () => {
  const html = lire('index.html');
  const csp = (html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)">/) || [])[1];
  assert.ok(csp, 'balise CSP absente');
  assert.ok(html.indexOf('Content-Security-Policy') < html.indexOf('<link'), 'la CSP doit précéder les feuilles de style');
  for (const regle of ["default-src 'self'", "script-src 'self' 'unsafe-inline'", "style-src 'self' 'unsafe-inline'", "font-src 'self'", "img-src 'self'", "connect-src 'self'", "object-src 'none'"]) {
    assert.ok(csp.includes(regle), regle);
  }
});

test('ouverture + séance complète + journal : aucune requête extérieure, aucun blocage CSP', async () => {
  const p = await app.page();
  await lancerSeance(p, ['Pectoraux']);
  await p.click('#workout-screen button:has-text("?")');
  await p.click('#info-modal button:has-text("OK")');
  await finirSeance(p);
  await p.click('#nav-log'); // le graphique utilise des styles en ligne (style="height:…")
  await p.click('#nav-home');
  assert.deepEqual(p.exterieurs, []);
  assert.deepEqual(await violations(p), []);
  assert.deepEqual(p.erreurs, []);
});

test('les polices Barlow Condensed (italique 900) et Inter viennent de fonts/', async () => {
  const p = await app.page();
  const r = await p.evaluate(async () => {
    const formes = ['italic 900 20px "Barlow Condensed"', '400 16px Inter', '800 16px Inter', '900 16px Inter'];
    await Promise.all(formes.map(f => document.fonts.load(f)));
    await document.fonts.ready;
    return {
      check: formes.map(f => document.fonts.check(f)),
      chargees: [...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family.replace(/"/g, '')} ${f.weight} ${f.style}`).sort(),
    };
  });
  assert.deepEqual(r.check, [true, true, true, true]);
  assert.deepEqual(r.chargees, ['Barlow Condensed 900 italic', 'Inter 400 normal', 'Inter 800 normal', 'Inter 900 normal']);
  assert.deepEqual(p.exterieurs, []);
  assert.deepEqual(p.erreurs, []);
});

test('chaque fichier de police utilisé existe, aucun fichier inutile, licences présentes', () => {
  const css = lire('css/app.css');
  const utilises = [...css.matchAll(/url\('\.\.\/fonts\/([^']+)'\)/g)].map(m => m[1]).sort();
  const presents = fs.readdirSync(path.join(RACINE, 'fonts')).filter(f => f.endsWith('.woff2')).sort();
  assert.deepEqual(utilises, presents);
  for (const f of presents) assert.ok(fs.statSync(path.join(RACINE, 'fonts', f)).size > 10000, f);
  assert.match(css, /font-display: swap/);
  for (const l of ['OFL-Inter.txt', 'OFL-Barlow-Condensed.txt']) assert.match(lire(`fonts/${l}`), /SIL Open Font License/);
});
