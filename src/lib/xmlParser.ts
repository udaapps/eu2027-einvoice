import {
  InvoiceFormat,
  InvoiceLine,
  ParsedInvoice,
  PartyInfo,
  ValidationIssue,
} from "./types";

function findChild(parent: Element | null, localName: string): Element | null {
  if (!parent) return null;
  for (let i = 0; i < parent.children.length; i++) {
    if (parent.children[i].localName === localName) {
      return parent.children[i];
    }
  }
  return null;
}

function findChildren(parent: Element | null, localName: string): Element[] {
  if (!parent) return [];
  const results: Element[] = [];
  for (let i = 0; i < parent.children.length; i++) {
    if (parent.children[i].localName === localName) {
      results.push(parent.children[i]);
    }
  }
  return results;
}

function findPath(parent: Element | null, path: string[]): Element | null {
  let current = parent;
  for (const segment of path) {
    current = findChild(current, segment);
    if (!current) return null;
  }
  return current;
}

function getText(parent: Element | null, path: string[]): string {
  const el = findPath(parent, path);
  return el?.textContent?.trim() || "";
}

function getNumber(parent: Element | null, path: string[]): number {
  const raw = getText(parent, path).replace(",", ".");
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCiiDate(raw: string): string {
  if (/^\d{8}$/.test(raw)) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  }
  return raw;
}

function parseUblParty(partyWrapper: Element | null): PartyInfo {
  const party = findChild(partyWrapper, "Party");
  const addr = findChild(party, "PostalAddress");

  const name =
    getText(party, ["PartyLegalEntity", "RegistrationName"]) ||
    getText(party, ["PartyName", "Name"]);

  const vatId = getText(party, ["PartyTaxScheme", "CompanyID"]);
  const email =
    getText(party, ["Contact", "ElectronicMail"]) ||
    getText(party, ["EndpointID"]);

  return {
    name,
    vatId,
    street: getText(addr, ["StreetName"]),
    city: getText(addr, ["CityName"]),
    postalCode: getText(addr, ["PostalZone"]),
    country: getText(addr, ["Country", "IdentificationCode"]),
    email,
  };
}

function parseUbl(root: Element): Omit<ParsedInvoice, "validation"> {
  const customizationId = getText(root, ["CustomizationID"]);
  let format: InvoiceFormat = "UBL 2.1";
  if (customizationId.toLowerCase().includes("xrechnung")) {
    format = "XRechnung (UBL)";
  } else if (customizationId.toLowerCase().includes("peppol")) {
    format = "Peppol BIS 3.0 (UBL)";
  }

  const lineNodes =
    findChildren(root, "InvoiceLine").length > 0
      ? findChildren(root, "InvoiceLine")
      : findChildren(root, "CreditNoteLine");

  const lines: InvoiceLine[] = lineNodes.map((line, index) => {
    const qtyEl =
      findChild(line, "InvoicedQuantity") ||
      findChild(line, "CreditedQuantity");
    return {
      id: getText(line, ["ID"]) || String(index + 1),
      name:
        getText(line, ["Item", "Name"]) ||
        getText(line, ["Item", "Description"]) ||
        "Unnamed Item",
      quantity: parseFloat(qtyEl?.textContent?.trim() || "1") || 1,
      unitCode: qtyEl?.getAttribute("unitCode") || "EA",
      unitPrice: getNumber(line, ["Price", "PriceAmount"]),
      taxPercent: getNumber(line, ["Item", "ClassifiedTaxCategory", "Percent"]),
      lineTotal: getNumber(line, ["LineExtensionAmount"]),
    };
  });

  const monetary = findChild(root, "LegalMonetaryTotal");
  const netTotal =
    getNumber(monetary, ["TaxExclusiveAmount"]) ||
    getNumber(monetary, ["LineExtensionAmount"]);
  const taxTotal = getNumber(root, ["TaxTotal", "TaxAmount"]);
  const grossTotal = getNumber(monetary, ["TaxInclusiveAmount"]);
  const payableAmount =
    getNumber(monetary, ["PayableAmount"]) || grossTotal;

  return {
    format,
    customizationId,
    invoiceNumber: getText(root, ["ID"]),
    issueDate: getText(root, ["IssueDate"]),
    dueDate: getText(root, ["DueDate"]),
    currency: getText(root, ["DocumentCurrencyCode"]) || "EUR",
    buyerReference: getText(root, ["BuyerReference"]),
    seller: parseUblParty(findChild(root, "AccountingSupplierParty")),
    buyer: parseUblParty(findChild(root, "AccountingCustomerParty")),
    iban: getText(root, ["PaymentMeans", "PayeeFinancialAccount", "ID"]),
    paymentReference: getText(root, ["PaymentMeans", "PaymentID"]),
    lines,
    netTotal,
    taxTotal,
    grossTotal,
    payableAmount,
  };
}

