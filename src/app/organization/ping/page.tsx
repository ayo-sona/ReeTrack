'use client';

import { useState } from 'react';
import { Send, Settings as SettingsIcon, Search, CheckSquare, Square, Clock, AlertCircle } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  planName: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: 'active' | 'expiring_soon' | 'expired';
}

interface SentPing {
  id: string;
  message: string;
  sentTo: number;
  sentAt: string;
  channel: 'email' | 'sms' | 'both';
}

// Mock data
const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Chidi Okonkwo',
    email: 'chidi@example.com',
    phone: '+234 801 234 5678',
    planName: 'Premium Membership',
    expiryDate: '2026-02-10',
    daysUntilExpiry: 10,
    status: 'expiring_soon'
  },
  {
    id: '2',
    name: 'Amara Nwosu',
    email: 'amara@example.com',
    phone: '+234 802 345 6789',
    planName: 'Basic Membership',
    expiryDate: '2025-12-30',
    daysUntilExpiry: -32,
    status: 'expired'
  },
  {
    id: '3',
    name: 'Funke Ajayi',
    email: 'funke@example.com',
    phone: '+234 804 567 8901',
    planName: 'VIP Membership',
    expiryDate: '2026-06-01',
    daysUntilExpiry: 121,
    status: 'active'
  },
  {
    id: '4',
    name: 'Tunde Bakare',
    email: 'tunde@example.com',
    phone: '+234 805 678 9012',
    planName: 'Premium Membership',
    expiryDate: '2026-02-15',
    daysUntilExpiry: 15,
    status: 'expiring_soon'
  },
  {
    id: '5',
    name: 'Ngozi Eze',
    email: 'ngozi@example.com',
    phone: '+234 806 789 0123',
    planName: 'Basic Membership',
    expiryDate: '2026-01-28',
    daysUntilExpiry: -3,
    status: 'expired'
  },
];

const MOCK_SENT_PINGS: SentPing[] = [
  {
    id: '1',
    message: 'Your membership expires in 7 days. Renew now to continue enjoying our services!',
    sentTo: 12,
    sentAt: '2026-01-30T14:30:00Z',
    channel: 'both'
  },
  {
    id: '2',
    message: 'Happy New Year! Special 20% discount on renewals this month.',
    sentTo: 45,
    sentAt: '2026-01-01T09:00:00Z',
    channel: 'email'
  },
];

