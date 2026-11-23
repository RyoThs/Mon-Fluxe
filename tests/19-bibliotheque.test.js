/* Bibliothèque des exercices (v1.5.0) : au moins 8 exercices par groupe et par niveau,
   et les 54 nouveaux se font chez soi SANS AUCUN MATÉRIEL. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

const NOUVEAUX = [
  'Pompes Négatives Genoux', 'Pompes Mur Larges', 'Planche Haute', 'Pompes Tempo', 'Pompes Hindoues', 'Pompes Larges Pause', 'Pompes Superman', 'Pompes Typewriter', 'Pompes Doigts',
  'Superman Alterné', 'Y-T-W au Sol', 'Chat-Vache', 'Superman Tirage', 'Planche Inversée', 'Bird Dog Coude-Genou', 'Arch Hold Bras Tendus', 'Planche Inversée 1 Jambe', 'Good Morning 1 Jambe',
  'Fentes Avant', 'Pont Fessier Tenu', 'Kickback Fessier', 'Squat Pause', 'Fentes Marchées', 'Squat 1 et Demi', 'Skater Squat', 'Squat Sauté 180°', 'Sissy Squat',
  'Relevés de Bassin', 'Planche Genoux', 'Crunch Croisé', 'Bicycle Crunch', 'Ciseaux', 'Hollow Hold', 'Planche RKC', 'V-Sit Tenu', 'Mountain Climber Rapide',
  'Pike Genoux', 'Élévations en Y', 'Ours Tenu', 'Pike Tempo', 'Bear Crawl', 'Planche Chien Tête en Bas', 'Taps Épaules en Équilibre', 'HSPU Négatives', 'Planche Lean Tenu',
  'Pompes Diamant Genoux', 'Curl Main Contre Main', 'Triceps Mur Serré', 'Pompes Coudes Serrés', 'Planche Haute-Basse', 'Curl Sous la Cuisse', 'Pompes Diamant Explosives', 'Pompes Tigre', 'Dips au Sol 1 Jambe',
];
const lireBibliotheque = p => p.evaluate(() => exerciseLibrary); // eslint-disable-line no-undef

test('au moins 8 exercices par groupe et par niveau (144 au total)', async () => {
  const b = await lireBibliotheque(await app.page());
  let total = 0;
  for (const [groupe, niveaux] of Object.entries(b)) {
    for (const niveau of ['beginner', 'intermediate', 'advanced']) {
      assert.ok(niveaux[niveau].length >= 8, `${groupe} ${niveau} : ${niveaux[niveau].length} exercices`);
      total += niveaux[niveau].length;
    }
  }
  assert.equal(total, 144);
});

test('pas de doublon dans un même groupe, et chaque exercice est complet (nom, répétitions, description, guide)', async () => {
  const b = await lireBibliotheque(await app.page());
  for (const [groupe, niveaux] of Object.entries(b)) {
    const noms = Object.values(niveaux).flat().map(e => e.n);
    assert.equal(new Set(noms).size, noms.length, `doublon dans ${groupe}`);
    for (const e of Object.values(niveaux).flat()) {
      assert.ok(e.n && e.d && Number.isInteger(e.r) && e.r > 0, `${groupe} : ${JSON.stringify(e).slice(0, 60)}`);
      assert.match(e.h, /\*\*[^*]+\*\* :/, `${e.n} : guide sans titre en gras`);
      assert.ok(e.s === undefined || e.s === 1, `${e.n} : marque « secondes » invalide`);
    }
  }
});

test('les 54 nouveaux exercices sont là et ne demandent aucun matériel', async () => {
  const b = await lireBibliotheque(await app.page());
  const tous = Object.values(b).flatMap(n => Object.values(n).flat());
  const MATERIEL = /chaise|table|serviette|bouteille|banc|canapé|porte|livre|meuble|support|haltère|élastique|barre/i;
  for (const nom of NOUVEAUX) {
    const e = tous.find(x => x.n === nom);
    assert.ok(e, `${nom} absent de la bibliothèque`);
    assert.doesNotMatch(`${e.d} ${e.h}`, MATERIEL, `${nom} demande du matériel`);
  }
  assert.equal(new Set(NOUVEAUX).size, 54);
});
