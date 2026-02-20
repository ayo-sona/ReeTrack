"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";

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

function formatPrice(price: string | null, cycle: BillingCycle): string {
  if (price === null || price === "0") return "Free";
  const base = Number(price);
  return cycle === "annually"
    ? `$${(base * 0.85).toFixed(2)}/mo`
    : `$${base}/mo`;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function PlansSkeleton() {
  return (
    <div className="w-full min-h-full overflow-y-auto bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 space-y-12 sm:space-y-16 lg:space-y-20">

        {/* Hero skeleton */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <div className="h-4 w-28 bg-gray-100 rounded-full animate-pulse mx-auto" />
          <div className="h-10 w-3/4 bg-gray-100 rounded-xl animate-pulse mx-auto" />
          <div className="h-4 w-2/3 bg-gray-100 rounded-lg animate-pulse mx-auto" />
          {/* Toggle skeleton */}
          <div className="flex w-48 mx-auto gap-2 bg-white border border-gray-100 rounded-full px-2 py-2 shadow-sm mt-4">
            <div className="flex-1 h-8 bg-gray-100 rounded-full animate-pulse" />
            <div className="flex-1 h-8 bg-gray-100 rounded-full animate-pulse" />
          </div>
        </section>

        {/* Cards skeleton */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col"
              >
                {/* Card header */}
                <div className="px-5 sm:px-6 pt-8 pb-5 border-b border-gray-100 space-y-3">
                  <div className="h-5 w-32 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-10 w-28 bg-gray-100 rounded-xl animate-pulse mt-2" />
                </div>
                {/* Features */}
                <div className="px-5 sm:px-6 py-5 sm:py-6 flex-1 space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-gray-100 animate-pulse shrink-0" />
                      <div className="h-3 bg-gray-100 rounded animate-pulse flex-1" />
                    </div>
                  ))}
                </div>
                {/* CTA */}
                <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                  <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table skeleton */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-5 sm:py-6 border-b border-gray-100 space-y-2">
            <div className="h-5 w-36 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="px-5 sm:px-6 py-3 sm:py-4 flex items-center gap-6">
                <div className="h-4 flex-1 bg-gray-100 rounded animate-pulse" />
                {[1, 2, 3].map((j) => (
                  <div key={j} className="w-4 h-4 rounded-full bg-gray-100 animate-pulse mx-auto" />
                ))}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EnterprisePlansPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/plans/organization");
        setPlans(res.data.data);
      } catch {
        toast.error("Failed to load plans. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePlanSelect = (plan: Plan) => {
    router.push(`/organization/checkout/${plan.id}`);
  };

  const sortedPlans = [...plans].sort((a, b) => +a.price - +b.price);

  if (loading && plans.length === 0) return <PlansSkeleton />;

  return (
    <div className="w-full min-h-full overflow-y-auto bg-[#F9FAFB]">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 space-y-12 sm:space-y-16 lg:space-y-20">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#0D9488] mb-3 sm:mb-4">
            Pricing Plans
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2937] mb-3 sm:mb-4 leading-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-sm sm:text-base text-[#9CA3AF] mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
            Choose the plan that fits your organisation. Start free and upgrade as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex w-full sm:w-auto sm:inline-flex items-center gap-2 sm:gap-3 bg-white border border-gray-100 rounded-full px-2 py-2 shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                billingCycle === "monthly"
                  ? "bg-[#0D9488] text-white shadow-sm"
                  : "text-[#9CA3AF] hover:text-[#1F2937]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                billingCycle === "annually"
                  ? "bg-[#0D9488] text-white shadow-sm"
                  : "text-[#9CA3AF] hover:text-[#1F2937]"
              }`}
            >
              Annually
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-all duration-200 ${
                  billingCycle === "annually"
                    ? "bg-white text-[#0D9488]"
                    : "bg-[#0D9488]/10 text-[#0D9488]"
                }`}
              >
                −15%
              </span>
            </button>
          </div>
        </section>

        {/* ── Pricing Cards ─────────────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {sortedPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-xl border flex flex-col transition-all duration-300 hover:shadow-lg ${
                  plan.mostPopular
                    ? "border-[#0D9488] shadow-md ring-1 ring-[#0D9488]"
                    : "border-gray-100 shadow-sm"
                }`}
              >
                {plan.mostPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="bg-[#0D9488] text-white text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="px-5 sm:px-6 pt-8 pb-5 border-b border-gray-100">
                  <h3 className="text-base sm:text-lg font-bold text-[#1F2937] mb-1">{plan.name}</h3>
                  <p className="text-sm text-[#9CA3AF] mb-4 sm:mb-5 leading-relaxed">{plan.description}</p>
                  <div>
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">
                      {formatPrice(plan.price, billingCycle)}
                    </span>
                    {billingCycle === "annually" && plan.price !== "0" && (
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        Billed annually at ${(Number(plan.price) * 12 * 0.85).toFixed(2)}/yr
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-5 sm:py-6 flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                        <span className="text-sm text-[#1F2937]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                  <Button
                    variant={plan.mostPopular ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    Get started
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Feature Comparison ───────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-5 sm:py-6 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] mb-1">Compare plans</h2>
            <p className="text-sm text-[#9CA3AF]">Everything included across all plans.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 sm:px-6 py-4 text-sm font-semibold text-[#1F2937] min-w-[160px] sm:w-1/2">
                    Feature
                  </th>
                  {sortedPlans.map((plan) => (
                    <th
                      key={plan.id}
                      className="text-center px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-[#0D9488] min-w-[90px]"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {includedFeatures.map((feature, i) => (
                  <tr key={i} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-5 sm:px-6 py-3 sm:py-4 text-sm text-[#1F2937]">{feature}</td>
                    {sortedPlans.map((plan) => (
                      <td key={plan.id} className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                        <CheckCircle className="w-4 h-4 text-[#0D9488] mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}