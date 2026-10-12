Evo — Mon répétiteur virtuel. Le premier répétiteur IA inclusif du Gabon. Ce système sert le site, l'app et les vidéos motion design : un seul vocabulaire visuel, du scroll à l'écran 9:16.

## Principe directeur

**Chaque mot, chaque section, chaque mouvement a un travail.** Si on ne peut pas dire en une phrase ce qu'un élément fait comprendre au visiteur, on le retire.

Une page Evo répond aux questions du visiteur dans l'ordre où il se les pose :

| # | Section | La question du visiteur | Ce que la section doit faire ressentir |
|---|---|---|---|
| 1 | Héros | « C'est quoi ? Pour qui ? » | Une promesse en une phrase : *Un répétiteur pour chaque élève.* |
| 2 | Film (vidéo) | « Montrez-moi. » | La preuve en 60 s, avant tout argument. |
| 3 | Le constat | « Pourquoi j'en aurais besoin ? » | Le problème qu'il vit déjà, pas le produit. |
| 4 | Ce qu'Evo fait | « Comment ça marche ? » | Trois gestes : explique, fait pratiquer, corrige. |
| 5 | Accessibilité | « Qu'est-ce qui le rend unique ? » | L'avantage décisif, sur scène sombre. |
| 6 | Pour qui | « Est-ce pour moi ? » | Parent, élève, école : chacun se reconnaît. |
| 7 | Questions | « Et si… ? » | Lever les derniers doutes, honnêtement. |
| 8 | Inscription | « Je fais quoi maintenant ? » | Une seule action : réserver une place. |

## Voix et contenu

- **Vouvoiement pour les parents et les écoles, tutoiement pour les élèves.** Jamais les deux dans le même bloc.
- **Phrases courtes, verbes d'action.** « Evo explique. » plutôt que « Evo propose une solution d'explication ».
- **Le concret gabonais avant l'abstrait.** « Un bâton de manioc coupé en 4 parts égales » plutôt que « une pizza ». « Le téléphone de la maison suffit » plutôt que « multi-plateforme ».
- **Bannis :** *solution innovante, révolutionnaire, de pointe, booster, écosystème, synergie*, et tout chiffre non sourcé. Le mot « IA » apparaît une fois dans le héros, puis on parle de ce qu'Evo *fait*.
- **Honnêteté du statut.** Evo est en développement : on dit « accès anticipé », « réserver une place », jamais « télécharger » ni « des milliers d'élèves ».
- **Maquettes et chiffres d'illustration** portent la mention « Illustration » ou « Données d'illustration ».
- **Casse :** phrase normale (pas de Majuscules À Chaque Mot). Capitales uniquement pour l'`eyebrow`.
- **Pas d'emoji.** Les icônes sont dessinées au trait.

Exemples réels :
> Un répétiteur pour chaque élève. Même à 22 h, la veille du contrôle.
> Trop facile ? Ça monte. Trop dur ? Ça redescend.
> Pose toutes tes questions. Personne ne te juge.
> N'attendez pas le prochain bulletin.

## Couleur

- Fond de page `surface-50`, cartes `surface-0`, maquettes UI sur `surface-100`. Texte `ink-900`, accroches `ink-700`, notes `ink-500`.
- **`evo-action` est la seule couleur d'action** : boutons principaux, liens, numéros de gestes. Texte `on-action` dessus.
- **`soleil` est l'accent « regardez ici »**, une fois par écran : le surligneur `.mark` sous les mots qui portent la phrase, le bouton de lecture vidéo, le badge « Accès anticipé ». Texte toujours `ink-900` (#0a1a3f) dessus.
- `evo-brand` et `evo-cyan` (les bleus du logo) sont réservés aux formes et aux icônes : jamais de texte blanc sur `evo-brand` (2.9:1).
- `feuille` = acquis/réussi, toujours accompagné d'une coche. `alerte` = erreur, toujours avec un texte.
- Scène sombre `surface-inverse` : une fois pour changer de chapitre (Accessibilité), une fois pour conclure (CTA final). Jamais deux sections sombres consécutives.
- Interdit : dégradés bleu-violet, texte en dégradé, lueurs, glassmorphism décoratif.

