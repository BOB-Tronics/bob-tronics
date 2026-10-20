"use client";

import { FiDownload } from "react-icons/fi";

export default function PrintInvoiceButton() {
  return (
    <button type="button" onClick={() => window.print()}>
      <FiDownload /> Download invoice
    </button>
  );
}