/* Outils partagés par tous les tests (et par outils/captures.js).
   - un petit serveur web qui sert l'application (comme GitHub Pages),
   - un navigateur Chromium à la taille d'un téléphone,
   - des raccourcis pour lire/écrire les données de l'app.

   Important : les tests n'utilisent jamais Internet. Toute demande vers un autre site
   (ancien Tailwind en ligne, polices Google...) reçoit une réponse vide. Ainsi :
   - un réseau coupé ne fait pas échouer les tests,
   - les tests de logique ne dépendent pas de l'apparence. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const RACINE = path.join(__dirname, '..');
/* Clés de stockage de l'app : ne doivent JAMAIS changer (sinon les utilisateurs perdent leurs données) */
const CLE_UTILISATEUR = 'fluxe_user_v1';
const CLE_REPRISE = 'fluxe_backup';
const JOUR = 864e5;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

function lire(f) { return fs.readFileSync(path.join(RACINE, f), 'utf8'); }

/* Liste FICHIERS de sw.js (les fichiers gardés hors ligne).
   Les commentaires sont retirés avant de lire les noms entre apostrophes. */
function listeFichiersSW(texte = lire('sw.js')) {
  const bloc = (texte.match(/const FICHIERS = \[([\s\S]*?)\];/) || [])[1];
  if (bloc === undefined) throw new Error('liste FICHIERS introuvable dans sw.js');
  const sansCommentaires = bloc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
  return (sansCommentaires.match(/'([^']+)'/g) || []).map(t => t.slice(1, -1));
}

/* Serveur web minimal : sert les fichiers d'un dossier (le projet par défaut) sur un port libre */
function serveur(racine = RACINE) {
  return new Promise(ok => {
    const s = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(racine, path.normalize(p));
      if (!f.startsWith(racine) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('introuvable'); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(res);
    });
    s.listen(0, '127.0.0.1', () => ok({ url: `http://127.0.0.1:${s.address().port}/`, fermer: () => s.close() }));
  });
}

/* Réponse vide adaptée au type de fichier demandé (script, feuille de style, police...) */
function reponseVide(route) {
  const type = route.request().resourceType();
  const contentType = type === 'script' ? 'text/javascript' : type === 'stylesheet' ? 'text/css' : 'text/plain';
  return route.fulfill({ status: 200, contentType, body: '' });
}

/* Démarre serveur + navigateur. Renvoie de quoi ouvrir des pages et tout fermer.
   options.racine : dossier à servir (le projet par défaut).
   options.remplacements : réponses à renvoyer à la place de certains sites (captures « avant »),
     sous la forme { 'https://debut-de-l-adresse': { contentType, body } }. */
async function demarrer(options = {}) {
  const srv = await serveur(options.racine);
  const nav = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
  return {
    url: srv.url,
    /* Ouvre une page neuve (stockage vide). Relevés automatiques :
       - p.erreurs : erreurs JavaScript (et blocages de sécurité affichés dans la console),
       - p.exterieurs : adresses d'autres sites que l'app a essayé de joindre,
       - window.__violationsCSP (dans la page) : blocages de la politique de sécurité (CSP).
       opts : options du navigateur (ex. { colorScheme: 'dark' }).
       chemin : fichier ouvert en premier (l'app par défaut). */
    async page(opts = {}, chemin = '') {
      const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block', ...opts });
      const exterieurs = [];
      await ctx.addInitScript(() => {
        window.__violationsCSP = [];
        document.addEventListener('securitypolicyviolation', e => window.__violationsCSP.push(`${e.violatedDirective} ${e.blockedURI}`));
      });
      await ctx.route(url => !url.href.startsWith(srv.url), route => {
        const url = route.request().url();
        if (!url.startsWith('data:')) exterieurs.push(url);
        const debut = Object.keys(options.remplacements || {}).find(d => url.startsWith(d));
        if (debut) return route.fulfill({ status: 200, ...options.remplacements[debut] });
        return reponseVide(route);
      });
      const p = await ctx.newPage();
      p.erreurs = [];
      p.exterieurs = exterieurs;
      p.on('pageerror', e => p.erreurs.push(e.message));
      p.on('console', m => { if (m.type() === 'error') p.erreurs.push(m.text()); });
      /* Réponses aux fenêtres alert/confirm : elles sont acceptées et leur texte gardé dans p.messages */
      p.messages = [];
      p.on('dialog', async d => { p.messages.push(d.message()); await d.accept(); });
      await p.goto(srv.url + chemin);
      return p;
    },
    async fermer() { await nav.close(); srv.fermer(); },
  };
}

/* Écrit des données dans le téléphone simulé (clé -> valeur), puis relance l'app */
async function donner(p, donnees) {
  await p.evaluate(d => { for (const [k, v] of Object.entries(d)) localStorage.setItem(k, JSON.stringify(v)); }, donnees);
  await p.reload();
}
/* Lit une donnée enregistrée par l'app (null si absente) */
const lireCle = (p, cle) => p.evaluate(k => JSON.parse(localStorage.getItem(k)), cle);
/* Liste des clés présentes dans le stockage */
const cles = p => p.evaluate(() => Object.keys(localStorage).sort());

/* Vrai si l'élément est caché par l'app. L'app cache ses écrans avec la classe « cache »
   (« hidden » dans l'ancienne version) : on regarde la classe ET l'affichage réel,
   pour que le test reste juste même si la feuille de style ne se charge pas. */
const cache = (p, selecteur) => p.$eval(selecteur, el => el.classList.contains('cache') || el.classList.contains('hidden') || getComputedStyle(el).display === 'none');

/* Coche des groupes musculaires puis lance une séance (« Activer le Fluxe ») */
async function lancerSeance(p, muscles = ['Pectoraux']) {
  for (const m of muscles) await p.click(`#main-screen button:text-is("${m}")`);
  await p.click('#main-screen button:has-text("Activer le Fluxe")');
}

/* Termine la séance en cours : « Suivant » jusqu'au bout, puis choix de l'humeur */
async function finirSeance(p, humeur = '🔥') {
  const total = await p.evaluate(() => currentWorkout.length); // eslint-disable-line no-undef
  const deja = await p.evaluate(() => currentStepIndex); // eslint-disable-line no-undef
  for (let i = deja; i < total; i++) await p.click('#workout-screen button:has-text("Suivant")');
  await p.click(`#feedback-screen button:has-text("${humeur}")`);
  return total;
}

module.exports = { demarrer, serveur, listeFichiersSW, donner, lireCle, cles, cache, lancerSeance, finirSeance, lire, CLE_UTILISATEUR, CLE_REPRISE, JOUR, RACINE };
