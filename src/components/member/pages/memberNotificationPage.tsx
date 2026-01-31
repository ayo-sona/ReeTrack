'use client';

import { useState } from 'react';
import { Bell, Check, CheckCheck, Info, AlertCircle, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/memberHook/useMember';
import { Notification } from '@/types/memberTypes/member';
import Link from 'next/link';

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications?.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    return true;
  });

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await markAsRead.mutateAsync(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'warning': return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'error': return <XCircle className="w-6 h-6 text-red-600" />;
      default: return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => {
    const content = (
      <div className={`p-4 rounded-xl border transition-all ${
        notification.read 
          ? 'bg-white border-gray-200 hover:border-gray-300' 
          : `${getNotificationBg(notification.type)} hover:shadow-md`
      }`}>
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
              
              {!notification.read && (
                <button
                  onClick={(e) => handleMarkAsRead(notification.id, e)}
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({notifications?.length || 0})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === 'unread'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-white rounded-xl border border-gray-100"></div>
              </div>
            ))}
          </div>
        ) : filteredNotifications && filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? "You're all caught up! New notifications will appear here."
                : 'When you receive notifications, they will appear here.'}
            </p>
          </div>
        )}

        {/* Notification Settings Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500" />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">Payment Reminders</p>
                <p className="text-sm text-gray-600">Get notified before payments are due</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500" />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">Promotions & Updates</p>
                <p className="text-sm text-gray-600">Receive updates about new features and offers</p>
              </div>
              <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}