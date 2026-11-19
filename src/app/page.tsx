"use client";

import { useState, useRef } from "react";
import {
  Upload,
  ShieldCheck,
  Printer,
  Download,
  FileText,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { ParsedInvoice } from "@/lib/types";
import { generateInvoiceCsv, parseEuInvoiceXml } from "@/lib/xmlParser";
import { SAMPLE_XRECHNUNG_XML } from "@/lib/sampleXml";
import InvoicePreview from "@/components/InvoicePreview";
import ValidationPanel from "@/components/ValidationPanel";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const [invoice, setInvoice] = useState<ParsedInvoice | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processXmlString = (content: string, name: string) => {
    try {
      setError("");
      const parsed = parseEuInvoiceXml(content);
      setInvoice(parsed);
      setFileName(name);
    } catch (err) {
      setInvoice(null);
      setError(err instanceof Error ? err.message : "Failed to parse XML file.");
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".xml")) {
      setError("Please select a valid .xml e-invoice file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = String(e.target?.result || "");
      processXmlString(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDownloadCsv = () => {
    if (!invoice) return;
    const csv = generateInvoiceCsv(invoice);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoiceNumber || "eu-invoice"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Shared Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <header className="no-print text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            Ready for the Jan 1, 2027 EU E-Invoicing Mandate
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Private EU E-Invoice XML Viewer, Validator &amp; PDF Converter
          </h1>
          <p className="text-slate-600 text-base">
            Instantly inspect <strong>XRechnung</strong>, <strong>Peppol BIS 3.0 (UBL)</strong>, and{" "}
            <strong>ZUGFeRD / Factur-X (CII)</strong> XML files. Runs completely offline in your
            browser—your financial data never leaves your device.
          </p>
        </header>

        {/* Upload Dropzone */}
        {!invoice && (
          <section className="no-print max-w-2xl mx-auto">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                isDragging
                  ? "border-blue-600 bg-blue-50/70"
                  : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xml,text/xml,application/xml"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-lg font-semibold text-slate-900">
                Drop your E-Invoice XML file here, or click to browse
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Supports UBL 2.1, Peppol BIS 3.0, XRechnung 3.0 &amp; UN/CEFACT CII (.xml)
              </p>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() =>
                  processXmlString(SAMPLE_XRECHNUNG_XML, "sample-xrechnung-3.0.xml")
                }
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Try with a Sample XRechnung 3.0 XML Invoice
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium text-center">
                {error}
              </div>
            )}
          </section>
        )}

        {/* Active Invoice Workspace */}
        {invoice && (
          <section className="space-y-6">
            {/* Action Toolbar */}
            <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-mono font-medium text-slate-900 truncate max-w-[220px]">
                  {fileName}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Save as PDF / Print
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInvoice(null);
                    setFileName("");
                    setError("");
                  }}
                  className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-medium px-3.5 py-2 rounded-xl transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  New File
                </button>
              </div>
            </div>

            {/* EN 16931 Validation */}
            <ValidationPanel
              issues={invoice.validation}
              format={invoice.format}
            />

            {/* Printable Invoice */}
            <InvoicePreview invoice={invoice} />
          </section>
        )}

        {/* Monetization / B2B Pro Banner */}
        <section className="no-print bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              For Accountants &amp; EU Businesses
            </span>
            <h2 className="text-xl font-bold">
              Need Bulk XML-to-PDF Conversion or ERP Automation?
            </h2>
            <p className="text-slate-300 text-sm">
              Single invoice inspection and PDF conversion here is always free. Preparing for the
              2027 Germany, Poland, or France B2B e-invoicing rollout? Get notified when our Bulk
              Batch Converter &amp; DATEV CSV Pack launches.
            </p>
          </div>
          <a
            href="mailto:support@aabready.com?subject=EU%202027%20Bulk%20E-Invoice%20Pro"
            className="shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm px-5 py-3 rounded-xl transition"
          >
            Request Bulk Pro Access →
          </a>
        </section>

        {/* SEO Content Cards */}
        <section className="no-print grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">
              Why 100% Client-Side Privacy Matters
            </h3>
            <p className="text-sm text-slate-600">
              E-invoices contain sensitive IBAN numbers, VAT IDs, and B2B pricing. Unlike cloud
              converters, this tool parses XML strictly inside your local browser memory—making it
              GDPR-friendly by design.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">
              2027 EU Mandate Deadlines
            </h3>
            <p className="text-sm text-slate-600">
              From <strong>January 1, 2027</strong>, Germany removes the paper/PDF transition
              exemption for businesses above €800,000 turnover, while Poland (KSeF) and other EU
              states enforce structured EN 16931 e-invoicing.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">
              Supported European Formats
            </h3>
            <p className="text-sm text-slate-600">
              Automatically detects and visualizes <strong>XRechnung 3.0</strong>,{" "}
              <strong>Peppol BIS Billing 3.0 (UBL 2.1)</strong>, and{" "}
              <strong>ZUGFeRD / Factur-X (UN/CEFACT CII)</strong> XML files.
            </p>
          </div>
        </section>

        {/* 2027 EU Country E-Invoicing Reference Table */}
        <section className="no-print bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            2027 European B2B E-Invoicing Mandate Timeline
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2.5 pr-4">Country</th>
                  <th className="py-2.5 pr-4">Key 2027 Milestone</th>
                  <th className="py-2.5 pr-4">Standard / Format</th>
                  <th className="py-2.5">Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 pr-4 font-semibold text-slate-900">Germany</td>
                  <td className="py-3 pr-4">January 1, 2027</td>
                  <td className="py-3 pr-4 font-mono text-xs">XRechnung / ZUGFeRD (EN 16931)</td>
                  <td className="py-3">Mandatory B2B issuance for companies &gt; €800k turnover</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-slate-900">Poland</td>
                  <td className="py-3 pr-4">2026–2027 KSeF Rollout</td>
                  <td className="py-3 pr-4 font-mono text-xs">FA(3) Structured XML</td>
                  <td className="py-3">National e-invoicing system expansion including micro-SMEs</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-slate-900">France</td>
                  <td className="py-3 pr-4">September 1, 2027</td>
                  <td className="py-3 pr-4 font-mono text-xs">Factur-X (CII) / UBL</td>
                  <td className="py-3">Mandatory B2B e-invoice issuance for SMEs &amp; micro-enterprises</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-slate-900">Belgium &amp; EU Peppol</td>
                  <td className="py-3 pr-4">Active / Ongoing 2027</td>
                  <td className="py-3 pr-4 font-mono text-xs">Peppol BIS Billing 3.0 (UBL 2.1)</td>
                  <td className="py-3">Structured B2B exchange over the Peppol network</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Visible FAQ Matching JSON-LD Schema */}
        <section className="no-print bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900">
                Are my XML invoices uploaded to a server?
              </h3>
              <p className="text-slate-600 mt-1">
                No. All XML parsing, EN 16931 validation, CSV generation, and PDF rendering execute
                strictly inside your local browser memory using the native DOMParser API. Your
                financial data never leaves your device.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                Which 2027 EU e-invoicing formats are supported?
              </h3>
              <p className="text-slate-600 mt-1">
                The tool supports XRechnung 3.0 (UBL and CII), Peppol BIS Billing 3.0 (UBL 2.1), and
                ZUGFeRD / Factur-X (UN/CEFACT CrossIndustryInvoice XML).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                When do the mandatory EU 2027 e-invoicing rules take effect?
              </h3>
              <p className="text-slate-600 mt-1">
                From January 1, 2027, Germany removes the paper and PDF e-invoicing transition
                exemption for businesses with annual turnover above €800,000, while countries such
                as Poland (KSeF) and France (September 2027 SME phase) roll out mandatory structured
                B2B e-invoicing.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <span>© 2026–2027 eu2027.aabready.com — Private EU Compliance Tools</span>
          <span>Zero cookies • Zero server storage • Built for EN 16931</span>
        </div>
      </footer>
    </div>
  );
}