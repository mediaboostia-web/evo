import { homeGraph, JsonLd } from "@/components/seo/JsonLd";
import { Accessibility } from "@/components/sections/Accessibility";
import { Audiences } from "@/components/sections/Audiences";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { Film } from "@/components/sections/Film";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Problem } from "@/components/sections/Problem";
import { Process } from "@/components/sections/Process";
import { Solution } from "@/components/sections/Solution";

/**
 * La page répond aux questions du visiteur dans l'ordre où il se les pose :
 * c'est quoi, montrez-moi, qui êtes-vous, pourquoi, comment, qu'est-ce qui vous rend unique,
 * est-ce pour moi, et après, et si, je fais quoi maintenant.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Film />
      <Manifesto />
      <Problem />
      <Solution />
      <Accessibility />
      <Audiences />
      <Process />
      <Faq />
      <Contact />
      <JsonLd data={homeGraph} />
    </>
  );
}
