"use client";

import { useEffect, useState } from "react";
import { Check, CheckCircle, ArrowRight, X } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { usePaystack } from "@/hooks/usePaystack";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import clsx from "clsx";

type BillingCycle = "monthly" | "annually";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  priceSuffix: string;
  features: string[];
  mostPopular: boolean;
}

const includedFeatures = [
  "Secure data encryption",
  "99.9% uptime SLA",
  "Regular updates & improvements",
  "Mobile apps",
  "Single sign-on (SSO)",
  "Audit logs",
];

export default function EnterprisePlansPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const { isReady, resumeTransaction } = usePaystack();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await apiClient.get("/plans/organization");
      setPlans(res.data.data);
      setLoading(false);
    })();
  }, []);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data: { data: { invoice } } } = await apiClient.post("/subscriptions/organizations", {
        planId: selectedPlan?.id,
      });
      const { data: { data: paymentData } } = await apiClient.post(
        "/payments/paystack/organization/initialize",
        { invoiceId: invoice?.id }
      );
      if (!isReady) return;
      resumeTransaction(paymentData.access_code);
      router.refresh();
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        if (status === 400) toast.error(data.message || "Invalid request. Please check your details.");
        else if (status === 403) toast.error("You don't have permission to perform this action.");
        else if (status === 404) toast.error("The requested resource was not found.");
        else if (status >= 500) toast.error("A server error occurred. Please try again later.");
        else toast.error(data.message || "An error occurred. Please try again.");
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error(error.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24" style={{ fontFamily: "Nunito, sans-serif" }}>
        <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin mb-3" />
        <p className="text-sm text-[#9CA3AF]">Loading plans...</p>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen bg-[#F9FAFB] overflow-y-auto"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="text-center max-w-3xl mx-auto">
          <span className="inline-block bg-[#0D9488]/10 text-[#0D9488] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
            Pricing Plans
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-base text-[#9CA3AF] mb-8 max-w-xl mx-auto">
            Choose the perfect plan for your organisation. Start with a free trial and upgrade as you grow.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-white border border-gray-100 rounded-xl p-1 shadow-sm gap-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                billingCycle === "monthly"
                  ? "bg-[#0D9488] text-white shadow-sm"
                  : "text-[#9CA3AF] hover:text-[#1F2937]"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                billingCycle === "annually"
                  ? "bg-[#0D9488] text-white shadow-sm"
                  : "text-[#9CA3AF] hover:text-[#1F2937]"
              )}
            >
              Annually
              {billingCycle === "annually" && (
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">Save 15%</span>
              )}
            </button>
            {billingCycle === "monthly" && (
              <span className="text-xs text-[#0D9488] font-semibold px-2 hidden sm:inline">
                Save 15% annually →
              </span>
            )}
          </div>
        </section>

        {/* ── Pricing cards ─────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={clsx(
                "relative bg-white rounded-xl border shadow-sm flex flex-col transition-all duration-200 hover:shadow-md",
                plan.mostPopular
                  ? "border-[#0D9488] ring-2 ring-[#0D9488]/20"
                  : "border-gray-100"
              )}
            >
              {/* Most popular badge */}
              {plan.mostPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#0D9488] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Card header */}
              <div className="px-6 pt-8 pb-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-[#1F2937] mb-1">{plan.name}</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">{plan.description}</p>
                <div>
                  <span className="text-3xl font-extrabold text-[#1F2937]">{plan.price}</span>
                  <span className="text-sm text-[#9CA3AF] ml-1">{plan.priceSuffix}</span>
                  {billingCycle === "annually" && plan.id !== "enterprise" && (
                    <p className="text-xs text-[#9CA3AF] mt-1">Billed annually</p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="px-6 py-5 flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                      <span className="text-sm text-[#1F2937]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6">
                <Button
                  type="button"
                  variant={plan.mostPopular ? "secondary" : "outline"}
                  className="w-full"
                  onClick={() => handlePlanSelect(plan)}
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </section>

        {/* ── Feature comparison ────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100 text-center">
            <h2 className="text-xl font-bold text-[#1F2937] mb-1">Compare plans</h2>
            <p className="text-sm text-[#9CA3AF]">
              See how our plans stack up to find the perfect fit for your organisation.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider min-w-[200px]">
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center px-6 py-4 min-w-[120px]">
                      <p className="text-sm font-bold text-[#1F2937]">{plan.name}</p>
                      <p className="text-xs text-[#9CA3AF]">{plan.price}</p>
                      {plan.mostPopular && (
                        <span className="inline-block mt-1 text-xs bg-[#0D9488]/10 text-[#0D9488] font-semibold px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {includedFeatures.map((feature, index) => (
                  <tr key={index} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#1F2937] font-semibold">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                        {feature}
                      </div>
                    </td>
                    {plans.map((plan) => (
                      <td key={`${plan.id}-${index}`} className="px-6 py-4 text-center">
                        {plan.id === "enterprise" || index < 4 ? (
                          <Check className="w-4 h-4 text-[#0D9488] mx-auto" />
                        ) : (
                          <span className="text-[#9CA3AF] text-sm">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Payment modal ─────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-sm w-full shadow-xl border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1F2937]">Complete Your Subscription</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 hover:bg-[#F9FAFB] transition-colors text-[#9CA3AF] hover:text-[#1F2937]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-6 space-y-5">
              {/* Plan summary */}
              <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl px-5 py-4 text-center">
                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1">
                  Subscribing to
                </p>
                <p className="text-base font-bold text-[#1F2937]">{selectedPlan?.name}</p>
                <p className="text-2xl font-extrabold text-[#1F2937] mt-1">
                  {selectedPlan?.price}
                  <span className="text-sm font-normal text-[#9CA3AF] ml-1">
                    {selectedPlan?.priceSuffix}
                  </span>
                </p>
                {billingCycle === "annually" && selectedPlan?.id !== "enterprise" && (
                  <p className="text-xs text-[#9CA3AF] mt-1">Billed annually</p>
                )}
              </div>

              {/* Payment options */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide">
                  Select payment method
                </p>
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full flex items-center justify-between px-4 py-3.5 border border-gray-200 rounded-xl hover:border-[#0D9488] hover:bg-[#F9FAFB] transition-all group"
                >
                  <Image
                    src="/paystack-logo.jpeg"
                    alt="Paystack"
                    width={80}
                    height={24}
                    className="h-6 w-auto"
                  />
                  <span className="text-sm font-semibold text-[#9CA3AF] group-hover:text-[#0D9488] transition-colors">
                    Pay with Paystack →
                  </span>
                </button>
                <button
                  onClick={() => toast.info("Kora payment coming soon")}
                  className="w-full flex items-center justify-between px-4 py-3.5 border border-gray-200 rounded-xl hover:border-[#0D9488] hover:bg-[#F9FAFB] transition-all group"
                >
                  <Image
                    src="/kora-logo.jpeg"
                    alt="Kora"
                    width={80}
                    height={24}
                    className="h-6 w-auto"
                  />
                  <span className="text-sm font-semibold text-[#9CA3AF] group-hover:text-[#0D9488] transition-colors">
                    Pay with Kora →
                  </span>
                </button>
              </div>

              <p className="text-xs text-[#9CA3AF] text-center">
                Secure payment processing powered by our trusted partners
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}