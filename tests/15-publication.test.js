/* Publication du site : après chaque mise à jour de main dont les tests sont verts, GitHub doit
   republier le site (GitHub Pages). Bug du 2026-11-22 : la v1.1.0 fusionnée n'a jamais été publiée
   (aucune « pages build and deployment » lancée), l'iPhone gardait la v1.0.0. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { lire, RACINE } = require('./outils');

const FICHIER = '.github/workflows/publication.yml';

test('une étape automatique « Publication » existe', () => {
  assert.ok(fs.existsSync(path.join(RACINE, FICHIER)), `${FICHIER} manquant`);
});

test('elle se lance seulement après les tests de main, et seulement s’ils sont verts', () => {
  const y = lire(FICHIER);
  assert.match(y, /workflow_run:\s*\n\s*workflows: \[Tests\]\s*\n\s*types: \[completed\]\s*\n\s*branches: \[main\]/);
  assert.match(y, /github\.event\.workflow_run\.conclusion == 'success'/);
  assert.match(y, /workflow_dispatch:/, 'on doit pouvoir la relancer à la main');
});

test('elle demande à GitHub Pages de republier le site, avec le seul droit nécessaire', () => {
  const y = lire(FICHIER);
  assert.match(y, /permissions:\s*\n\s*pages: write/);
  assert.doesNotMatch(y, /contents: write/);
  assert.match(y, /gh api -X POST "repos\/\$\{\{ github\.repository \}\}\/pages\/builds"/);
  assert.match(y, /GH_TOKEN: \$\{\{ secrets\.GITHUB_TOKEN \}\}/);
});
