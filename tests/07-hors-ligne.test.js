/* Hors ligne : service worker (sw.js) et manifeste (manifest.json). */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { demarrer, lire, listeFichiersSW, lireCle, lancerSeance, finirSeance, RACINE, CLE_UTILISATEUR } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

const FICHIERS = listeFichiersSW();

test('la liste hors ligne est exactement celle prévue', () => {
  assert.deepEqual(FICHIERS, ['./', 'index.html', 'css/app.css', 'fonts/inter-400.woff2', 'fonts/inter-800.woff2',
    'fonts/inter-900.woff2', 'fonts/barlow-condensed-900-italic.woff2', 'icon.png', 'manifest.json']);
});

test('chaque fichier de la liste existe', () => {
  for (const f of FICHIERS.filter(f => f !== './')) assert.ok(fs.existsSync(path.join(RACINE, f)), `${f} introuvable`);
});

test('toutes les polices de fonts/ sont gardées hors ligne', () => {
  for (const f of fs.readdirSync(path.join(RACINE, 'fonts')).filter(f => f.endsWith('.woff2'))) assert.ok(FICHIERS.includes(`fonts/${f}`), f);
});

/* Lance sw.js dans un faux navigateur. « manquant » = un fichier que le serveur ne trouve pas.
   « cachesExistants » = noms de caches déjà présents sur le téléphone. */
function chargerSW({ manquant = null, cachesExistants = [] } = {}) {
  const ecouteurs = {}, gardes = new Set(), noms = new Set(cachesExistants);
  const etat = { skip: false, claim: false };
  const cache = {
    addAll: async liste => { for (const f of liste) if (f === manquant) throw new TypeError('404 ' + f); for (const f of liste) gardes.add(f); },
    put: async () => {}, match: async () => undefined,
  };
  const self = { addEventListener: (type, fn) => { ecouteurs[type] = fn; }, skipWaiting: () => { etat.skip = true; }, clients: { claim: async () => { etat.claim = true; } } };
  const caches = {
    open: async n => { noms.add(n); return cache; },
    has: async n => noms.has(n),
    keys: async () => [...noms],
    delete: async n => noms.delete(n),
  };
  vm.runInNewContext(lire('sw.js'), { self, caches, location: { origin: 'http://127.0.0.1' }, URL, Request, Response, fetch: async () => { throw new Error('hors ligne'); } });
  const lancer = async type => { let attendu; ecouteurs[type]({ waitUntil: p => { attendu = p; } }); return attendu.then(() => true, () => false); };
  return { lancer, gardes, noms, etat };
}

test('installation : si un fichier manque, elle échoue (tout ou rien)', async () => {
  const sw = chargerSW({ manquant: 'fonts/barlow-condensed-900-italic.woff2' });
  assert.equal(await sw.lancer('install'), false, 'l’installation aurait dû échouer');
  assert.equal(sw.etat.skip, false, 'une version incomplète ne doit jamais remplacer l’ancienne');
});

test('installation : quand tout est là, chaque fichier est gardé', async () => {
  const sw = chargerSW();
  assert.equal(await sw.lancer('install'), true);
  assert.equal(sw.etat.skip, true);
  assert.deepEqual([...sw.gardes].sort(), [...FICHIERS].sort());
});

test('sw.js installe la liste d’un seul bloc (cache.addAll), sans « .catch » qui cache les erreurs', () => {
  const install = lire('sw.js').match(/addEventListener\('install',[\s\S]*?\n\}\);/)[0];
  assert.match(install, /\.addAll\(FICHIERS\)/);
  assert.doesNotMatch(install, /\.catch\(/);
  assert.match(lire('sw.js'), /const CACHE = PREFIXE \+ 'v' \+ VERSION;/);
  assert.match(lire('sw.js'), /const PREFIXE = 'fluxe-app-'/);
});

