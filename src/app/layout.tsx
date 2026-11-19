import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://eu2027.aabready.com"),
  title: {
    default:
      "Free Private EU E-Invoice XML Viewer & PDF Converter | XRechnung, Peppol & ZUGFeRD",
    template: "%s | EU2027.aabready",
  },
  description:
    "View, validate (EN 16931), and convert XRechnung, Peppol BIS 3.0 UBL, and ZUGFeRD/Factur-X CII XML invoices to printable PDF 100% offline in your browser. Zero server uploads.",
  keywords: [
    "XRechnung XML viewer",
    "Peppol XML to PDF",
    "ZUGFeRD XML reader",
    "EN 16931 invoice validator",
    "EU e-invoicing 2027 tool",
    "EU battery passport QR generator 2027",
  ],
  alternates: {
    canonical: "https://eu2027.aabready.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "100% Private EU E-Invoice XML Viewer & EN 16931 Validator",
    description:
      "Inspect XRechnung, Peppol UBL & ZUGFeRD XML invoices locally in your browser and export clean PDFs without uploading financial data.",
    url: "https://eu2027.aabready.com",
    siteName: "EU 2027 Compliance Tools by AABReady",
    type: "website",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "EU 2027 Private E-Invoice XML Viewer & Validator",
      url: "https://eu2027.aabready.com",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      description:
        "100% browser-based viewer, EN 16931 validator, and PDF/CSV converter for XRechnung, Peppol BIS 3.0 UBL, and ZUGFeRD CII XML invoices.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Are my XML invoices uploaded to a server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. All XML parsing, EN 16931 validation, CSV generation, and PDF rendering execute strictly inside your local browser memory using the native DOMParser API. Your financial data never leaves your device.",
          },
        },
        {
          "@type": "Question",
          name: "Which 2027 EU e-invoicing formats are supported?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The tool supports XRechnung 3.0 (UBL and CII), Peppol BIS Billing 3.0 (UBL 2.1), and ZUGFeRD / Factur-X (UN/CEFACT CrossIndustryInvoice XML).",
          },
        },
        {
          "@type": "Question",
          name: "When do the mandatory EU 2027 e-invoicing rules take effect?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "From January 1, 2027, Germany removes the paper and PDF e-invoicing transition exemption for businesses with annual turnover above €800,000, while countries such as Poland (KSeF) and France (September 2027 SME phase) roll out mandatory structured B2B e-invoicing.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}