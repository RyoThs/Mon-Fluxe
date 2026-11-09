/* Captures d'écran « avant / après » pour vérifier que la nouvelle feuille de style
   (css/app.css, écrite à la main) donne le même rendu que l'ancien Tailwind en ligne.

   Utilisation :  node outils/captures.js <dossier-de-sortie>
   (le dossier de sortie doit être HORS du dépôt : les images ne sont pas versionnées)

   - « avant » = index.html de la version de référence (commit c0f045c), avec une copie
     locale de Tailwind 3.4 générée ici (le site cdn.tailwindcss.com n'est pas joignable
     et ne doit plus être utilisé) ;
   - « après » = index.html actuel du dossier, avec css/app.css.
   Pour chaque écran, en thème clair et sombre, le script compare les images pixel par pixel
   et écrit le pourcentage de pixels différents (et une image des différences en rouge). */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { demarrer, RACINE, CLE_UTILISATEUR, CLE_REPRISE, JOUR } = require('../tests/outils');

const REFERENCE = 'c0f045c'; // dernière version avec Tailwind en ligne
const SORTIE = process.argv[2];
if (!SORTIE) { console.error('Indique un dossier de sortie : node outils/captures.js <dossier>'); process.exit(1); }
if (path.resolve(SORTIE).startsWith(RACINE + path.sep)) { console.error('Le dossier de sortie doit être hors du dépôt.'); process.exit(1); }

/* Prépare le dossier « avant » : ancien index.html + icône + Tailwind de référence */
function preparerAvant() {
  const dossier = fs.mkdtempSync(path.join(os.tmpdir(), 'fluxe-avant-'));
  fs.writeFileSync(path.join(dossier, 'index.html'), execFileSync('git', ['show', `${REFERENCE}:index.html`], { cwd: RACINE }));
  fs.copyFileSync(path.join(RACINE, 'icon.png'), path.join(dossier, 'icon.png'));
  const config = path.join(dossier, 'tailwind.config.js');
  // Même réglages que le Tailwind en ligne : configuration par défaut, mode sombre = réglage du téléphone
  fs.writeFileSync(config, `module.exports = { content: [${JSON.stringify(path.join(dossier, 'index.html'))}], darkMode: 'media' };\n`);
  const css = path.join(dossier, 'reference.css');
  execFileSync(path.join(RACINE, 'node_modules', '.bin', 'tailwindcss'), ['-c', config, '-o', css], { cwd: dossier, stdio: 'ignore' });
  return { dossier, css: fs.readFileSync(css, 'utf8') };
}

/* Le Tailwind en ligne ajoutait sa feuille de style à la fin de <head>, une fois la page lue :
   on fait pareil avec la copie locale. */
const injecteur = css => `document.addEventListener('DOMContentLoaded', function () {
  var s = document.createElement('style'); s.textContent = ${JSON.stringify(css)}; document.head.appendChild(s);
});`;

/* Hasard figé : les mêmes exercices sortent à chaque capture */
function hasardFige() {
  let graine = 42;
  Math.random = () => { graine = (graine * 16807) % 2147483647; return (graine - 1) / 2147483646; };
}

const profil = () => ({
  lvl: 2, xp: 90, streak: 3,
  logs: [0, 1, 3].map((j, i) => ({ date: new Date(Date.now() - j * JOUR).toISOString(), mood: ['😃', '🔥', '💀'][i], count: 3 + i * 3 })),
});

/* Écrans à photographier : chacun prépare la page dans l'état voulu */
const ECRANS = {
  accueil: async p => {
    await p.click('#main-screen button:text-is("Pectoraux")');
    await p.click('#main-screen button:text-is("Jambes")');
    await p.click('#express-toggle');
  },
  seance: async p => {
    await p.click('#main-screen button:text-is("Dos")');
    await p.click('#main-screen button:has-text("Activer le Fluxe")');
  },
  fiche: async p => {
    await p.click('#main-screen button:text-is("Abdos")');
    await p.click('#main-screen button:has-text("Activer le Fluxe")');
    await p.click('#workout-screen button:has-text("?")');
  },
  fin: async p => {
    await p.click('#main-screen button:text-is("Bras")');
    await p.click('#main-screen button:has-text("Activer le Fluxe")');
    for (let i = 0; i < 3; i++) await p.click('#workout-screen button:has-text("Suivant")');
  },
  journal: async p => { await p.click('#nav-log'); },
};

