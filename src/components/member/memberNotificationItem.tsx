'use client';

import Link from 'next/link';
import { Info, AlertCircle, CheckCircle, XCircle, Check } from 'lucide-react';
import { SyntheticNotification } from '@/types/memberTypes/member';

interface NotificationItemProps {
  notification: SyntheticNotification;
  isRead: boolean; // Read status tracked externally via localStorage
  onMarkAsRead?: (id: string, e: React.MouseEvent) => void;
}

export default function NotificationItem({ 
  notification, 
  isRead,
  onMarkAsRead 
}: NotificationItemProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'warning': return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'error': return <XCircle className="w-6 h-6 text-red-600" />;
      default: return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    if (read) return 'bg-white border-gray-200 hover:border-gray-300';
    
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      subscription: { color: "bg-purple-100 text-purple-700", label: "Subscription" },
      payment: { color: "bg-green-100 text-green-700", label: "Payment" },
      achievement: { color: "bg-yellow-100 text-yellow-700", label: "Achievement" },
      system: { color: "bg-blue-100 text-blue-700", label: "System" },
    };

    const badge = badges[category as keyof typeof badges];
    if (!badge) return null;

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const content = (
    <div className={`p-4 rounded-xl border transition-all ${getNotificationBg(notification.type, isRead)} ${!isRead && 'hover:shadow-md'}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 ${isRead ? 'opacity-50' : ''}`}>
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className={`font-semibold ${isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                {notification.title}
              </h3>
              <div className="mt-1">
                {getCategoryBadge(notification.category)}
              </div>
            </div>
            {!isRead && (
              <span className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0 mt-1.5"></span>
            )}
          </div>
          
          <p className={`text-sm ${isRead ? 'text-gray-500' : 'text-gray-700'}`}>
            {notification.message}
          </p>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
            
            {!isRead && onMarkAsRead && (
              <button
                onClick={(e) => onMarkAsRead(notification.id, e)}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (notification.link) {
    return <Link href={notification.link}>{content}</Link>;
  }

  return content;
}