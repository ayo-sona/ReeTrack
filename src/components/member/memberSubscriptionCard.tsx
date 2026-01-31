'use client';

import Link from 'next/link';
import { CreditCard, QrCode, Play, Pause, X } from 'lucide-react';
import { Subscription } from '@/types/memberTypes/member';

interface SubscriptionCardProps {
  subscription: Subscription;
  onAction?: (action: 'pause' | 'resume' | 'cancel' | 'checkin', id: string) => void;
  showActions?: boolean;
}

export default function SubscriptionCard({ subscription, onAction, showActions = false }: SubscriptionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'canceled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'canceled': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            {subscription.organizationName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{subscription.organizationName}</h3>
            <p className="text-sm text-gray-600">{subscription.planName}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(subscription.status)}`}>
          {getStatusIcon(subscription.status)}
          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-bold text-gray-900">₦{subscription.planPrice.toLocaleString()}</span>
        <span className="text-gray-600">/{subscription.planInterval}</span>
      </div>

      {/* Features */}
      <div className="space-y-2 mb-4">
        {subscription.features.slice(0, 3).map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            {feature}
          </div>
        ))}
        {subscription.features.length > 3 && (
          <p className="text-sm text-gray-500">+{subscription.features.length - 3} more features</p>
        )}
      </div>

      {/* Next Billing */}
      {subscription.status === 'active' && subscription.nextBillingDate && (
        <div className="pt-4 mb-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Next billing: <span className="font-medium text-gray-900">
              {new Date(subscription.nextBillingDate).toLocaleDateString()}
            </span>
          </p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          {subscription.status === 'active' && (
            <>
              <button
                onClick={() => onAction?.('checkin', subscription.id)}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <QrCode className="w-4 h-4" />
                Check In
              </button>
              <button
                onClick={() => onAction?.('pause', subscription.id)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Pause className="w-4 h-4" />
              </button>
            </>
          )}

          {subscription.status === 'paused' && (
            <button
              onClick={() => onAction?.('resume', subscription.id)}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Play className="w-4 h-4" />
              Resume
            </button>
          )}

          <Link href={`/member/subscriptions/${subscription.id}`} className="flex-1">
            <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              View Details
            </button>
          </Link>
        </div>
      )}

      {!showActions && (
        <Link href={`/member/subscriptions/${subscription.id}`}>
          <button className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            View Details
          </button>
        </Link>
      )}
    </div>
  );
}