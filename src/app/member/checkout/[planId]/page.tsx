"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Building2, Check, CreditCard, Shield } from "lucide-react";
import Link from "next/link";
import { useAvailablePlans } from "@/hooks/memberHook/useCommunity";
import { memberApi } from "@/lib/memberAPI/memberAPI";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/memberHook/useMember";
import { Spinner } from "@heroui/react";
import apiClient from "@/lib/apiClient";
import { usePaystack } from "@/hooks/usePaystack";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.planId as string;

  const { data: allPlans, isLoading: plansLoading } = useAvailablePlans();
  const { data: profile } = useProfile();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isReady, resumeTransaction } = usePaystack();
  // const { paystack, initializePaystack } = usePaystack();

  // useEffect(() => {
  //   initializePaystack();
  // }, []);

  // Find the specific plan
  const plan = allPlans?.find((p) => p.id === planId);

  if (plansLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Plan Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              The plan you&apos;re trying to subscribe to doesn&apos;t exist or
              is no longer available.
            </p>
            <Link href="/member/communities">
              <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Back to My Community
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "Free";
    return `₦${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Calculate next billing date
  const getNextBillingDate = (interval: string | null) => {
    if (!interval) return null;

    const today = new Date();
    const nextDate = new Date(today);

    switch (interval.toLowerCase()) {
      case "monthly":
        nextDate.setMonth(today.getMonth() + 1);
        break;
      case "yearly":
      case "annual":
        nextDate.setFullYear(today.getFullYear() + 1);
        break;
      case "weekly":
        nextDate.setDate(today.getDate() + 7);
        break;
      case "quarterly":
        nextDate.setMonth(today.getMonth() + 3);
        break;
      default:
        return null;
    }

    return nextDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle checkout
  const handleCheckout = async () => {
    console.log(profile?.email, plan.price);
    if (!profile?.email || plan.price === null) {
      setError("Unable to process payment. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create subscription in your system
      const {
        data: {
          data: { invoice },
        },
      } = await apiClient.post(
        `/subscriptions/members/subscribe/${plan.organization_id}`,
        {
          planId: plan.id,
        },
      );
      console.log(invoice);

      // 2. Initialize Paystack payment
      const {
        data: { data: paymentData },
      } = await apiClient.post("/payments/paystack/initialize", {
        invoiceId: invoice?.id,
      });
      console.log(paymentData);

      // 3. Redirect to Paystack
      if (!isReady) return;
      resumeTransaction(paymentData.access_code);
      // if (!paystack) return;
      // paystack.resumeTransaction(paymentData.access_code);
      router.refresh();
      //   window.location.href = payment.authorization_url;
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to start subscription");
    } finally {
      setIsProcessing(false);
    }
  };

  const nextBillingDate = getNextBillingDate(plan.interval);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href={`/member/communities/${plan.organization_id}`}>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Plans</span>
          </button>
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-1">
            Review your subscription and complete payment
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Plan Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Organization Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Organization
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {plan.organization.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {plan.organization.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {plan.organization.description}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t space-y-2 text-sm text-gray-600">
                  <p>{plan.organization.address}</p>
                  <p>{plan.organization.email}</p>
                  <p>{plan.organization.phone}</p>
                </div>
              </div>
            </div>

            {/* Plan Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Plan Details
              </h2>

              <div className="space-y-4">
                {/* Plan Name */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Plan Name</p>
                  <p className="text-xl font-bold text-gray-900">{plan.name}</p>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900">{plan.description}</p>
                </div>

                {/* Billing */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(plan.price)}
                    </p>
                  </div>
                  {plan.interval && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Billing Period
                      </p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">
                        {plan.interval}
                      </p>
                    </div>
                  )}
                </div>

                {/* Next Billing Date */}
                {nextBillingDate && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <p className="text-sm text-emerald-700 font-medium mb-1">
                      Next Billing Date
                    </p>
                    <p className="text-lg font-semibold text-emerald-900">
                      {nextBillingDate}
                    </p>
                  </div>
                )}

                {/* Features */}
                {plan.features && plan.features.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      What&apos;s Included
                    </p>
                    <ul className="space-y-2">
                      {plan.features.map((feature: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-gray-900"
                        >
                          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Security */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">
                    Secure Payment
                  </p>
                  <p className="text-sm text-blue-700">
                    Your payment information is encrypted and secure. We use
                    industry-standard security measures to protect your data.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-semibold text-gray-900">
                    {plan.name}
                  </span>
                </div>

                {plan.interval && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billing</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {plan.interval}
                    </span>
                  </div>
                )}

                {nextBillingDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Billing</span>
                    <span className="font-semibold text-gray-900">
                      {nextBillingDate}
                    </span>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-emerald-600">
                      {formatCurrency(plan.price)}
                    </span>
                  </div>
                  {plan.interval && (
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      Billed {plan.interval}
                    </p>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isProcessing || plan.price === null}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
              >
                {isProcessing ? (
                  <Spinner color="success" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    {plan.price === null ? "Free Plan" : "Proceed to Payment"}
                  </>
                )}
              </button>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By subscribing, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
