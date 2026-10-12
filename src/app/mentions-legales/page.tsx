import { Fill, LegalPage, type LegalSection } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

const path = "/mentions-legales";
const { legal } = site;

export const metadata = pageMetadata({
  title: "Mentions légales",
  description:
    "Éditeur, directeur de la publication, hébergeur et propriété intellectuelle du site Evo, Mon Répétiteur Virtuel.",
  path,
});

const sections: LegalSection[] = [
  {
    id: "editeur",
    title: "Éditeur du site",
    content: (
      <>
        <p>
          Le site {site.url.replace("https://", "")} est édité par <strong>{site.legalName}</strong>.
        </p>
        <ul>
          <li>
            Forme juridique : <Fill value={legal.companyForm} label="forme juridique et capital" />
          </li>
          <li>
            Siège social : <Fill value={legal.address} label="adresse du siège" />
          </li>
          <li>
            RCCM : <Fill value={legal.rccm} label="numéro RCCM" />
          </li>
          <li>
            NIF : <Fill value={legal.nif} label="numéro d'identification fiscale" />
          </li>
          <li>
            Téléphone : <a href={`tel:${site.contact.phoneE164}`}>{site.contact.phoneDisplay}</a>
          </li>
          <li>
            E-mail : <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "publication",
    title: "Directeur de la publication",
    content: (
      <p>
        <Fill value={legal.publisher} label="nom et qualité du directeur de la publication" />
      </p>
    ),
  },
  {
    id: "hebergeur",
    title: "Hébergeur",
    content: (
      <ul>
        <li>
          Société : <Fill value={legal.host.name} label="nom de l'hébergeur" />
        </li>
        <li>
          Adresse : <Fill value={legal.host.address} label="adresse de l'hébergeur" />
        </li>
        <li>
          Site : <Fill value={legal.host.website} label="site de l'hébergeur" />
        </li>
      </ul>
    ),
  },
  {
    id: "propriete",
    title: "Propriété intellectuelle",
    content: (
      <>
        <p>
          Le nom Evo, le logo, la mascotte, les textes et la structure de ce site sont la propriété de {site.legalName}.
          Toute reproduction ou réutilisation, totale ou partielle, sans autorisation écrite préalable est interdite.
        </p>
        <p>
          Les maquettes d&apos;interface et les chiffres signalés par la mention « Illustration » ou « Données
          d&apos;illustration » présentent le fonctionnement prévu d&apos;Evo. Ils ne constituent pas des résultats
          mesurés.
        </p>
      </>
    ),
  },
  {
    id: "credits",
    title: "Crédits",
    content: (
      <ul>
        <li>Photographies : images d&apos;illustration.</li>
        <li>
          Polices : Gabarito et Atkinson Hyperlegible, sous licence libre SIL Open Font License. Atkinson
          Hyperlegible a été conçue par le Braille Institute pour les lecteurs malvoyants.
        </li>
        <li>Icônes : Phosphor Icons, sous licence MIT.</li>
      </ul>
    ),
  },
  {
    id: "liens",
    title: "Liens vers d'autres sites",
    content: (
      <p>
        Ce site contient des liens vers des services tiers, notamment WhatsApp et Facebook. {site.legalName} n&apos;est pas
        responsable de leur contenu ni de leurs pratiques en matière de données.
      </p>
    ),
  },
  {
    id: "droit",
    title: "Droit applicable",
    content: (
      <p>
        Ce site et les présentes mentions sont soumis au droit gabonais. En cas de litige, et à défaut d&apos;accord
        amiable, les tribunaux gabonais sont compétents.
      </p>
    ),
  },
];

export default function LegalNoticePage() {
  return (
    <LegalPage
      title="Mentions légales"
      path={path}
      intro="Qui édite ce site, qui l'héberge, et à qui appartient ce que vous y voyez."
      sections={sections}
    />
  );
}
