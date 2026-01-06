'use client';

import React from 'react';
import { AuthProvider } from '../../features/auth/authContext';
import { NotificationProvider } from '../../features/notifications/notificationContext';
import { Header } from '../../components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}