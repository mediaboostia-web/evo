# Evo, Mon Répétiteur Virtuel : site vitrine

Refonte du site [evomrv.ga](https://www.evomrv.ga/). Une page d'accueil, cinq pages d'information (confidentialité, sécurité des données, conditions, accessibilité, mentions légales) et tout l'outillage de référencement.

**Technologies :** Next.js 16 (App Router), React 19, Tailwind CSS 4, Motion, Phosphor Icons, TypeScript.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

| Commande            | Rôle                                                              |
| ------------------- | ----------------------------------------------------------------- |
| `npm run dev`       | Serveur de développement                                          |
| `npm run build`     | Compilation de production (toutes les pages sont statiques)       |
| `npm run start`     | Sert la version compilée                                          |
| `npm run lint`      | Vérification ESLint                                               |
| `npm run typecheck` | Vérification TypeScript                                           |
| `npm run images`    | Régénère les images web à partir des sources de `evo ressources/` |

Node.js 20.9 ou plus récent.

## Où modifier quoi

| Besoin                                                    | Fichier                                              |
| --------------------------------------------------------- | ---------------------------------------------------- |
| Téléphone, e-mail, Facebook, adresse du site              | `src/lib/site.ts`                                    |
| **Vidéo de présentation** (fichier MP4 ou identifiant YouTube) | `src/lib/site.ts`, bloc `video` (voir `public/video/LISEZ-MOI.txt`) |
| **Mentions légales à compléter** (RCCM, NIF, siège, hébergeur) | `src/lib/site.ts`, bloc `legal`                      |
| Textes : accroches, chiffres, étapes, profils, questions  | `src/lib/content.ts`                                 |
| Couleurs, typographie, rayons, ombres                     | `src/app/globals.css`, bloc `@theme`                 |
| Une section de la page d'accueil                          | `src/components/sections/`                           |
| Ordre des sections                                        | `src/app/page.tsx`                                   |
| Pages juridiques                                          | `src/app/<nom-de-la-page>/page.tsx`                  |

### Ajouter le film de présentation

La section située juste après le héros attend une vidéo **16:9 (1920 x 1080)**. Tant qu'aucune vidéo n'est renseignée, le cadre affiche l'image d'attente et la mention « bientôt disponible ».

1. Déposer `evo-presentation.mp4` et ses sous-titres `evo-presentation.fr.vtt` dans `public/video/`.
2. Dans `src/lib/site.ts` : `mp4: "/video/evo-presentation.mp4"` et `captions: "/video/evo-presentation.fr.vtt"`.

Variante YouTube : renseigner seulement `youtubeId`. Le lecteur n'est chargé qu'au clic, en mode de confidentialité avancée.

## Structure

```
src/
  app/                    Pages, métadonnées, sitemap, robots, manifeste, carte de partage
  components/
    layout/               En-tête, pied de page, logo
    sections/             Les sections de la page d'accueil, dans l'ordre du récit
    demos/                Mini-interfaces interactives (conversation, exercice)
    legal/                Gabarit des pages juridiques
    seo/                  Données structurées schema.org
    ui/                   Bouton, révélation au défilement, compteur
  lib/                    Configuration du site, contenus, utilitaires
public/
  brand/                  Logo, mascotte, écran d'app, icônes
  images/                 Photographies optimisées
  video/                  Emplacement du film de présentation
scripts/optimize-images.mjs
```

Les dossiers `refonte/` (première maquette HTML) et `evo ressources/` (sources brutes) sont conservés mais ne font pas partie du site compilé.

## Référencement : ce qui est en place

- **Balises** : titre et description uniques par page, URL canoniques, Open Graph, cartes X/Twitter, `hreflang` fr-GA, balises géographiques.
- **Carte de partage** 1200 x 630 générée à la compilation (`src/app/opengraph-image.tsx`) : c'est l'aperçu affiché sur WhatsApp et Facebook.
- **Données structurées** (JSON-LD) : `Organization`, `WebSite`, `WebPage`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`.
- **Fichiers d'exploration** : `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/llms.txt` (assistants IA), `/.well-known/security.txt`.
- **Structure** : un seul `h1` par page, titres hiérarchisés, HTML sémantique, textes alternatifs sur toutes les images.
- **Continuité** : les ancres du site d'origine (`#apropos`, `#solution`, `#contact`) sont conservées ; les anciennes URL WordPress sont redirigées vers l'accueil (`next.config.ts`).
- **Vitesse** : pages statiques, images servies en AVIF/WebP à la taille de l'écran, polices auto-hébergées, vidéo chargée à la demande.

### À faire à la mise en ligne

1. Renseigner `NEXT_PUBLIC_SITE_URL` si le domaine change (voir `.env.example`).
2. Compléter le bloc `legal` de `src/lib/site.ts` : les pages juridiques affichent « À compléter » tant qu'une valeur manque.
3. Faire relire les pages juridiques par un conseil : elles sont rédigées avec soin mais ne remplacent pas un avis juridique.
4. Déclarer le site dans Google Search Console (variable `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`) et y soumettre `/sitemap.xml`.
5. Créer ou mettre à jour la fiche Google Business Profile avec le même nom, le même téléphone et la même adresse que sur le site.

## Sécurité et vie privée

- En-têtes appliqués à toutes les réponses (`next.config.ts`) : CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **Aucun cookie, aucun traceur.** Le site n'a donc pas besoin de bandeau de consentement. Si un outil de mesure d'audience est ajouté plus tard, en choisir un sans cookie ou prévoir un bandeau et mettre à jour la politique de confidentialité.
- Le formulaire de réservation n'envoie rien à un serveur : il prépare un message et l'ouvre dans WhatsApp ou dans la messagerie du visiteur.
- Les réglages d'accessibilité sont mémorisés dans le navigateur du visiteur (`localStorage`, clé `evo-a11y`).

## Accessibilité

Police Atkinson Hyperlegible (conçue pour les lecteurs malvoyants), contrastes AA, navigation complète au clavier, lien d'évitement, respect de `prefers-reduced-motion`, contenu lisible sans JavaScript. La section Accessibilité propose quatre réglages qui s'appliquent à tout le site : texte plus grand, contraste renforcé, moins d'animations, lecture à voix haute.

## Déploiement

Le site est un projet Next.js standard.

- **Vercel** (le plus simple) : importer le dépôt, aucune configuration nécessaire.
- **Serveur Node.js** : `npm run build` puis `npm run start` derrière un proxy HTTPS.

Pointer ensuite le domaine `www.evomrv.ga` vers le nouvel hébergement.
