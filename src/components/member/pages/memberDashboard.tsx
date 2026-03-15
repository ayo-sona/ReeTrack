"use client";

import { Wallet, CreditCard, Calendar, QrCode, ArrowRight } from "lucide-react";
import {
  useProfile,
  useActiveSubscriptions,
} from "@/hooks/memberHook/useMember";
import RecentActivity from "@/components/member/memberRecentActivity";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useInvoices } from "@/hooks/memberHook/useMember";

export default function MemberDashboard() {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: subscriptions, isLoading: subsLoading } =
    useActiveSubscriptions();
    const { data: allInvoices, isLoading: invoiceLoading } =
    useInvoices(1, 100, "failed");

  const activeSubscriptionsCount = subscriptions.length;

  const rawInvoice = allInvoices as any;
  const invoicesList: any[] = Array.isArray(rawInvoice?.data)
    ? rawInvoice.data
    : Array.isArray(rawInvoice?.data?.data)
      ? rawInvoice.data.data
      : [];

  const failedInvoiceCount = invoicesList.length;

  // const upcomingPayments =
  //   subscriptions?.filter((s) => s.auto_renew).length || 0;

  // Sort subscriptions by expiry date (soonest first)
  const sortedSubscriptions = subscriptions
    ? [...subscriptions].sort(
        (a, b) =>
          new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime(),
      )
    : [];

  // Check if subscription expires within 7 days
  const isExpiringSoon = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  return (
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

        {/* Wallet Card - Coming Soon */}
        {/* <div className="bg-gradient-to-br from-[#0D9488] to-[#0B7A70] rounded-xl p-8 text-white shadow-lg border-2 border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-semibold">
                Wallet Balance
              </p>
              <h2 className="text-white text-4xl font-extrabold mt-2">
                Coming Soon
              </h2>
              <p className="text-white/90 text-sm mt-3 font-medium">
                Wallet feature will be available soon
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
        </div> */}

        {/* Quick Stats - 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Subscriptions */}
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

          {/* Upcoming Payments */}
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
                  <Link key={sub.id} href={`/member/subscriptions/${sub.id}`}>
                    <div
                      className={`flex items-center justify-between p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        expiringSoon
                          ? "border-[#F06543]/40 bg-[#F06543]/5 hover:bg-[#F06543]/10 hover:border-[#F06543]/60"
                          : "border-[#E5E7EB] hover:border-[#0D9488]/40 hover:bg-[#0D9488]/5"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#0D9488] to-[#0B7A70] rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
                          {sub.plan.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1F2937] text-base">
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
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-[#1F2937] text-lg">
                          ₦{sub.plan.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-[#9CA3AF] font-semibold">
                          /{sub.plan.interval}
                        </p>
                      </div>
                    </div>
                  </Link>
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

        {/* Recent Activity - New Component */}
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

          <Link href="/member/wallet">
            <button className="w-full p-6 bg-white rounded-xl shadow-sm border border-[#E5E7EB] hover:border-[#0D9488]/40 hover:shadow-md transition-all duration-300 h-full group">
              <div className="bg-[#0D9488]/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0D9488]/20 transition-colors duration-300">
                <Wallet className="w-7 h-7 text-[#0D9488]" />
              </div>
              <p className="text-sm font-bold text-[#1F2937]">Wallet</p>
              <p className="text-xs text-[#9CA3AF] mt-2 font-semibold">
                Coming soon
              </p>
            </button>
          </Link>

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
  );
}
