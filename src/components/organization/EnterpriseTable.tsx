'use client';

import { PaymentReminder } from '../../types/organization';
import { Mail, MessageSquare, Phone, CheckCircle, XCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

interface RemindersTableProps {
  reminders: PaymentReminder[];
}

export function RemindersTable({ reminders }: RemindersTableProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'sent':
        return {
          icon: <CheckCircle className="h-3.5 w-3.5" />,
          className: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        };
      case 'failed':
        return {
          icon: <XCircle className="h-3.5 w-3.5" />,
          className: 'bg-red-50 text-red-600 border border-red-100',
        };
      default:
        return {
          icon: <Clock className="h-3.5 w-3.5" />,
          className: 'bg-amber-50 text-amber-700 border border-amber-100',
        };
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      payment_due: 'Payment Due',
      subscription_expiring: 'Expiring Soon',
      payment_failed: 'Payment Failed',
      welcome: 'Welcome',
    };
    return labels[type] || type;
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-3 w-3" />;
      case 'sms': return <Phone className="h-3 w-3" />;
      case 'whatsapp': return <MessageSquare className="h-3 w-3" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div
      className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden"
      style={{ fontFamily: 'Nunito, sans-serif' }}
    >
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-[#F9FAFB]">
              {['Member', 'Type', 'Channels', 'Scheduled', 'Status'].map((col) => (
                <th
                  key={col}
                  className="px-6 py-3.5 text-left text-xs font-bold text-[#9CA3AF] uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reminders.map((reminder) => {
              const status = getStatusConfig(reminder.status);
              return (
                <tr
                  key={reminder.id}
                  className="hover:bg-[#F9FAFB] transition-colors duration-150"
                >
                  {/* Member */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[#1F2937]">
                      {reminder.payer_user?.first_name} {reminder.payer_user?.last_name}
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {reminder.payer_user?.email}
                    </p>
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1F2937]">
                      {getTypeLabel(reminder.type)}
                    </span>
                  </td>

                  {/* Channels */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {reminder.channels.map((channel) => (
                        <span
                          key={channel}
                          className="inline-flex items-center gap-1 rounded-full bg-[#0D9488]/10 text-[#0D9488] px-2.5 py-0.5 text-xs font-semibold"
                        >
                          {getChannelIcon(channel)}
                          <span className="capitalize">{channel}</span>
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Scheduled */}
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    {formatDate(reminder.scheduled_for)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
                        status.className
                      )}
                    >
                      {status.icon}
                      {reminder.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-50">
        {reminders.map((reminder) => {
          const status = getStatusConfig(reminder.status);
          return (
            <div key={reminder.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">
                    {reminder.payer_user?.first_name} {reminder.payer_user?.last_name}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">{reminder.payer_user?.email}</p>
                </div>
                <span
                  className={clsx(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize flex-shrink-0',
                    status.className
                  )}
                >
                  {status.icon}
                  {reminder.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                <span className="font-medium text-[#1F2937]">{getTypeLabel(reminder.type)}</span>
                <span>{formatDate(reminder.scheduled_for)}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {reminder.channels.map((channel) => (
                  <span
                    key={channel}
                    className="inline-flex items-center gap-1 rounded-full bg-[#0D9488]/10 text-[#0D9488] px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {getChannelIcon(channel)}
                    <span className="capitalize">{channel}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}