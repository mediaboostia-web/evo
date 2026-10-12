import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

const path = "/securite-des-donnees";

export const metadata = pageMetadata({
  title: "Sécurité des données",
  description:
    "Comment Evo protège les données des familles et des élèves : connexion chiffrée, aucune base exposée, principes de conception, signalement d'une faille.",
  path,
});

const sections: LegalSection[] = [
  {
    id: "site",
    title: "Ce qui protège ce site aujourd'hui",
    content: (
      <>
        <ul>
          <li>
            <strong>Connexion chiffrée.</strong> Le site n&apos;est servi qu&apos;en HTTPS. Votre navigateur est invité à
            refuser toute connexion non chiffrée (HSTS).
          </li>
          <li>
            <strong>Rien à voler.</strong> Ce site ne crée pas de compte, ne stocke aucun mot de passe et n&apos;enregistre
            aucun formulaire. Il n&apos;y a pas de base de données de visiteurs derrière ces pages.
          </li>
          <li>
            <strong>Navigateur verrouillé.</strong> Une politique de sécurité du contenu (CSP) limite les scripts, les
            images et les cadres aux seules sources prévues. Le site ne peut pas être intégré dans une page tierce.
          </li>
          <li>
            <strong>Aucun traceur.</strong> Pas de régie publicitaire, pas de pixel de réseau social, pas de script
            d&apos;audience tiers.
          </li>
          <li>
            <strong>Permissions fermées.</strong> Le site ne demande ni la caméra, ni le micro, ni la position.
          </li>
          <li>
            <strong>Vidéo à la demande.</strong> Le lecteur vidéo n&apos;est chargé que si vous appuyez sur lecture.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "application",
    title: "Nos principes pour l'application Evo",
    content: (
      <>
        <p>
          Evo est en cours de développement. Ces principes guident sa conception ; ils seront détaillés et datés à
          l&apos;ouverture de l&apos;application.
        </p>
        <ul>
          <li>
            <strong>Le strict nécessaire.</strong> Nous ne collectons que ce qui sert à faire apprendre : le niveau, les
            réponses aux exercices, les progrès.
          </li>
          <li>
            <strong>Chiffrement.</strong> Les données circulent chiffrées entre l&apos;appareil et nos serveurs, et sont
            chiffrées là où elles sont stockées.
          </li>
          <li>
            <strong>Le parent garde la main.</strong> Le compte d&apos;un élève mineur est rattaché à un adulte
            responsable, qui peut consulter, exporter ou supprimer les données.
          </li>
          <li>
            <strong>Accès restreint.</strong> Dans l&apos;équipe, seules les personnes qui en ont besoin accèdent aux
            données, et chaque accès est tracé.
          </li>
          <li>
            <strong>Ni publicité ni revente.</strong> Les données d&apos;un élève ne servent ni à cibler de la publicité,
            ni à alimenter des tiers.
          </li>
          <li>
            <strong>Suppression sur demande.</strong> Une famille qui quitte Evo peut faire effacer ses données.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "familles",
    title: "Trois réflexes pour les familles",
    content: (
      <>
        <ol>
          <li>
            <strong>Vérifiez le numéro.</strong> Notre seul numéro WhatsApp est le {site.contact.phoneDisplay}. Notre
            seule adresse est {site.contact.email}.
          </li>
          <li>
            <strong>Ne partagez jamais un code.</strong> Evo ne vous demandera jamais un mot de passe, un code reçu par
            SMS ou un paiement par simple message.
          </li>
          <li>
            <strong>Un doute ? Demandez.</strong> Si un message se réclamant d&apos;Evo vous paraît étrange, écrivez-nous
            avant d&apos;y répondre.
          </li>
        </ol>
      </>
    ),
  },
  {
    id: "signalement",
    title: "Signaler une faille de sécurité",
    content: (
      <>
        <p>
          Vous avez trouvé une vulnérabilité sur ce site ? Écrivez à{" "}
          <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Signalement de sécurité")}`}>
            {site.contact.email}
          </a>{" "}
          avec l&apos;objet « Signalement de sécurité ». Décrivez la faille et la manière de la reproduire. Nous accusons
          réception sous 72 heures et vous tenons informé de la correction.
        </p>
        <p>
          Merci de ne pas divulguer la faille publiquement avant sa correction, et de ne pas accéder à des données qui ne
          sont pas les vôtres. Les coordonnées de signalement sont aussi publiées au format standard dans{" "}
          <a href="/.well-known/security.txt">security.txt</a>.
        </p>
      </>
    ),
  },
  {
    id: "incident",
    title: "En cas d'incident",
    content: (
      <p>
        Si un incident de sécurité venait à toucher des données personnelles, nous préviendrions les personnes concernées
        et l&apos;autorité compétente dans les meilleurs délais, en expliquant ce qui s&apos;est passé et ce que nous
        faisons pour y remédier. Vos droits sont rappelés dans la{" "}
        <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.
      </p>
    ),
  },
];

export default function SecurityPage() {
  return (
    <LegalPage
      title="Sécurité des données"
      path={path}
      intro="Confier les devoirs de son enfant à un outil, c'est lui accorder sa confiance. Voici ce qui protège vos données, aujourd'hui et demain."
      summary={[
        "Le site est servi uniquement en connexion chiffrée (HTTPS).",
        "Il ne crée aucun compte et n'enregistre aucun formulaire : il n'y a pas de base de visiteurs à pirater.",
        "L'application est conçue pour collecter le strict nécessaire et laisser la main aux parents.",
        "Une faille à signaler ? Écrivez-nous, nous répondons sous 72 heures.",
      ]}
      sections={sections}
    />
  );
}
