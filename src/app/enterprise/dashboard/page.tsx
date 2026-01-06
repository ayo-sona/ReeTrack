import { AnalyticsCards } from '../../../components/enterprise/AnalyticsCards';
import { MembersGrowthChart } from '../../../components/enterprise/MembersGrowthChart';
import { RevenueChart } from '../../../components/enterprise/RevenueChart';
import { PlanDistributionChart } from '../../../components/enterprise/PlanDistributionChart';
import { RecentMembersTable } from '../../../components/enterprise/RecentMembersTable';

export default function EnterpriseDashboardPage() {
  return (
    <div className="space-y-6">
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