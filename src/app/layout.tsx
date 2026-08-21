import type { Metadata } from "next";
import { Bricolage_Grotesque, Atkinson_Hyperlegible, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  variable: "--font-body",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Up — Real life skills, taught step by step",
  description:
    "Learn practical life skills like changing a tire, wiring a plug, and more through step-by-step tutorials with an AI mentor that adapts to your age.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${atkinsonHyperlegible.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
          THESIS: Tutorials are seed packets, not SaaS cards — an enticing front you'd
          pick up, an instructional back you'd actually follow. Refuses the generic
          edtech card-grid-with-one-soft-accent default.
          OWN-WORLD: Tomato red is the only interactive signal; pea-green, sunflower-gold,
          rust, teal, and berry live only on packet-front category art, never on chrome.
          Kraft-buff paper ground, warm charcoal ink, galvanized-steel structural bar.
          Bricolage Grotesque display, Atkinson Hyperlegible body, JetBrains Mono for counts.
          STORY: A parent or kid sees real tasks framed as approachable, provable skills,
          trusts the mentor adapts to them, and starts growing their first skill.
          FIRST VIEWPORT: A steel header bar above a kraft-ground seed rack of category
          cards; the lead card flips open to its instructional back showing the live
          mentor chat; primary CTA in tomato red, upper right.
          FORM: The Seed Rack — challenger-fused, won the concept-seed roll on audience
          identification and product clarity over the assigned Field Manual direction;
          seed key 7ff64c92.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the
          finish review, the verdict, DESIGN.md, and every shipping raster carrying
          its provenance.
        */}
        {children}
      </body>
    </html>
  );
}
