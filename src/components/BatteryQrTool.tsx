"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  BatteryCharging,
  CheckCircle2,
  AlertTriangle,
  Download,
  QrCode,
} from "lucide-react";

type BatteryCategory = "portable" | "lmt" | "ev" | "industrial_over_2kwh";

const CATEGORIES: Record<
  BatteryCategory,
  {
    label: string;
    passportRequired: boolean;
    replaceableRequired: boolean;
    summary: string;
  }
> = {
  portable: {
    label: "Portable Battery (≤ 5 kg — Electronics, Toys, Tools)",
    passportRequired: false,
    replaceableRequired: true,
    summary:
      "Must be readily removable and replaceable by the end-user from February 18, 2027. QR code label required on the battery/packaging.",
  },
  lmt: {
    label: "LMT Battery (E-Bikes, E-Scooters)",
    passportRequired: true,
    replaceableRequired: true,
    summary:
      "Requires BOTH an official Digital Battery Passport QR code AND independent replaceability by an independent professional from February 18, 2027.",
  },
  ev: {
    label: "Electric Vehicle (EV) Battery",
    passportRequired: true,
    replaceableRequired: false,
    summary:
      "Mandatory EU Digital Battery Passport accessible via permanent QR code starting February 18, 2027, including carbon footprint declaration.",
  },
  industrial_over_2kwh: {
    label: "Industrial Battery (> 2 kWh)",
    passportRequired: true,
    replaceableRequired: false,
    summary:
      "Mandatory Digital Battery Passport QR code, state-of-health (SoH) data access, and carbon footprint record from February 18, 2027.",
  },
};

export default function BatteryQrTool() {
  const [category, setCategory] = useState<BatteryCategory>("lmt");
  const [manufacturer, setManufacturer] = useState("EuroVolt Mobility GmbH");
  const [modelId, setModelId] = useState("EV-LMT-48V-2027");
  const [gtin, setGtin] = useState("04012345678901");
  const [serial, setSerial] = useState("SN-2027-00184");
  const [passportUrl, setPassportUrl] = useState(
    "https://passport.example.eu/01/04012345678901/21/SN-2027-00184"
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const activeRule = CATEGORIES[category];

  useEffect(() => {
    let cancelled = false;
    const payload = passportUrl.trim() || `https://eu2027.aabready.com/battery-qr-2027?gtin=${gtin}&sn=${serial}`;

    QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl("");
      });

    return () => {
      cancelled = true;
    };
  }, [passportUrl, gtin, serial]);

  const handleDownloadSvg = async () => {
    const payload =
      passportUrl.trim() ||
      `https://eu2027.aabready.com/battery-qr-2027?gtin=${gtin}&sn=${serial}`;
    const svgString = await QRCode.toString(payload, {
      type: "svg",
      margin: 2,
      errorCorrectionLevel: "M",
    });
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eu-battery-qr-${modelId || "label"}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <BatteryCharging className="w-5 h-5 text-blue-600" />
            <h2>1. Battery Classification & Label Data</h2>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Battery Category (EU Regulation 2023/1542)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BatteryCategory)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                {Object.entries(CATEGORIES).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Manufacturer / Brand
                </label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Model / SKU
                </label>
                <input
                  type="text"
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  GS1 GTIN (14-digit)
                </label>
                <input
                  type="text"
                  value={gtin}
                  onChange={(e) => setGtin(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Batch / Serial Number
                </label>
                <input
                  type="text"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Digital Passport / Compliance GS1 Digital Link URL
              </label>
              <input
                type="url"
                value={passportUrl}
                onChange={(e) => setPassportUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-xs text-slate-900"
              />
              <p className="text-xs text-slate-500 mt-1">
                Generated 100% locally in your browser. Compatible with ISO/IEC 18004 QR scanners.
              </p>
            </div>
          </div>
        </section>

        {/* Compliance Output + QR Preview */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <QrCode className="w-5 h-5 text-blue-600" />
              <h2>2. Feb 18, 2027 Readiness & QR Label</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                className={`p-3 rounded-xl border ${
                  activeRule.passportRequired
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-emerald-50 border-emerald-200 text-emerald-900"
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {activeRule.passportRequired ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  Digital Battery Passport
                </div>
                <p className="mt-1">
                  {activeRule.passportRequired
                    ? "Mandatory from Feb 18, 2027"
                    : "Not required (Standard QR label still applies)"}
                </p>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  activeRule.replaceableRequired
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Removability Rule (Art. 11)
                </div>
                <p className="mt-1">
                  {activeRule.replaceableRequired
                    ? "Must be removable/replaceable by Feb 18, 2027"
                    : "Exempt from consumer hand-tool removal rule"}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              {activeRule.summary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 border-t border-slate-200 pt-5">
            <div className="bg-white border-2 border-slate-900 rounded-xl p-3 text-center shrink-0">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`EU Battery QR label for ${modelId}`}
                  width={150}
                  height={150}
                  className="mx-auto"
                />
              ) : (
                <div className="w-[150px] h-[150px] bg-slate-100 rounded" />
              )}
              <p className="text-[10px] font-mono font-bold text-slate-900 mt-1">
                {modelId || "EU-BATTERY"}
              </p>
              <p className="text-[9px] text-slate-500 truncate max-w-[150px]">
                {manufacturer}
              </p>
            </div>

            <div className="space-y-3 text-sm w-full">
              <p className="text-slate-600 text-xs">
                Export crisp vector <strong>SVG</strong> for product packaging or high-res{" "}
                <strong>PNG</strong> for technical spec sheets.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs cursor-pointer transition"
                >
                  <Download className="w-4 h-4" />
                  Download Vector SVG
                </button>
                {qrDataUrl && (
                  <a
                    href={qrDataUrl}
                    download={`eu-battery-qr-${modelId || "label"}.png`}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl text-xs transition"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}