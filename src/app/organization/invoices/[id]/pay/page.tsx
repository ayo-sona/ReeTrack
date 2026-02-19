"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { usePaystack } from "@/hooks/usePaystack";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle } from "lucide-react";

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  due_date: string;
}

export default function PayInvoicePage() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const { paystack } = usePaystack();

  useEffect(() => {
    if (!params?.id) return;
    const loadInvoice = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/invoices/organization/${params.id}`);
        setInvoice(data.data);
      } catch (err) {
        console.error("Failed to load invoice:", err);
        setError("Failed to load invoice details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadInvoice();
  }, [params?.id]);

  const handlePay = async () => {
    setPaying(true);
    try {
      const { data } = await apiClient.post(
        "/payments/paystack/organization/initialize",
        { invoiceId: params?.id }
      );
      paystack.resumeTransaction(data.data.access_code);
    } catch (err) {
      console.error("Payment initialization failed:", err);
      setError("Failed to initialize payment. Please try again.");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#F9FAFB] flex items-center justify-center"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin" />
          <p className="text-sm text-[#9CA3AF]">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-12"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0D9488]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#0D9488]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#1F2937]">Invoice Payment</h1>
              {invoice?.invoice_number && (
                <p className="text-xs text-[#9CA3AF]">#{invoice.invoice_number}</p>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-5">
            {/* Amount — hero element */}
            <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl px-5 py-4 text-center">
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">Amount Due</p>
              <p className="text-4xl font-extrabold text-[#1F2937]">
                ₦{invoice?.amount?.toLocaleString() ?? "—"}
              </p>
            </div>

            {/* Invoice details */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">Description</p>
                <p className="text-sm font-semibold text-[#1F2937]">
                  {invoice?.description || "—"}
                </p>
              </div>

              {invoice?.due_date && (
                <div>
                  <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">Due Date</p>
                  <p className="text-sm font-semibold text-[#1F2937]">
                    {new Date(invoice.due_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-semibold">{error}</p>
              </div>
            )}

            {/* CTA */}
            <Button
              type="button"
              variant="default"
              className="w-full"
              disabled={paying || !invoice}
              onClick={handlePay}
            >
              {paying ? "Initializing payment..." : `Pay ₦${invoice?.amount?.toLocaleString() ?? ""}`}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-4">
          Payments are processed securely via Paystack
        </p>
      </div>
    </div>
  );
}