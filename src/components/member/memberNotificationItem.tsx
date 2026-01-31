'use client';

import Link from 'next/link';
import { Info, AlertCircle, CheckCircle, XCircle, Check } from 'lucide-react';
import { Notification } from '@/types/memberTypes/member';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string, e: React.MouseEvent) => void;
}

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'warning': return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'error': return <XCircle className="w-6 h-6 text-red-600" />;
      default: return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    if (read) return 'bg-white border-gray-200';
    
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const content = (
    <div className={`p-4 rounded-xl border transition-all hover:shadow-md ${getNotificationBg(notification.type, notification.read)}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 ${notification.read ? 'opacity-50' : ''}`}>
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
              {notification.title}
            </h3>
            {!notification.read && (
              <span className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0 mt-1.5"></span>
            )}
          </div>
          
          <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
            {notification.message}
          </p>

          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
            
            {!notification.read && onMarkAsRead && (
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