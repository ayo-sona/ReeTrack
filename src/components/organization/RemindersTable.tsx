import React, { useState } from 'react';
import { Search, Send, Calendar, Clock, AlertCircle, Mail, MessageSquare, Download } from 'lucide-react';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: 'upcoming' | 'overdue';
  lastReminder: string | null;
  remindersSent: number;
  amountDue: number;
}

interface RemindersTableProps {
  members: Member[];
  onSendReminder: (memberIds: number[]) => void;
  onSelectMembers?: (memberIds: number[]) => void;
}

export const RemindersTable: React.FC<RemindersTableProps> = ({
  members,
  onSendReminder,
  onSelectMembers
}) => {
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'overdue'>('all');
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSelectMember = (memberId: number) => {
    const newSelection = selectedMembers.includes(memberId)
      ? selectedMembers.filter(id => id !== memberId)
      : [...selectedMembers, memberId];
    
    setSelectedMembers(newSelection);
    onSelectMembers?.(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
      onSelectMembers?.([]);
    } else {
      const allIds = filteredMembers.map(m => m.id);
      setSelectedMembers(allIds);
      onSelectMembers?.(allIds);
    }
  };

  const handleSendReminder = () => {
    if (selectedMembers.length > 0) {
      onSendReminder(selectedMembers);
    }
  };

  // Mock reminder history data
  const reminderHistory = [
    {
      id: 1,
      memberName: 'Jane Smith',
      type: 'email' as const,
      sentDate: '2026-01-02',
      status: 'delivered' as const,
      template: 'Overdue Payment'
    },
    {
      id: 2,
      memberName: 'John Doe',
      type: 'sms' as const,
      sentDate: '2025-12-28',
      status: 'delivered' as const,
      template: 'Upcoming Expiry'
    },
    {
      id: 3,
      memberName: 'Sarah Williams',
      type: 'email' as const,
      sentDate: '2026-01-01',
      status: 'opened' as const,
      template: 'Upcoming Expiry'
    },
    {
      id: 4,
      memberName: 'David Brown',
      type: 'sms' as const,
      sentDate: '2025-12-30',
      status: 'delivered' as const,
      template: 'Final Notice'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6 px-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-4 px-2 border-b-2 font-medium transition-colors ${
              activeTab === 'active'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Reminders
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-2 border-b-2 font-medium transition-colors ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Reminder History
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'active' ? (
          <>
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'upcoming' | 'overdue')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="overdue">Overdue</option>
              </select>
              <button
                onClick={handleSendReminder}
                disabled={selectedMembers.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Reminder ({selectedMembers.length})
              </button>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Member</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Membership</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Expiry Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount Due</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Last Reminder</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleSelectMember(member.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <p className="text-sm text-gray-500">{member.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded font-medium">
                          {member.membershipType}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{member.expiryDate}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {member.status === 'overdue' ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded flex items-center gap-1 w-fit">
                            <AlertCircle className="w-3 h-3" />
                            {Math.abs(member.daysUntilExpiry)} days overdue
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" />
                            {member.daysUntilExpiry} days left
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900">
                        ₦{member.amountDue.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {member.lastReminder || 'Never'}
                        {member.remindersSent > 0 && (
                          <span className="ml-2 text-xs text-gray-500 font-medium">
                            ({member.remindersSent}x sent)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => onSendReminder([member.id])}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                        >
                          Send
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No members found matching your criteria</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Reminder History */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Reminder History</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Member</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Template</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Sent Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reminderHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900">{record.memberName}</td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-2">
                          {record.type === 'email' ? (
                            <>
                              <Mail className="w-4 h-4 text-blue-600" />
                              <span className="text-sm">Email</span>
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-4 h-4 text-green-600" />
                              <span className="text-sm">SMS</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-900">{record.template}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{record.sentDate}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-sm rounded font-medium ${
                          record.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          record.status === 'opened' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};