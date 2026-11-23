/* Vérificateur de code (eslint) pour les tests, les outils (Node.js) et sw.js (service worker).
   Il attrape surtout les variables utilisées sans être déclarées et le code mort. */
const NODE = ['require', 'module', '__dirname', 'process', 'console', 'Buffer', 'setTimeout', 'clearTimeout', 'URL'];
const NAVIGATEUR = ['window', 'Event', 'document', 'localStorage', 'getComputedStyle', 'Image', 'navigator', 'Navigator', 'DOMException', 'caches', 'Request', 'Response', 'fetch'];
const SERVICE_WORKER = ['self', 'caches', 'fetch', 'location', 'Request', 'Response', 'URL', 'setTimeout', 'clearTimeout'];
const REGLES = {
  'no-undef': 'error',
  'no-redeclare': 'error',
  'no-dupe-keys': 'error',
  'no-unreachable': 'error',
  'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
};

/* Code de l'app (js/) : scripts classiques chargés dans l'ordre par index.html. Ils se partagent leurs
   fonctions et variables du haut de fichier : la liste PARTAGES dit lesquelles existent, pour qu'une faute
   de frappe (nom inconnu) soit quand même attrapée. */
const APP = [...NAVIGATEUR, 'alert', 'confirm', 'File', 'FileReader', 'URL', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date'];
const PARTAGES = require('node:fs').readdirSync(require('node:path').join(__dirname, 'js')).filter(f => f.endsWith('.js'))
  .flatMap(f => [...require('node:fs').readFileSync(require('node:path').join(__dirname, 'js', f), 'utf8')
    .matchAll(/^(?:function\s+|async function\s+|const\s+|let\s+)([A-Za-z_$][\w$]*)/gm)].map(m => m[1]))
  .concat(['selectedMuscles', 'currentWorkout', 'currentStepIndex', 'levelKey', 'isExpress']);

module.exports = [
  {
    files: ['js/**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: Object.fromEntries([...APP, ...PARTAGES].map(g => [g, 'writable'])) },
    rules: { ...REGLES, 'no-redeclare': ['error', { builtinGlobals: false }], 'no-unused-vars': ['error', { vars: 'local', args: 'none', caughtErrors: 'none' }] },
  },
  {
    files: ['tests/**/*.js', 'outils/**/*.js', 'eslint.config.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs', globals: Object.fromEntries([...NODE, ...NAVIGATEUR].map(g => [g, 'readonly'])) },
    rules: REGLES,
  },
  {
    files: ['sw.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: Object.fromEntries(SERVICE_WORKER.map(g => [g, 'readonly'])) },
    rules: REGLES,
  },
];
