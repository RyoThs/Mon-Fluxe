/* Export / import de la progression (fichier JSON), depuis l'encadré « Ma progression » du journal. */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { demarrer, donner, lireBrut, lireCle, attendre, CLE_UTILISATEUR } = require('./outils');

let app;
before(async () => { app = await demarrer(); });
after(async () => { await app.fermer(); });

const AVANT_IMPORT = 'fluxe_user_v1_avant_import';
const P = { lvl: 2, xp: 30, streak: 5, logs: [{ date: '2026-11-01T10:00:00.000Z', mood: '🔥', count: 3 }, { date: '2026-11-02T10:00:00.000Z', mood: '😃', count: 6 }] };
const Q = { lvl: 4, xp: 120, streak: 9, logs: [{ date: '2026-10-01T10:00:00.000Z', mood: '💀', count: 9 }] };
const sauvegarde = profil => ({ app: 'fluxe-app', format: 1, exporte_le: '2026-11-09T12:00:00.000Z', data: { fluxe_user_v1: profil } });
const aujourdhui = () => { const d = new Date(), z = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`; };

/* Ouvre l'app avec une progression ; sansPartage = navigateur sans menu de partage (ordinateur) */
async function ouvrir(profil, { sansPartage = true } = {}) {
  const p = await app.page();
  if (sansPartage) await p.addInitScript(() => { delete Navigator.prototype.share; delete Navigator.prototype.canShare; });
  await donner(p, { [CLE_UTILISATEUR]: profil });
  await p.click('#nav-log');
  return p;
}
const toutLeStockage = p => p.evaluate(() => ({ ...localStorage }));
const violations = p => p.evaluate(() => window.__violationsCSP);

async function exporter(p) {
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#bouton-exporter')]);
  return { nom: dl.suggestedFilename(), contenu: JSON.parse(fs.readFileSync(await dl.path(), 'utf8')) };
}
async function importer(p, texte, nom = 'sauvegarde.json') {
  const avant = p.messages.length;
  await p.setInputFiles('#fichier-import', { name: nom, mimeType: 'application/json', buffer: Buffer.from(texte) });
  await attendre(() => p.messages.length > avant, 'aucun message après l’import');
}

test('l’encadré « Ma progression » est dans le journal, avec Exporter et Importer', async () => {
  const p = await ouvrir(P);
  assert.ok(await p.isVisible('#logbook-screen .encadre-sauvegarde'));
  assert.equal(await p.textContent('#bouton-exporter'), 'Exporter');
  assert.match(await p.textContent('#bouton-importer'), /Importer/);
  assert.equal(await p.getAttribute('#fichier-import', 'accept'), 'application/json,.json');
});

test('export (téléchargement) : bon nom de fichier et bon contenu, sans blocage CSP', async () => {
  const p = await ouvrir(P);
  const { nom, contenu } = await exporter(p);
  assert.equal(nom, `fluxe-progression-${aujourdhui()}.json`);
  assert.deepEqual(Object.keys(contenu), ['app', 'format', 'exporte_le', 'data']);
  assert.equal(contenu.app, 'fluxe-app');
  assert.equal(contenu.format, 1);
  assert.ok(Math.abs(Date.parse(contenu.exporte_le) - Date.now()) < 60000);
  assert.deepEqual(contenu.data, { fluxe_user_v1: P });
  assert.deepEqual(await violations(p), []);
  assert.deepEqual(p.erreurs, []);
});

test('export sur iPhone : le menu de partage reçoit le fichier (pas de téléchargement)', async () => {
  const p = await app.page();
  await p.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'canShare', { configurable: true, value: d => !!(d && d.files) });
    Object.defineProperty(Navigator.prototype, 'share', { configurable: true, value: async d => { window.__partage = { nom: d.files[0].name, type: d.files[0].type, texte: await d.files[0].text() }; } });
  });
  await donner(p, { [CLE_UTILISATEUR]: P });
  await p.click('#nav-log');
  let telechargements = 0;
  p.on('download', () => telechargements++);
  await p.click('#bouton-exporter');
  await p.waitForFunction(() => window.__partage);
  const partage = await p.evaluate(() => window.__partage);
  assert.equal(partage.nom, `fluxe-progression-${aujourdhui()}.json`);
  assert.equal(partage.type, 'application/json');
  assert.deepEqual(JSON.parse(partage.texte).data.fluxe_user_v1, P);
  await p.waitForTimeout(300);
  assert.equal(telechargements, 0);
});

test('export sur iPhone, partage annulé : rien ne se passe ; partage en panne : téléchargement', async () => {
  const p = await app.page();
  await p.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'canShare', { configurable: true, value: () => true });
    Object.defineProperty(Navigator.prototype, 'share', { configurable: true, value: async () => { throw new DOMException(window.__erreurPartage || 'annulé', window.__erreurPartage || 'AbortError'); } });
  });
  await donner(p, { [CLE_UTILISATEUR]: P });
  await p.click('#nav-log');
  let telechargements = 0;
  p.on('download', () => telechargements++);
  await p.click('#bouton-exporter');
  await p.waitForTimeout(300);
  assert.equal(telechargements, 0);
  await p.evaluate(() => { window.__erreurPartage = 'NotAllowedError'; });
  const { contenu } = await exporter(p);
  assert.deepEqual(contenu.data.fluxe_user_v1, P);
  assert.deepEqual(p.erreurs, []);
});

test('aller-retour : export puis import sur un autre téléphone = données identiques, copie avant import', async () => {
  const a = await ouvrir(P);
  const { contenu } = await exporter(a);

  const b = await ouvrir(Q);
  const brutAvant = await lireBrut(b, CLE_UTILISATEUR);
  await importer(b, JSON.stringify(contenu));
  assert.match(b.messages[0], /niveau 4, 120 XP, 1 séance/);
  assert.match(b.messages[0], /niveau 2, 30 XP, 2 séance/);
  assert.equal(b.messages[1], 'Progression importée.');
  assert.deepEqual(await lireCle(b, CLE_UTILISATEUR), P);
  assert.equal(await lireBrut(b, AVANT_IMPORT), brutAvant, 'copie exacte de la progression d’avant');
  // L'affichage est à jour
  assert.equal(await b.textContent('#user-lvl'), '2');
  assert.equal(await b.textContent('#streak-counter'), '🔥 5 SESSIONS');
  assert.equal(await b.locator('#log-list > div').count(), 2);
  assert.deepEqual(await violations(b), []);
  assert.deepEqual(b.erreurs, []);
  // Après rechargement, toujours là
  await b.reload();
  assert.equal(await b.textContent('#user-lvl'), '2');
});

test('import annulé à la confirmation : rien n’est modifié', async () => {
  const p = await ouvrir(Q);
  const avant = await toutLeStockage(p);
  p.reponses.push(false);
  const n = p.messages.length;
  await p.setInputFiles('#fichier-import', { name: 's.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(sauvegarde(P))) });
  await attendre(() => p.messages.length > n);
  await p.waitForTimeout(200);
  assert.equal(p.messages.length, n + 1, 'seulement la question, pas de message de réussite');
  assert.deepEqual(await toutLeStockage(p), avant);
  assert.equal(await p.textContent('#user-lvl'), '4');
});

const refus = {
  'JSON cassé': ['{abc', /abîmé/],
  'fichier vide': ['', /abîmé/],
  'sauvegarde Fluxe Suivi': [JSON.stringify({ app: 'fluxe-suivi', format: 3, version: '2.4.2', exportedAt: '2026-11-01T00:00:00Z', data: { sessions: [], routines: [] } }), /Fluxe Suivi/],
  'ancienne sauvegarde Fluxe Suivi (sans en-tête)': [JSON.stringify({ sessions: [{ id: 1 }], routines: [] }), /Fluxe Suivi/],
  'autre appli': [JSON.stringify({ ...sauvegarde(P), app: 'atlas' }), /pas une sauvegarde Fluxe valide/],
  'format inconnu': [JSON.stringify({ ...sauvegarde(P), format: 2 }), /pas une sauvegarde Fluxe valide/],
  'texte au lieu d’un objet': [JSON.stringify('fluxe'), /pas une sauvegarde Fluxe valide/],
  'données absentes': [JSON.stringify({ app: 'fluxe-app', format: 1 }), /pas une sauvegarde Fluxe valide/],
  'progression en tableau': [JSON.stringify(sauvegarde([P])), /pas une sauvegarde Fluxe valide/],
  'niveau en texte': [JSON.stringify(sauvegarde({ ...P, lvl: '2' })), /pas une sauvegarde Fluxe valide/],
  'niveau 0': [JSON.stringify(sauvegarde({ ...P, lvl: 0 })), /pas une sauvegarde Fluxe valide/],
  'XP négative': [JSON.stringify(sauvegarde({ ...P, xp: -5 })), /pas une sauvegarde Fluxe valide/],
  'champ manquant': [JSON.stringify(sauvegarde({ lvl: 2, xp: 30, logs: [] })), /pas une sauvegarde Fluxe valide/],
  'journal abîmé': [JSON.stringify(sauvegarde({ ...P, logs: [{ date: 'hier', mood: '🔥', count: 3 }] })), /pas une sauvegarde Fluxe valide/],
};
for (const [nom, [texte, attendu]] of Object.entries(refus)) {
  test(`fichier refusé (${nom}) : message clair, rien n’est modifié`, async () => {
    const p = await ouvrir(Q);
    const avant = await toutLeStockage(p);
    await importer(p, texte);
    assert.equal(p.messages.length, 1, 'pas de demande de confirmation');
    assert.match(p.messages[0], attendu);
    assert.match(p.messages[0], /Rien n'a été modifié/);
    assert.deepEqual(await toutLeStockage(p), avant);
    assert.equal(await p.textContent('#user-lvl'), '4');
    assert.deepEqual(p.erreurs, []);
  });
}

test('le contenu d’un fichier importé n’est jamais interprété comme du code (textContent)', async () => {
  const p = await ouvrir(Q);
  const piege = '<b>x</b>';
  await importer(p, JSON.stringify(sauvegarde({ ...P, logs: [{ date: '2026-11-01T10:00:00.000Z', mood: piege, count: 3 }] })));
  await attendre(() => p.messages.length >= 2);
  assert.equal(await p.locator('#log-list b').count(), 0);
  assert.equal(await p.textContent('#log-list .carte-seance-humeur'), piege);
  assert.deepEqual(await violations(p), []);
});
