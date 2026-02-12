"use client";

import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Check,
  Globe,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useAvailablePlans } from "@/hooks/memberHook/useCommunity";
import { memberApi } from "@/lib/memberAPI/memberAPI";
import { useQuery } from "@tanstack/react-query";
import { addDays, addWeeks, addMonths, addYears, format } from "date-fns";

export default function OrganizationPlansPage() {
  const params = useParams();
  const organizationId = params.id as string;

  const { data: allPlans, isLoading: plansLoading } = useAvailablePlans();

  // Get member's subscriptions
  const { data: subscriptionsData } = useQuery({
    queryKey: ["member", "subscriptions"],
    queryFn: async () => {
      const response = await memberApi
        .getMySubscription()
        .catch(() => ({ data: [] }));
      return Array.isArray(response.data)
        ? response.data
        : response.data
          ? [response.data]
          : [];
    },
  });

  if (plansLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto animate-pulse space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Filter plans for this organization
  const organizationPlans =
    allPlans?.filter(
      (plan) => plan.organization_id === organizationId && plan.is_active
    ) || [];

  if (organizationPlans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Plans Available
            </h3>
            <p className="text-gray-600 mb-6">
              This organization doesn&apos;t have any active plans.
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

  const organization = organizationPlans[0].organization;
  const subscriptions = subscriptionsData || [];

  // Helper function to format currency
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "Free";
    return `₦${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Helper function to calculate next billing date
  const getNextBillingDate = (interval: string | null) => {
    if (!interval) return null;

    const today = new Date();
    switch (interval.toLowerCase()) {
      case "daily":
        return addDays(today, 1);
      case "weekly":
        return addWeeks(today, 1);
      case "monthly":
        return addMonths(today, 1);
      case "quarterly":
        return addMonths(today, 3);
      case "yearly":
        return addYears(today, 1);
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/member/communities">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Community</span>
          </button>
        </Link>

        {/* Organization Header */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-emerald-500/25">
              {organization.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {organization.name}
              </h1>
              <p className="text-gray-700 mb-4">{organization.description}</p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{organization.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{organization.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{organization.phone}</span>
                </div>
                {organization.website && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <a
                      href={`https://${organization.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Plans Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Available Plans ({organizationPlans.length})
          </h2>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizationPlans.map((plan) => {
            const isSubscribed = subscriptions.some(
              (sub: any) => sub.plan_id === plan.id && sub.status === "active"
            );

            const nextBillingDate = getNextBillingDate(plan.interval);

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl border-2 p-6 transition-all duration-200 ${
                  isSubscribed
                    ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                {/* Subscribed Badge */}
                {isSubscribed && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      <Check className="w-3 h-3" />
                      Currently Subscribed
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                {/* Plan Description */}
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                {/* Price */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-emerald-600">
                    {formatCurrency(plan.price)}
                    {plan.interval && (
                      <span className="text-sm text-gray-600 font-normal">
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                </div>

                {/* Billing Date & Time */}
                {nextBillingDate && (
                  <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">
                            Next billing date
                          </p>
                          <p className="font-medium text-gray-900">
                            {format(nextBillingDate, "MMMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm border-t border-gray-200 pt-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Billing time</p>
                          <p className="font-medium text-gray-900">
                            {format(nextBillingDate, "hh:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features */}
                {plan.features && plan.features.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Features:
                    </p>
                    <ul className="space-y-2">
                      {plan.features.map((feature: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Subscribe Button */}
                {isSubscribed ? (
                  <Link href="/member/subscriptions">
                    <button className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                      Manage Subscription
                    </button>
                  </Link>
                ) : (
                  <Link href={`/member/checkout/${plan.id}`}>
                    <button className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                      Subscribe Now
                    </button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}