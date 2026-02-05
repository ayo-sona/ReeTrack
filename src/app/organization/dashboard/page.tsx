"use client";

import { AnalyticsCards } from "../../../components/organization/AnalyticsCards";
import { MembersGrowthChart } from "../../../components/organization/MembersGrowthChart";
import { RevenueChart } from "../../../components/organization/RevenueChart";
import { PlanDistributionChart } from "../../../components/organization/PlanDistributionChart";
import { RecentMembersTable } from "../../../components/organization/RecentMembersTable";
import { PaymentVerification } from "../../../components/organization/PaymentVerification";
import { Suspense } from "react";

export default function OrganizationDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Payment verification wrapped in Suspense */}
      <Suspense fallback={null}>
        <PaymentVerification />
      </Suspense>

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Welcome back! Here&apos;s an overview of your membership business.
        </p>
      </div>

      {/* Analytics Cards */}
      <AnalyticsCards />

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MembersGrowthChart />
        <RevenueChart />
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentMembersTable />
        </div>
        <div>
          <PlanDistributionChart />
        </div>
      </div>
    </div>
  );
}