"use client";

import { ParsedInvoice } from "@/lib/types";

interface Props {
  invoice: ParsedInvoice;
}

export default function InvoicePreview({ invoice }: Props) {
  const formatMoney = (amount: number) => {
    try {
      return new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: invoice.currency || "EUR",
      }).format(amount);
    } catch {
      return `${amount.toFixed(2)} ${invoice.currency}`;
    }
  };

  return (
    <div
      id="printable-invoice"
      className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm text-slate-800 print:border-0 print:shadow-none print:p-0 print:rounded-none"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6 mb-6">
        <div>
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded mb-2 print:border print:border-blue-200">
            {invoice.format}
          </span>
          <h2 className="text-2xl font-bold text-slate-950">
            INVOICE #{invoice.invoiceNumber || "N/A"}
          </h2>
          {invoice.buyerReference && (
            <p className="text-xs text-slate-500 mt-1">
              Buyer Ref / Leitweg-ID:{" "}
              <span className="font-mono font-medium text-slate-800">
                {invoice.buyerReference}
              </span>
            </p>
          )}
        </div>

        <div className="text-sm sm:text-right space-y-1">
          <div>
            <span className="text-slate-500">Issue Date: </span>
            <span className="font-semibold text-slate-900">
              {invoice.issueDate || "—"}
            </span>
          </div>
          {invoice.dueDate && (
            <div>
              <span className="text-slate-500">Due Date: </span>
              <span className="font-semibold text-slate-900">
                {invoice.dueDate}
              </span>
            </div>
          )}
          <div>
            <span className="text-slate-500">Currency: </span>
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
            From (Seller)
          </p>
          <p className="font-bold text-slate-900 text-base">
            {invoice.seller.name || "Unknown Seller"}
          </p>
          {invoice.seller.street && (
            <p className="text-sm text-slate-600">{invoice.seller.street}</p>
          )}
          <p className="text-sm text-slate-600">
            {[invoice.seller.postalCode, invoice.seller.city, invoice.seller.country]
              .filter(Boolean)
              .join(", ")}
          </p>
          {invoice.seller.vatId && (
            <p className="text-xs text-slate-600 mt-2">
              VAT ID: <span className="font-mono font-semibold">{invoice.seller.vatId}</span>
            </p>
          )}
          {invoice.seller.email && (
            <p className="text-xs text-slate-500">{invoice.seller.email}</p>
          )}
        </div>

        <div className="bg-slate-50 p-4 rounded-xl print:bg-transparent print:p-0">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Bill To (Buyer)
          </p>
          <p className="font-bold text-slate-900 text-base">
            {invoice.buyer.name || "Unknown Buyer"}
          </p>
          {invoice.buyer.street && (
            <p className="text-sm text-slate-600">{invoice.buyer.street}</p>
          )}
          <p className="text-sm text-slate-600">
            {[invoice.buyer.postalCode, invoice.buyer.city, invoice.buyer.country]
              .filter(Boolean)
              .join(", ")}
          </p>
          {invoice.buyer.vatId && (
            <p className="text-xs text-slate-600 mt-2">
              VAT ID: <span className="font-mono font-semibold">{invoice.buyer.vatId}</span>
            </p>
          )}
        </div>
      </div>

      {/* Line Items Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="py-3 pr-3">#</th>
              <th className="py-3 pr-3">Description</th>
              <th className="py-3 px-3 text-right">Qty</th>
              <th className="py-3 px-3 text-right">Unit Price</th>
              <th className="py-3 px-3 text-right">VAT</th>
              <th className="py-3 pl-3 text-right">Net Total</th>
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
                  {line.quantity} <span className="text-xs text-slate-400">{line.unitCode}</span>
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  {formatMoney(line.unitPrice)}
                </td>
                <td className="py-3 px-3 text-right whitespace-nowrap">
                  {line.taxPercent}%
                </td>
                <td className="py-3 pl-3 text-right font-semibold text-slate-900 whitespace-nowrap">
                  {formatMoney(line.lineTotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals & Payment Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 pt-6">
        <div className="text-sm space-y-1 max-w-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Payment Details
          </p>
          {invoice.iban ? (
            <p className="text-slate-700">
              IBAN: <span className="font-mono font-semibold">{invoice.iban}</span>
            </p>
          ) : (
            <p className="text-slate-500 text-xs">No IBAN specified in XML.</p>
          )}
          {invoice.paymentReference && (
            <p className="text-slate-700">
              Reference: <span className="font-mono">{invoice.paymentReference}</span>
            </p>
          )}
        </div>

        <div className="w-full sm:w-72 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Net Subtotal</span>
            <span>{formatMoney(invoice.netTotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Total VAT / Tax</span>
            <span>{formatMoney(invoice.taxTotal)}</span>
          </div>
          <div className="flex justify-between text-slate-800 font-semibold border-t border-slate-200 pt-2">
            <span>Gross Total</span>
            <span>{formatMoney(invoice.grossTotal)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-slate-950 bg-slate-100 px-3 py-2 rounded-lg print:bg-transparent print:border print:border-slate-300">
            <span>Amount Due</span>
            <span>{formatMoney(invoice.payableAmount)}</span>
          </div>
        </div>
      </div>

      {/* Subtle Print Footer */}
      <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
        <span>Rendered locally via eu2027.aabready.com (100% Client-Side)</span>
        <span>EN 16931 Compliant Visualization</span>
      </div>
    </div>
  );
}