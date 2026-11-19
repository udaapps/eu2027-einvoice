import type { Metadata } from "next";
import DeInvoiceApp from "@/components/DeInvoiceApp";

export const metadata: Metadata = {
  title:
    "E-Rechnung Viewer kostenlos: XRechnung & ZUGFeRD XML öffnen (PDF)",
  description:
    "Kostenloser E-Rechnung Viewer online: XRechnung 3.0, ZUGFeRD & Peppol XML sofort im Browser öffnen, nach EN 16931 prüfen und als PDF oder CSV speichern. 100 % lokal ohne Upload.",
  keywords: [
    "e-rechnung viewer",
    "e-rechnung viewer kostenlos",
    "xrechnung viewer",
    "xrechnung viewer kostenlos",
    "xrechnung öffnen",
    "zugferd viewer",
    "zugferd xml viewer",
    "elster e rechnung viewer alternative",
    "xrechnung in pdf umwandeln",
  ],
  alternates: {
    canonical: "https://eu2027.aabready.com/de",
    languages: {
      de: "https://eu2027.aabready.com/de",
      en: "https://eu2027.aabready.com",
    },
  },
  openGraph: {
    title: "E-Rechnung Viewer kostenlos – XRechnung & ZUGFeRD XML öffnen",
    description:
      "XRechnung und ZUGFeRD XML-Rechnungen 100 % lokal im Browser anzeigen, prüfen und als PDF drucken. DSGVO-konform ohne Server-Upload.",
    url: "https://eu2027.aabready.com/de",
    locale: "de_DE",
    type: "website",
  },
};

const DE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Kostenloser E-Rechnung Viewer (XRechnung & ZUGFeRD)",
      url: "https://eu2027.aabready.com/de",
      inLanguage: "de",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      description:
        "100 % lokaler Browser-Viewer zum kostenlosen Öffnen, Prüfen (EN 16931) und PDF-Exportieren von XRechnung, ZUGFeRD und Peppol XML-Rechnungen.",
    },
    {
      "@type": "FAQPage",
      inLanguage: "de",
      mainEntity: [
        {
          "@type": "Question",
          name: "Wie kann ich eine XRechnung XML-Datei kostenlos öffnen?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ziehen Sie Ihre .xml-Datei einfach in das Upload-Feld. Der XRechnung Viewer liest die Datei sofort lokal im Browser aus und stellt alle Positionen, Steuersätze, Leitweg-ID und IBAN übersichtlich dar.",
          },
        },
        {
          "@type": "Question",
          name: "Kann ich eine XRechnung oder ZUGFeRD XML als PDF speichern?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ja. Nach dem Öffnen klicken Sie auf Als PDF speichern / Drucken und wählen im Druckdialog Ihres Browsers Als PDF speichern. Zusätzlich steht ein CSV-Export bereit.",
          },
        },
        {
          "@type": "Question",
          name: "Was ist der Unterschied zum ELSTER E-Rechnung Viewer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Unser Online-Viewer funktioniert ohne Login, ohne Installation und zeigt direkt die EN 16931 Pflichtfelder (inkl. BR-DE-15 Leitweg-ID und Summenprüfung) komplett lokal im Browser an.",
          },
        },
      ],
    },
  ],
};

export default function DePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(DE_JSON_LD) }}
      />
      <DeInvoiceApp />
    </>
  );
}