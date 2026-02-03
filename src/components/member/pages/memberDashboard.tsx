"use client";

import {
  Wallet,
  CreditCard,
  Calendar,
  TrendingUp,
  Bell,
  QrCode,
} from "lucide-react";
import {
  useSubscriptions,
  useWallet,
  useNotifications,
} from "@/hooks/memberHook/useMember";
import Link from "next/link";

export default function MemberDashboard() {
  const { data: subscriptions, isLoading: subsLoading } = useSubscriptions();
  const { data: wallet } = useWallet();
  const { data: notifications } = useNotifications();

  const activeSubscriptions =
    subscriptions?.filter((s) => s.status === "active") || [];
  const upcomingPayments =
    subscriptions?.filter((s) => s.nextBillingDate && s.autoRenew) || [];
  const unreadNotifications = notifications?.filter((n) => !n.read).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your subscriptions and payments
            </p>
          </div>
        </div>

        {/* Wallet Card */}
        <Link href="/member/wallet">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Wallet Balance</p>
                <h2 className="text-4xl font-bold mt-2">
                  ₦{wallet?.balance.toLocaleString() || "0"}
                </h2>
                <p className="text-emerald-100 text-sm mt-2">
                  {wallet
                    ? "Tap to view details"
                    : "Create your wallet to get started"}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8" />
              </div>
            </div>
          </div>
        </Link>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Plans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeSubscriptions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Upcoming Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {upcomingPayments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₦48K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Subscriptions */}
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
          ) : activeSubscriptions.length > 0 ? (
            <div className="space-y-4">
              {activeSubscriptions.slice(0, 3).map((sub) => (
                <Link key={sub.id} href={`/member/subscriptions/${sub.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {sub.organizationName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {sub.organizationName}
                        </h3>
                        <p className="text-sm text-gray-600">{sub.planName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₦{sub.planPrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        /{sub.planInterval}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
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

        {/* Quick Actions */}
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
