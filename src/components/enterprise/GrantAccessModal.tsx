'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Member, AccessGrant } from '../../types/member';

interface GrantAccessModalProps {
  member: Member;
  onClose: () => void;
  onGrant: (data: Omit<AccessGrant, 'grantedBy' | 'grantedAt' | 'memberId'>) => void;
}

export function GrantAccessModal({ member, onClose, onGrant }: GrantAccessModalProps) {
  const [duration, setDuration] = useState('30');
  const [durationType, setDurationType] = useState<'days' | 'months'>('days');
  const [reason, setReason] = useState('');

  const calculateExpiryDate = () => {
    const date = new Date();
    if (durationType === 'days') {
      date.setDate(date.getDate() + parseInt(duration));
    } else {
      date.setMonth(date.getMonth() + parseInt(duration));
    }
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGrant({
      duration: parseInt(duration),
      durationType,
      expiryDate: calculateExpiryDate(),
      reason,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Grant Access
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Member Info */}
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Granting access to:</p>
              <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">{member.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Access Duration
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="duration"
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                <select
                  value={durationType}
                  onChange={(e) => setDurationType(e.target.value as 'days' | 'months')}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            {/* Expiry Date Preview */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Access will expire on: <strong>{calculateExpiryDate()}</strong>
              </p>
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Access Grant
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="E.g., Complimentary access, special promotion..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {/* Notice */}
            <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-3">
              <p className="text-xs text-orange-600 dark:text-orange-400">
                <strong>Note:</strong> Access will expire automatically on the specified date. It cannot be revoked manually.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Grant Access
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}