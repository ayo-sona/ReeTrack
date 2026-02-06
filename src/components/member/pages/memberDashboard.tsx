"use client";

import {
  Wallet,
  CreditCard,
  Calendar,
  TrendingUp,
  Bell,
  QrCode,
  Clock,
  History,
  UserCheck,
  AlertCircle,
  TrendingDown,
} from "lucide-react";
import {
  useSubscriptions,
  useWallet,
  useNotifications,
  useProfile,
  useTransactions,
  useReferral,
} from "@/hooks/memberHook/useMember";
import Link from "next/link";
import { format } from "date-fns";

export default function MemberDashboard() {
  const { data: subscriptions, isLoading: subsLoading } = useSubscriptions();
  const { data: wallet } = useWallet();
  const { data: notifications } = useNotifications();
  const { data: profile } = useProfile();
  const { data: transactions } = useTransactions();
  // const { data: referral } = useReferral();

  const activeSubscriptions =
    subscriptions?.filter((s) => s.status === "active") || [];
  const upcomingPayments =
    subscriptions?.filter((s) => s.nextBillingDate && s.autoRenew) || [];
  // const unreadNotifications = notifications?.filter((n) => !n.read).length || 0;

  // Get recent transactions
  const recentTransactions = transactions?.slice(0, 3) || [];

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
                  {/* ₦{wallet?.balance.toLocaleString() || "0"} */}
                  Coming soon
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-gray-600 text-sm">Pending Payments</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  ₦
                  {recentTransactions
                    .reduce((sum, t) => sum + (t.amount || 0), 0)
                    .toLocaleString()}
                </p>
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

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Transactions
            </h2>
            <Link href="/member/transactions">
              <span className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                View All
              </span>
            </Link>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${tx.amount > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                    >
                      {tx.amount > 0 ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {tx.description || "Transaction"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {tx.createdAt
                          ? format(new Date(tx.createdAt), "MMM d, yyyy")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-medium ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <History className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">No recent transactions</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/member/check-in">
            <button className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all h-full">
              <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <QrCode className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Check In</p>
              <p className="text-xs text-gray-500 mt-1">Scan QR code</p>
            </button>
          </Link>

          <Link href="/member/wallet">
            <button className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all h-full">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Wallet</p>
              <p className="text-xs text-gray-500 mt-1">
                Balance: ₦{wallet?.balance?.toLocaleString() || "0"}
              </p>
            </button>
          </Link>

          <Link href="/member/payments">
            <button className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all h-full">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Payments</p>
              <p className="text-xs text-gray-500 mt-1">
                {upcomingPayments.length} upcoming
              </p>
            </button>
          </Link>

          {/* <Link href="/member/referrals">
            <button className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all h-full">
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Refer & Earn</p>
              <p className="text-xs text-gray-500 mt-1">
                {referral?.referralCount || 0} friends joined
              </p>
            </button>
          </Link> */}
        </div>
      </div>
    </div>
  );
}
