import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BatteryQrTool from "@/components/BatteryQrTool";

export const metadata: Metadata = {
  title: "EU Battery Regulation 2027 Compliance Checker & QR Passport Generator",
  description:
    "Check February 18, 2027 EU Battery Regulation (EU) 2023/1542 obligations for Portable, LMT, EV, and Industrial batteries and generate vector QR labels 100% client-side.",
  alternates: {
    canonical: "https://eu2027.aabready.com/battery-qr-2027",
  },
};

export default function BatteryQrPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        <header className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            EU Regulation (EU) 2023/1542 • Deadline: February 18, 2027
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            EU 2027 Battery Compliance Checker & QR Label Generator
          </h1>
          <p className="text-slate-600 text-base">
            Verify whether your product requires a <strong>Digital Battery Passport</strong> or{" "}
            <strong>user-replaceable battery design</strong> by February 18, 2027, and generate
            print-ready SVG/PNG GS1 Digital Link QR codes locally in your browser.
          </p>
        </header>

        <BatteryQrTool />

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-bold text-slate-900 mb-2">
              February 18, 2027 Milestone
            </h2>
            <p className="text-sm text-slate-600">
              Under Regulation (EU) 2023/1542, every EV battery, LMT (e-bike/e-scooter) battery, and
              industrial battery over 2 kWh placed on the EU market must carry a scannable QR code
              linking to a Digital Battery Passport.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-bold text-slate-900 mb-2">
              Article 11 Removability
            </h2>
            <p className="text-sm text-slate-600">
              Portable batteries incorporated into consumer products sold in the European Union must
              be readily removable and replaceable by end-users using commercially available tools
              from February 18, 2027.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-bold text-slate-900 mb-2">
              100% Local QR Generation
            </h2>
            <p className="text-sm text-slate-600">
              Your GTIN, batch serial numbers, and internal product URLs are never transmitted to
              any third-party server. All SVG and PNG QR labels render directly inside your browser.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <span>© 2026–2027 eu2027.aabready.com — Private EU Compliance Tools</span>
          <span>Informational utility • Not formal legal advice</span>
        </div>
      </footer>
    </div>
  );
}