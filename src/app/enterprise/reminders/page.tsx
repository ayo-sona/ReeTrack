'use client';

import { useState } from 'react';
import { Send, Settings as SettingsIcon } from 'lucide-react';
import { RemindersTable } from '../../../components/enterprise/RemindersTable';
import { SendReminderModal } from '../../../components/enterprise/SendReminderModal';
import { ReminderSettingsModal } from '../../../components/enterprise/ReminderSettingsModal';

// Mock data matching the Member interface from the components
const MOCK_MEMBERS = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 801 234 5678',
    membershipType: 'Gold',
    expiryDate: '2026-01-10',
    daysUntilExpiry: 6,
    status: 'upcoming' as const,
    lastReminder: '2025-12-28',
    remindersSent: 2,
    amountDue: 50000
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+234 802 345 6789',
    membershipType: 'Platinum',
    expiryDate: '2025-12-30',
    daysUntilExpiry: -5,
    status: 'overdue' as const,
    lastReminder: '2026-01-02',
    remindersSent: 4,
    amountDue: 100000
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+234 803 456 7890',
    membershipType: 'Silver',
    expiryDate: '2026-01-15',
    daysUntilExpiry: 11,
    status: 'upcoming' as const,
    lastReminder: null,
    remindersSent: 0,
    amountDue: 30000
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '+234 804 567 8901',
    membershipType: 'Gold',
    expiryDate: '2026-01-08',
    daysUntilExpiry: 4,
    status: 'upcoming' as const,
    lastReminder: '2026-01-01',
    remindersSent: 1,
    amountDue: 50000
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david@example.com',
    phone: '+234 805 678 9012',
    membershipType: 'Bronze',
    expiryDate: '2025-12-25',
    daysUntilExpiry: -10,
    status: 'overdue' as const,
    lastReminder: '2025-12-30',
    remindersSent: 5,
    amountDue: 20000
  }
];

const DEFAULT_SETTINGS = {
  autoRemindersEnabled: true,
  firstReminderDays: 14,
  secondReminderDays: 7,
  thirdReminderDays: 3,
  overdueReminderDays: 1,
  maxReminders: 5,
  preferredChannel: 'email' as 'email' | 'sms' | 'both',
  emailEnabled: true,
  smsEnabled: true,
  sendingStartHour: 9,
  sendingEndHour: 18,
  sendOnWeekends: false,
  defaultUpcomingTemplate: 1,
  defaultOverdueTemplate: 2,
  minDaysBeforeReminder: 1,
  stopRemindersAfterDays: 90
};

interface SendReminderData {
  memberIds: number[];
  channel: 'email' | 'sms' | 'both';
  templateId?: number;
  customMessage?: string;
  scheduleFor?: string;
}

export default function RemindersPage() {
  const [showSendModal, setShowSendModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Calculate stats
  const upcomingCount = MOCK_MEMBERS.filter(m => m.status === 'upcoming').length;
  const overdueCount = MOCK_MEMBERS.filter(m => m.status === 'overdue').length;
  const totalRemindersSent = MOCK_MEMBERS.reduce((sum, m) => sum + m.remindersSent, 0);

  const handleSendReminder = (memberIds: number[]) => {
    setSelectedMemberIds(memberIds);
    setShowSendModal(true);
  };

  const handleSendReminderSubmit = (data: SendReminderData) => {
    console.log('Send reminder:', data);
    setShowSendModal(false);
    setSelectedMemberIds([]);
    // Here you would typically make an API call to send the reminders
  };

  const handleSettingsSave = (newSettings: typeof DEFAULT_SETTINGS) => {
    console.log('Settings saved:', newSettings);
    setSettings(newSettings);
    setShowSettingsModal(false);
    // Here you would typically make an API call to save settings
  };

  const selectedMembers = MOCK_MEMBERS.filter(m => selectedMemberIds.includes(m.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Payment Reminders
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage and send payment reminders to members
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <SettingsIcon className="h-4 w-4" />
            Settings
          </button>
          <button
            onClick={() => {
              // If no members selected, open modal anyway (it will show all members)
              if (selectedMemberIds.length === 0) {
                setShowSendModal(true);
              } else {
                handleSendReminder(selectedMemberIds);
              }
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            Send Reminder {selectedMemberIds.length > 0 && `(${selectedMemberIds.length})`}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Expiry</p>
          <p className="mt-1 text-2xl font-bold text-orange-600 dark:text-orange-400">
            {upcomingCount}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
          <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
            {overdueCount}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Reminders Sent</p>
          <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
            {totalRemindersSent}
          </p>
        </div>
      </div>

      {/* Reminders Table */}
      <RemindersTable 
        members={MOCK_MEMBERS}
        onSendReminder={handleSendReminder}
        onSelectMembers={setSelectedMemberIds}
      />

      {/* Send Reminder Modal */}
      {showSendModal && (
        <SendReminderModal
          isOpen={showSendModal}
          onClose={() => {
            setShowSendModal(false);
            setSelectedMemberIds([]);
          }}
          selectedMembers={selectedMembers.length > 0 ? selectedMembers : MOCK_MEMBERS}
          onSend={handleSendReminderSubmit}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <ReminderSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          settings={settings}
          onSave={handleSettingsSave}
        />
      )}
    </div>
  );
}