function parseCiiParty(partyEl: Element | null): PartyInfo {
  const addr = findChild(partyEl, "PostalTradeAddress");
  const taxRegs = findChildren(partyEl, "SpecifiedTaxRegistration");
  const vatReg = taxRegs.find((el) => {
    const idEl = findChild(el, "ID");
    return idEl?.getAttribute("schemeID") === "VA";
  });
  const vatId =
    getText(vatReg || taxRegs[0] || null, ["ID"]) || "";

  return {
    name: getText(partyEl, ["Name"]),
    vatId,
    street: getText(addr, ["LineOne"]),
    city: getText(addr, ["CityName"]),
    postalCode: getText(addr, ["PostcodeCode"]),
    country: getText(addr, ["CountryID"]),
    email: getText(partyEl, [
      "URIUniversalCommunication",
      "URIID",
    ]),
  };
}

function parseCii(root: Element): Omit<ParsedInvoice, "validation"> {
  const customizationId = getText(root, [
    "ExchangedDocumentContext",
    "GuidelineSpecifiedDocumentContextParameter",
    "ID",
  ]);

  let format: InvoiceFormat = "UN/CEFACT CII";
  if (customizationId.toLowerCase().includes("xrechnung")) {
    format = "XRechnung (CII)";
  } else if (
    customizationId.toLowerCase().includes("factur-x") ||
    customizationId.toLowerCase().includes("zugferd") ||
    customizationId.toLowerCase().includes("en16931")
  ) {
    format = "ZUGFeRD / Factur-X (CII)";
  }

  const tx = findChild(root, "SupplyChainTradeTransaction");
  const agreement = findChild(tx, "ApplicableHeaderTradeAgreement");
  const settlement = findChild(tx, "ApplicableHeaderTradeSettlement");
  const summation = findChild(
    settlement,
    "SpecifiedTradeSettlementHeaderMonetarySummation"
  );

  const lineNodes = findChildren(tx, "IncludedSupplyChainTradeLineItem");
  const lines: InvoiceLine[] = lineNodes.map((line, index) => {
    const qtyEl = findPath(line, [
      "SpecifiedLineTradeDelivery",
      "BilledQuantity",
    ]);
    return {
      id:
        getText(line, ["AssociatedDocumentLineDocument", "LineID"]) ||
        String(index + 1),
      name:
        getText(line, ["SpecifiedTradeProduct", "Name"]) || "Unnamed Item",
      quantity: parseFloat(qtyEl?.textContent?.trim() || "1") || 1,
      unitCode: qtyEl?.getAttribute("unitCode") || "C62",
      unitPrice: getNumber(line, [
        "SpecifiedLineTradeAgreement",
        "NetPriceProductTradePrice",
        "ChargeAmount",
      ]),
      taxPercent: getNumber(line, [
        "SpecifiedLineTradeSettlement",
        "ApplicableTradeTax",
        "RateApplicablePercent",
      ]),
      lineTotal: getNumber(line, [
        "SpecifiedLineTradeSettlement",
        "SpecifiedTradeSettlementLineMonetarySummation",
        "LineTotalAmount",
      ]),
    };
  });

  const netTotal =
    getNumber(summation, ["TaxBasisTotalAmount"]) ||
    getNumber(summation, ["LineTotalAmount"]);
  const taxTotal = getNumber(summation, ["TaxTotalAmount"]);
  const grossTotal = getNumber(summation, ["GrandTotalAmount"]);
  const payableAmount =
    getNumber(summation, ["DuePayableAmount"]) || grossTotal;

  return {
    format,
    customizationId,
    invoiceNumber: getText(root, ["ExchangedDocument", "ID"]),
    issueDate: formatCiiDate(
      getText(root, ["ExchangedDocument", "IssueDateTime", "DateTimeString"])
    ),
    dueDate: formatCiiDate(
      getText(settlement, [
        "SpecifiedTradePaymentTerms",
        "DueDateDateTime",
        "DateTimeString",
      ])
    ),
    currency: getText(settlement, ["InvoiceCurrencyCode"]) || "EUR",
    buyerReference: getText(agreement, ["BuyerReference"]),
    seller: parseCiiParty(findChild(agreement, "SellerTradeParty")),
    buyer: parseCiiParty(findChild(agreement, "BuyerTradeParty")),
    iban: getText(settlement, [
      "SpecifiedTradeSettlementPaymentMeans",
      "PayeePartyCreditorFinancialAccount",
      "IBANID",
    ]),
    paymentReference: getText(settlement, ["PaymentReference"]),
    lines,
    netTotal,
    taxTotal,
    grossTotal,
    payableAmount,
  };
}

