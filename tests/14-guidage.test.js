/* Mieux guider un débutant (v1.2.0) : secondes pour les exercices tenus, chrono (sans bip),
   repos entre les exercices, échauffement et étirements, dessins, bouton « Plus facile ». */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { demarrer, donner, CLE_REPRISE } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

// Les exercices qu'on TIENT (en secondes) et non qu'on répète
const TENUS = ['Chaise Murale', 'Planche', 'Superman Iso', 'Planche Latérale', 'L-Sit', 'Maintien Pike', 'Handstand Hold', '90 Degree Hold', 'Cercles Bras'];

// Une séance enregistrée (comme si l'app avait été fermée), pour choisir l'exercice affiché
const reprise = (exercices, index = 0) => ({ [CLE_REPRISE]: { workout: exercices, index, lvl: 'beginner' } });
const ex = (n, r, extra = {}) => ({ n, r, d: 'description', h: '• **Mouvement** : test', ...extra });

test('bibliothèque : exactement les exercices tenus sont marqués « en secondes »', async () => {
  const p = await app.page();
  const marques = await p.evaluate(() => { // eslint-disable-next-line no-undef
    const l = []; for (const g of Object.values(exerciseLibrary)) for (const n of Object.values(g)) for (const e of n) if (e.s) l.push(e.n);
    return [...new Set(l)].sort();
  });
  assert.deepEqual(marques, [...TENUS].sort());
});

test('séance : « Secondes » pour un exercice tenu, « Reps » sinon (une ancienne sauvegarde sans marque = Reps)', async () => {
  const p = await app.page();
  await donner(p, reprise([ex('Planche', 30, { s: 1 }), ex('Crunch', 20)]));
  await p.click('#resume-card button:has-text("Reprendre")');
  assert.equal(await p.textContent('.seance-unite'), 'Secondes');
  await p.click('#workout-screen button:has-text("Suivant")');
  assert.equal(await p.textContent('.seance-unite'), 'Reps');
  assert.deepEqual(p.erreurs, []);
});

test('« À suivre » affiche « 30 s » pour un exercice tenu', async () => {
  const p = await app.page();
  await donner(p, reprise([ex('Crunch', 20), ex('Planche', 30, { s: 1 })]));
  await p.click('#resume-card button:has-text("Reprendre")');
  assert.equal(await p.textContent('#a-suivre li span'), '30 s');
});

module.exports = { reprise, ex, TENUS };
