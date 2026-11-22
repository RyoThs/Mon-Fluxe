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
  // v1.2.0 : plus aucun code dans la page, donc le code « en ligne » est interdit (seuls les fichiers js/ de l'app tournent)
  assert.match(csp, /script-src 'self';/);
  assert.ok(!/script-src[^;]*unsafe-inline/.test(csp), "script-src ne doit plus autoriser 'unsafe-inline'");
  for (const regle of ["default-src 'self'", "style-src 'self' 'unsafe-inline'", "font-src 'self'", "img-src 'self'", "connect-src 'self'", "object-src 'none'"]) {
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

test('les polices Barlow Condensed (500 à 800, et italique 900 pour le mot FLUXE) viennent de fonts/', async () => {
  // v1.1.0 : comme Fluxe Suivi, texte courant en police du téléphone (plus d'Inter), chiffres et titres en Barlow Condensed
  const p = await app.page();
  const r = await p.evaluate(async () => {
    const formes = ['italic 900 20px "Barlow Condensed"', '500 20px "Barlow Condensed"', '600 20px "Barlow Condensed"', '700 20px "Barlow Condensed"', '800 20px "Barlow Condensed"'];
    await Promise.all(formes.map(f => document.fonts.load(f)));
    await document.fonts.ready;
    return {
      check: formes.map(f => document.fonts.check(f)),
      chargees: [...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family.replace(/"/g, '')} ${f.weight} ${f.style}`).sort(),
    };
  });
  assert.deepEqual(r.check, [true, true, true, true, true]);
  assert.deepEqual(r.chargees, ['Barlow Condensed 500 normal', 'Barlow Condensed 600 normal', 'Barlow Condensed 700 normal', 'Barlow Condensed 800 normal', 'Barlow Condensed 900 italic']);
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
  assert.match(lire('fonts/OFL-Barlow-Condensed.txt'), /SIL Open Font License/);
  assert.ok(!fs.existsSync(path.join(RACINE, 'fonts', 'OFL-Inter.txt')), 'Inter n’est plus utilisée');
});
