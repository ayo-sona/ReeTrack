'use client';

import { useState } from 'react';
import { useMembers } from '../../hooks/useMembers';
import { Button } from '@/components/ui/button';

interface ManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ManualPaymentData) => void;
}

export interface ManualPaymentData {
  memberId: string;
  amount: number;
  currency: string;
  method: 'card' | 'bank_transfer' | 'ussd' | 'cash';
  description: string;
  paidAt: string;
}

export function ManualPaymentModal({ isOpen, onClose, onSave }: ManualPaymentModalProps) {
  const [formData, setFormData] = useState<ManualPaymentData>({
    memberId: '',
    amount: 0,
    currency: 'NGN',
    method: 'cash',
    description: '',
    paidAt: new Date().toISOString().split('T')[0],
  });

  const { data: members = [] } = useMembers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all';
  const labelClass = 'block text-sm font-semibold text-[#1F2937] mb-1.5';

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-xl border border-gray-100 bg-white shadow-xl max-h-[90vh] flex flex-col"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          {/* Header */}
          <div className="border-b border-gray-100 px-6 py-5 flex-shrink-0">
            <h2 className="text-lg font-bold text-[#1F2937]">Log Manual Payment</h2>
            <p className="text-sm text-[#9CA3AF] mt-0.5">
              Record a payment made outside the platform
            </p>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1">
            <form onSubmit={handleSubmit} id="manual-payment-form" className="p-6 space-y-4">
              {/* Member */}
              <div>
                <label className={labelClass}>
                  Member <span className="text-[#F06543]">*</span>
                </label>
                <select
                  value={formData.memberId}
                  onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                  className={inputClass}
                  required
                >
                  <option value="">Select a member...</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.user.first_name} {member.user.last_name} — {member.user.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className={labelClass}>
                  Amount (₦) <span className="text-[#F06543]">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className={inputClass}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Method & Date — side by side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Payment Method <span className="text-[#F06543]">*</span>
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) =>
                      setFormData({ ...formData, method: e.target.value as ManualPaymentData['method'] })
                    }
                    className={inputClass}
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                    <option value="ussd">USSD</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Payment Date <span className="text-[#F06543]">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.paidAt}
                    onChange={(e) => setFormData({ ...formData, paidAt: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>
                  Description <span className="text-[#F06543]">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="e.g., Monthly membership payment"
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>

              {/* Notice */}
              <div className="rounded-lg bg-[#0D9488]/5 border border-[#0D9488]/15 px-4 py-3">
                <p className="text-xs text-[#0D9488] leading-relaxed">
                  <span className="font-bold">Note:</span> This logs a payment manually without processing through a payment gateway.
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="manual-payment-form" variant="secondary" size="sm">
              Log Payment
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}