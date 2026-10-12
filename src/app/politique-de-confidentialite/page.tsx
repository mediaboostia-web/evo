import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

const path = "/politique-de-confidentialite";

export const metadata = pageMetadata({
  title: "Politique de confidentialité",
  description:
    "Quelles données Evo traite, pourquoi, pendant combien de temps, et comment exercer vos droits. Aucun cookie publicitaire, aucun traceur, aucune revente.",
  path,
});

const mail = (
  <a href={`mailto:${site.legal.dpo}`}>{site.legal.dpo}</a>
);

const sections: LegalSection[] = [
  {
    id: "responsable",
    title: "Qui est responsable de vos données",
    content: (
      <>
        <p>
          Le site <strong>{site.url.replace("https://", "")}</strong> est édité par {site.legalName}, startup EdTech
          gabonaise qui développe Evo, un répétiteur virtuel. {site.legalName} est le responsable du traitement des données
          décrites sur cette page.
        </p>
        <p>
          Pour toute question sur vos données : {mail} ou WhatsApp au {site.contact.phoneDisplay}.
        </p>
      </>
    ),
  },
  {
    id: "donnees",
    title: "Les données que nous traitons",
    content: (
      <>
        <p>
          Ce site est une vitrine : il présente Evo et permet de réserver une place en accès anticipé. Il ne crée pas de
          compte et n&apos;enregistre aucun formulaire. Voici, concrètement, ce qui existe.
        </p>
        <div className="overflow-x-auto">
          <table className="stack">
            <thead>
              <tr>
                <th scope="col">Donnée</th>
                <th scope="col">Pourquoi</th>
                <th scope="col">Conservation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Donnée">
                  <strong>Votre message de réservation</strong>
                  <br />
                  Prénom, profil (parent, élève, école), niveau, et le numéro WhatsApp ou l&apos;adresse e-mail depuis
                  lequel vous l&apos;envoyez.
                </td>
                <td data-label="Pourquoi">Vous répondre et vous prévenir de l&apos;ouverture d&apos;Evo.</td>
                <td data-label="Conservation">Jusqu&apos;à l&apos;ouverture d&apos;Evo, puis 12 mois au plus, ou jusqu&apos;à votre demande de suppression.</td>
              </tr>
              <tr>
                <td data-label="Donnée">
                  <strong>Vos réglages d&apos;accessibilité</strong>
                  <br />
                  Texte plus grand, contraste renforcé, animations réduites.
                </td>
                <td data-label="Pourquoi">Retrouver la page comme vous l&apos;avez réglée à votre prochaine visite.</td>
                <td data-label="Conservation">Uniquement dans votre navigateur. Nous n&apos;y avons jamais accès.</td>
              </tr>
              <tr>
                <td data-label="Donnée">
                  <strong>Journaux techniques</strong>
                  <br />
                  Adresse IP, date et heure, page demandée.
                </td>
                <td data-label="Pourquoi">Faire fonctionner le site et le protéger contre les attaques.</td>
                <td data-label="Conservation">Durée limitée, fixée par l&apos;hébergeur.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Le formulaire de réservation prépare un message et l&apos;ouvre dans WhatsApp ou dans votre messagerie. C&apos;est
          vous qui choisissez de l&apos;envoyer : tant que vous ne l&apos;envoyez pas, nous ne recevons rien.
        </p>
      </>
    ),
  },
  {
    id: "jamais",
    title: "Ce que nous ne faisons pas",
    content: (
      <ul>
        <li>Aucun cookie publicitaire et aucun traceur de mesure d&apos;audience sur ce site.</li>
        <li>Aucune revente, location ou cession de vos données à des tiers.</li>
        <li>Aucun profilage publicitaire, ni des parents, ni des élèves.</li>
        <li>Aucune prospection commerciale sans votre accord.</li>
      </ul>
    ),
  },
  {
    id: "enfants",
    title: "Les données des enfants",
    content: (
      <>
        <p>
          Evo s&apos;adresse à des élèves, donc à des mineurs. Nous appliquons une règle simple : la réservation d&apos;une
          place doit être faite par un parent, un tuteur légal ou un établissement. Un élève qui nous écrit directement
          est invité à le faire avec l&apos;accord d&apos;un adulte responsable.
        </p>
        <p>
          Nous ne demandons jamais de photo, d&apos;adresse du domicile ni de document d&apos;identité d&apos;un enfant sur
          ce site. Un parent peut à tout moment demander la suppression des informations concernant son enfant.
        </p>
      </>
    ),
  },
  {
    id: "base",
    title: "Sur quelle base nous traitons vos données",
    content: (
      <>
        <p>
          Nous traitons votre message de réservation avec votre <strong>consentement</strong> : vous choisissez de nous
          écrire, et vous pouvez retirer cet accord à tout moment. Les journaux techniques reposent sur notre{" "}
          <strong>intérêt légitime</strong> à assurer la sécurité du site.
        </p>
        <p>
          Ces traitements respectent la loi gabonaise n° 001/2011 relative à la protection des données à caractère
          personnel, telle que modifiée.
        </p>
      </>
    ),
  },
  {
    id: "destinataires",
    title: "Qui a accès à vos données",
    content: (
      <>
        <p>Seules les personnes de l&apos;équipe Evo qui en ont besoin pour vous répondre lisent vos messages.</p>
        <p>Deux types de prestataires interviennent techniquement :</p>
        <ul>
          <li>
            <strong>Le service de messagerie que vous choisissez</strong> (WhatsApp, édité par Meta, ou votre
            fournisseur d&apos;e-mail). Votre message transite par leurs serveurs, selon leurs propres règles de
            confidentialité.
          </li>
          <li>
            <strong>L&apos;hébergeur du site</strong>, qui traite les journaux techniques pour notre compte.
          </li>
        </ul>
        <p>
          Ces prestataires peuvent être situés hors du Gabon. Nous choisissons des prestataires reconnus qui offrent des
          garanties de sécurité et de confidentialité.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies et stockage local",
    content: (
      <>
        <p>
          Ce site <strong>ne dépose aucun cookie</strong>. C&apos;est pourquoi aucun bandeau de consentement ne
          s&apos;affiche : il n&apos;y a rien à accepter ou à refuser.
        </p>
        <p>
          Seuls vos réglages d&apos;accessibilité sont mémorisés, dans le stockage local de votre navigateur, sous le nom{" "}
          <code>evo-a11y</code>. Vous pouvez les effacer à tout moment depuis les réglages de votre navigateur.
        </p>
        <p>
          Le film de présentation n&apos;est chargé que si vous appuyez sur lecture. S&apos;il est hébergé sur YouTube, il
          est diffusé en mode de confidentialité avancée, sans cookie de suivi avant la lecture.
        </p>
      </>
    ),
  },
  {
    id: "droits",
    title: "Vos droits",
    content: (
      <>
        <p>Vous pouvez à tout moment, gratuitement :</p>
        <ul>
          <li>
            <strong>accéder</strong> aux données que nous détenons sur vous ou sur votre enfant ;
          </li>
          <li>
            les faire <strong>corriger</strong> si elles sont inexactes ;
          </li>
          <li>
            les faire <strong>supprimer</strong> ;
          </li>
          <li>
            vous <strong>opposer</strong> à leur utilisation ou retirer votre consentement.
          </li>
        </ul>
        <p>
          Écrivez-nous à {mail} en précisant votre demande. Nous répondons dans un délai de 30 jours. Si notre réponse ne
          vous satisfait pas, vous pouvez saisir l&apos;autorité gabonaise chargée de la protection des données à
          caractère personnel et de la vie privée.
        </p>
      </>
    ),
  },
  {
    id: "securite",
    title: "Comment nous protégeons vos données",
    content: (
      <p>
        Connexion chiffrée, en-têtes de sécurité, aucune base de données exposée sur ce site. Le détail figure sur la
        page <Link href="/securite-des-donnees">Sécurité des données</Link>.
      </p>
    ),
  },
  {
    id: "evolution",
    title: "Évolution de cette politique",
    content: (
      <p>
        Evo est en cours de développement. À l&apos;ouverture de l&apos;application, cette politique sera complétée pour
        décrire précisément les données de compte et d&apos;apprentissage. Toute modification importante sera annoncée
        sur cette page, avec sa date, avant son entrée en vigueur.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      path={path}
      intro="Vos données vous appartiennent. Cette page explique, sans jargon, ce que nous collectons, pourquoi, et comment vous gardez la main."
      summary={[
        "Ce site ne dépose aucun cookie et n'utilise aucun traceur.",
        "Nous ne recevons que le message que vous choisissez de nous envoyer par WhatsApp ou par e-mail.",
        "Rien n'est revendu, loué ni utilisé pour de la publicité.",
        "Vous pouvez demander l'accès, la correction ou la suppression de vos données à tout moment.",
      ]}
      sections={sections}
    />
  );
}
