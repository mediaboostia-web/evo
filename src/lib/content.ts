/**
 * Contenu éditorial partagé entre l'affichage et les données structurées (SEO).
 */

export const heroLines = [
  "Même à 22 h, la veille du contrôle.",
  "Même dans une classe surchargée.",
  "Même quand les cours coûtent trop cher.",
  "Même sans entendre.",
  "Même sans voir.",
] as const;

export const stats = [
  { value: "24 h/24", label: "Disponible, même la veille du contrôle" },
  { value: "3 cycles", label: "Primaire, collège et lycée" },
  { value: "4 outils", label: "D'accessibilité, intégrés dès la conception" },
  { value: "1 téléphone", label: "Celui de la maison suffit pour apprendre" },
] as const;

export const problems = [
  {
    title: "Un enseignant, trop d'élèves.",
    text: "Impossible de suivre chacun. Les questions restent sans réponse.",
    answer: "Evo répond à chaque question",
  },
  {
    title: "Le répétiteur, un luxe.",
    text: "Un bon soutien scolaire coûte plus que ce que beaucoup de familles peuvent payer.",
    answer: "Un répétiteur dans le téléphone",
  },
  {
    title: "Des difficultés vues trop tard.",
    text: "On découvre le retard au bulletin, quand il faut déjà rattraper.",
    answer: "Evo vous alerte dès le début",
  },
  {
    title: "Des outils qui excluent.",
    text: "Un élève sourd ou malvoyant n'a presque rien d'adapté pour réviser.",
    answer: "Evo est inclusif dès sa conception",
  },
] as const;

export const steps = [
  {
    title: "Réservez votre place",
    text: "Trente secondes, gratuit, sans engagement. Un prénom suffit.",
  },
  {
    title: "Recevez votre invitation",
    text: "Dès l'ouverture, les familles inscrites sont prévenues en premier.",
  },
  {
    title: "Posez la première question",
    text: "Sur le téléphone de la maison. Evo explique, puis fait pratiquer.",
  },
  {
    title: "Suivez les progrès",
    text: "Matière par matière, sans attendre le prochain bulletin.",
  },
] as const;

export const accessibilityTools = [
  {
    key: "captions",
    title: "Sous-titres automatiques",
    text: "Chaque explication en vidéo s'affiche aussi en texte. Pour les élèves sourds ou malentendants.",
  },
  {
    key: "sign",
    title: "Avatar en langue des signes",
    text: "Un avatar traduit les explications en langue des signes, à côté de la leçon.",
  },
  {
    key: "voice",
    title: "Lecture à voix haute",
    text: "Evo lit les leçons, les consignes et les exercices. Pour les élèves malvoyants ou en difficulté de lecture.",
  },
  {
    key: "braille",
    title: "Braille numérique",
    text: "Evo fonctionne avec les plages braille, pour lire les leçons du bout des doigts.",
  },
] as const;

export const audiences = [
  {
    key: "parents",
    label: "Parents",
    title: "Aidez-le aux devoirs, même quand vous ne pouvez pas.",
    text: "Travail, fatigue, matière oubliée : Evo prend le relais et vous dit où en est votre enfant.",
    points: [
      "Un tableau de bord clair, matière par matière",
      "Une alerte dès qu'une notion bloque",
      "Des devoirs corrigés et expliqués",
    ],
    cta: { label: "Réserver ma place", href: "/#contact" },
    image: "/images/mere-fille-devoirs.jpg",
    alt: "Une mère aide sa fille à faire ses devoirs à la maison.",
  },
  {
    key: "eleves",
    label: "Élèves",
    title: "Pose toutes tes questions. Personne ne te juge.",
    text: "Tu peux redemander dix fois. Evo réexplique, sans soupirer, jusqu'à ce que tu aies compris.",
    points: [
      "Des exemples tirés de ton quotidien",
      "Des exercices à ton niveau, ni trop faciles ni trop durs",
      "Disponible à toute heure, même la veille du contrôle",
    ],
    cta: { label: "Réserver ma place", href: "/#contact" },
    image: "/images/eleve-exercice-mathematiques.jpg",
    alt: "Un élève concentré résout un exercice de mathématiques.",
  },
  {
    key: "ecoles",
    label: "Écoles",
    title: "Un suivi individuel pour chaque élève de l'établissement.",
    text: "Prolongez le travail de vos enseignants à la maison et repérez plus tôt les élèves en difficulté.",
    points: [
      "Un relais des enseignants, pas un remplaçant",
      "Des difficultés repérées avant le bulletin",
      "Une solution inclusive pour tous vos élèves",
    ],
    cta: { label: "Devenir école pilote", href: "/#contact" },
    image: "/images/enseignant-explique-lecon.jpg",
    alt: "Un enseignant explique une leçon à ses élèves en classe.",
  },
] as const;

export const faq = [
  {
    question: "Evo remplace-t-il l'enseignant ?",
    answer:
      "Non. Evo prolonge le travail de l'enseignant à la maison : il explique, fait pratiquer et signale les difficultés. L'enseignant reste le guide.",
  },
  {
    question: "Pour quelles classes ?",
    answer:
      "Du primaire au lycée. Les explications et les exercices s'adaptent au niveau de chaque élève.",
  },
  {
    question: "Mon enfant est sourd ou malvoyant. Peut-il utiliser Evo ?",
    answer:
      "Oui, c'est l'une des raisons d'exister d'Evo : sous-titres automatiques, avatar en langue des signes, lecture à voix haute et compatibilité braille.",
  },
  {
    question: "Faut-il un ordinateur ?",
    answer: "Non. Un téléphone suffit. Evo fonctionne aussi sur tablette et sur ordinateur.",
  },
  {
    question: "Combien ça coûte ?",
    answer:
      "Les tarifs seront annoncés à l'ouverture. Les familles inscrites en accès anticipé seront informées en premier.",
  },
  {
    question: "Quand Evo sera-t-il disponible ?",
    answer:
      "Evo est en cours de développement. Réservez votre place : vous serez prévenu dès l'ouverture, avant tout le monde.",
  },
  {
    question: "Que faites-vous des données de mon enfant ?",
    answer:
      "Nous ne collectons que le strict nécessaire, jamais à des fins publicitaires, et rien n'est revendu. Notre politique de confidentialité détaille vos droits.",
  },
] as const;
