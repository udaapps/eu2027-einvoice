import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://eu2027.aabready.com"),
  title:
    "Free Private EU E-Invoice XML Viewer & PDF Converter | XRechnung, Peppol & ZUGFeRD",
  description:
    "View, validate (EN 16931), and convert XRechnung, Peppol BIS 3.0 UBL, and ZUGFeRD/Factur-X CII XML invoices to printable PDF 100% offline in your browser. Zero server uploads.",
  keywords: [
    "XRechnung XML viewer",
    "Peppol XML to PDF",
    "ZUGFeRD XML reader",
    "EN 16931 invoice validator",
    "EU e-invoicing 2027 tool",
    "private client-side e-invoice viewer",
  ],
  alternates: {
    canonical: "https://eu2027.aabready.com",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}