function validateEn16931(
  data: Omit<ParsedInvoice, "validation">
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  issues.push(
    data.invoiceNumber
      ? {
          ruleId: "BR-02",
          severity: "pass",
          title: "Invoice Number (BT-1)",
          message: `Present: ${data.invoiceNumber}`,
        }
      : {
          ruleId: "BR-02",
          severity: "error",
          title: "Missing Invoice Number (BT-1)",
          message: "An invoice must have a unique identifier.",
        }
  );

  issues.push(
    data.issueDate
      ? {
          ruleId: "BR-03",
          severity: "pass",
          title: "Issue Date (BT-2)",
          message: `Valid date found: ${data.issueDate}`,
        }
      : {
          ruleId: "BR-03",
          severity: "error",
          title: "Missing Issue Date (BT-2)",
          message: "Invoice issue date is mandatory under EN 16931.",
        }
  );

  issues.push(
    data.seller.name && data.buyer.name
      ? {
          ruleId: "BR-06/07",
          severity: "pass",
          title: "Seller & Buyer Legal Names",
          message: "Both supplier and customer party names are present.",
        }
      : {
          ruleId: "BR-06/07",
          severity: "error",
          title: "Missing Seller or Buyer Name",
          message: "Both Seller (BT-27) and Buyer (BT-44) names are required.",
        }
  );

  issues.push(
    data.seller.vatId
      ? {
          ruleId: "BR-CO-09",
          severity: "pass",
          title: "Seller VAT / Tax ID (BT-31)",
          message: `Tax ID detected: ${data.seller.vatId}`,
        }
      : {
          ruleId: "BR-CO-09",
          severity: "warning",
          title: "Missing Seller VAT ID",
          message:
            "Recommended for EU B2B invoices (mandatory when VAT is charged).",
        }
  );

  issues.push(
    data.lines.length > 0
      ? {
          ruleId: "BR-16",
          severity: "pass",
          title: "Invoice Line Items",
          message: `${data.lines.length} line item(s) parsed successfully.`,
        }
      : {
          ruleId: "BR-16",
          severity: "error",
          title: "No Line Items Found",
          message: "An EN 16931 invoice must contain at least one line item.",
        }
  );

  const mathDiff = Math.abs(data.netTotal + data.taxTotal - data.grossTotal);
  issues.push(
    mathDiff <= 0.02
      ? {
          ruleId: "BR-CO-15",
          severity: "pass",
          title: "Tax & Gross Total Arithmetic",
          message: "Net + VAT matches Grand Total accurately.",
        }
      : {
          ruleId: "BR-CO-15",
          severity: "error",
          title: "Arithmetic Mismatch",
          message: `Net (${data.netTotal.toFixed(2)}) + Tax (${data.taxTotal.toFixed(
            2
          )}) does not equal Gross (${data.grossTotal.toFixed(2)}).`,
        }
  );

  issues.push(
    data.buyerReference
      ? {
          ruleId: "BR-DE-15",
          severity: "pass",
          title: "Buyer Reference / Leitweg-ID (BT-10)",
          message: `Present: ${data.buyerReference}`,
        }
      : {
          ruleId: "BR-DE-15",
          severity: "warning",
          title: "No Buyer Reference / Leitweg-ID",
          message:
            "Mandatory for German XRechnung B2G invoices; optional for standard B2B.",
        }
  );

  issues.push(
    data.iban
      ? {
          ruleId: "BT-84",
          severity: "pass",
          title: "Payment IBAN Account",
          message: `IBAN detected: ${data.iban}`,
        }
      : {
          ruleId: "BT-84",
          severity: "warning",
          title: "No IBAN Detected",
          message: "Add a payment account IBAN if bank transfer is expected.",
        }
  );

  return issues;
}

export function parseEuInvoiceXml(xmlString: string): ParsedInvoice {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");

  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    throw new Error(
      "Invalid XML syntax. Please upload a valid XRechnung, Peppol UBL, or ZUGFeRD XML file."
    );
  }

  const root = doc.documentElement;
  let parsed: Omit<ParsedInvoice, "validation">;

  if (root.localName === "Invoice" || root.localName === "CreditNote") {
    parsed = parseUbl(root);
  } else if (root.localName === "CrossIndustryInvoice") {
    parsed = parseCii(root);
  } else {
    throw new Error(
      `Unsupported XML root element <${root.localName}>. Expected UBL <Invoice> or CII <CrossIndustryInvoice>.`
    );
  }

  return {
    ...parsed,
    validation: validateEn16931(parsed),
  };
}

export function generateInvoiceCsv(invoice: ParsedInvoice): string {
  const headers = [
    "InvoiceNumber",
    "IssueDate",
    "Seller",
    "SellerVAT",
    "Buyer",
    "LineID",
    "Description",
    "Quantity",
    "Unit",
    "UnitPrice",
    "VAT%",
    "LineTotal",
    "Currency",
  ];

  const escapeCsv = (val: string | number) =>
    `"${String(val).replace(/"/g, '""')}"`;

  const rows = invoice.lines.map((line) =>
    [
      invoice.invoiceNumber,
      invoice.issueDate,
      invoice.seller.name,
      invoice.seller.vatId,
      invoice.buyer.name,
      line.id,
      line.name,
      line.quantity,
      line.unitCode,
      line.unitPrice.toFixed(2),
      line.taxPercent.toFixed(2),
      line.lineTotal.toFixed(2),
      invoice.currency,
    ]
      .map(escapeCsv)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}