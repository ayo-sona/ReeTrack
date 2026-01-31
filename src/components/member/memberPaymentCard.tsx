'use client';

import { Download, Check, X, Clock, CreditCard, Wallet as WalletIcon, Building } from 'lucide-react';
import { Payment } from '@/types/memberTypes/member';

interface PaymentCardProps {
  payment: Payment;
  onDownloadReceipt?: (paymentId: string) => void;
}

export default function PaymentCard({ payment, onDownloadReceipt }: PaymentCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <Check className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'wallet': return <WalletIcon className="w-4 h-4" />;
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'transfer': return <Building className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Payment Info */}
        <div className="flex-1">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
              {payment.organizationName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900">{payment.organizationName}</h3>
              <p className="text-sm text-gray-600 mb-2">{payment.planName}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(payment.status)}`}>
                  {getStatusIcon(payment.status)}
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
                  {getMethodIcon(payment.paymentMethod)}
                  {payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount & Actions */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">₦{payment.amount.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
            <p className="text-xs text-gray-400 mt-1">Ref: {payment.reference}</p>
          </div>

          {payment.status === 'success' && payment.receiptUrl && onDownloadReceipt && (
            <button
              onClick={() => onDownloadReceipt(payment.id)}
              className="p-3 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors flex-shrink-0"
              title="Download Receipt"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}