async function photographier(app, nomVersion) {
  const fichiers = {};
  for (const theme of ['light', 'dark']) {
    for (const [ecran, preparer] of Object.entries(ECRANS)) {
      const p = await app.page({ colorScheme: theme });
      await p.addInitScript(hasardFige);
      await p.evaluate(([k1, v1, k2, v2]) => { localStorage.setItem(k1, v1); localStorage.setItem(k2, v2); },
        [CLE_UTILISATEUR, JSON.stringify(profil()), CLE_REPRISE, JSON.stringify({ workout: [{ n: 'Squat', r: 10, d: 'x', h: 'x' }], index: 0, lvl: 'intermediate' })]);
      await p.reload();
      await p.waitForLoadState('load');
      await preparer(p);
      await p.waitForTimeout(150);
      const f = path.join(SORTIE, `${ecran}-${theme === 'light' ? 'clair' : 'sombre'}-${nomVersion}.png`);
      await p.screenshot({ path: f, fullPage: true, animations: 'disabled' });
      if (p.erreurs.length) console.warn(`  erreurs JS (${nomVersion}, ${ecran}, ${theme}) :`, p.erreurs);
      fichiers[`${ecran}-${theme === 'light' ? 'clair' : 'sombre'}`] = f;
      await p.context().close();
    }
  }
  return fichiers;
}

/* Compare deux images dans le navigateur (canvas) : renvoie le % de pixels différents
   et écrit une image où les différences sont en rouge. */
async function comparer(app, a, b, sortieDiff) {
  const p = await app.page();
  const res = await p.evaluate(async ([da, db]) => {
    const charger = src => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.src = src; });
    const [ia, ib] = await Promise.all([charger(da), charger(db)]);
    const w = Math.max(ia.width, ib.width), h = Math.max(ia.height, ib.height);
    const lirePixels = img => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = '#ff00ff'; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0); return x.getImageData(0, 0, w, h).data; };
    const pa = lirePixels(ia), pb = lirePixels(ib);
    const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
    const out = x.createImageData(w, h);
    let diff = 0;
    for (let i = 0; i < pa.length; i += 4) {
      const ecart = Math.max(Math.abs(pa[i] - pb[i]), Math.abs(pa[i + 1] - pb[i + 1]), Math.abs(pa[i + 2] - pb[i + 2]));
      if (ecart > 16) { diff++; out.data.set([255, 0, 0, 255], i); }
      else { const g = (pa[i] + pa[i + 1] + pa[i + 2]) / 3; out.data.set([g, g, g, 60], i); }
    }
    x.putImageData(out, 0, 0);
    return { pourcent: (100 * diff) / (w * h), tailles: `${ia.width}x${ia.height} / ${ib.width}x${ib.height}`, image: c.toDataURL('image/png') };
  }, [a, b].map(f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64')));
  fs.writeFileSync(sortieDiff, Buffer.from(res.image.split(',')[1], 'base64'));
  await p.context().close();
  return res;
}

(async () => {
  fs.mkdirSync(SORTIE, { recursive: true });
  const avant = preparerAvant();
  const appAvant = await demarrer({ racine: avant.dossier, remplacerCdnTailwind: injecteur(avant.css) });
  const imagesAvant = await photographier(appAvant, 'avant');
  await appAvant.fermer();

  const appApres = await demarrer();
  const imagesApres = await photographier(appApres, 'apres');
  console.log('Écran            | pixels différents | tailles (avant / après)');
  for (const nom of Object.keys(imagesAvant)) {
    const r = await comparer(appApres, imagesAvant[nom], imagesApres[nom], path.join(SORTIE, `${nom}-differences.png`));
    console.log(`${nom.padEnd(16)} | ${r.pourcent.toFixed(3).padStart(8)} %        | ${r.tailles}`);
  }
  await appApres.fermer();
  fs.rmSync(avant.dossier, { recursive: true, force: true });
  console.log(`Images dans : ${path.resolve(SORTIE)}`);
})();
