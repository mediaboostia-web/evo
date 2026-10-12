"use client";

import { ArrowRight, CheckCircle, EnvelopeSimple, WhatsappLogo } from "@phosphor-icons/react";
import { useId, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { site, whatsappLink } from "@/lib/site";

const profiles = ["Parent", "Élève", "École ou partenaire"] as const;
const levels = ["Primaire", "Collège", "Lycée"] as const;

type Channel = "whatsapp" | "email";

function buildMessage(name: string, profile: string, level: string) {
  const lines = [
    "Bonjour Evo,",
    `Je souhaite réserver une place en accès anticipé.`,
    `Prénom : ${name}`,
    `Profil : ${profile}`,
  ];
  if (level) lines.push(`Niveau : ${level}`);
  return lines.join("\n");
}

function Choice({
  name,
  value,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label
      className={cn(
        "flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border-2 px-3 text-center text-[0.9375rem] leading-tight font-bold transition-colors duration-200 has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-evo-600",
        checked ? "border-evo-600 bg-evo-100 text-evo-800" : "border-line-soft bg-white text-copy hover:border-line",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {value}
    </label>
  );
}

/**
 * Réservation d'une place en accès anticipé.
 * Le formulaire prépare un message et l'ouvre dans WhatsApp (ou dans la messagerie) :
 * rien n'est envoyé ni enregistré par le site, c'est le visiteur qui expédie son message.
 */
export function ContactForm() {
  const id = useId();
  const [name, setName] = useState("");
  const [profile, setProfile] = useState<string>(profiles[0]);
  const [level, setLevel] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState<Channel | null>(null);

  const send = (channel: Channel) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Indiquez votre prénom pour que nous sachions à qui répondre.");
      document.getElementById(`${id}-name`)?.focus();
      return;
    }
    setError("");
    const message = buildMessage(trimmed, profile, level);
    const url =
      channel === "whatsapp"
        ? whatsappLink(message)
        : `mailto:${site.contact.email}?subject=${encodeURIComponent("Réserver une place en accès anticipé")}&body=${encodeURIComponent(message)}`;
    if (channel === "whatsapp") window.open(url, "_blank", "noopener,noreferrer");
    else window.location.href = url;
    setSent(channel);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send("whatsapp");
  };

  if (sent) {
    return (
      <div role="status" className="on-light flex h-full flex-col items-start justify-center rounded-[1.75rem] bg-white p-6 text-ink sm:p-9 md:rounded-[2rem]">
        <span className="flex size-14 items-center justify-center rounded-full bg-ok-soft text-ok">
          <CheckCircle weight="fill" className="size-8" aria-hidden />
        </span>
        <h3 className="text-h3 mt-6">Votre message est prêt, {name.trim()}.</h3>
        <p className="mt-3 text-copy">
          {sent === "whatsapp"
            ? "Il vient de s'ouvrir dans WhatsApp. Il ne reste qu'à appuyer sur Envoyer : nous vous répondons et vous prévenons dès l'ouverture."
            : "Il vient de s'ouvrir dans votre messagerie. Il ne reste qu'à l'envoyer : nous vous répondons et vous prévenons dès l'ouverture."}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => send(sent)} className={buttonClass("primary", "md")}>
            Rouvrir le message
          </button>
          <button type="button" onClick={() => setSent(null)} className={buttonClass("outline", "md")}>
            Modifier mes informations
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="on-light rounded-[1.75rem] bg-white p-6 text-ink sm:p-9 md:rounded-[2rem]"
      aria-labelledby={`${id}-title`}
    >
      <h3 id={`${id}-title`} className="text-h3">
        Réservez votre place
      </h3>
      <p className="mt-2 text-copy">Gratuit, sans engagement. Trente secondes.</p>

      <div className="mt-7 flex flex-col gap-2">
        <label htmlFor={`${id}-name`} className="font-bold text-ink">
          Votre prénom
        </label>
        <input
          id={`${id}-name`}
          name="prenom"
          type="text"
          autoComplete="given-name"
          autoCapitalize="words"
          enterKeyHint="send"
          required
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError("");
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "min-h-13 w-full rounded-2xl border-2 bg-white px-4 text-base text-ink transition-colors duration-200 placeholder:text-muted focus:border-evo-600 focus:outline-none",
            error ? "border-warn" : "border-line",
          )}
        />
        {error ? (
          <p id={`${id}-error`} role="alert" className="text-[0.9375rem] font-bold text-warn">
            {error}
          </p>
        ) : null}
      </div>

      <fieldset className="mt-6">
        <legend className="font-bold text-ink">Vous êtes</legend>
        <div className="mt-2 grid grid-cols-1 gap-2 min-[400px]:grid-cols-3">
          {profiles.map((value) => (
            <Choice key={value} name="profil" value={value} checked={profile === value} onChange={setProfile} />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-bold text-ink">
          Niveau concerné <span className="font-normal text-muted">(facultatif)</span>
        </legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {levels.map((value) => (
            <Choice key={value} name="niveau" value={value} checked={level === value} onChange={setLevel} />
          ))}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-col gap-3">
        <button type="submit" className={buttonClass("primary", "lg", "w-full")}>
          <WhatsappLogo weight="fill" className="size-5" aria-hidden />
          Réserver ma place
          <ArrowRight
            weight="bold"
            className="size-[1.125rem] transition-transform duration-200 group-hover/btn:translate-x-1"
            aria-hidden
          />
        </button>
        <button type="button" onClick={() => send("email")} className={buttonClass("outline", "lg", "w-full")}>
          <EnvelopeSimple weight="bold" className="size-5" aria-hidden />
          Envoyer par e-mail
        </button>
      </div>

      <p className="mt-5 text-sm text-muted">
        Votre message s&apos;ouvre dans WhatsApp ou dans votre messagerie : c&apos;est vous qui l&apos;envoyez. Ce site
        n&apos;enregistre rien.
      </p>
    </form>
  );
}
