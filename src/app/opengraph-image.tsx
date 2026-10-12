import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/** Carte de partage (WhatsApp, Facebook, LinkedIn, X), générée à la compilation. */
export const alt = `${site.fullName} : ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [bold, medium, phone] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/Gabarito-ExtraBold.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/Gabarito-Medium.ttf")),
    readFile(join(process.cwd(), "public/brand/evo-app-phone.png")),
  ]);
  const phoneSrc = `data:image/png;base64,${phone.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0a1230",
          backgroundImage:
            "radial-gradient(circle at 82% 38%, rgba(0,103,255,0.62), rgba(10,18,48,0) 55%), linear-gradient(180deg, #070614 0%, #0d1a47 100%)",
          color: "#ffffff",
          fontFamily: "Gabarito",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 0 0 80px",
            width: 800,
          }}
        >
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "10px 22px",
              borderRadius: 999,
              border: "1.5px solid rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.07)",
              color: "#3ad8fb",
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Le répétiteur IA inclusif du Gabon
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 34,
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -3,
            }}
          >
            <span>Un répétiteur</span>
            <span>pour chaque élève.</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 30,
              fontSize: 31,
              fontWeight: 500,
              color: "#a9b8d8",
              lineHeight: 1.35,
            }}
          >
            <span>Evo explique, fait pratiquer et corrige.</span>
            <span>Du primaire au lycée, à toute heure.</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 46, fontSize: 28, fontWeight: 800 }}>
            <span>évo</span>
            <span style={{ margin: "0 16px", width: 6, height: 6, borderRadius: 6, backgroundColor: "#3ad8fb" }} />
            <span style={{ fontWeight: 500, color: "#a9b8d8" }}>Mon Répétiteur Virtuel</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 70,
            top: 54,
            width: 370,
            height: 660,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={phoneSrc} width={370} height={662} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Gabarito", data: bold, weight: 800, style: "normal" },
        { name: "Gabarito", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
