/* Petites fonctions utiles partout (aucune ne lit ni n'écrit le stockage). */

// Mélange équitable (Fisher-Yates) : chaque ordre a exactement la même chance. Renvoie une nouvelle liste.
function melanger(liste) {
    const copie = [...liste];
    for (let i = copie.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copie[i], copie[j]] = [copie[j], copie[i]];
    }
    return copie;
}

// Crée un élément avec textContent : un texte venant d'un fichier importé ne peut jamais être pris pour du code
function element(balise, classe, texte) {
    const el = document.createElement(balise);
    if (classe) el.className = classe;
    if (texte !== undefined) el.textContent = texte;
    return el;
}

// Transforme « **Placement** : texte » en éléments : chaque ligne devient un paragraphe, **…** devient du gras
function texteAvecGras(texte) {
    return texte.split('\n').map(ligne => {
        const p = element('p', 'ligne-aide');
        ligne.split(/\*\*(.+?)\*\*/).forEach((morceau, i) => {
            if (morceau) p.append(i % 2 ? element('strong', '', morceau) : document.createTextNode(morceau));
        });
        return p;
    });
}

// Date en toutes lettres et en français (« mercredi 18 novembre ») ; l'année est ajoutée si ce n'est pas l'année en cours
function dateLisible(date) {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    if (date.getFullYear() !== new Date().getFullYear()) options.year = 'numeric';
    return date.toLocaleDateString('fr-FR', options);
}

// Petit message en bas de l'écran (comme Fluxe Suivi), qui disparaît tout seul au bout de 2,5 s
let minuteurMessage = null;
function afficherMessage(texte) {
    const zone = document.getElementById('message');
    zone.textContent = texte;
    zone.classList.add('visible');
    clearTimeout(minuteurMessage);
    minuteurMessage = setTimeout(() => zone.classList.remove('visible'), 2500);
}

// Lundi 0 h de la semaine en cours (heure du téléphone)
function debutDeSemaine(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
}
