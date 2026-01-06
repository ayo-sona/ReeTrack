'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MOCK_MEMBERS } from '../../lib/mockData/enterpriseMockdata';

export function MembersGrowthChart() {
  // Generate growth data from members' join dates
  const generateGrowthData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    // Get last 6 months
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      
      // Count members who joined up to this month
      const totalMembers = MOCK_MEMBERS.filter(m => {
        const joinedDate = new Date(m.joinedDate);
        return (joinedDate.getFullYear() < year) || 
               (joinedDate.getFullYear() === year && joinedDate.getMonth() <= monthIndex);
      }).length;

      // Count active members at this point
      const activeMembers = MOCK_MEMBERS.filter(m => {
        const joinedDate = new Date(m.joinedDate);
        const joinedByThisMonth = (joinedDate.getFullYear() < year) || 
                                  (joinedDate.getFullYear() === year && joinedDate.getMonth() <= monthIndex);
        return joinedByThisMonth && m.status === 'active';
      }).length;

      // Count inactive members
      const inactiveMembers = MOCK_MEMBERS.filter(m => {
        const joinedDate = new Date(m.joinedDate);
        const joinedByThisMonth = (joinedDate.getFullYear() < year) || 
                                  (joinedDate.getFullYear() === year && joinedDate.getMonth() <= monthIndex);
        return joinedByThisMonth && m.status === 'inactive';
      }).length;

      chartData.push({
        month: months[monthIndex],
        total: totalMembers,
        active: activeMembers,
        inactive: inactiveMembers,
      });
    }
    
    return chartData;
  };

  const data = generateGrowthData();

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Member Growth
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Total and active members over the last 6 months
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis 
            dataKey="month" 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(31 41 55)',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Total Members"
            dot={{ fill: '#3b82f6' }}
          />
          <Line
            type="monotone"
            dataKey="active"
            stroke="#10b981"
            strokeWidth={2}
            name="Active"
            dot={{ fill: '#10b981' }}
          />
          <Line
            type="monotone"
            dataKey="inactive"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Inactive"
            dot={{ fill: '#f59e0b' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}