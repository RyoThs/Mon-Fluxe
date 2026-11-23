/* Fluxe App - service worker (fonctionnement hors ligne)
   Stratégie : réseau d'abord (tu vois toujours la dernière version),
   et si le téléphone est hors ligne, on utilise la copie gardée en cache.

   ATTENTION : Fluxe App, Fluxe Suivi et ATLAS sont publiés sur le même domaine
   (ryoths.github.io). Dans le navigateur, ils partagent donc le même espace de caches.
   Règle de sécurité : Fluxe App ne lit et ne supprime QUE ses propres caches, reconnus
   par leur préfixe « fluxe-app- ». Il ne touche jamais aux caches des autres applications.
   (Les données de l'app sont dans le localStorage : ce fichier n'y touche jamais.) */

const VERSION = '1.9.0'; // version de l'app : la même dans index.html (app-version) et package.json
const PREFIXE = 'fluxe-app-';
const CACHE = PREFIXE + 'v' + VERSION; // ex. « fluxe-app-v1.0.0 » : nouveau cache à chaque version

// Fichiers gardés hors ligne dès la première visite (liste exacte, rien d'autre)
const FICHIERS = [
  './',
  'index.html',
  'css/app.css',
  'js/zoom.js',
  'js/outils.js',
  'js/stockage.js',
  'js/exercices.js',
  'js/motivation.js',
  'js/ecrans.js',
  'js/journal.js',
  'js/videos.js',
  'js/dessins.js',
  'js/echauffement.js',
  'js/chrono.js',
  'js/seance.js',
  'js/programme.js',
  'js/sauvegarde.js',
  'js/rappels.js',
  'js/actions.js',
  'js/main.js',
  'fonts/barlow-condensed-500.woff2',
  'fonts/barlow-condensed-600.woff2',
  'fonts/barlow-condensed-700.woff2',
  'fonts/barlow-condensed-800.woff2',
  'fonts/barlow-condensed-900-italic.woff2',
  'videos/pompes.webm', 'videos/pompes.mp4', 'videos/squat.webm', 'videos/squat.mp4',
  'videos/gainage.webm', 'videos/gainage.mp4', 'videos/fente.webm', 'videos/fente.mp4',
  'videos/saut.webm', 'videos/saut.mp4',
  'icon.png',
  'manifest.json'
];

// Un cache appartient à Fluxe App uniquement s'il porte son préfixe.
const estUnCacheFluxeApp = nom => nom.startsWith(PREFIXE);

self.addEventListener('install', e => {
  // Tout ou rien : si un seul fichier manque, l'installation échoue et l'ancienne version
  // (complète) reste en place. Ainsi le téléphone n'a jamais une copie hors ligne à trous.
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(FICHIERS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  // Nettoyage : uniquement les anciennes versions de Fluxe App (préfixe « fluxe-app- »,
  // par exemple l'ancien « fluxe-app-v1 »), jamais le cache de la version actuelle.
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => estUnCacheFluxeApp(n) && n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Délai maximum d'attente du réseau : au-delà, on sert la copie gardée (si elle existe).
const DELAI_RESEAU = 3000; // millisecondes

// Cherche une réponse uniquement dans le cache de Fluxe App.
const chercherDansMonCache = async requete => {
  if (!(await caches.has(CACHE))) return undefined;
  return (await caches.open(CACHE)).match(requete);
};

// Copie locale d'un fichier ; pour une page, à défaut, la copie de index.html.
const copieLocale = async requete =>
  (await chercherDansMonCache(requete)) ||
  (requete.mode === 'navigate' ? await chercherDansMonCache('index.html') : undefined);

// Même requête, mais en demandant toujours au serveur si le fichier a changé.
const sansVieilleCopie = req => { try { return new Request(req, { cache: 'no-cache' }); } catch (x) { return req; } };

/* Choisit la réponse :
   1. le réseau, s'il répond en moins de DELAI_RESEAU ;
   2. sinon (réseau lent ou coupé) la copie locale, si elle existe ;
   3. sinon on attend quand même le réseau (réseau lent sans copie) ;
   4. sinon erreur (hors ligne et jamais visité). */
async function repondre(requete, reseau) {
  const TROP_LONG = 'trop-long', ECHEC = 'echec';
  let minuteur;
  const delai = new Promise(ok => { minuteur = setTimeout(ok, DELAI_RESEAU, TROP_LONG); });
  const premier = await Promise.race([reseau.catch(() => ECHEC), delai]);
  clearTimeout(minuteur);
  if (premier !== TROP_LONG && premier !== ECHEC) return premier;
  const copie = await copieLocale(requete);
  if (copie) return copie;
  if (premier === TROP_LONG) { try { return await reseau; } catch (x) { /* réseau finalement en échec */ } }
  return Response.error();
}

/* Vidéo demandée par morceaux (en-tête Range, c'est ce que fait l'iPhone) : on découpe la copie complète
   gardée hors ligne et on répond « 206 contenu partiel ». Sans copie, on laisse faire le réseau. */
async function repondreMorceau(requete) {
  const copie = await chercherDansMonCache(new URL(requete.url).pathname.replace(/^.*?\/videos\//, 'videos/'));
  if (!copie) return fetch(requete);
  const octets = await copie.arrayBuffer();
  const [, debut, fin] = /bytes=(\d*)-(\d*)/.exec(requete.headers.get('Range')) || [];
  const d = debut ? Number(debut) : Math.max(0, octets.byteLength - Number(fin || 0));
  const f = fin && debut ? Math.min(Number(fin), octets.byteLength - 1) : octets.byteLength - 1;
  return new Response(octets.slice(d, f + 1), { status: 206, headers: {
    'Content-Type': copie.headers.get('Content-Type') || 'video/mp4',
    'Content-Range': `bytes ${d}-${f}/${octets.byteLength}`, 'Content-Length': String(f - d + 1), 'Accept-Ranges': 'bytes' } });
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Seuls les fichiers de l'app elle-même sont gérés (aucun site extérieur).
  if (url.origin !== location.origin) return;
  if (e.request.headers.has('Range')) { e.respondWith(repondreMorceau(e.request)); return; }

  const reseau = fetch(sansVieilleCopie(e.request));
  // La réponse du réseau met toujours le cache à jour, même si elle arrive après le délai.
  // Si l'écriture échoue (mémoire du téléphone pleine...), on l'ignore : l'app continue.
  e.waitUntil(
    reseau
      .then(rep => {
        if (!rep || !rep.ok) return undefined;
        const copie = rep.clone();
        return caches.open(CACHE).then(c => c.put(e.request, copie));
      })
      .catch(() => {})
  );
  e.respondWith(repondre(e.request, reseau));
});
