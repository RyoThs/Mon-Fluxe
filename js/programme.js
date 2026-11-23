/* Programme « Débuter en 4 semaines » : 12 séances guidées (3 par semaine).
   Semaines 1-2 en Débutant, semaines 3-4 en Intermédiaire ; on alterne haut du corps, bas du corps, corps entier.
   Progression gardée dans fluxe_programme = { id, faites } (écrit seulement quand on commence). */
const HAUT = ['Pectoraux', 'Dos', 'Bras'], BAS = ['Jambes', 'Abdos'], COMPLET = ['Pectoraux', 'Jambes', 'Épaules', 'Abdos'];
const PROGRAMMES = {
    debuter4: {
        nom: 'Débuter en 4 semaines',
        seances: [HAUT, BAS, COMPLET, HAUT, BAS, COMPLET, HAUT, BAS, COMPLET, HAUT, BAS, COMPLET]
            .map((groupes, i) => ({ groupes, niveau: i < 6 ? 'beginner' : 'intermediate', titre: groupes === HAUT ? 'Haut du corps' : groupes === BAS ? 'Bas du corps' : 'Corps entier' })),
    },
};

// Programme en cours, ou null (absent ou abîmé)
function lireProgramme() {
    const p = Storage.get('fluxe_programme', null);
    const def = estObjet(p) && PROGRAMMES[p.id];
    return def && estEntier(p.faites, 0, def.seances.length) ? p : null;
}

function commencerProgramme() { Storage.set('fluxe_programme', { id: 'debuter4', faites: 0 }); afficherProgramme(); }
function arreterProgramme() { Storage.remove('fluxe_programme'); afficherProgramme(); }

function lancerSeanceProgramme() {
    const p = lireProgramme();
    if (!p) return;
    const s = PROGRAMMES[p.id].seances[p.faites];
    if (!s) return;
    levelKey = s.niveau; // niveau imposé pour cette séance (le choix de l'accueil n'est pas modifié)
    afficherNiveau();
    generateWorkout(s.groupes, { programme: true });
}

// Appelé à la fin d'une séance du programme
function avancerProgramme() {
    const p = lireProgramme();
    if (p && p.faites < PROGRAMMES[p.id].seances.length) Storage.set('fluxe_programme', { ...p, faites: p.faites + 1 });
    afficherProgramme();
}

function afficherProgramme() {
    const zone = document.getElementById('programme');
    const p = lireProgramme();
    const bouton = (texte, act, classe = 'bouton-reprendre') => { const b = element('button', classe, texte); b.dataset.act = act; return b; };
    const def = PROGRAMMES.debuter4;
    if (!p) {
        zone.replaceChildren(element('span', 'carte-reprise-titre', 'Programme'), element('p', 'programme-nom', def.nom),
            element('p', 'programme-texte', '12 séances guidées, 3 par semaine'), bouton('Commencer', 'programmeCommencer'));
        return;
    }
    const total = PROGRAMMES[p.id].seances.length;
    const barre = element('div', 'barre-xp'); const rempli = element('div', 'barre-xp-remplie'); rempli.style.width = `${(p.faites / total) * 100}%`; barre.append(rempli);
    if (p.faites >= total) {
        zone.replaceChildren(element('span', 'carte-reprise-titre', PROGRAMMES[p.id].nom), element('p', 'programme-nom', 'Programme terminé 🎉'), barre,
            element('div', 'programme-boutons'));
        zone.lastChild.append(bouton('Recommencer', 'programmeCommencer'), bouton('Arrêter', 'programmeArreter', 'bouton-secondaire'));
        return;
    }
    const s = PROGRAMMES[p.id].seances[p.faites];
    zone.replaceChildren(element('span', 'carte-reprise-titre', PROGRAMMES[p.id].nom), element('p', 'programme-nom', `Séance ${p.faites + 1}/${total} · ${s.titre}`),
        element('p', 'programme-texte', `${s.groupes.join(', ')} · ${NOM_NIVEAU[s.niveau]}`), barre, element('div', 'programme-boutons'));
    zone.lastChild.append(bouton('Lancer', 'programmeLancer'), bouton('Arrêter', 'programmeArreter', 'bouton-secondaire'));
}
