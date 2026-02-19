"use client";

import { AnalyticsCards } from "../../../components/organization/AnalyticsCards";
import { MembersGrowthChart } from "../../../components/organization/MembersGrowthChart";
import { RevenueChart } from "../../../components/organization/RevenueChart";
import { PlanDistributionChart } from "../../../components/organization/PlanDistributionChart";
import { RecentMembersTable } from "../../../components/organization/RecentMembersTable";
import { PaymentVerification } from "../../../components/organization/PaymentVerification";
import { Suspense } from "react";

export default function OrganizationDashboardPage() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <div
      className="min-h-screen bg-[#F9FAFB] px-4 sm:px-6 lg:px-8 py-8"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Payment verification */}
        <Suspense fallback={null}>
          <PaymentVerification />
        </Suspense>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#0D9488] mb-0.5">{greeting}</p>
            <h1 className="text-2xl font-extrabold text-[#1F2937]">Dashboard</h1>
            <p className="text-sm text-[#9CA3AF] mt-1">
              Here&apos;s an overview of your membership business.
            </p>
          </div>

          {/* Live date badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-4 py-2.5 shadow-sm self-start sm:self-auto flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-[#1F2937]">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Analytics Cards */}
        <section>
          <AnalyticsCards />
        </section>

        {/* Charts Row */}
        <section className="grid gap-6 lg:grid-cols-2">
          <MembersGrowthChart />
          <RevenueChart />
        </section>

        {/* Bottom Row */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentMembersTable />
          </div>
          <div>
            <PlanDistributionChart />
          </div>
        </section>
      </div>
    </div>
  );
}