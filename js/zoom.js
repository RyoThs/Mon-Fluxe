/* Écran fixe : pas de zoom (comme Fluxe Suivi).
   - balise viewport (maximum-scale=1, user-scalable=no) : navigateurs qui la respectent ;
   - « touch-action: manipulation » (css/app.css) : pas de zoom au double toucher ;
   - ici : pincement annulé (Safari sur iPhone ignore la balise viewport). Le défilement à un doigt reste normal. */
const annulerGeste = e => e.preventDefault();
['gesturestart', 'gesturechange', 'gestureend'].forEach(t => document.addEventListener(t, annulerGeste, { passive: false }));
document.addEventListener('touchmove', e => { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
