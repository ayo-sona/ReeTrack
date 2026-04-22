"use client";

import { useState } from "react";
import {
  Wallet,
  CreditCard,
  Calendar,
  QrCode,
  ArrowRight,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  useProfile,
  useActiveSubscriptions,
  useCancelSubscription,
} from "@/hooks/memberHook/useMember";
import RecentActivity from "@/components/member/memberRecentActivity";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useInvoices } from "@/hooks/memberHook/useMember";
import { toast } from "sonner"; // or your toast lib; swap if needed
import { useMemberOrgs } from "@/hooks/memberHook/useMember";
import Image from "next/image";

// ─── Cancel Confirmation Modal ──────────────────────────────────────────────

interface CancelModalProps {
  subscription: {
    id: string;
    plan: { name: string; price: number; interval: string };
    expires_at: string;
  } | null;
  onConfirm: () => void;
  onClose: () => void;
  isLoading: boolean;
  orgLogo: string | null;
}

function CancelModal({
  subscription,
  onConfirm,
  onClose,
  isLoading,
  orgLogo,
}: CancelModalProps) {
  if (!subscription) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-[#E5E7EB]">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#9CA3AF] hover:text-[#1F2937] hover:bg-[#F9FAFB] transition-colors disabled:opacity-40"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-[#EF4444]" />
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-[#1F2937] mb-2">
          Cancel Subscription?
        </h2>
        <p className="text-[#6B7280] text-sm mb-4 leading-relaxed">
          You&apos;re about to cancel{" "}
          <div className="w-10 h-10 bg-gradient-to-br from-[#0D9488] to-[#0B7A70] rounded-lg flex items-center justify-center text-white font-bold text-sm overflow-hidden relative">
            {orgLogo ? (
              <Image
                src={orgLogo}
                alt={subscription.plan.name}
                fill
                className="object-cover"
              />
            ) : (
              subscription.plan.name.charAt(0)
            )}
          </div>
          . Your subscription will remain active until{" "}
          <span className="font-semibold text-[#1F2937]">
            {new Date(subscription.expires_at).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          , and{" "}
          <span className="font-semibold text-[#EF4444]">
            no further billing will occur
          </span>{" "}
          after that date.
        </p>

        {/* Plan summary pill */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0D9488] to-[#0B7A70] rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {subscription.plan.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-[#1F2937] text-sm">
                {subscription.plan.name}
              </p>
              <p className="text-xs text-[#9CA3AF]">
                ₦{subscription.plan.price.toLocaleString()} /{" "}
                {subscription.plan.interval}
              </p>
            </div>
          </div>
          <span className="text-xs bg-[#DCFCE7] text-[#16A34A] font-semibold px-2.5 py-1 rounded-full">
            Active until{" "}
            {new Date(subscription.expires_at).toLocaleDateString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
            onClick={onClose}
            disabled={isLoading}
          >
            Keep Subscription
          </Button>
          <Button
            className="flex-1 bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cancelling…
              </span>
            ) : (
              "Yes, Cancel"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function MemberDashboard() {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: subscriptions, isLoading: subsLoading } =
    useActiveSubscriptions();
  const { data: allInvoices, isLoading: invoiceLoading } = useInvoices(
    1,
    100,
    "failed",
  );
  const { mutate: cancelSubscription, isPending: isCancelling } =
    useCancelSubscription();

  const [cancelTarget, setCancelTarget] = useState<
    (typeof subscriptions)[number] | null
  >(null);

  const activeSubscriptionsCount = subscriptions.length;

  const rawInvoice = allInvoices as any;
  const invoicesList: any[] = Array.isArray(rawInvoice?.data)
    ? rawInvoice.data
    : Array.isArray(rawInvoice?.data?.data)
      ? rawInvoice.data.data
      : [];

  const failedInvoiceCount = invoicesList.length;
  const { data: memberOrgs } = useMemberOrgs();
  const orgLogo =
    memberOrgs?.[0]?.organization_user?.organization?.logo_url ?? null;

  const sortedSubscriptions = subscriptions
    ? [...subscriptions].sort(
        (a, b) =>
          new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime(),
      )
    : [];

  const isExpiringSoon = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const handleCancelConfirm = () => {
    if (!cancelTarget) return;
    cancelSubscription(cancelTarget.id, {
      onSuccess: () => {
        toast.success(
          `${cancelTarget.plan.name} has been cancelled. You'll retain access until ${new Date(cancelTarget.expires_at).toLocaleDateString()}.`,
        );
        setCancelTarget(null);
      },
      onError: () => {
        toast.error("Failed to cancel subscription. Please try again.");
      },
    });
  };

  return (
    <>
      {/* Cancel Modal */}
      <CancelModal
        subscription={cancelTarget}
        onConfirm={handleCancelConfirm}
        onClose={() => setCancelTarget(null)}
        isLoading={isCancelling}
        orgLogo={orgLogo} 
      />

      <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-[#1F2937]">
                Welcome back{" "}
                {profile?.first_name
                  ? profile.first_name.charAt(0).toUpperCase() +
                    profile.first_name.slice(1).toLowerCase()
                  : ""}
                ! 👋
              </h1>
              <p className="text-[#9CA3AF] mt-2 font-medium">
                Manage your subscriptions and payments
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB] hover:border-[#0D9488]/30 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#0D9488]/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-[#0D9488]" />
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm font-semibold">
                    Active Subscriptions
                  </p>
                  <p className="text-3xl font-extrabold text-[#1F2937]">
                    {activeSubscriptionsCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB] hover:border-[#0D9488]/30 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#F06543]/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-[#F06543]" />
                </div>
                <div>
                  <p className="text-[#9CA3AF] text-sm font-semibold">
                    Pending Invoices
                  </p>
                  <p className="text-3xl font-extrabold text-[#1F2937]">
                    {failedInvoiceCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Subscriptions List */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0D9488]">
                Active Subscriptions
              </h2>
              <Link href="/member/subscriptions">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {subsLoading || invoiceLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-[#F9FAFB] rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : sortedSubscriptions.length > 0 ? (
              <div className="space-y-4">
                {sortedSubscriptions.slice(0, 3).map((sub) => {
                  const expiringSoon = isExpiringSoon(sub.expires_at);

                  return (
                    <div
                      key={sub.id}
                      className={`flex items-center justify-between p-5 rounded-xl border transition-all duration-300 ${
                        expiringSoon
                          ? "border-[#F06543]/40 bg-[#F06543]/5"
                          : "border-[#E5E7EB]"
                      }`}
                    >
                      {/* Left — clickable plan info */}
                      <Link
                        href={`/member/subscriptions/${sub.id}`}
                        className="flex items-center gap-4 flex-1 min-w-0 hover:opacity-80 transition-opacity"
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-[#0D9488] to-[#0B7A70] rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-sm shrink-0 overflow-hidden relative">
                          {orgLogo ? (
                            <Image
                              src={orgLogo}
                              alt={sub.plan.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            sub.plan.name.charAt(0)
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-[#1F2937] text-base truncate">
                            {sub.plan.name}
                          </h3>
                          <p className="text-sm text-[#9CA3AF] mt-1 font-medium">
                            {expiringSoon ? (
                              <span className="text-[#F06543] font-semibold">
                                Expires{" "}
                                {new Date(sub.expires_at).toLocaleDateString()}
                              </span>
                            ) : (
                              `Expires ${new Date(sub.expires_at).toLocaleDateString()}`
                            )}
                          </p>
                        </div>
                      </Link>

                      {/* Right — price + cancel */}
                      <div className="flex items-center gap-4 shrink-0 ml-4">
                        <div className="text-right">
                          <p className="font-extrabold text-[#1F2937] text-lg">
                            ₦{sub.plan.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-[#9CA3AF] font-semibold">
                            /{sub.plan.interval}
                          </p>
                        </div>

                        <button
                          onClick={() => setCancelTarget(sub)}
                          className="text-xs font-semibold text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#FEF2F2] hover:border-[#EF4444]/60 px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[#F9FAFB] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10 text-[#9CA3AF]" />
                </div>
                <h3 className="text-xl font-bold text-[#1F2937] mb-2">
                  No active subscriptions
                </h3>
                <p className="text-[#9CA3AF] font-medium mb-6">
                  Get started by browsing our plans
                </p>
                <Button
                  onClick={() => router.push("/member/communities")}
                  variant="default"
                  size="default"
                >
                  Browse Plans
                </Button>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <RecentActivity />

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/member/check-ins">
              <button className="w-full p-6 bg-white rounded-xl shadow-sm border border-[#E5E7EB] hover:border-[#0D9488]/40 hover:shadow-md transition-all duration-300 h-full group">
                <div className="bg-[#0D9488]/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0D9488]/20 transition-colors duration-300">
                  <QrCode className="w-7 h-7 text-[#0D9488]" />
                </div>
                <p className="text-sm font-bold text-[#1F2937]">Check In</p>
              </button>
            </Link>

            {/* <Link href="/member/wallet">
              <button className="w-full p-6 bg-white rounded-xl shadow-sm border border-[#E5E7EB] hover:border-[#0D9488]/40 hover:shadow-md transition-all duration-300 h-full group">
                <div className="bg-[#0D9488]/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0D9488]/20 transition-colors duration-300">
                  <Wallet className="w-7 h-7 text-[#0D9488]" />
                </div>
                <p className="text-sm font-bold text-[#1F2937]">Wallet</p>
                <p className="text-xs text-[#9CA3AF] mt-2 font-semibold">
                  Coming soon
                </p>
              </button>
            </Link> */}

            <Link href="/member/payments">
              <button className="w-full p-6 bg-white rounded-xl shadow-sm border border-[#E5E7EB] hover:border-[#0D9488]/40 hover:shadow-md transition-all duration-300 h-full group">
                <div className="bg-[#0D9488]/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0D9488]/20 transition-colors duration-300">
                  <CreditCard className="w-7 h-7 text-[#0D9488]" />
                </div>
                <p className="text-sm font-bold text-[#1F2937]">Payments</p>
                <p className="text-xs text-[#9CA3AF] mt-2 font-semibold">
                  {failedInvoiceCount} pending
                </p>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
