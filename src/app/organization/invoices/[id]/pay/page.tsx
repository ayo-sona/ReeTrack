"use client";

import { useEffect, useRef, useState } from "react";
import apiClient from "@/lib/apiClient";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  due_date: string;
  plan?: { name: string; interval: string };
  organization?: { name: string; email: string };
}

export default function PayInvoicePage() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/invoices/organization/${params.id}`);
        setInvoice(data.data);
      } catch {
        setError("Failed to load invoice. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [params?.id]);

  const handleDownload = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      // Dynamically import to keep bundle light
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${invoice?.invoice_number ?? params?.id}.pdf`);
    } catch {
      // Fallback to print dialog
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center font-[Nunito,sans-serif]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin" />
          <p className="text-sm text-[#9CA3AF]">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center font-[Nunito,sans-serif] px-4">
        <div className="text-center space-y-3 max-w-sm">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-base font-bold text-[#1F2937]">Could not load invoice</p>
          <p className="text-sm text-[#9CA3AF]">{error}</p>
          <Button variant="outline" onClick={() => router.back()}>Go back</Button>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === "paid";
  const issuedDate = new Date(invoice.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const dueDate = invoice.due_date
    ? new Date(invoice.due_date).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-[Nunito,sans-serif] px-4 py-10 sm:py-16 print:bg-white print:p-0">

      {/* Action bar — hidden on print */}
      <div className="max-w-2xl mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-[#9CA3AF] hover:text-[#1F2937] transition-colors flex items-center gap-1"
        >
          ← Back to My Access
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isPaid && (
            <Button
              variant="default"
              size="default"
              className="flex-1 sm:flex-none"
              onClick={() => router.push(`/organization/invoices/${invoice.id}/checkout`)}
            >
              Pay ₦{invoice.amount.toLocaleString()}
            </Button>
          )}
          <Button
            variant="outline"
            size="default"
            className="flex-1 sm:flex-none"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? "Preparing..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* ── Invoice Document ─────────────────────────────────────────────── */}
      <div
        ref={printRef}
        className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden print:shadow-none print:border-none print:rounded-none"
      >
        {/* Invoice top stripe */}
        <div className="h-1.5 bg-[#0D9488]" />

        {/* Header */}
        <div className="px-8 sm:px-12 pt-10 pb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-b border-gray-100">
          <div>
            {/* Logo / Brand */}
            <p className="text-2xl font-extrabold text-[#0D9488] tracking-tight">
              {invoice.organization?.name ?? "ReeTrack"}
            </p>
            {invoice.organization?.email && (
              <p className="text-xs text-[#9CA3AF] mt-1">{invoice.organization.email}</p>
            )}
          </div>

          <div className="sm:text-right space-y-1">
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">Invoice</p>
            <p className="text-lg font-extrabold text-[#1F2937]">#{invoice.invoice_number}</p>
            {/* Status badge */}
            <span className={clsx(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize",
              isPaid
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : invoice.status === "failed"
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            )}>
              {isPaid && <CheckCircle className="w-3 h-3" />}
              <span className={clsx(
                "w-1.5 h-1.5 rounded-full",
                isPaid ? "hidden" : invoice.status === "failed" ? "bg-red-500" : "bg-amber-400"
              )} />
              {isPaid ? "Paid" : invoice.status === "failed" ? "Failed" : "Pending"}
            </span>
          </div>
        </div>

        {/* Dates row */}
        <div className="px-8 sm:px-12 py-6 grid grid-cols-2 sm:grid-cols-3 gap-6 border-b border-gray-100 bg-[#F9FAFB]">
          <div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">Issue Date</p>
            <p className="text-sm font-semibold text-[#1F2937]">{issuedDate}</p>
          </div>
          {dueDate && (
            <div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">Due Date</p>
              <p className="text-sm font-semibold text-[#1F2937]">{dueDate}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">Plan</p>
            <p className="text-sm font-semibold text-[#1F2937] capitalize">
              {invoice.plan?.name ?? "Subscription"}
              {invoice.plan?.interval && (
                <span className="text-[#9CA3AF] font-normal ml-1">· {invoice.plan.interval}</span>
              )}
            </p>
          </div>
        </div>

        {/* Line items table */}
        <div className="px-8 sm:px-12 py-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left pb-3 text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">
                  Description
                </th>
                <th className="text-right pb-3 text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-dashed border-gray-100">
                <td className="py-4 text-sm font-semibold text-[#1F2937]">
                  {invoice.description || `${invoice.plan?.name ?? "Subscription"} Plan`}
                </td>
                <td className="py-4 text-sm font-bold text-[#1F2937] text-right">
                  ₦{invoice.amount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#9CA3AF]">Subtotal</span>
              <span className="text-sm font-semibold text-[#1F2937]">₦{invoice.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-base font-bold text-[#1F2937]">Total</span>
              <span className="text-2xl font-extrabold text-[#1F2937]">₦{invoice.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="px-8 sm:px-12 py-6 border-t border-gray-100 bg-[#F9FAFB] text-center">
          <p className="text-xs text-[#9CA3AF]">
            {isPaid
              ? "Thank you for your payment. This invoice has been settled in full."
              : "Please complete payment by the due date to avoid service interruption."}
          </p>
        </div>

        {/* Bottom stripe */}
        <div className="h-1 bg-[#0D9488]/20" />
      </div>
    </div>
  );
}