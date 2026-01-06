'use client';

import { Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { MOCK_MEMBERS, MOCK_PAYMENTS } from '../../lib/mockData/enterpriseMockdata';

export function AnalyticsCards() {
  // Calculate real stats from mock data
  const totalMembers = MOCK_MEMBERS.length;
  const activeMembers = MOCK_MEMBERS.filter(m => m.status === 'active').length;
  const inactiveMembers = MOCK_MEMBERS.filter(m => m.status === 'inactive').length;
  const expiredMembers = MOCK_MEMBERS.filter(m => m.status === 'expired').length;

  // Calculate revenue from successful payments
  const successfulPayments = MOCK_PAYMENTS.filter(p => p.status === 'success');
  const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

  // Calculate this month's revenue
  const now = new Date();
  const thisMonthPayments = successfulPayments.filter(p => {
    const paymentDate = new Date(p.paidAt || p.createdAt);
    return paymentDate.getMonth() === now.getMonth() && 
           paymentDate.getFullYear() === now.getFullYear();
  });
  const monthlyRevenue = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);

  // Calculate new members this month
  const newMembersThisMonth = MOCK_MEMBERS.filter(m => {
    const joinedDate = new Date(m.joinedDate);
    return joinedDate.getMonth() === now.getMonth() && 
           joinedDate.getFullYear() === now.getFullYear();
  }).length;

  // Calculate revenue growth (mock: compare to previous month estimate)
  const revenueGrowth = monthlyRevenue > 0 ? 15.5 : 0;

  const stats = [
    {
      name: 'Total Members',
      value: totalMembers.toString(),
      change: `+${newMembersThisMonth} this month`,
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500',
      subStats: [
        { label: 'Active', value: activeMembers },
        { label: 'Inactive', value: inactiveMembers },
        { label: 'Expired', value: expiredMembers },
      ]
    },
    {
      name: 'Monthly Revenue',
      value: `₦${(monthlyRevenue / 1000).toFixed(1)}K`,
      change: `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth.toFixed(1)}% from last month`,
      changeType: revenueGrowth >= 0 ? 'positive' as const : 'negative' as const,
      icon: DollarSign,
      color: 'bg-green-500',
      subStats: [
        { label: 'Payments', value: thisMonthPayments.length },
        { label: 'Total', value: `₦${totalRevenue.toLocaleString()}` },
      ]
    },
    {
      name: 'Active Members',
      value: activeMembers.toString(),
      change: `${((activeMembers / totalMembers) * 100).toFixed(1)}% of total`,
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'bg-purple-500',
      subStats: [
        { label: 'Auto-renew', value: MOCK_MEMBERS.filter(m => m.autoRenew).length },
      ]
    },
    {
      name: 'Needs Attention',
      value: (inactiveMembers + expiredMembers).toString(),
      change: `${expiredMembers} expired, ${inactiveMembers} inactive`,
      changeType: 'warning' as const,
      icon: AlertCircle,
      color: 'bg-orange-500',
      subStats: []
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="mt-4">
                <div
                  className={`inline-flex items-baseline gap-1 text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : stat.changeType === 'negative'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-orange-600 dark:text-orange-400'
                  }`}
                >
                  {stat.change}
                </div>

                {stat.subStats.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-4">
                      {stat.subStats.map((subStat) => (
                        <div key={subStat.label} className="text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            {subStat.label}:
                          </span>{' '}
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {subStat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}