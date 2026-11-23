/* Export / import de la progression (fichier JSON), depuis l'écran Journal.
   Le fichier est vérifié entièrement avant de toucher à quoi que ce soit. */
// Date du jour au format AAAA-MM-JJ (heure du téléphone), pour le nom du fichier
function dateDuJour() {
    const d = new Date(), deux = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`;
}

/* Export : sur iPhone, ouvre le menu de partage (Fichiers, AirDrop, mail...) ;
   sinon, téléchargement classique du fichier. */
async function exporterProgression() {
    const contenu = JSON.stringify({ app: 'fluxe-app', format: 1, exporte_le: new Date().toISOString(), data: { fluxe_user_v1: champsUtiles(userData) } }, null, 1);
    const nom = `fluxe-progression-${dateDuJour()}.json`;
    await partagerFichier(contenu, nom, 'application/json', 'Progression Fluxe');
}

/* Partage un fichier : sur iPhone, menu de partage (Fichiers, AirDrop, Calendrier…) ;
   sinon, téléchargement classique. */
async function partagerFichier(contenu, nom, type, titre) {
    const fichier = new File([contenu], nom, { type });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [fichier] })) {
        try { await navigator.share({ files: [fichier], title: titre }); return; }
        catch (e) { if (e && e.name === 'AbortError') return; } // partage annulé : rien à faire ; autre souci : téléchargement
    }
    const lien = document.createElement('a');
    lien.href = URL.createObjectURL(fichier);
    lien.download = nom;
    document.body.appendChild(lien);
    lien.click();
    lien.remove();
    setTimeout(() => URL.revokeObjectURL(lien.href), 10000);
}

// Import : lit le fichier choisi, puis le vérifie avant de toucher à quoi que ce soit
function importerProgression(champ) {
    const fichier = champ.files && champ.files[0];
    champ.value = ''; // permet de rechoisir le même fichier plus tard
    if (!fichier) return;
    if (fichier.size > TAILLE_MAX_IMPORT) return alert("Ce fichier est trop gros pour être une sauvegarde Fluxe (plus de 1 Mo). Rien n'a été modifié.");
    const lecteur = new FileReader();
    lecteur.onload = () => appliquerImport(String(lecteur.result));
    lecteur.onerror = () => alert("Impossible de lire ce fichier. Rien n'a été modifié.");
    lecteur.readAsText(fichier);
}

function appliquerImport(texte) {
    let contenu;
    try { contenu = JSON.parse(texte); } catch (e) {
        return alert("Ce fichier n'est pas une sauvegarde lisible (contenu abîmé). Rien n'a été modifié.");
    }
    if (estObjet(contenu) && (contenu.app === 'fluxe-suivi' || (contenu.app === undefined && Array.isArray(contenu.sessions)))) {
        return alert("Ce fichier vient de Fluxe Suivi (l'autre appli) : il ne contient pas de progression Fluxe. Rien n'a été modifié.");
    }
    if (!estObjet(contenu) || contenu.app !== 'fluxe-app' || contenu.format !== 1 || !estObjet(contenu.data) || !estProfilValide(contenu.data.fluxe_user_v1)) {
        return alert("Ce fichier n'est pas une sauvegarde Fluxe valide. Rien n'a été modifié.");
    }
    const nouveau = champsUtiles(contenu.data.fluxe_user_v1);
    const resume = p => `niveau ${p.lvl}, ${p.xp} XP, ${p.logs.length} séance(s)`;
    if (!confirm(`Importer cette sauvegarde ?\n\nTa progression actuelle (${resume(userData)}) sera remplacée par celle du fichier (${resume(nouveau)}).\n\nUne copie de sécurité de ta progression actuelle est gardée sur ce téléphone.`)) return;
    try {
        /* Copies de sécurité (texte exact enregistré, ou progression affichée) :
           - fluxe_user_v1_avant_import : la progression d'origine, avant le TOUT PREMIER import (jamais écrasée) ;
           - fluxe_user_v1_avant_dernier_import : la progression juste avant l'import le plus récent. */
        const actuel = localStorage.getItem('fluxe_user_v1');
        const copie = actuel !== null ? actuel : JSON.stringify(userData);
        if (localStorage.getItem('fluxe_user_v1_avant_import') === null) localStorage.setItem('fluxe_user_v1_avant_import', copie);
        localStorage.setItem('fluxe_user_v1_avant_dernier_import', copie);
        Storage.set('fluxe_user_v1', nouveau);
    } catch (e) {
        return alert("Impossible d'enregistrer sur ce téléphone (mémoire pleine ?). Rien n'a été modifié.");
    }
    userData = chargerProgression();
    updateUI();
    renderLogbook();
    alert('Progression importée.');
}
