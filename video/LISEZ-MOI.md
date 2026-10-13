# Evo, le film de présentation

Film de 1 min 27 (1920 × 1080, 24 images/seconde), raconté en voix off et sous-titré de bout en bout. Il est affiché sur la page d'accueil, juste après le héros.

| Fichier | Rôle |
| --- | --- |
| `public/video/evo-presentation.mp4` | Version web, lue par le site |
| `public/video/evo-presentation-affiche.jpg` | Image affichée avant la lecture |
| `public/video/evo-presentation.fr.vtt` | Sous-titres séparés, pour YouTube ou un autre lecteur |
| `video/out/evo-film-master.mp4` | Version maître, haute qualité (non versionnée : plus de 100 Mo) |

## Ce que raconte le film

1. **19 h.** Grâce, 15 ans, bloque depuis deux heures sur le même exercice.
2. **En classe.** La leçon a été expliquée une fois, pour tout le monde. Sa question n'a jamais été posée.
3. **Sans l'entendre, sans le voir.** Un élève sourd, une élève malvoyante. Le film coupe réellement le son deux secondes, puis brouille l'image deux secondes : le spectateur vit ce que ces élèves vivent.
4. **À la maison.** Sa mère encourage, mais un répétiteur n'est pas dans le budget.
5. **Evo.** Le vrai site apparaît sur son écran. La vraie interface montre la question, l'explication avec le bâton de manioc, l'exercice, puis « Encore un exemple » touché dix fois.
6. **Pour chaque élève.** Les quatre outils d'accessibilité du site.
7. **Le lendemain.** Elle va au tableau.
8. **Réservez sa place.** La page d'accueil, le clic sur le bouton, l'adresse du site.

## Ce qui est vrai à l'image

- L'écran du portable, les bulles de conversation, l'exercice et la page d'accueil sont des **captures du site**, jamais des dessins. Elles se refont avec `capture-ui.js`.
- Les libellés des outils d'accessibilité reprennent mot pour mot ceux du site.
- Les personnages viennent des plans et des photos fournis ; rien n'a été généré pour le film.

## La bande-son

- **Voix** : `voix/voix-off.mp3`, découpée phrase par phrase aux silences mesurés.
- **Musique et bruitages** : calculés par `scripts/audio.js` (piano, nappe, arpège, clics). Aucun échantillon tiers, donc aucun droit à vérifier. C'est une musique de synthèse simple : un compositeur ferait plus riche.
- **Niveau** : −15 LUFS, pointes à −1 dB. La musique passe sous la voix quand elle parle.
- **Silence voulu** de 28,4 s à 30,6 s : zéro absolu, vérifié à chaque fabrication.

## Refaire le film

Il faut Node.js, Python 3, ffmpeg, et Microsoft Edge ou Google Chrome.

```bash
npm install
npm install -D playwright-core       # pilote le navigateur pour les captures et le rendu
pip install faster-whisper           # seulement pour retranscrire une nouvelle voix

npm run dev                          # le site doit tourner pour les captures
node video/scripts/fetch-fonts.js    # polices du site
node video/scripts/capture-ui.js     # vraie interface -> video/motion/ui
node video/scripts/prep.js           # plans -> images, photos, suivi de l'écran du portable
node video/scripts/audio.js          # voix + musique + bruitages -> video/out/evo-film-audio.wav
node video/scripts/render.js film    # le film -> video/out/evo-film-master.mp4 (10 minutes environ)
node video/scripts/export.js         # version web, affiche et sous-titres -> public/video
```

Pour vérifier une image sans tout rendre : `node video/scripts/render.js planche controle.jpg 12 44 68`. Pour voir le film bouger, ouvrir `video/motion/film.html` dans un navigateur (espace : pause, flèches : image par image).

### Où changer quoi

| Besoin | Fichier |
| --- | --- |
| Moment où tombe chaque phrase, sous-titres, durée des scènes | `motion/timeline.js` |
| Mise en page et textes à l'écran | `motion/film.html` |
| Animations de chaque scène | `motion/film.js` |
| Musique, bruitages, niveaux | `scripts/audio.js` |
| Choix des plans, ralentis | `scripts/prep.js` |

**Nouvelle voix :** remplacer `voix/voix-off.mp3`, lancer `python video/scripts/transcribe.py`, puis reporter dans `motion/timeline.js` le début et la fin de chaque phrase (`work/words.json` donne le temps de chaque mot).

### Matière non versionnée

Les plans tournés (`evo ressources/video scenes/`), les deux photos en 2K (`video/sources/`) et les fichiers intermédiaires (`video/work/`, `video/out/`) restent sur le poste de fabrication : ils sont trop lourds pour le dépôt. Sans eux, les scripts ne peuvent pas refaire le film.

## À faire confirmer par Evo

Trois phrases de la voix engagent l'entreprise :

- « ce n'est pas dans le budget » laisse entendre un prix bas, alors que les tarifs ne sont pas publiés ;
- « la langue des signes » suppose que l'avatar sera disponible au lancement ;
- le film montre Evo utilisé « ce soir », alors que le produit est en accès anticipé.

L'écran final affiche `evomrv.ga` : à corriger dans `motion/film.html` si le site est publié à une autre adresse.

## Pistes pour aller plus loin

- Une version verticale (9:16) pour WhatsApp, TikTok et Reels.
- Une incrustation en langue des signes, tournée avec un interprète.
- Une audiodescription, en seconde piste audio.