test('activation : seuls les anciens caches « fluxe-app-… » sont supprimés (dont l’ancien fluxe-app-v1)', async () => {
  const sw = chargerSW({ cachesExistants: ['fluxe-suivi-v19', 'muscu-v1', 'fluxe-v10', 'atlas', 'fluxe-app-v0', 'fluxe-app-v1', 'fluxe-app-v1.0.0'] });
  assert.equal(await sw.lancer('activate'), true);
  assert.deepEqual([...sw.noms].sort(), ['atlas', 'fluxe-app-v1.0.0', 'fluxe-suivi-v19', 'fluxe-v10', 'muscu-v1']);
  assert.equal(sw.etat.claim, true);
});

test('manifest.json : nom, adresses, affichage, couleurs et icône à sa vraie taille', () => {
  const m = JSON.parse(lire('manifest.json'));
  assert.equal(m.name, 'Fluxe');
  assert.ok(m.short_name);
  assert.equal(m.start_url, './');
  assert.equal(m.scope, './');
  assert.equal(m.display, 'standalone');
  assert.equal(m.theme_color, '#2D9B7C');
  assert.match(lire('index.html'), /<meta name="theme-color" content="#2D9B7C">/);
  assert.equal(m.background_color, '#FAF8F2');
  assert.equal(m.icons.length, 1);
  const png = fs.readFileSync(path.join(RACINE, m.icons[0].src));
  const taille = `${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`; // largeur x hauteur lues dans l'en-tête PNG
  assert.equal(m.icons[0].sizes, taille);
  assert.equal(m.icons[0].type, 'image/png');
  assert.match(lire('index.html'), /<link rel="manifest" href="manifest.json">/);
});

/* Dans la page : attend que le service worker soit actif et pilote la page (15 s au plus,
   sinon erreur claire au lieu d'un test bloqué, par exemple si l'installation a échoué). */
async function avecAttenteSW(p) {
  await p.evaluate(() => {
    window.__swPret = () => Promise.race([
      (async () => {
        await navigator.serviceWorker.ready;
        if (!navigator.serviceWorker.controller) await new Promise(ok => navigator.serviceWorker.addEventListener('controllerchange', ok, { once: true }));
      })(),
      new Promise((ok, ko) => setTimeout(() => ko(new Error('service worker pas actif après 15 s')), 15000)),
    ]);
  });
  return p;
}

test('vrai navigateur : le service worker s’installe, garde tous les fichiers et laisse les caches des autres apps', { timeout: 30000 }, async () => {
  // On ouvre d'abord un simple fichier (l'icône) : l'app n'est pas encore lancée, aucun service worker
  const p = await app.page({ serviceWorkers: 'allow' }, 'icon.png');
  // Faux caches d'autres applications (Fluxe Suivi) et ancienne version de Fluxe App, créés AVANT
  await p.evaluate(async () => {
    for (const n of ['fluxe-suivi-v19', 'muscu-v1', 'fluxe-app-v0', 'fluxe-app-v1']) await (await caches.open(n)).put('/temoin', new Response('x'));
  });
  await p.goto(app.url); // l'app enregistre son service worker
  await avecAttenteSW(p);
  const r = await p.evaluate(async () => {
    await window.__swPret();
    const reg = await navigator.serviceWorker.getRegistration();
    const noms = (await caches.keys()).sort();
    const gardes = (await (await caches.open('fluxe-app-v1.0.0')).keys()).map(q => new URL(q.url).pathname);
    const suivi = await (await (await caches.open('fluxe-suivi-v19')).match('/temoin')).text();
    return { scope: new URL(reg.scope).pathname, noms, gardes, suivi };
  });
  assert.equal(r.scope, '/');
  assert.deepEqual(r.noms, ['fluxe-app-v1.0.0', 'fluxe-suivi-v19', 'muscu-v1']); // l'ancien « fluxe-app-v1 » est supprimé
  assert.equal(r.suivi, 'x');
  for (const f of FICHIERS) assert.ok(r.gardes.includes('/' + f.replace('./', '')), `${f} absent du cache`);
  assert.deepEqual(p.erreurs, []);
});

