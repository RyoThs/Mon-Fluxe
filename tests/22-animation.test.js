/* v1.8.0 : silhouettes animées (le mouvement se voit en boucle : départ → arrivée → départ)
   et positions plus précises dans les guides. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer, donner, CLE_REPRISE } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

const reprise = n => ({ [CLE_REPRISE]: { workout: [{ n, r: 10, d: 'description', h: '• **Position** : a\n• **Mouvement** : b\n• **Attention** : c' }], index: 0, lvl: 'beginner' } });

test('chaque famille de dessin a une position de départ et une d’arrivée de même forme', async () => {
  const p = await app.page();
  const defauts = await p.evaluate(() => Object.entries(DESSINS).filter(([, d]) => // eslint-disable-line no-undef
    !d.debut || !d.fin || d.debut.traits.length !== d.fin.traits.length || d.debut.traits.some((t, i) => t.length !== d.fin.traits[i].length)).map(([f]) => f));
  assert.deepEqual(defauts, []);
});

test('pendant la séance, la silhouette bouge en boucle (corps et tête animés)', async () => {
  const p = await app.page();
  await donner(p, reprise('Pompes Genoux')); // exercice sans vidéo (v1.9.0)
  await p.click('#resume-card button:has-text("Reprendre")');
  const anim = await p.$$eval('#ex-dessin animate', els => els.map(a => [a.parentElement.tagName, a.getAttribute('attributeName'), a.getAttribute('repeatCount')]));
  assert.deepEqual(anim, [['path', 'd', 'indefinite'], ['circle', 'cx', 'indefinite'], ['circle', 'cy', 'indefinite']]);
  // le corps change vraiment de forme entre le départ et l'arrivée
  const valeurs = await p.getAttribute('#ex-dessin path.dessin-corps animate', 'values');
  const [a, b] = valeurs.split(';');
  assert.notEqual(a, b);
  assert.deepEqual(p.erreurs, []);
});

test('réglage « réduire les animations » du téléphone : la silhouette reste immobile', async () => {
  const p = await app.page({ reducedMotion: 'reduce' });
  await donner(p, reprise('Superman')); // exercice sans vidéo (v1.9.0)
  await p.click('#resume-card button:has-text("Reprendre")');
  assert.ok(await p.isVisible('#ex-dessin svg'));
  assert.equal(await p.locator('#ex-dessin animate').count(), 0);
});

test('position précise : pompes au mur à 1 mètre du mur, mains plus larges que les épaules', async () => {
  const p = await app.page();
  const h = await p.evaluate(() => exerciseLibrary['Pectoraux'].beginner.find(e => e.n === 'Pompes au Mur').h); // eslint-disable-line no-undef
  const position = h.split('\n')[0];
  assert.match(position, /1 m/);
  assert.match(position, /plus larges que les épaules/);
});
