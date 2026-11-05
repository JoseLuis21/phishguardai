import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PhishGuardAI",
    template: "%s · PhishGuardAI",
  },
  description:
    "Análisis con IA de los correos sospechosos reenviados a analisis.phishing@coplex.cl.",
};

/**
 * Runs before first paint so the page never flashes the wrong theme: a saved
 * choice wins, otherwise it follows the system and keeps following it.
 */
const SCRIPT_TEMA = `(function(){var d=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)");function g(){try{return localStorage.getItem("tema")}catch(e){return null}}function a(){var t=g();d.dataset.theme=t==="dark"||t==="light"?t:m.matches?"dark":"light"}a();m.addEventListener("change",function(){if(!g())a()})})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CL"
      className={`${archivo.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
