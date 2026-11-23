/* v1.6.0 : pas de zoom sur les pages (comme Fluxe Suivi).
   Sur iPhone, Safari ignore « user-scalable=no » : il faut aussi annuler les gestes de pincement en JavaScript. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

test('balise viewport : zoom interdit', async () => {
  const p = await app.page();
  const vp = await p.getAttribute('meta[name=viewport]', 'content');
  assert.match(vp, /maximum-scale=1(\.0)?(,|$)/);
  assert.match(vp, /user-scalable=no/);
});

test('double toucher : pas de zoom (touch-action: manipulation)', async () => {
  const p = await app.page();
  assert.equal(await p.evaluate(() => getComputedStyle(document.documentElement).touchAction), 'manipulation');
});

test('pincement : annulé sur iPhone (gesturestart) et à deux doigts ailleurs ; le défilement à un doigt reste libre', async () => {
  const p = await app.page();
  const r = await p.evaluate(() => {
    const annule = e => { document.dispatchEvent(e); return e.defaultPrevented; };
    const doigts = n => { const e = new Event('touchmove', { cancelable: true, bubbles: true }); Object.defineProperty(e, 'touches', { value: { length: n } }); return e; };
    return {
      iphone: ['gesturestart', 'gesturechange', 'gestureend'].map(t => annule(new Event(t, { cancelable: true }))),
      deuxDoigts: annule(doigts(2)),
      unDoigt: annule(doigts(1)),
    };
  });
  assert.deepEqual(r, { iphone: [true, true, true], deuxDoigts: true, unDoigt: false });
  assert.deepEqual(p.erreurs, []);
});

test('aucun champ de saisie visible sous 16 px (sinon l’iPhone zoome tout seul en tapant)', async () => {
  const p = await app.page();
  await p.click('#nav-log');
  const petits = await p.$$eval('input', l => l.filter(i => i.type !== 'file' && i.offsetParent && parseFloat(getComputedStyle(i).fontSize) < 16).map(i => i.id));
  assert.deepEqual(petits, []);
});
