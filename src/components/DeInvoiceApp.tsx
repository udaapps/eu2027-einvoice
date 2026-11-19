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
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { ParsedInvoice } from "@/lib/types";
import { generateInvoiceCsv, parseEuInvoiceXml } from "@/lib/xmlParser";
import { SAMPLE_XRECHNUNG_XML } from "@/lib/sampleXml";
import Navbar from "@/components/Navbar";

export default function DeInvoiceApp() {
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
    } catch {
      setInvoice(null);
      setError(
        "Ungültige XML-Datei. Bitte laden Sie eine gültige XRechnung-, ZUGFeRD- (CII) oder Peppol-UBL-XML-Datei hoch."
      );
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".xml")) {
      setError("Bitte wählen Sie eine gültige .xml E-Rechnungsdatei aus.");
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
    link.download = `${invoice.invoiceNumber || "e-rechnung"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatMoneyDe = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: currency || "EUR",
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${currency}`;
    }
  };

  const errorsCount =
    invoice?.validation.filter((i) => i.severity === "error").length ?? 0;
  const warningsCount =
    invoice?.validation.filter((i) => i.severity === "warning").length ?? 0;
  const passedCount =
    invoice?.validation.filter((i) => i.severity === "pass").length ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <header className="no-print text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" />
            100 % Lokal im Browser • DSGVO-konform • E-Rechnungspflicht 2027
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            E-Rechnung Viewer kostenlos – XRechnung &amp; ZUGFeRD XML öffnen
          </h1>
          <p className="text-slate-600 text-base">
            Öffnen, prüfen (EN 16931) und drucken Sie{" "}
            <strong>XRechnung 3.0</strong>, <strong>ZUGFeRD / Factur-X</strong>{" "}
            und <strong>Peppol UBL</strong> XML-Rechnungen sofort als PDF oder
            CSV. Ohne Server-Upload – Ihre Rechnungsdaten bleiben auf Ihrem
            Gerät.
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
                XRechnung oder ZUGFeRD XML-Datei hier ablegen oder auswählen
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Unterstützt XRechnung (UBL &amp; CII), ZUGFeRD / Factur-X &amp;
                Peppol BIS 3.0 (.xml)
              </p>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={() =>
                  processXmlString(
                    SAMPLE_XRECHNUNG_XML,
                    "beispiel-xrechnung-3.0.xml"
                  )
                }
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Mit Beispiel-XRechnung 3.0 testen
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
            {/* Toolbar */}
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
                  Als PDF speichern / Drucken
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  CSV Export (Buchhaltung)
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
                  Neue Datei
                </button>
              </div>
            </div>

            {/* German EN 16931 Validation Panel */}
            <div className="no-print bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    EN 16931 &amp; XRechnung Strukturprüfung
                  </h2>
                  <p className="text-sm text-slate-500">
                    Erkanntes Format:{" "}
                    <span className="font-semibold text-blue-700">
                      {invoice.format}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {passedCount} Bestanden
                  </span>
                  {warningsCount > 0 && (
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {warningsCount} Hinweise
                    </span>
                  )}
                  {errorsCount > 0 ? (
                    <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {errorsCount} Fehler
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      EN 16931 Konform
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {invoice.validation.map((issue) => (
                  <div
                    key={issue.ruleId}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-sm ${
                      issue.severity === "pass"
                        ? "bg-slate-50 border-slate-200"
                        : issue.severity === "warning"
                        ? "bg-amber-50/60 border-amber-200"
                        : "bg-rose-50/60 border-rose-200"
                    }`}
                  >
                    {issue.severity === "pass" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {issue.severity === "warning" && (
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    {issue.severity === "error" && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{issue.title}</span>
                        <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                          {issue.ruleId}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs mt-0.5">
                        {issue.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* German Printable A4 Invoice Preview */}
            <div
              id="printable-invoice"
              className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm text-slate-800 print:border-0 print:shadow-none print:p-0 print:rounded-none"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6 mb-6">
                <div>
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded mb-2 print:border print:border-blue-200">
                    {invoice.format}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-950">
                    RECHNUNG Nr. {invoice.invoiceNumber || "—"}
                  </h2>
                  {invoice.buyerReference && (
                    <p className="text-xs text-slate-500 mt-1">
                      Leitweg-ID / Käuferreferenz:{" "}
                      <span className="font-mono font-medium text-slate-800">
                        {invoice.buyerReference}
                      </span>
                    </p>
                  )}
                </div>

                <div className="text-sm sm:text-right space-y-1">
                  <div>
                    <span className="text-slate-500">Rechnungsdatum: </span>
                    <span className="font-semibold text-slate-900">
                      {invoice.issueDate || "—"}
                    </span>
                  </div>
                  {invoice.dueDate && (
                    <div>
                      <span className="text-slate-500">Fälligkeitsdatum: </span>
                      <span className="font-semibold text-slate-900">
                        {invoice.dueDate}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500">Währung: </span>
                    <span className="font-semibold text-slate-900">
                      {invoice.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller & Buyer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl print:bg-transparent print:p-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Rechnungssteller (Verkäufer)
                  </p>
                  <p className="font-bold text-slate-900 text-base">
                    {invoice.seller.name || "Unbekannt"}
                  </p>
                  {invoice.seller.street && (
                    <p className="text-sm text-slate-600">
                      {invoice.seller.street}
                    </p>
                  )}
                  <p className="text-sm text-slate-600">
                    {[
                      invoice.seller.postalCode,
                      invoice.seller.city,
                      invoice.seller.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {invoice.seller.vatId && (
                    <p className="text-xs text-slate-600 mt-2">
                      USt-IdNr.:{" "}
                      <span className="font-mono font-semibold">
                        {invoice.seller.vatId}
                      </span>
                    </p>
                  )}
                  {invoice.seller.email && (
                    <p className="text-xs text-slate-500">
                      {invoice.seller.email}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-xl print:bg-transparent print:p-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Rechnungsempfänger (Käufer)
                  </p>
                  <p className="font-bold text-slate-900 text-base">
                    {invoice.buyer.name || "Unbekannt"}
                  </p>
                  {invoice.buyer.street && (
                    <p className="text-sm text-slate-600">
                      {invoice.buyer.street}
                    </p>
                  )}
                  <p className="text-sm text-slate-600">
                    {[
                      invoice.buyer.postalCode,
                      invoice.buyer.city,
                      invoice.buyer.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {invoice.buyer.vatId && (
                    <p className="text-xs text-slate-600 mt-2">
                      USt-IdNr.:{" "}
                      <span className="font-mono font-semibold">
                        {invoice.buyer.vatId}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Line Items */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                      <th className="py-3 pr-3">Pos.</th>
                      <th className="py-3 pr-3">Bezeichnung</th>
                      <th className="py-3 px-3 text-right">Menge</th>
                      <th className="py-3 px-3 text-right">Einzelpreis</th>
                      <th className="py-3 px-3 text-right">MwSt.</th>
                      <th className="py-3 pl-3 text-right">Nettobetrag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoice.lines.map((line) => (
                      <tr key={line.id}>
                        <td className="py-3 pr-3 text-slate-500 font-mono text-xs">
                          {line.id}
                        </td>
                        <td className="py-3 pr-3 font-medium text-slate-900">
                          {line.name}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {line.quantity}{" "}
                          <span className="text-xs text-slate-400">
                            {line.unitCode}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {formatMoneyDe(line.unitPrice, invoice.currency)}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {line.taxPercent} %
                        </td>
                        <td className="py-3 pl-3 text-right font-semibold text-slate-900 whitespace-nowrap">
                          {formatMoneyDe(line.lineTotal, invoice.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals & Payment */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6">
                <div className="text-sm space-y-1 max-w-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Zahlungsinformationen
                  </p>
                  {invoice.iban ? (
                    <p className="text-slate-700">
                      IBAN:{" "}
                      <span className="font-mono font-semibold">
                        {invoice.iban}
                      </span>
                    </p>
                  ) : (
                    <p className="text-slate-500 text-xs">
                      Keine IBAN in der XML-Datei angegeben.
                    </p>
                  )}
                  {invoice.paymentReference && (
                    <p className="text-slate-700">
                      Verwendungszweck:{" "}
                      <span className="font-mono">
                        {invoice.paymentReference}
                      </span>
                    </p>
                  )}
                </div>

                <div className="w-full sm:w-72 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Nettobetrag</span>
                    <span>
                      {formatMoneyDe(invoice.netTotal, invoice.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Umsatzsteuer (MwSt.)</span>
                    <span>
                      {formatMoneyDe(invoice.taxTotal, invoice.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-semibold border-t border-slate-200 pt-2">
                    <span>Bruttobetrag</span>
                    <span>
                      {formatMoneyDe(invoice.grossTotal, invoice.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-950 bg-slate-100 px-3 py-2 rounded-lg print:bg-transparent print:border print:border-slate-300">
                    <span>Zahlbetrag</span>
                    <span>
                      {formatMoneyDe(invoice.payableAmount, invoice.currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                <span>
                  Lokal visualisiert mit eu2027.aabready.com/de (Kein Upload)
                </span>
                <span>EN 16931 Ansicht</span>
              </div>
            </div>
          </section>
        )}

        {/* B2B Pro Banner */}
        <section className="no-print bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Für Steuerberater, Buchhaltung &amp; KMU
            </span>
            <h2 className="text-xl font-bold">
              Mehrere XRechnungen gleichzeitig in PDF oder DATEV-CSV umwandeln?
            </h2>
            <p className="text-slate-300 text-sm">
              Das einzelne Öffnen, Prüfen und Drucken von E-Rechnungen ist hier
              dauerhaft kostenlos. Für den Stapel-Export (Bulk XML-zu-PDF) vor
              dem 1. Januar 2027 können Sie frühzeitig Pro-Zugang anfragen.
            </p>
          </div>
          <a
            href="mailto:support@aabready.com?subject=EU%202027%20Bulk%20E-Rechnung%20Pro"
            className="shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm px-5 py-3 rounded-xl transition"
          >
            Bulk Pro anfragen →
          </a>
        </section>

        {/* German SEO Feature Cards */}
        <section className="no-print grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-bold text-slate-900 mb-2">
              DSGVO-sicher ohne Server-Upload
            </h2>
            <p className="text-sm text-slate-600">
              Im Gegensatz zu Cloud-Tools verarbeitet dieser kostenlose
              E-Rechnung Viewer Ihre XML-Datei ausschließlich lokal im
              Arbeitsspeicher Ihres Browsers – ideal für vertrauliche IBAN-,
              USt-IdNr.- und Preisdaten.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-bold text-slate-900 mb-2">
              XRechnung, ZUGFeRD &amp; ELSTER-Kompatibel
            </h2>
            <p className="text-sm text-slate-600">
              Erkennt automatisch <strong>XRechnung 3.0</strong> (UBL &amp; CII),{" "}
              <strong>ZUGFeRD / Factur-X</strong> sowie{" "}
              <strong>Peppol BIS 3.0</strong> – als schnelle, installationsfreie
              Alternative zu Desktop-Programmen wie dem ELSTER- oder Quba-Viewer.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h2 className="font-bold text-slate-900 mb-2">
              E-Rechnungspflicht ab 1. Januar 2027
            </h2>
            <p className="text-sm text-slate-600">
              Ab dem <strong>01.01.2027</strong> endet in Deutschland die
              Übergangsfrist für Unternehmen mit mehr als 800.000 €
              Vorjahresumsatz. Mit diesem Tool prüfen Sie strukturierte EN 16931
              XML-Rechnungen sofort ohne Installation.
            </p>
          </div>
        </section>

        {/* German FAQ matching Schema */}
        <section className="no-print bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Häufige Fragen zum E-Rechnung &amp; XRechnung Viewer
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900">
                Wie kann ich eine XRechnung XML-Datei kostenlos öffnen?
              </h3>
              <p className="text-slate-600 mt-1">
                Ziehen Sie Ihre <code>.xml</code>-Datei einfach in das
                Upload-Feld oben oder klicken Sie zum Auswählen. Der XRechnung
                Viewer liest die Datei sofort lokal im Browser aus und stellt
                alle Positionen, Steuersätze, Leitweg-ID und IBAN übersichtlich
                dar.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                Kann ich eine XRechnung oder ZUGFeRD XML als PDF speichern?
              </h3>
              <p className="text-slate-600 mt-1">
                Ja. Nach dem Öffnen klicken Sie auf{" "}
                <strong>„Als PDF speichern / Drucken“</strong> und wählen im
                Druckdialog Ihres Browsers „Als PDF speichern“. Zusätzlich steht
                ein CSV-Export für Excel und die Buchhaltung bereit.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                Was ist der Unterschied zum ELSTER E-Rechnung Viewer?
              </h3>
              <p className="text-slate-600 mt-1">
                Unser Online-Viewer funktioniert ohne Login, ohne Installation
                (Windows, Mac, Linux) und zeigt direkt die EN 16931
                Pflichtfelder (inkl. BR-DE-15 Leitweg-ID und Summenprüfung) an –
                komplett offline im Browser.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="no-print border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <span>
            © 2026–2027 eu2027.aabready.com/de — Kostenloser E-Rechnung Viewer
          </span>
          <span>Keine Cookies • Kein Server-Upload • EN 16931 &amp; XRechnung 3.0</span>
        </div>
      </footer>
    </div>
  );
}