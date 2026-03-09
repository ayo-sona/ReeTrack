"use client";

import { AnalyticsCards } from "../../../components/organization/AnalyticsCards";
import { MembersGrowthChart } from "../../../components/organization/MembersGrowthChart";
import { RevenueChart } from "../../../components/organization/RevenueChart";
import { PlanDistributionChart } from "../../../components/organization/PlanDistributionChart";
import { RecentMembersTable } from "../../../components/organization/RecentMembersTable";
import { KycBanner } from "../../../components/organization/AddKYCBanner";

export default function OrganizationDashboardPage() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-[Nunito,sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">

        {/* ── KYC Banner — disappears once verified ───────────────────── */}
        <KycBanner />

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#0D9488] mb-1">
              {greeting}
            </p>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1F2937]">
              Dashboard
            </h1>
            <p className="text-sm text-[#9CA3AF] mt-1 leading-relaxed">
              Here&apos;s an overview of how things have been so far.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-4 py-2.5 shadow-sm w-full sm:w-auto flex-shrink-0 self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-sm font-semibold text-[#1F2937] truncate">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* ── Analytics Cards ─────────────────────────────────────────── */}
        <section aria-label="Key metrics">
          <AnalyticsCards />
        </section>

        {/* ── Charts Row ──────────────────────────────────────────────── */}
        <section
          aria-label="Charts"
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <div className="min-h-[280px] sm:min-h-[320px]">
            <MembersGrowthChart />
          </div>
          <div className="min-h-[280px] sm:min-h-[320px]">
            <RevenueChart />
          </div>
        </section>

        {/* ── Bottom Row ──────────────────────────────────────────────── */}
        <section
          aria-label="Members and plan distribution"
          className="grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          <div className="lg:col-span-2 min-h-[300px]">
            <RecentMembersTable />
          </div>
          <div className="min-h-[280px]">
            <PlanDistributionChart />
          </div>
        </section>

      </div>
    </div>
  );
}