/* La montre du film. Tout part de la voix : chaque phrase est un morceau du fichier
   voix/voix-off.mp3 (début, fin) posé à un instant du film. Les silences entre les
   morceaux sont voulus. Lu par le navigateur (film.js) et par Node (audio.js). */
(function (root) {
  const FPS = 24;
  const DURATION = 86.5;

  // [début dans la voix, fin dans la voix, instant dans le film], en secondes.
  // Les coupes tombent au milieu des silences mesurés dans l'enregistrement.
  const voice = [
    [0.0, 1.21, 0.9], // Dix-neuf heures.
    [1.21, 6.19, 2.6], // Grâce a quinze ans… depuis deux heures.
    [6.19, 9.82, 7.7], // Elle relit. Elle gomme. Elle recommence.
    [9.82, 15.2, 11.8], // Ce n'est pas qu'elle ne travaille pas… expliquer autrement.
    [15.2, 22.95, 17.6], // En classe… n'a pas osé le dire.
    [22.95, 25.52, 25.8], // Certains élèves suivent ce cours sans l'entendre.
    [25.52, 27.11, 30.7], // D'autres, sans le voir.
    [27.11, 34.27, 34.9], // À la maison… pas dans le budget.
    [34.98, 37.6, 42.7], // Alors ce soir, Grâce essaie autre chose.
    [37.6, 38.3, 46.0], // Évo.
    [38.3, 39.96, 47.0], // Mon Répétiteur Virtuel.
    [39.96, 48.94, 49.9], // Elle pose sa question… personne ne soupire.
    [48.94, 54.63, 59.5], // Et pour les élèves sourds ou malvoyants… Dès le départ.
    [54.63, 60.76, 66.4], // Ce soir-là… elle se lève.
    [60.76, 65.62, 73.4], // Un élève qui bloque… expliquer autrement.
    [65.62, 66.23, 79.3], // Évo.
    [66.23, 68.12, 80.2], // Un répétiteur pour chaque élève.
    [68.12, 69.41, 82.6], // Réservez sa place.
  ];

  /** Instant du film où l'on entend l'instant `s` de la voix. */
  const at = (s) => {
    for (const [a, b, t] of voice) if (s >= a - 1e-6 && s <= b + 1e-6) return +(t + (s - a)).toFixed(3);
    // Entre deux morceaux (souffle retiré) : on se cale sur le morceau suivant.
    for (const [a, , t] of voice) if (a > s) return t;
    return DURATION;
  };

  // Le silence voulu : plus aucun son, pour faire ressentir un cours suivi sans l'entendre.
  const silence = [28.4, 30.6];
  // L'image brouillée : le son est là, l'image ne l'est plus.
  const blur = [31.75, 34.15];

  const scenes = [
    ["open", 0, 7.6, "19 h, le blocage"],
    ["trip", 7.6, 13.0, "Relire, gommer, recommencer"],
    ["doubt", 13.0, 17.4, "Personne pour expliquer autrement"],
    ["class", 17.4, 25.6, "En classe, une seule fois"],
    ["hear", 25.6, 30.6, "Sans l'entendre"],
    ["see", 30.6, 34.6, "Sans le voir"],
    ["mom", 34.6, 42.4, "À la maison"],
    ["pivot", 42.4, 46.15, "Elle essaie autre chose"],
    ["brand", 46.15, 49.6, "Evo, Mon Répétiteur Virtuel"],
    ["demo", 49.6, 59.3, "Evo explique autrement"],
    ["access", 59.3, 66.2, "Pour chaque élève"],
    ["next", 66.2, 73.2, "Le lendemain"],
    ["msg", 73.2, 79.0, "Le message"],
    ["end", 79.0, DURATION, "Réservez sa place"],
  ].map(([id, start, end, title]) => ({ id, start, end, title }));

  // Sous-titres : [début dans la voix, fin dans la voix, texte]. « | » force le passage à la ligne.
  const cues = [
    [0.05, 1.1, "Dix-neuf heures."],
    [1.37, 3.62, "Grâce a quinze ans, un contrôle demain…"],
    [4.2, 6.02, "et le même exercice depuis deux heures."],
    [7.1, 7.7, "Elle relit."],
    [8.05, 8.62, "Elle gomme."],
    [8.94, 9.72, "Elle recommence."],
    [11.12, 12.4, "Ce n'est pas qu'elle ne travaille pas."],
    [12.79, 14.98, "C'est que personne n'est là|pour lui expliquer autrement."],
    [15.42, 17.78, "En classe, son professeur a expliqué la leçon."],
    [18.21, 19.5, "Une fois, pour tout le monde."],
    [20.0, 21.15, "Grâce n'a pas tout compris…"],
    [21.8, 22.72, "et n'a pas osé le dire."],
    [23.21, 25.4, "Certains élèves suivent ce cours|sans l'entendre."],
    [25.67, 26.92, "D'autres, sans le voir."],
    [27.33, 29.32, "À la maison, sa mère rentre du travail."],
    [29.57, 31.4, "Elle regarde le cahier, elle encourage."],
    [31.71, 34.1, "Mais un répétiteur,|ce n'est pas dans le budget."],
    [35.16, 37.43, "Alors ce soir, Grâce essaie autre chose."],
    [37.81, 38.25, "Evo."],
    [38.46, 39.86, "Mon Répétiteur Virtuel."],
    [40.1, 41.1, "Elle pose sa question."],
    [41.33, 44.0, "Evo explique autrement,|avec un exemple de chez elle."],
    [44.2, 45.98, "Puis un exercice, juste à son niveau."],
    [46.26, 48.81, "Elle peut redemander dix fois :|personne ne soupire."],
    [49.07, 50.62, "Et pour les élèves sourds ou malvoyants :"],
    [50.84, 53.58, "des sous-titres, la langue des signes,|la lecture à voix haute."],
    [53.84, 54.48, "Dès le départ."],
    [54.79, 56.36, "Ce soir-là, Grâce a compris."],
    [57.08, 59.52, "Et le lendemain, quand le professeur|demande qui veut essayer…"],
    [59.94, 60.62, "elle se lève."],
    [60.91, 62.9, "Un élève qui bloque|n'est pas un élève incapable."],
    [63.36, 65.48, "Il lui manque quelqu'un|pour expliquer autrement."],
    [65.76, 66.14, "Evo."],
    [66.35, 68.02, "Un répétiteur pour chaque élève."],
    [68.23, 69.2, "Réservez sa place."],
  ];

  // Sous-titres placés sur le film. Chacun reste un quart de seconde après la phrase,
  // sauf si le suivant arrive.
  const captions = cues.map(([a, b, text]) => ({ start: at(a), end: at(b), text, sound: false }));
  // Ce que l'on entend sans parole, écrit pour qui n'entend pas.
  captions.push(
    { start: 0.15, end: 0.85, text: "[ tic-tac d'une horloge ]", sound: true },
    { start: silence[0] + 0.1, end: silence[1] - 0.1, text: "[ silence ]", sound: true },
    { start: 32.45, end: 34.3, text: "[ on entend la classe, on ne la voit plus ]", sound: true },
  );
  captions.sort((x, y) => x.start - y.start);
  captions.forEach((c, i) => {
    const next = captions[i + 1];
    c.end = +Math.min(c.end + 0.3, next ? next.start - 0.04 : DURATION).toFixed(3);
  });

  const TL = { FPS, DURATION, voice, at, silence, blur, scenes, captions };
  if (typeof module !== "undefined" && module.exports) module.exports = TL;
  else root.EVO_TL = TL;
})(typeof window !== "undefined" ? window : globalThis);