export default function PingsPage() {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'expiring_soon' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter members
  const filteredMembers = MOCK_MEMBERS.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const expiringCount = MOCK_MEMBERS.filter(m => m.status === 'expiring_soon').length;
  const expiredCount = MOCK_MEMBERS.filter(m => m.status === 'expired').length;

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length && filteredMembers.length > 0) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(m => m.id));
    }
  };

  const handleQuickSelect = (type: 'expiring' | 'expired' | 'all') => {
    const members = type === 'all' 
      ? MOCK_MEMBERS 
      : MOCK_MEMBERS.filter(m => m.status === (type === 'expiring' ? 'expiring_soon' : 'expired'));
    setSelectedMembers(members.map(m => m.id));
    setStatusFilter(type === 'all' ? 'all' : type === 'expiring' ? 'expiring_soon' : 'expired');
  };

  const handleSendPing = (data: { message: string; channel: 'email' | 'sms' | 'both' }) => {
    console.log('Sending ping to:', selectedMembers, data);
    // TODO: API call to send messages
    alert(`Ping sent to ${selectedMembers.length} members via ${data.channel}`);
    setShowSendModal(false);
    setSelectedMembers([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-NG', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">
            Send reminders and updates to your members
          </p>
        </div>
        <button
          onClick={() => setShowAutomationModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <SettingsIcon className="w-4 h-4" />
          Auto-Reminders
        </button>
      </div>

      {/* Quick Stats & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Expiring Soon */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <p className="text-sm font-medium text-orange-900">Expiring Soon</p>
            </div>
            <p className="text-3xl font-bold text-orange-600">{expiringCount}</p>
          </div>
          <button
            onClick={() => handleQuickSelect('expiring')}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
          >
            Notify All Expiring
          </button>
        </div>

        {/* Overdue */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border border-red-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-medium text-red-900">Overdue</p>
            </div>
            <p className="text-3xl font-bold text-red-600">{expiredCount}</p>
          </div>
          <button
            onClick={() => handleQuickSelect('expired')}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Notify All Overdue
          </button>
        </div>
      </div>

      {/* Recent Sent Notifications */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h2>
        {MOCK_SENT_PINGS.length > 0 ? (
          <div className="space-y-3">
            {MOCK_SENT_PINGS.map((ping) => (
              <div key={ping.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 mb-2 line-clamp-2">{ping.message}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Send className="w-3 h-3" />
                        {ping.sentTo} members
                      </span>
                      <span>•</span>
                      <span className="capitalize">{ping.channel}</span>
                      <span>•</span>
                      <span>{formatTimestamp(ping.sentAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Send className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No notifications sent yet</p>
          </div>
        )}
      </div>

      {/* Members Selection */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Select Members</h2>
            <button
              onClick={() => setShowSendModal(true)}
              disabled={selectedMembers.length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
                selectedMembers.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              Send to {selectedMembers.length} {selectedMembers.length === 1 ? 'Member' : 'Members'}
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              {(['all', 'expiring_soon', 'expired'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All Members' : 
                   status === 'expiring_soon' ? 'Expiring Soon' : 
                   'Overdue'}
                </button>
              ))}
            </div>

            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {selectedMembers.length === filteredMembers.length && filteredMembers.length > 0 ? (
                <>
                  <CheckSquare className="w-4 h-4" />
                  Deselect All
                </>
              ) : (
                <>
                  <Square className="w-4 h-4" />
                  Select All ({filteredMembers.length})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <label
                key={member.id}
                className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedMembers.includes(member.id) ? 'bg-blue-50 hover:bg-blue-100' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(member.id)}
                  onChange={() => handleSelectMember(member.id)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-600 truncate">{member.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{member.planName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        member.status === 'active' ? 'bg-green-100 text-green-700' :
                        member.status === 'expiring_soon' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {member.status === 'expiring_soon' ? `${member.daysUntilExpiry}d left` :
                         member.status === 'expired' ? `${Math.abs(member.daysUntilExpiry)}d overdue` :
                         'Active'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {member.status === 'expired' ? 'Expired' : 'Expires'} {formatDate(member.expiryDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No members found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showSendModal && (
        <SendModal
          selectedCount={selectedMembers.length}
          onClose={() => setShowSendModal(false)}
          onSend={handleSendPing}
        />
      )}

      {showAutomationModal && (
        <AutomationModal
          onClose={() => setShowAutomationModal(false)}
        />
      )}
    </div>
  );
}

// Send Message Modal
function SendModal({ 
  selectedCount,
  onClose,
  onSend 
}: { 
  selectedCount: number;
  onClose: () => void;
  onSend: (data: { message: string; channel: 'email' | 'sms' | 'both' }) => void;
}) {
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<'email' | 'sms' | 'both'>('both');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend({ message, channel });
    }
  };

  const messageTemplates = [
    "Your membership expires soon. Renew now to continue enjoying our services!",
    "Your membership has expired. Please renew to regain access.",
    "Special renewal offer: Get 10% off when you renew this week!",
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Send to {selectedCount} {selectedCount === 1 ? 'Member' : 'Members'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Quick Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Templates
            </label>
            <div className="space-y-2">
              {messageTemplates.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(template)}
                  className="w-full text-left px-4 py-2.5 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              {message.length} characters
              {channel !== 'email' && ` • ${Math.ceil(message.length / 160)} SMS`}
            </p>
          </div>

          {/* Channel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send Via
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['email', 'sms', 'both'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setChannel(option)}
                  className={`px-4 py-3 rounded-lg border-2 font-medium text-sm capitalize transition-all ${
                    channel === option
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!message.trim()}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Send Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Automation Settings Modal
function AutomationModal({ onClose }: { onClose: () => void }) {
  const [enabled, setEnabled] = useState(true);
  const [reminderDays, setReminderDays] = useState([30, 14, 7]);
  const [channel, setChannel] = useState<'email' | 'sms' | 'both'>('email');
  const [customMessage, setCustomMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Automation settings:', { enabled, reminderDays, channel, customMessage });
    // TODO: API call to save settings
    alert('Automation settings saved!');
    onClose();
  };

  const toggleDay = (day: number) => {
    setReminderDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort((a, b) => b - a)
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Automatic Reminders</h2>
          <p className="text-sm text-gray-600 mt-1">Set up automated notifications for expiring memberships</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div>
              <p className="font-medium text-gray-900">Enable Auto-Reminders</p>
              <p className="text-sm text-gray-600">Send automatic notifications before memberships expire</p>
            </div>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                enabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                enabled ? 'translate-x-7' : ''
              }`} />
            </button>
          </div>

          {enabled && (
            <>
              {/* Reminder Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Send Reminders (Days Before Expiry)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[30, 14, 7, 3, 1].map((days) => (
                    <label
                      key={days}
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        reminderDays.includes(days)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={reminderDays.includes(days)}
                        onChange={() => toggleDay(days)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">{days} days</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Channel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Send Via
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['email', 'sms', 'both'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setChannel(option)}
                      className={`px-4 py-3 rounded-lg border-2 font-medium text-sm capitalize transition-all ${
                        channel === option
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                  placeholder="Leave empty to use default message template..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  If empty, we&apos;ll use: &quot;Your membership expires in [X] days. Renew now!&quot
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}