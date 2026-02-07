"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Download, Check, X, Receipt, CreditCard, FileText } from "lucide-react";
import { useAllPayments } from "@/hooks/memberHook/useMember";
import Link from "next/link";

export default function PaymentReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;

  const { data: payments, isLoading } = useAllPayments();
  
  // Find the specific payment
  const payment = payments?.find((p) => p.id === paymentId);

  // ✅ FIX: Redirect pending payments back to payment history
  useEffect(() => {
    if (!isLoading && payment && payment.status === "pending") {
      router.push("/member/payments");
    }
  }, [payment, isLoading, router]);

  // Helper function to format currency - handle string or number
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '₦0.00';
    
    return `₦${numAmount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Check className="w-6 h-6" />;
      case "failed":
        return <X className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700 border-green-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // ✅ Payment not found or is pending (will redirect)
  if (!payment || payment.status === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {payment?.status === "pending" ? "Receipt Not Available" : "Payment not found"}
          </h3>
          <p className="text-gray-600 mb-6">
            {payment?.status === "pending" 
              ? "Receipts are only available for completed payments."
              : "The payment you're looking for doesn't exist or has been removed."}
          </p>
          <Link href="/member/payments">
            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              Back to Payments
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const planName = payment.invoice?.member_subscription?.plan.name || "Unknown Plan";
  const planDescription = payment.invoice?.member_subscription?.plan.description || "";
  const reference = payment.provider_reference || payment.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button & Actions - Hidden on print */}
        <div className="flex items-center justify-between print:hidden">
          <Link href="/member/payments">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Payments
            </button>
          </Link>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Print Receipt
          </button>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header with Status */}
          <div className={`p-8 border-b-4 ${
            payment.status === "success" ? "border-green-500 bg-green-50" :
            "border-red-500 bg-red-50"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Receipt className="w-8 h-8 text-gray-700" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Payment Receipt</h1>
                  <p className="text-sm text-gray-600">Transaction ID: {payment.id}</p>
                </div>
              </div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getStatusColor(payment.status)}`}>
                {getStatusIcon(payment.status)}
                <span className="font-semibold">
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-1">Amount {payment.status === "success" ? "Paid" : "Attempted"}</p>
              <p className="text-4xl font-bold text-gray-900">
                {formatCurrency(payment.amount)}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-8 space-y-6">
            {/* Transaction Info */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Transaction Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Reference Number</p>
                    <p className="font-semibold text-gray-900 font-mono text-sm">
                      {reference}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {payment.payment_method || "Card"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Payment Provider</p>
                    <p className="font-semibold text-gray-900">
                      {payment.payment_provider || "Paystack"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Transaction Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(payment.created_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Currency</p>
                    <p className="font-semibold text-gray-900">
                      {payment.currency?.toUpperCase() || "NGN"}
                    </p>
                  </div>

                  {payment.invoice_id && (
                    <div>
                      <p className="text-sm text-gray-600">Invoice ID</p>
                      <p className="font-semibold text-gray-900 font-mono text-sm">
                        {payment.invoice_id}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription/Plan Info */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Plan Details
              </h2>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {planName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{planName}</h3>
                    {planDescription && (
                      <p className="text-sm text-gray-700 mt-1">{planDescription}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(payment.amount)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax/Fees</span>
                  <span className="font-semibold">{formatCurrency(0)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t-2 border-gray-200">
                  <span>Total {payment.status === "success" ? "Paid" : "Amount"}</span>
                  <span>{formatCurrency(payment.amount)}</span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {payment.status === "success" && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">
                      Payment Successful
                    </h3>
                    <p className="text-sm text-green-700">
                      Your payment has been processed successfully. This receipt has been sent to your email.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Failed Message */}
            {payment.status === "failed" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">
                      Payment Failed
                    </h3>
                    <p className="text-sm text-red-700">
                      This payment was not successful. Please contact support if you believe this is an error or try making the payment again.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              If you have any questions about this receipt, please contact support.
            </p>
            <p className="text-xs text-gray-500 text-center mt-2">
              This is an electronic receipt and does not require a signature.
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </div>
  );
}