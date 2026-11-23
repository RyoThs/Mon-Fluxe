/* v1.9.0 : micro-vidéos réalistes (homme 3D, mouvements captés sur de vraies personnes) pour les exercices
   dont le mouvement correspond exactement ; les autres gardent leur silhouette animée. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { demarrer, donner, lire, listeFichiersSW, RACINE, CLE_REPRISE } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

const VIDEOS = { 'Pompes Classiques': 'pompes', 'Pompes Tempo': 'pompes', 'Pompes Coudes Serrés': 'pompes',
  'Squat Classique': 'squat', 'Squat Pause': 'squat', 'Squat 1 et Demi': 'squat',
  'Planche': 'gainage', 'Planche RKC': 'gainage', 'Fentes Avant': 'fente', 'Fentes Marchées': 'fente', 'Squat Jumps': 'saut' };
const reprise = n => ({ [CLE_REPRISE]: { workout: [{ n, r: 10, d: 'description', h: '• **Position** : a\n• **Mouvement** : b\n• **Attention** : c' }], index: 0, lvl: 'beginner' } });
const ouvrir = async (n, opts = {}) => { const p = await app.page(opts); await donner(p, reprise(n)); await p.click('#resume-card button:has-text("Reprendre")'); return p; };

test('chaque fichier vidéo existe (MP4 pour iPhone + WebM), est léger et gardé hors ligne', () => {
  const sw = listeFichiersSW();
  for (const nom of new Set(Object.values(VIDEOS))) {
    for (const ext of ['mp4', 'webm']) {
      const f = `videos/${nom}.${ext}`;
      assert.ok(fs.existsSync(path.join(RACINE, f)), `${f} manquant`);
      assert.ok(fs.statSync(path.join(RACINE, f)).size < 100 * 1024, `${f} trop lourd`);
      assert.ok(sw.includes(f), `${f} absent de la liste hors ligne`);
    }
  }
});

test('un exercice avec vidéo montre la vidéo (muette, en boucle, dans la page) au lieu de la silhouette', async () => {
  const p = await ouvrir('Pompes Classiques');
  const v = await p.$eval('#ex-dessin video', el => ({ muted: el.muted, loop: el.loop, inline: el.playsInline, auto: el.autoplay, sources: [...el.querySelectorAll('source')].map(s => s.getAttribute('src')) }));
  assert.deepEqual(v, { muted: true, loop: true, inline: true, auto: true, sources: ['videos/pompes.webm', 'videos/pompes.mp4'] });
  assert.equal(await p.locator('#ex-dessin svg').count(), 0);
  await p.waitForFunction(() => document.querySelector('#ex-dessin video').currentTime > 0, null, { timeout: 5000 });
  assert.deepEqual(p.erreurs, []);
});

test('la bonne vidéo pour chaque exercice concerné', async () => {
  const p = await app.page();
  const r = await p.evaluate(noms => noms.map(n => videoPour(n)), Object.keys(VIDEOS)); // eslint-disable-line no-undef
  assert.deepEqual(r, Object.values(VIDEOS));
  assert.equal(await p.evaluate(() => videoPour('Pompes Genoux')), null, 'pas de vidéo si le mouvement n’est pas exactement le même'); // eslint-disable-line no-undef
});

test('un exercice sans vidéo garde sa silhouette animée', async () => {
  const p = await ouvrir('Superman');
  assert.ok(await p.isVisible('#ex-dessin svg'));
  assert.equal(await p.locator('#ex-dessin video').count(), 0);
});

test('« réduire les animations » : la vidéo ne démarre pas toute seule', async () => {
  const p = await ouvrir('Squat Classique', { reducedMotion: 'reduce' });
  assert.equal(await p.$eval('#ex-dessin video', el => el.autoplay), false);
});

test('cloison : si la vidéo ne se charge pas, la silhouette animée la remplace', async () => {
  const p = await app.page();
  await p.route('**/videos/**', r => r.fulfill({ status: 404, body: '' }));
  await donner(p, reprise('Planche'));
  await p.click('#resume-card button:has-text("Reprendre")');
  await p.waitForSelector('#ex-dessin svg', { timeout: 5000 });
  assert.equal(await p.locator('#ex-dessin video').count(), 0);
});

test('crédits : personnage MakeHuman (CC0) et mouvements CMU cités', () => {
  const c = lire('videos/CREDITS.md');
  assert.match(c, /MakeHuman/);
  assert.match(c, /CC0/);
  assert.match(c, /mocap\.cs\.cmu\.edu/);
});

test('hors ligne, une vidéo demandée par morceaux (comme le fait l’iPhone) est bien servie (206)', { timeout: 30000 }, async () => {
  const p = await app.page({ serviceWorkers: 'allow' });
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload();
  await p.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 });
  await p.context().setOffline(true);
  const r = await p.evaluate(async () => {
    const rep = await fetch('videos/pompes.mp4', { headers: { Range: 'bytes=0-99' } });
    return { statut: rep.status, taille: (await rep.arrayBuffer()).byteLength, plage: rep.headers.get('Content-Range') };
  });
  assert.equal(r.statut, 206);
  assert.equal(r.taille, 100);
  assert.match(r.plage, /^bytes 0-99\/\d+$/);
  await p.context().setOffline(false);
});
