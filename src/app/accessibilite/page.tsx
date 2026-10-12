import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

const path = "/accessibilite";

export const metadata = pageMetadata({
  title: "Accessibilité du site",
  description:
    "Ce que ce site fait pour être utilisable par tous : police pour lecteurs malvoyants, contrastes, clavier, réglages, et ce qu'il reste à améliorer.",
  path,
});

const sections: LegalSection[] = [
  {
    id: "engagement",
    title: "Notre engagement",
    content: (
      <p>
        Evo est conçu d&apos;abord pour les élèves que l&apos;on oublie. Un site qui présente cette promesse doit la tenir
        lui-même. Nous visons le niveau AA des règles internationales d&apos;accessibilité des contenus web (WCAG 2.2).
      </p>
    ),
  },
  {
    id: "en-place",
    title: "Ce qui est en place",
    content: (
      <ul>
        <li>
          <strong>Une police faite pour être lue.</strong> Le texte est composé en Atkinson Hyperlegible, dessinée par le
          Braille Institute pour distinguer nettement les lettres qui se ressemblent.
        </li>
        <li>
          <strong>Des contrastes vérifiés.</strong> Les textes respectent un rapport de contraste d&apos;au moins 4,5 pour
          1 sur leur fond.
        </li>
        <li>
          <strong>Tout au clavier.</strong> Menu, onglets, questions, formulaire : chaque élément s&apos;atteint avec la
          touche Tabulation, et l&apos;élément actif est toujours entouré d&apos;un anneau visible.
        </li>
        <li>
          <strong>Un lien « Aller au contenu »</strong> en tout début de page, pour passer la navigation.
        </li>
        <li>
          <strong>Une structure claire.</strong> Titres hiérarchisés, régions nommées, images décrites : les lecteurs
          d&apos;écran s&apos;y repèrent.
        </li>
        <li>
          <strong>Des cibles confortables.</strong> Boutons et liens font au moins 44 pixels de haut sur écran tactile.
        </li>
        <li>
          <strong>Le zoom reste libre.</strong> La page s&apos;agrandit jusqu&apos;à 200 % sans perte de contenu.
        </li>
        <li>
          <strong>Des animations respectueuses.</strong> Elles se coupent automatiquement si votre appareil demande de
          réduire les mouvements.
        </li>
        <li>
          <strong>Sans JavaScript, le contenu reste lisible.</strong>
        </li>
      </ul>
    ),
  },
  {
    id: "reglages",
    title: "Les réglages à votre disposition",
    content: (
      <>
        <p>
          Dans la section <Link href="/#accessibilite">Accessibilité</Link> de la page d&apos;accueil, quatre réglages
          s&apos;appliquent à tout le site :
        </p>
        <ul>
          <li>
            <strong>Texte plus grand</strong> : agrandit tous les textes.
          </li>
          <li>
            <strong>Contraste renforcé</strong> : fonce les textes secondaires et les filets, souligne les liens.
          </li>
          <li>
            <strong>Moins d&apos;animations</strong> : coupe les mouvements.
          </li>
          <li>
            <strong>Écouter ce passage</strong> : lecture à voix haute par la synthèse vocale de votre appareil.
          </li>
        </ul>
        <p>Vos choix sont mémorisés sur votre appareil pour vos prochaines visites.</p>
      </>
    ),
  },
  {
    id: "limites",
    title: "Ce qu'il reste à améliorer",
    content: (
      <ul>
        <li>Ce site n&apos;a pas encore fait l&apos;objet d&apos;un audit par un organisme indépendant.</li>
        <li>
          Le film de présentation sera publié avec ses sous-titres en français. Une transcription écrite sera ajoutée.
        </li>
        <li>La lecture à voix haute dépend des voix installées sur votre appareil.</li>
      </ul>
    ),
  },
  {
    id: "signaler",
    title: "Signaler une difficulté",
    content: (
      <p>
        Quelque chose vous bloque sur ce site ? Dites-le nous : <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>{" "}
        ou WhatsApp au {site.contact.phoneDisplay}. Décrivez la page et l&apos;appareil utilisé. Nous vous répondons et
        corrigeons au plus vite.
      </p>
    ),
  },
];

export default function AccessibilityStatementPage() {
  return (
    <LegalPage
      title="Accessibilité du site"
      path={path}
      intro="Un élève sourd ou malvoyant a le même droit de comprendre. Un visiteur aussi. Voici ce que ce site fait, et ce qu'il doit encore mieux faire."
      sections={sections}
    />
  );
}
