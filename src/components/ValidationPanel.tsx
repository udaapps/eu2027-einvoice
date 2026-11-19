"use client";

import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { ValidationIssue } from "@/lib/types";

interface Props {
  issues: ValidationIssue[];
  format: string;
}

export default function ValidationPanel({ issues, format }: Props) {
  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  const passed = issues.filter((i) => i.severity === "pass").length;

  return (
    <div className="no-print bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            EN 16931 Compliance Validation
          </h2>
          <p className="text-sm text-slate-500">
            Detected Standard: <span className="font-semibold text-blue-700">{format}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {passed} Passed
          </span>
          {warnings > 0 && (
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {warnings} Warnings
            </span>
          )}
          {errors > 0 ? (
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {errors} Errors
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              2027 Ready
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {issues.map((issue) => (
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
              <p className="text-slate-600 text-xs mt-0.5">{issue.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}