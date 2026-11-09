/* Vérificateur de code (eslint) pour les tests, les outils (Node.js) et sw.js (service worker).
   Il attrape surtout les variables utilisées sans être déclarées et le code mort. */
const NODE = ['require', 'module', '__dirname', 'process', 'console', 'Buffer', 'setTimeout', 'clearTimeout', 'URL'];
const NAVIGATEUR = ['window', 'document', 'localStorage', 'getComputedStyle', 'Image', 'navigator', 'caches', 'Request', 'Response', 'fetch'];
const SERVICE_WORKER = ['self', 'caches', 'fetch', 'location', 'Request', 'Response', 'URL'];
const REGLES = {
  'no-undef': 'error',
  'no-redeclare': 'error',
  'no-dupe-keys': 'error',
  'no-unreachable': 'error',
  'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
};

module.exports = [
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
