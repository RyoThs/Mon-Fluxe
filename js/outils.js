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

// Lundi 0 h de la semaine en cours (heure du téléphone)
function debutDeSemaine(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return d;
}
