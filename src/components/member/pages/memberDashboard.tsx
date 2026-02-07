"use client";

import {
  Wallet,
  CreditCard,
  Calendar,
  TrendingUp,
  QrCode,
  CheckCircle,
} from "lucide-react";
import {
  useProfile,
  useActiveSubscriptions,
} from "@/hooks/memberHook/useMember";
import RecentActivity from "@/components/member/memberRecentActivity";
import Link from "next/link";

export default function MemberDashboard() {
  // ✅ Real data from API
  const { data: profile } = useProfile();
  const { data: subscriptions, isLoading: subsLoading } =
    useActiveSubscriptions();

  // 🔜 Placeholders (API not implemented yet)
  const walletBalance = 0; // useWallet() - not in API yet
  const unreadNotifications = 0; // useNotifications() - not in API yet

  // ✅ Calculate stats from real data
  const activeSubscriptionsCount = subscriptions?.length || 0;
  const checkInCount = profile?.check_in_count || 0;

  // ✅ Calculate upcoming payments (active subscriptions with auto-renew)
  const upcomingPayments =
    subscriptions?.filter((s) => s.auto_renew).length || 0;

  // ✅ Sort subscriptions by expiry date (soonest first)
  const sortedSubscriptions = subscriptions
    ? [...subscriptions].sort(
        (a, b) =>
          new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime()
      )
    : [];

  // ✅ Check if subscription expires within 7 days
  const isExpiringSoon = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {profile?.user?.first_name}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your subscriptions and payments
            </p>
          </div>
        </div>

        {/* Wallet Card - 🔜 Placeholder */}
        <Link href="/member/wallet">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Wallet Balance</p>
                <h2 className="text-4xl font-bold mt-2">
                  ₦{walletBalance.toLocaleString()}
                </h2>
                <p className="text-emerald-100 text-sm mt-2">
                  Create your wallet to get started
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8" />
              </div>
            </div>
          </div>
        </Link>

        {/* Quick Stats - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Active Subscriptions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeSubscriptionsCount}
                </p>
              </div>
            </div>
          </div>

          {/* Check-in Count */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Check-ins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {checkInCount}
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Upcoming Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {upcomingPayments}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Subscriptions List */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Active Subscriptions
            </h2>
            <Link href="/member/subscriptions">
              <span className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                View All
              </span>
            </Link>
          </div>

          {subsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-100 rounded-lg"></div>
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
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${
                        expiringSoon
                          ? "border-orange-300 bg-orange-50 hover:bg-orange-100"
                          : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {sub.plan.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {sub.plan.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {expiringSoon ? (
                              <span className="text-orange-600 font-medium">
                                ⚠️ Expires{" "}
                                {new Date(sub.expires_at).toLocaleDateString()}
                              </span>
                            ) : (
                              `Expires ${new Date(sub.expires_at).toLocaleDateString()}`
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ₦{sub.plan.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          /{sub.plan.interval}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No active subscriptions</p>
              <button className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Browse Plans
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity - New Component */}
        <RecentActivity />

        {/* Quick Actions - 🔜 Placeholders */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/member/check-in">
            <button className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all">
              <QrCode className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Check In</p>
            </button>
          </Link>

          <Link href="/member/wallet">
            <button className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all">
              <Wallet className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Top Up</p>
            </button>
          </Link>

          <Link href="/member/payments">
            <button className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all">
              <Calendar className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Payments</p>
            </button>
          </Link>

          <Link href="/member/referrals">
            <button className="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all">
              <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Refer & Earn</p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}