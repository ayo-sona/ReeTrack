'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MOCK_PAYMENTS } from '../../lib/mockData/enterpriseMockdata';

export function RevenueChart() {
  // Generate revenue data from payments
  const generateRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    // Get last 6 months
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      
      // Get all successful payments for this month
      const monthPayments = MOCK_PAYMENTS.filter(p => {
        if (p.status !== 'success') return false;
        const paymentDate = new Date(p.paidAt || p.createdAt);
        return paymentDate.getFullYear() === year && paymentDate.getMonth() === monthIndex;
      });

      const revenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
      const memberCount = new Set(monthPayments.map(p => p.memberId)).size;

      chartData.push({
        month: months[monthIndex],
        revenue: revenue / 1000, // Convert to thousands for better display
        members: memberCount,
      });
    }
    
    return chartData;
  };

  const data = generateRevenueData();

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Revenue Trend
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Monthly revenue from successful payments (in thousands)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis 
            dataKey="month" 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
            label={{ value: '₦ (thousands)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(31 41 55)',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
            }}
            formatter={(value: number | undefined) => {
              const num = value ?? 0;
              return [`₦${num.toFixed(1)}K`, 'Revenue'];
            }}
          />
          <Legend />
          <Bar
            dataKey="revenue"
            fill="#10b981"
            name="Revenue (₦K)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary stats */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total (6 months)</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            ₦{(data.reduce((sum, d) => sum + d.revenue, 0)).toFixed(1)}K
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Avg per month</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            ₦{(data.reduce((sum, d) => sum + d.revenue, 0) / data.length).toFixed(1)}K
          </p>
        </div>
      </div>
    </div>
  );
}