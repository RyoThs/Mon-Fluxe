/* Fluxe App - service worker (fonctionnement hors ligne)
   Stratégie : réseau d'abord (tu vois toujours la dernière version),
   et si le téléphone est hors ligne, on utilise la copie gardée en cache.

   ATTENTION : Fluxe App, Fluxe Suivi et ATLAS sont publiés sur le même domaine
   (ryoths.github.io). Dans le navigateur, ils partagent donc le même espace de caches.
   Règle de sécurité : Fluxe App ne lit et ne supprime QUE ses propres caches, reconnus
   par leur préfixe « fluxe-app- ». Il ne touche jamais aux caches des autres applications.
   (Les données de l'app sont dans le localStorage : ce fichier n'y touche jamais.) */

const PREFIXE = 'fluxe-app-';
const VERSION = PREFIXE + 'v1'; // change ce numéro à chaque mise à jour de l'app

// Fichiers gardés hors ligne dès la première visite (liste exacte, rien d'autre)
const FICHIERS = [
  './',
  'index.html',
  'css/app.css',
  'fonts/inter-400.woff2',
  'fonts/inter-800.woff2',
  'fonts/inter-900.woff2',
  'fonts/barlow-condensed-900-italic.woff2',
  'icon.png',
  'manifest.json'
];

// Un cache appartient à Fluxe App uniquement s'il porte son préfixe.
const estUnCacheFluxeApp = nom => nom.startsWith(PREFIXE);

self.addEventListener('install', e => {
  // Tout ou rien : si un seul fichier manque, l'installation échoue et l'ancienne version
  // (complète) reste en place. Ainsi le téléphone n'a jamais une copie hors ligne à trous.
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(FICHIERS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  // Nettoyage : uniquement les anciennes versions de Fluxe App (préfixe « fluxe-app- »).
  e.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => estUnCacheFluxeApp(n) && n !== VERSION).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Cherche une réponse uniquement dans le cache de Fluxe App.
const chercherDansMonCache = async requete => {
  if (!(await caches.has(VERSION))) return undefined;
  return (await caches.open(VERSION)).match(requete);
};

// Même requête, mais en demandant toujours au serveur si le fichier a changé.
const sansVieilleCopie = req => { try { return new Request(req, { cache: 'no-cache' }); } catch (x) { return req; } };

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Seuls les fichiers de l'app elle-même sont gérés (aucun site extérieur).
  if (url.origin !== location.origin) return;

  e.respondWith(
    fetch(sansVieilleCopie(e.request))
      .then(rep => {
        if (rep && rep.ok) {
          const copie = rep.clone();
          caches.open(VERSION).then(c => c.put(e.request, copie));
        }
        return rep;
      })
      .catch(async () =>
        (await chercherDansMonCache(e.request)) ||
        (e.request.mode === 'navigate' ? await chercherDansMonCache('index.html') : undefined) ||
        Response.error()
      )
  );
});