## Typographie

- **Gabarito** (titres, `display`, `h2`, `h3`, `stat`) : géométrique et chaleureuse, comme le logo.
- **Atkinson Hyperlegible** (texte, `lead`, `body`, `small`, `eyebrow`) : conçue par le Braille Institute pour les lecteurs malvoyants. Le choix de police *est* une preuve de la promesse d'accessibilité.
- Les deux sont servies par Google Fonts : `family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Gabarito:wght@500;600;700;800`.
- Corps de texte à 18px minimum. Titres en `text-wrap: balance`.
- Tailles fluides : `display` clamp(44px, 7.4vw, 96px), `h2` clamp(34px, 4.6vw, 60px), `h3` clamp(24px, 2.4vw, 32px).
- Une image peut s'insérer dans un titre (pastille mascotte dans le H1) : une seule par page.

## Mise en page

- Conteneur 1200px, gouttière 16px en mobile. Sections : padding vertical clamp(72px, 10vw, 144px).
- Grille texte / visuel en 2 colonnes, alternée d'un geste à l'autre ; une colonne sous 860px.
- Rayons : `radius-pill` pour tout ce qui se clique, `radius-lg` pour les cartes, `radius-xl` pour les grands cadres.
- Trame de points 28px en fond du héros uniquement (le « cahier »).

## Vidéo motion design

- Emplacement `VideoSlot` juste après le héros : **16:9 (1920×1080) en desktop, 9:16 (1080×1920) en mobile**, bascule à 767px.
- Fichiers via `data-src-desktop`, `data-src-mobile`, `data-poster-desktop`, `data-poster-mobile`, sous-titres `.vtt` via `data-captions` (obligatoires).
- Les vidéos reprennent ce système : fonds `surface-50` / `surface-inverse`, Gabarito pour le texte à l'écran (titres ≥ 96px sur 1920×1080, étiquettes ≥ 40px), `soleil` comme unique accent.

## Mouvement (site et vidéo, mêmes règles)

- **Partir du problème, pas du produit.** La page et la vidéo ouvrent sur ce que vit le parent.
- **Une idée par écran.** Une section = une question du visiteur.
- **Chaque mouvement explique quelque chose.** Pas de flottement, de pulsation ni de dérive pour remplir.
- Entrées : `ease-out` (exponentielle), `dur-3`, translation de 28px vers le haut. Sorties : `ease-in`. Jamais de rebond.
- Listes : décalage de 80ms entre éléments, dans l'ordre de lecture.
- Une courte pause (300ms) avant la valeur qui compte (compteur du chiffre-clé).
- `prefers-reduced-motion` et l'option « Réduire les animations » coupent tout mouvement ; le contenu reste visible sans JavaScript.

## Accessibilité (non négociable)

- Contrastes WCAG AA vérifiés dans les deux thèmes ; un mode **contraste élevé** (AAA, noir sur blanc) est proposé dans le panneau Accessibilité.
- Focus clavier : anneau `focus` 3px plein, décalé de 3px.
- Lien « Aller au contenu », titres hiérarchisés, FAQ en `<details>`, maquettes UI en `role="img"` avec description.
- Panneau Accessibilité fixe : texte plus grand (×1.18), contraste élevé, réduire les animations, lecture à voix haute (synthèse vocale fr-FR).
- Cibles tactiles ≥ 44px. Couleur jamais seule porteuse de sens.

## Iconographie

- Icônes au trait, 24×24, épaisseur 2–2.6px, extrémités arrondies, `currentColor`. Une seule famille, dessinée maison (pas d'emoji, pas d'icônes remplies sauf lecture ▶).
- Pastille d'icône : carré 56px `radius` 16px, fond teinté (`surface-100` ou cyan à 14% sur scène sombre).

## Marque

- Logo : `assets/Logos/evo-logo.png` (fond transparent), hauteur 46px dans l'en-tête. Ne pas recolorer.
- Mascotte : `assets/Logos/evo-mascot.png` — sur fond clair uniquement (fond #ebf3fe intégré, `mix-blend-mode: multiply`).
- Écran d'app : `assets/Logos/evo-app-phone.png` pour le héros.
