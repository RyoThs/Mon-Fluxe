/* Rappels de séance : un fichier calendrier (.ics) avec une séance qui revient chaque semaine aux jours choisis,
   et une alerte à l'heure. Le calendrier du téléphone fait le rappel : pas de serveur, pas de compte, rien n'est envoyé. */
const JOURS_ICS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']; // lundi → dimanche
let joursRappel = [];

function basculerJourRappel(bouton) {
    const j = bouton.dataset.jour;
    joursRappel = joursRappel.includes(j) ? joursRappel.filter(x => x !== j) : [...joursRappel, j];
    bouton.classList.toggle('actif', joursRappel.includes(j));
}

// Texte du fichier calendrier (lignes séparées par \r\n, comme le veut le format iCalendar)
function calendrierRappel(jours, heure) {
    const ordre = jours.slice().sort((a, b) => JOURS_ICS.indexOf(a) - JOURS_ICS.indexOf(b));
    const deux = n => String(n).padStart(2, '0');
    // premier jour choisi à partir d'aujourd'hui
    const debut = new Date();
    while (!ordre.includes(JOURS_ICS[(debut.getDay() + 6) % 7])) debut.setDate(debut.getDate() + 1);
    const [h, m] = heure.split(':');
    const date = `${debut.getFullYear()}${deux(debut.getMonth() + 1)}${deux(debut.getDate())}`;
    const maintenant = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    return [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Fluxe App//Rappels//FR', 'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT', `UID:fluxe-rappel-${Date.now()}@fluxe-app`, `DTSTAMP:${maintenant}`,
        `DTSTART:${date}T${deux(h)}${deux(m)}00`, 'DURATION:PT30M',
        `RRULE:FREQ=WEEKLY;BYDAY=${ordre.join(',')}`,
        'SUMMARY:Séance Fluxe', 'DESCRIPTION:C\'est l\'heure de ta séance Fluxe !',
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Séance Fluxe', 'TRIGGER:PT0M', 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR', '',
    ].join('\r\n');
}

async function ajouterRappel() {
    if (joursRappel.length === 0) return afficherMessage('Choisis au moins un jour');
    const heure = document.getElementById('rappel-heure').value || '18:00';
    await partagerFichier(calendrierRappel(joursRappel, heure), 'fluxe-rappels.ics', 'text/calendar', 'Rappels Fluxe');
}

// Passerelle vers Fluxe Suivi (l'appli pour la salle, même site) : proposée au niveau 5 ou après 20 séances
function afficherPasserelle() {
    document.getElementById('passerelle').classList.toggle('cache', !(userData.lvl >= 5 || userData.logs.length >= 20));
}