test('mode avion : après une 1re visite, l’app s’ouvre avec style et police, et une séance complète est enregistrée', { timeout: 30000 }, async () => {
  const p = await avecAttenteSW(await app.page({ serviceWorkers: 'allow' }));
  await p.evaluate(() => window.__swPret());

  await p.context().setOffline(true);
  p.erreurs.length = 0;
  await p.reload();
  await p.waitForSelector('#main-screen');

  // Le style est là (fond crème, écrans cachés) et la police Barlow Condensed aussi
  assert.equal(await p.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(250, 248, 242)');
  assert.equal(await p.$eval('#workout-screen', el => getComputedStyle(el).display), 'none');
  const police = await p.evaluate(async () => {
    await document.fonts.load('italic 900 20px "Barlow Condensed"');
    await document.fonts.load('900 16px Inter');
    const face = [...document.fonts].find(f => f.family.replace(/"/g, '') === 'Barlow Condensed');
    return { barlow: document.fonts.check('italic 900 20px "Barlow Condensed"'), inter: document.fonts.check('900 16px Inter'), statut: face && face.status };
  });
  assert.deepEqual(police, { barlow: true, inter: true, statut: 'loaded' });

  // Séance complète hors ligne : l'XP est enregistrée
  await lancerSeance(p, ['Jambes']);
  const n = await finirSeance(p);
  const u = await lireCle(p, CLE_UTILISATEUR);
  assert.equal(u.xp, 15 * n);
  assert.equal(u.logs.length, 1);
  assert.deepEqual(p.erreurs, []);
  assert.deepEqual(await p.evaluate(() => window.__violationsCSP), []);
  await p.context().setOffline(false);
});

test('réseau lent : après 3 s, la copie gardée est servie, puis la réponse tardive met le cache à jour', { timeout: 40000 }, async () => {
  const p = await avecAttenteSW(await app.page({ serviceWorkers: 'allow' }));
  await p.evaluate(() => window.__swPret());

  // Le serveur met 6 s à répondre pour la page d'accueil, et sa réponse contient un marqueur
  const MARQUEUR = '<!-- reponse-tardive-du-reseau -->';
  await p.context().route(app.url, async route => {
    await new Promise(ok => setTimeout(ok, 6000));
    await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: lire('index.html') + MARQUEUR });
  });

  const debut = Date.now();
  await p.reload({ waitUntil: 'domcontentloaded' });
  const duree = Date.now() - debut;
  assert.ok(duree >= 2500 && duree < 5500, `la copie aurait dû arriver vers 3 s (reçue en ${duree} ms)`);
  assert.ok(!(await p.content()).includes('reponse-tardive-du-reseau'), 'la page affichée doit être la copie gardée');
  await p.waitForSelector('#main-screen');

  // Quand le réseau finit par répondre, la copie gardée est remplacée par la nouvelle version
  const misAJour = await p.evaluate(async marqueur => {
    for (let i = 0; i < 100; i++) {
      const rep = await (await caches.open('fluxe-app-v1.0.0')).match('./');
      if (rep && (await rep.text()).includes(marqueur)) return true;
      await new Promise(ok => setTimeout(ok, 100));
    }
    return false;
  }, MARQUEUR);
  assert.equal(misAJour, true, 'la réponse tardive aurait dû mettre le cache à jour');
  assert.deepEqual(p.erreurs, []);
});

test('sw.js : écriture en cache protégée (waitUntil + erreurs ignorées) et délai réseau de 3 s', () => {
  const sw = lire('sw.js');
  assert.match(sw, /const DELAI_RESEAU = 3000;/);
  const fetchBloc = sw.match(/addEventListener\('fetch',[\s\S]*?\n\}\);/)[0];
  assert.match(fetchBloc, /e\.waitUntil\(/);
  assert.match(fetchBloc, /\.catch\(\(\) => \{\}\)/);
});
