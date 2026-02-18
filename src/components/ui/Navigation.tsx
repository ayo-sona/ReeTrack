"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import dynamic from "next/dynamic";
import { getCookie, deleteCookie } from "cookies-next/client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "#about" },
];

const ClientOnlyNavigation = () => {
  const token = getCookie("access_token");
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const targetTab = hoveredTab || activeTab;
    const targetElement = itemRefs.current[targetTab];
    if (targetElement && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = targetElement.getBoundingClientRect();
      setPillStyle({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
      });
    }
  }, [activeTab, hoveredTab]);

  const pillLeft = useSpring(pillStyle.left, { stiffness: 300, damping: 30 });
  const pillWidth = useSpring(pillStyle.width, { stiffness: 300, damping: 30 });

  const handleLogout = async () => {
    try {
      setLoading(true);
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      if (typeof window !== "undefined") localStorage.clear();
      deleteCookie("access_token");
      deleteCookie("current_role");
      deleteCookie("user_roles");
      setLoading(false);
      router.push("/");
    }
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navStyle = (extra?: object) => ({
    background: scrolled ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.40)",

    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: scrolled
      ? "0 4px 24px rgba(0,0,0,0.08), 0 0 40px 8px rgba(255,255,255,0.6)"
      : "0 2px 16px rgba(0,0,0,0.06), 0 0 30px 6px rgba(255,255,255,0.5)",
    ...extra,
  });

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-0 right-0 z-50 px-6 py-4 hidden md:block"
      >
        <div className="max-w-6xl mx-auto">
          <div
            className="transition-all duration-500 rounded-full"
            style={navStyle()}
          >
            <div className="w-full px-8 py-3 flex items-center justify-between gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative z-10 shrink-0"
              >
                <Link
                  href="/"
                  className="text-xl font-extrabold bg-gradient-to-r from-[#0D9488] to-[#0B7A70] bg-clip-text text-transparent tracking-tight"
                >
                  ReeTrack
                </Link>
              </motion.div>

              <div
                ref={navRef}
                className="relative flex items-center gap-2 px-3 py-2 rounded-full flex-1 justify-center max-w-md"
              >
                <motion.div
                  className="absolute top-2 bottom-2 rounded-full bg-white shadow-lg shadow-[#0D9488]/10 border border-gray-100"
                  style={{ left: pillLeft, width: pillWidth }}
                />
                {navItems.map((item, idx) => (
                  <motion.a
                    key={item.label}
                    ref={(el) => {
                      itemRefs.current[item.label] = el;
                    }}
                    href={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                    onClick={() => setActiveTab(item.label)}
                    onMouseEnter={() => setHoveredTab(item.label)}
                    onMouseLeave={() => setHoveredTab(null)}
                    className={`relative z-10 px-4 py-2 text-[14px] font-semibold tracking-tight transition-colors duration-200 whitespace-nowrap ${
                      activeTab === item.label
                        ? "text-[#1F2937]"
                        : "text-[#9CA3AF] hover:text-[#1F2937]"
                    }`}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>

              {token ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleLogout}
                    disabled={loading}
                    variant="secondary"
                    size="default"
                  >
                    {loading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              ) : (
                <div className="flex items-center gap-3 shrink-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Button variant="ghost" size="default" asChild>
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="default"
                      size="default"
                      asChild
                      className="shadow-lg shadow-[#F06543]/20 relative overflow-hidden"
                    >
                      <Link href="/auth">
                        <span className="relative z-10">Get Started</span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-0 right-0 z-50 px-4 md:hidden"
      >
        <div
          className="transition-all duration-500 rounded-[28px]"
          style={navStyle({ background: "rgba(255,255,255,0.92)" })}
        >
          <div className="w-full px-5 py-4 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-extrabold bg-gradient-to-r from-[#0D9488] to-[#0B7A70] bg-clip-text text-transparent tracking-tight"
            >
              ReeTrack
            </Link>
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-[#1F2937] hover:text-[#0D9488] transition-colors rounded-2xl hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-20 md:hidden bg-black/20"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-30 md:hidden overflow-y-auto rounded-[30px]"
              style={{
                // background: "rgba(255,255,255,0.97)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full flex flex-col justify-center px-8 py-16">
                <nav className="space-y-2 mt-20 mb-auto">
                  {navItems.map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.1 + idx * 0.1,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => {
                          setActiveTab(item.label);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`block dark:text-white text-left py-4 px-6 text-3xl font-bold transition-all rounded-2xl ${activeTab === item.label ? "text-[#0D9488] bg-gray-300" : "text-[#1F2937]/70"}`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {token ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      disabled={loading}
                      variant="secondary"
                      size="lg"
                      className="w-full"
                    >
                      {loading ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-4"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="w-full"
                    >
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      variant="default"
                      size="lg"
                      asChild
                      className="w-full shadow-2xl shadow-[#F06543]/20"
                    >
                      <Link
                        href="/auth"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </Button>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-auto pt-12"
                >
                  <p className="text-[#1F2937]/50 text-sm">
                    © {new Date().getFullYear()} ReeTrack Inc.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const Navigation = dynamic(() => Promise.resolve(ClientOnlyNavigation), {
  ssr: false,
  loading: () => (
    <div className="fixed top-6 left-0 right-0 z-50 px-6">
      <div className="max-w-6xl mx-auto h-16" />
    </div>
  ),
});
