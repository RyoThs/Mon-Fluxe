/* Guides des exercices (bouton « ? ») plus directs (v1.7.0) :
   3 lignes toujours dans le même ordre (Position, Mouvement, Attention), tutoiement, phrases courtes. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

const tousLesMouvements = p => p.evaluate(() => [ // eslint-disable-next-line no-undef
  ...Object.values(exerciseLibrary).flatMap(g => Object.values(g).flat()), ...ECHAUFFEMENTS, ...ETIREMENTS]);

test('chaque guide a 3 lignes : Position, Mouvement, Attention (dans cet ordre)', async () => {
  for (const e of await tousLesMouvements(await app.page())) {
    const titres = e.h.split('\n').map(l => (l.match(/^• \*\*([^*]+)\*\* : \S/) || [])[1]);
    assert.deepEqual(titres, ['Position', 'Mouvement', 'Attention'], `${e.n} : ${e.h.slice(0, 80)}`);
  }
});

test('tutoiement : jamais « vous », « votre », « vos »', async () => {
  for (const e of await tousLesMouvements(await app.page())) assert.doesNotMatch(e.h, /\b(vous|votre|vos)\b/i, e.n);
});

test('phrases courtes : chaque ligne fait 80 caractères au plus (sans le titre)', async () => {
  for (const e of await tousLesMouvements(await app.page())) {
    for (const l of e.h.split('\n')) {
      const texte = l.replace(/^• \*\*[^*]+\*\* : /, '');
      assert.ok(texte.length <= 80, `${e.n} : « ${texte} » (${texte.length} caractères)`);
    }
  }
});
