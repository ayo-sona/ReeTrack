'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Wallet,
  CreditCard,
  QrCode,
  Bell,
  User,
  Gift,
  Menu,
  X,
  LogOut,
  Settings,
} from 'lucide-react';
import { useProfile, useNotifications } from '@/hooks/memberHook/useMember';

interface MemberLayoutProps {
  children: React.ReactNode;
}

export default function MemberLayout({ children }: MemberLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: notifications } = useNotifications();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const navigation = [
    { name: 'Dashboard', href: '/member/dashboard', icon: Home },
    { name: 'Wallet', href: '/member/wallet', icon: Wallet },
    { name: 'Subscriptions', href: '/member/subscriptions', icon: CreditCard },
    { name: 'Check In', href: '/member/check-in', icon: QrCode },
    { name: 'Payments', href: '/member/payments', icon: CreditCard },
    { name: 'Referrals', href: '/member/referrals', icon: Gift },
  ];

  const handleLogout = () => {
    // TODO: Implement logout
    localStorage.removeItem('access_token');
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <Link href="/member/dashboard">
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              PayPips
            </h1>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/member/notifications">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-6 h-6 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
              <Link href="/member/profile">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
          <div className="p-6">
            <Link href="/member/dashboard">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-8">
                PayPips
              </h1>
            </Link>

            {/* Profile Section */}
            <div className="mb-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {profile?.firstName} {profile?.lastName}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{profile?.email}</p>
                </div>
              </div>
              <Link href="/member/profile">
                <button className="w-full text-sm text-emerald-700 hover:text-emerald-800 font-medium">
                  View Profile →
                </button>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <button
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </Link>
                );
              })}

              {/* Notifications with Badge */}
              <Link href="/member/notifications">
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    pathname === '/member/notifications'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">Notifications</span>
                </button>
              </Link>
            </nav>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
              <Link href="/member/profile">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}