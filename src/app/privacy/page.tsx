import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy & Zero-Upload GDPR Architecture",
  description:
    "How eu2027.aabready.com processes XRechnung, Peppol UBL, ZUGFeRD XML invoices and EU Battery QR data 100% client-side with zero server uploads.",
  alternates: {
    canonical: "https://eu2027.aabready.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10 space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-950">
          Privacy Policy & GDPR Architecture
        </h1>
        <p className="text-sm text-slate-500">Last updated: November 19, 2026</p>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-bold text-slate-900 text-base mb-1">
              1. Zero Server Uploads (100% Client-Side Processing)
            </h2>
            <p>
              All tools on <strong>eu2027.aabready.com</strong>—including the EU E-Invoice XML
              Viewer, EN 16931 Validator, CSV/PDF Exporter, and EU 2027 Battery QR Generator—run
              exclusively inside your web browser using local JavaScript and native browser APIs.
              Uploaded XML invoices, IBAN numbers, VAT IDs, and product serial numbers are never
              transmitted to or stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-900 text-base mb-1">
              2. Cookies & Tracking
            </h2>
            <p>
              We do not store your invoice files in cookies, localStorage, or remote databases.
              Closing or refreshing the browser tab immediately clears parsed document data from
              memory.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-900 text-base mb-1">
              3. Accuracy & Disclaimer
            </h2>
            <p>
              Validation checks (such as EN 16931 structural checks and EU Battery Regulation
              2023/1542 summaries) are provided for operational convenience and pre-flight review.
              Always verify final statutory filings with your local tax advisor, ERP provider, or
              authorized EU compliance body.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-slate-900 text-base mb-1">
              4. Contact
            </h2>
            <p>
              For technical questions or bulk compliance tooling inquiries, contact{" "}
              <a
                href="mailto:support@aabready.com"
                className="text-blue-600 underline font-medium"
              >
                support@aabready.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <span>© 2026–2027 eu2027.aabready.com — Private EU Compliance Tools</span>
          <span>Zero server storage • GDPR friendly by design</span>
        </div>
      </footer>
    </div>
  );
}