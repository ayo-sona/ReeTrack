"use client";

import { useState } from "react";
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

// Helper function to get user from localStorage safely
function getUserFromLocalStorage(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.user;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
  return null;
}

export function OrganizationSidebar({
  isCollapsed,
  onToggleCollapse,
}: OrganizationSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Use lazy initialization to load user data once on mount
  const [user] = useState<User | null>(getUserFromLocalStorage);

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
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "280px",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`
          hidden lg:sticky lg:flex top-0 left-0 h-screen flex-col
          bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl
          border-r border-white/20 dark:border-gray-700/20
          shadow-xl shadow-emerald-500/5
          z-0
          ${isMobileOpen ? "fixed !flex translate-x-0 z-40" : ""}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-white/10 dark:border-gray-700/10">
            {/* Logo - Always visible */}
            <div
              className={`flex items-center gap-3 ${isCollapsed ? "mx-auto" : ""}`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 blur-xl opacity-20 -z-10"></div>
              </div>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                >
                  PayPips
                </motion.span>
              )}
            </div>

            {/* Collapse Toggle - Hidden when collapsed */}
            {!isCollapsed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleCollapse}
                className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.03,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ x: isActive ? 0 : 4 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className={`
                        relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl
                        transition-all duration-200 group
                        ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent shadow-lg shadow-emerald-500/5"
                            : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                        }
                      `}
                    >
                      {/* Active Glow */}
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-transparent"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 40,
                            }}
                          />
                          <motion.div
                            layoutId="activeBar"
                            className="absolute left-0 w-1 h-10 bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-500 rounded-r-full shadow-lg shadow-emerald-500/50"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 40,
                            }}
                          />
                        </>
                      )}

                      <Icon
                        className={`
                          w-5 h-5 flex-shrink-0 transition-all duration-200
                          ${
                            isActive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                          }
                        `}
                      />

                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                          className={`
                            font-medium text-sm transition-colors duration-200
                            ${
                              isActive
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-gray-700 dark:text-gray-300"
                            }
                          `}
                        >
                          {item.name}
                        </motion.span>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-6 px-4 py-2.5 bg-gray-900/95 dark:bg-gray-700/95 backdrop-blur-xl text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl">
                          {item.name}
                        </div>
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* User Card - Only render when user data is available */}
          {!isCollapsed && user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="p-4"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/60 to-white/30 dark:from-gray-800/60 dark:to-gray-800/30 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 p-4 shadow-lg shadow-emerald-500/5">
                {/* Subtle glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-3xl"></div>

                <div className="relative flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-emerald-500/25">
                      {user.first_name?.charAt(0).toUpperCase() || "U"}
                      {user.last_name?.charAt(0).toUpperCase() || ""}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg"></div>
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
              </div>
            </motion.div>
          )}

          {/* Collapsed User Avatar - Only render when user data is available */}
          {isCollapsed && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              <div className="relative group">
                <div className="w-11 h-11 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-emerald-500/25 cursor-pointer hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-200">
                  {user.first_name?.charAt(0).toUpperCase() || "U"}
                  {user.last_name?.charAt(0).toUpperCase() || ""}
                </div>
                <div className="absolute -bottom-1 right-1/2 translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg"></div>

                {/* Tooltip */}
                <div className="absolute left-full ml-6 top-1/2 -translate-y-1/2 px-4 py-3 bg-gray-900/95 dark:bg-gray-700/95 backdrop-blur-xl text-white rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl">
                  <p className="font-semibold text-sm">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-300 mt-0.5">{user.email}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.aside>
    </>
  );
}