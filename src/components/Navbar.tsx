"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "E-Invoice Viewer (EN)" },
  { href: "/de", label: "E-Rechnung (DE)" },
  { href: "/battery-qr-2027", label: "Battery QR" },
  { href: "/privacy", label: "Privacy" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="no-print bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            EU
          </div>
          <span className="font-bold text-slate-900 tracking-tight">
            EU2027<span className="text-blue-600">.aabready</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg transition ${
                  active
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="hidden lg:inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs ml-2">
            <Lock className="w-3.5 h-3.5" />
            100% Client-Side
          </span>
        </div>
      </div>
    </nav>
  );
}