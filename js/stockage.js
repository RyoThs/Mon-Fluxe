/* Stockage sur le téléphone (localStorage) : lecture sûre et vérification des données.
   Clés à ne JAMAIS renommer (voir docs/STOCKAGE.md) : fluxe_user_v1 (progression) et fluxe_backup (séance en cours). */
const Storage = {
    // Lecture sûre : une valeur illisible (fichier abîmé) renvoie la valeur par défaut au lieu de planter
    get: (k, f = []) => { try { return JSON.parse(localStorage.getItem(k)) || f; } catch (e) { return f; } },
    set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
    remove: (k) => localStorage.removeItem(k)
};

/* ===== Progression de l'utilisateur (clé fluxe_user_v1) : lecture et vérification ===== */
const profilParDefaut = () => ({ lvl: 1, xp: 0, logs: [], streak: 0 });
// Nombre entier entre min et max (les bornes écartent seulement les valeurs absurdes, ex. 1e300)
const estEntier = (v, min, max) => Number.isInteger(v) && v >= min && v <= max;
// Une ligne du journal : { date (texte de date), mood (humeur), count (nombre d'exercices) }
const estSeanceValide = l => !!l && typeof l === 'object' && !Array.isArray(l)
    && typeof l.date === 'string' && l.date.length <= 64 && !Number.isNaN(Date.parse(l.date))
    && typeof l.mood === 'string' && l.mood.length > 0 && l.mood.length <= 16
    && estEntier(l.count, 0, 1000);
// Règle de chaque champ de la progression. Pas de règle « xp < niveau × 100 » :
// on refuse seulement l'absurde, pour qu'un export fait par l'app soit toujours réimportable.
const reglesProfil = {
    lvl: v => estEntier(v, 1, 1000),
    xp: v => estEntier(v, 0, 1000000),
    streak: v => estEntier(v, 0, 100000),
    logs: v => Array.isArray(v) && v.every(estSeanceValide)
};
const MAX_SEANCES_IMPORT = 5000;
const TAILLE_MAX_IMPORT = 1024 * 1024; // 1 Mo
// Ne garde que les champs utilisés par l'app (progression et chaque séance du journal)
const champsUtiles = p => ({
    lvl: p.lvl, xp: p.xp, streak: p.streak,
    logs: p.logs.map(l => ({ date: l.date, mood: l.mood, count: l.count }))
});
const estObjet = v => !!v && typeof v === 'object' && !Array.isArray(v);
// Vérification stricte (fichier importé) : tous les champs présents et du bon type
const estProfilValide = p => estObjet(p) && Object.keys(reglesProfil).every(k => reglesProfil[k](p[k])) && p.logs.length <= MAX_SEANCES_IMPORT;

/* Lit la progression enregistrée sans jamais rien perdre :
   - illisible (texte abîmé) : le texte brut est copié dans fluxe_user_v1_illisible
     (sans écraser une copie déjà faite) et l'app repart des valeurs par défaut ;
   - incomplète : les champs manquants sont complétés, les autres sont gardés ;
   - champ au mauvais format : il est remplacé (et le texte brut est copié aussi).
   La clé fluxe_user_v1 elle-même n'est réécrite qu'à la prochaine séance terminée. */
function chargerProgression() {
    const brut = localStorage.getItem('fluxe_user_v1');
    if (brut === null) return profilParDefaut();
    let lu = null;
    try { lu = JSON.parse(brut); } catch (e) { lu = null; }
    const garderCopie = () => { if (localStorage.getItem('fluxe_user_v1_illisible') === null) localStorage.setItem('fluxe_user_v1_illisible', brut); };
    if (!estObjet(lu)) { garderCopie(); return profilParDefaut(); }
    const profil = { ...profilParDefaut(), ...lu };
    let abime = false;
    for (const k of Object.keys(reglesProfil)) {
        if (lu[k] === undefined) continue; // champ manquant : valeur par défaut, rien d'abîmé
        if (reglesProfil[k](lu[k])) continue;
        abime = true;
        profil[k] = k === 'logs' && Array.isArray(lu.logs) ? lu.logs.filter(estSeanceValide) : profilParDefaut()[k];
    }
    if (abime) garderCopie();
    return profil;
}

/* Séance interrompue (clé fluxe_backup) : renvoie null si absente ou mal formée */
function lireSauvegardeSeance() {
    const b = Storage.get('fluxe_backup', null);
    const exerciceValide = ex => estObjet(ex) && typeof ex.n === 'string' && typeof ex.d === 'string'
        && typeof ex.h === 'string' && (typeof ex.r === 'number' || typeof ex.r === 'string');
    const valide = estObjet(b) && Array.isArray(b.workout) && b.workout.length > 0 && b.workout.every(exerciceValide)
        && estEntier(b.index, 0, b.workout.length - 1)
        && ['beginner', 'intermediate', 'advanced'].includes(b.lvl);
    return valide ? b : null;
}
