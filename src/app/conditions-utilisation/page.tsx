import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

const path = "/conditions-utilisation";

export const metadata = pageMetadata({
  title: "Conditions d'utilisation",
  description:
    "Les règles du site Evo et de l'accès anticipé : gratuit, sans engagement, et transparent sur l'état d'avancement du produit.",
  path,
});

const sections: LegalSection[] = [
  {
    id: "objet",
    title: "À quoi sert ce site",
    content: (
      <p>
        Ce site présente Evo, le répétiteur virtuel développé par {site.legalName}, et permet de réserver une place en
        accès anticipé. En le consultant, vous acceptez les présentes conditions.
      </p>
    ),
  },
  {
    id: "avancement",
    title: "Evo est en cours de développement",
    content: (
      <>
        <p>
          Nous le disons clairement : Evo n&apos;est pas encore ouvert au public. Les fonctionnalités décrites sur ce site
          correspondent à ce que nous construisons. Elles peuvent évoluer d&apos;ici l&apos;ouverture.
        </p>
        <p>
          Les écrans et les chiffres portant la mention « Illustration » ou « Données d&apos;illustration » montrent le
          fonctionnement prévu. Ils ne constituent ni une promesse de résultat scolaire, ni des résultats mesurés.
        </p>
      </>
    ),
  },
  {
    id: "acces-anticipe",
    title: "L'accès anticipé",
    content: (
      <ul>
        <li>
          <strong>Gratuit et sans engagement.</strong> Réserver une place ne vous oblige à rien et ne donne lieu à aucun
          paiement.
        </li>
        <li>
          <strong>Une priorité, pas une garantie.</strong> Les personnes inscrites sont prévenues en premier de
          l&apos;ouverture. Le nombre de places et la date d&apos;ouverture seront communiqués le moment venu.
        </li>
        <li>
          <strong>Vous pouvez vous retirer.</strong> Un simple message à {site.contact.email} suffit pour annuler votre
          réservation et faire supprimer vos informations.
        </li>
        <li>
          <strong>Pour les mineurs.</strong> La réservation doit être faite par un parent, un tuteur légal ou un
          établissement scolaire.
        </li>
      </ul>
    ),
  },
  {
    id: "tarifs",
    title: "Tarifs",
    content: (
      <p>
        Les tarifs d&apos;Evo seront annoncés à l&apos;ouverture. Aucune somme n&apos;est demandée sur ce site. Toute offre
        payante fera l&apos;objet de conditions de vente distinctes, présentées avant tout engagement.
      </p>
    ),
  },
  {
    id: "bon-usage",
    title: "Bon usage du site",
    content: (
      <>
        <p>Vous vous engagez à ne pas :</p>
        <ul>
          <li>tenter de perturber le fonctionnement du site ou d&apos;accéder à des parties non publiques ;</li>
          <li>copier ou réutiliser ses contenus sans autorisation ;</li>
          <li>nous transmettre des informations fausses ou concernant une autre personne sans son accord.</li>
        </ul>
      </>
    ),
  },
  {
    id: "responsabilite",
    title: "Responsabilité",
    content: (
      <>
        <p>
          Nous faisons de notre mieux pour que les informations de ce site soient exactes et à jour, et pour qu&apos;il
          reste accessible. Nous ne pouvons toutefois pas garantir l&apos;absence d&apos;erreur ni une disponibilité
          permanente.
        </p>
        <p>
          Evo complète le travail de l&apos;enseignant. Il ne le remplace pas et ne se substitue pas au suivi de
          l&apos;établissement scolaire.
        </p>
      </>
    ),
  },
  {
    id: "donnees",
    title: "Données personnelles",
    content: (
      <p>
        Le traitement de vos données est décrit dans la{" "}
        <Link href="/politique-de-confidentialite">politique de confidentialité</Link> et sur la page{" "}
        <Link href="/securite-des-donnees">Sécurité des données</Link>.
      </p>
    ),
  },
  {
    id: "modification",
    title: "Modification et droit applicable",
    content: (
      <p>
        Ces conditions peuvent être mises à jour, notamment à l&apos;ouverture de l&apos;application. La date de
        dernière mise à jour figure en haut de cette page. Elles sont soumises au droit gabonais.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Conditions d'utilisation"
      path={path}
      intro="Des règles courtes et claires, à l'image de ce que nous voulons construire avec les familles."
      summary={[
        "Evo est en développement : ce site présente ce que nous construisons.",
        "Réserver une place est gratuit, sans engagement, et annulable à tout moment.",
        "Aucun paiement n'est demandé sur ce site.",
      ]}
      sections={sections}
    />
  );
}
