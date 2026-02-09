"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Archive,
  CreditCard,
  Send,
  FileDown,
  Settings,
  Receipt,
  ScanLine,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/organization/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/organization/members", icon: Users },
  { name: "Plans", href: "/organization/plans", icon: Package },
  {
    name: "Transactions",
    href: "/organization/transactions",
    icon: CreditCard,
  },
  {
    name: "Organization Plans",
    href: "/organization/organization-plans",
    icon: Archive,
  },
  { name: "Billings", href: "/organization/billing", icon: Receipt },
  { name: "Check-ins", href: "/organization/check-ins", icon: ScanLine },
  { name: "Ping", href: "/organization/ping", icon: Send },
  { name: "Reports", href: "/organization/reports", icon: FileDown },
  { name: "Settings", href: "/organization/settings", icon: Settings },
];

// Define User type
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status?: string;
}

interface OrganizationSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function OrganizationSidebar({
  isCollapsed,
  onToggleCollapse,
}: OrganizationSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Load user data on mount
  useEffect(() => {
    // Load user data
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed.user);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 shadow-lg shadow-emerald-500/5 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "5rem" : "16rem",
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        className={`
          fixed left-0 top-0 z-40 h-screen
          bg-white/80 dark:bg-gray-900/80
          backdrop-blur-2xl
          border-r border-white/20 dark:border-gray-700/20
          shadow-2xl shadow-emerald-500/5
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo Section */}
          <div className="relative mb-8">
            {/* Logo - Always visible */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/30">
                  RT
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 blur-xl opacity-30 -z-10" />
              </div>
            </div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-center"
              >
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ReeTrack
                </h1>
              </motion.div>
            )}

            {/* Collapse Toggle - Hidden when collapsed */}
            {!isCollapsed && (
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");

              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      relative group flex items-center gap-3 px-3 py-2.5 rounded-xl
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                  >
                    {/* Active Glow */}
                    {isActive && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl blur-xl" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-r-full" />
                      </>
                    )}

                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? "text-emerald-600 dark:text-emerald-400" : ""
                      }`}
                    />

                    {!isCollapsed && (
                      <span className="font-medium text-sm">{item.name}</span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-6 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User Card - Only render when user data is available */}
          {!isCollapsed && user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mt-4 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200/50 dark:border-gray-700/50"
            >
              {/* Subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-xl blur-xl" />

              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {user.first_name?.charAt(0).toUpperCase() || "U"}
                  {user.last_name?.charAt(0).toUpperCase() || ""}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Collapsed User Avatar - Only render when user data is available */}
          {isCollapsed && user && (
            <div className="relative mt-4 flex justify-center group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg cursor-pointer">
                {user.first_name?.charAt(0).toUpperCase() || "U"}
                {user.last_name?.charAt(0).toUpperCase() || ""}
              </div>

              {/* Tooltip */}
              <div className="absolute left-full ml-6 bottom-0 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                <p className="font-semibold">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-gray-300">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}