export type InvoiceFormat =
  | "XRechnung (UBL)"
  | "Peppol BIS 3.0 (UBL)"
  | "UBL 2.1"
  | "XRechnung (CII)"
  | "ZUGFeRD / Factur-X (CII)"
  | "UN/CEFACT CII"
  | "Unknown";

export interface PartyInfo {
  name: string;
  vatId: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  email?: string;
}

export interface InvoiceLine {
  id: string;
  name: string;
  quantity: number;
  unitCode: string;
  unitPrice: number;
  taxPercent: number;
  lineTotal: number;
}

export interface ValidationIssue {
  ruleId: string;
  severity: "pass" | "warning" | "error";
  title: string;
  message: string;
}

export interface ParsedInvoice {
  format: InvoiceFormat;
  customizationId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  buyerReference: string;
  seller: PartyInfo;
  buyer: PartyInfo;
  iban: string;
  paymentReference: string;
  lines: InvoiceLine[];
  netTotal: number;
  taxTotal: number;
  grossTotal: number;
  payableAmount: number;
  validation: ValidationIssue[];
}