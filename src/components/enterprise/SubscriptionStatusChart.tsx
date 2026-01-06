'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MOCK_SUBSCRIPTION_DISTRIBUTION } from '../../lib/mockData/analytics';

export function SubscriptionStatusChart() {
  // Cast data to the format Recharts expects
  const chartData = MOCK_SUBSCRIPTION_DISTRIBUTION.map(item => ({
    ...item,
    name: item.status, // Recharts expects a 'name' field
  }));

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Subscription Status
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Distribution of member statuses
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props) => {
              const percent = props.percent ?? 0;
              return `${(percent * 100).toFixed(1)}%`;
            }}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(31 41 55)',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {MOCK_SUBSCRIPTION_DISTRIBUTION.map((item) => (
          <div key={item.status} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {item.status}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}