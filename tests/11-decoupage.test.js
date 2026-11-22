/* Code rangé en petits fichiers (js/), comme Fluxe Suivi :
   - index.html ne contient plus de code JavaScript, seulement la structure des écrans ;
   - chaque fichier de js/ est chargé par index.html ET gardé hors ligne (sw.js) ;
   - les boutons n'ont plus de onclick="…" : ils portent un data-act, aiguillé par js/actions.js. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { demarrer, lire, listeFichiersSW, RACINE } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

const fichiersJs = () => fs.readdirSync(path.join(RACINE, 'js')).filter(f => f.endsWith('.js')).sort();
const scriptsCharges = () => [...lire('index.html').matchAll(/<script src="(js\/[^"?]+)(?:\?[^"]*)?"><\/script>/g)].map(m => m[1]);

test('index.html commence par <!DOCTYPE html> (sinon le navigateur passe en mode « bizarre »)', async () => {
  assert.match(lire('index.html'), /^<!DOCTYPE html>/i);
  const p = await app.page();
  assert.equal(await p.evaluate(() => document.compatMode), 'CSS1Compat');
});

test('index.html ne contient aucun code JavaScript en ligne', () => {
  const html = lire('index.html');
  assert.doesNotMatch(html, /<script>[\s\S]*?<\/script>/, 'bloc <script> en ligne');
  assert.doesNotMatch(html, /\son[a-z]+="/, 'attribut onclick/onchange… en ligne');
});

test('chaque fichier de js/ est chargé par index.html et gardé hors ligne', () => {
  const js = fichiersJs();
  assert.ok(js.length >= 5, 'le code doit être découpé en plusieurs fichiers');
  const charges = scriptsCharges();
  const sw = listeFichiersSW();
  for (const f of js) {
    assert.ok(charges.includes(`js/${f}`), `js/${f} n'est pas chargé par index.html`);
    assert.ok(sw.includes(`js/${f}`), `js/${f} absent de la liste hors ligne de sw.js`);
  }
  assert.equal(charges[charges.length - 1], 'js/main.js', 'main.js (le démarrage) doit être chargé en dernier');
});

test('chaque bouton à data-act a son geste dans js/actions.js', async () => {
  const p = await app.page();
  const acts = await p.$$eval('[data-act]', els => [...new Set(els.map(e => e.dataset.act))]);
  assert.ok(acts.length >= 8);
  const actions = lire('js/actions.js');
  for (const a of acts) assert.match(actions, new RegExp(`['"]?${a}['"]?\\s*:`), `geste « ${a} » absent de js/actions.js`);
  assert.deepEqual(p.erreurs, []);
});

test('aucun fichier de js/ ne dépasse 250 lignes (un sujet = un fichier)', () => {
  for (const f of fichiersJs()) {
    const n = lire(`js/${f}`).split('\n').length;
    assert.ok(n <= 250, `js/${f} fait ${n} lignes`);
  }
});
