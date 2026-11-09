/* Vérificateur de code (eslint) pour les tests et les outils (Node.js).
   Il attrape surtout les variables utilisées sans être déclarées et le code mort. */
const NODE = ['require', 'module', '__dirname', 'process', 'console', 'Buffer', 'setTimeout', 'clearTimeout', 'URL'];
const NAVIGATEUR = ['window', 'document', 'localStorage', 'getComputedStyle', 'Image'];

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs', globals: Object.fromEntries([...NODE, ...NAVIGATEUR].map(g => [g, 'readonly'])) },
    rules: {
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-dupe-keys': 'error',
      'no-unreachable': 'error',
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
    },
  },
];
