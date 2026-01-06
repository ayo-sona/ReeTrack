'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MOCK_MEMBERS, MOCK_PLANS } from '../../lib/mockData/enterpriseMockdata';

export function PlanDistributionChart() {
  // Calculate plan distribution from actual members
  const planDistribution = MOCK_PLANS.map(plan => {
    const membersOnPlan = MOCK_MEMBERS.filter(m => m.planId === plan.id);
    const count = membersOnPlan.length;
    const percentage = MOCK_MEMBERS.length > 0 
      ? (count / MOCK_MEMBERS.length) * 100 
      : 0;

    return {
      planId: plan.id,
      planName: plan.name,
      count: count,
      percentage: percentage,
      color: getColorForPlan(plan.name),
    };
  }).filter(p => p.count > 0); // Only show plans with members

  // Color assignment based on plan name
  function getColorForPlan(planName: string) {
    const colors: { [key: string]: string } = {
      'Basic': '#3b82f6',      // Blue
      'Premium': '#8b5cf6',    // Purple
      'VIP': '#f59e0b',        // Orange
      'Student': '#10b981',    // Green
    };
    
    for (const key in colors) {
      if (planName.includes(key)) {
        return colors[key];
      }
    }
    return '#6b7280'; // Gray fallback
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Plan Distribution
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Members by subscription plan
        </p>
      </div>

      {planDistribution.length === 0 ? (
        <div className="flex items-center justify-center h-[250px] text-gray-500 dark:text-gray-400">
          <p>No members yet</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={planDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props) => {
                  const percent = props.percent ?? 0;
                  return `${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
               contentStyle={{
                backgroundColor: 'rgba(156, 163, 175, 0.7)', 
                border: '1px solid rgb(229 231 235)',
                borderRadius: '0.5rem',
                color: 'white',
              }}
                formatter={(value: number | undefined, name: string | undefined, props: { payload?: { percentage?: number; planName?: string } }) => {
                  const count = value ?? 0;
                  const percentage = props.payload?.percentage ?? 0;
                  const planName = props.payload?.planName ?? 'Unknown';
                  return [
                    `${count} members (${percentage.toFixed(1)}%)`,
                    planName
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {planDistribution.map((item) => (
              <div key={item.planId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {item.planName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {item.count}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}