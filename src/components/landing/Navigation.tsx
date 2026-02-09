"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useSpring } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import dynamic from "next/dynamic";
import GlassSurface from "../effects/glassEffect";

// Better approach: Use dynamic import with ssr: false
const ClientOnlyNavigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Features");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "#about" },
  ];

  // Update pill position based on active or hovered tab
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

  // Smooth spring animation for pill movement
  const pillLeft = useSpring(pillStyle.left, { stiffness: 300, damping: 30 });
  const pillWidth = useSpring(pillStyle.width, { stiffness: 300, damping: 30 });

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-0 right-0 z-50 px-6 hidden md:block"
      >
        <div className="max-w-6xl mx-auto">
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={999}
            brightness={scrolled ? 98 : 95}
            opacity={scrolled ? 0.85 : 0.75}
            blur={scrolled ? 16 : 20}
            backgroundOpacity={scrolled ? 0.7 : 0.5}
            saturation={1.2}
            className="transition-all duration-500 shadow-2xl shadow-black/5"
          >
            <div className="w-full px-8 py-1 flex items-center justify-between gap-8">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative z-10 shrink-0"
              >
                <Link
                  href="/"
                  className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent tracking-tight"
                >
                  ReeTrack
                </Link>
              </motion.div>

              {/* Navigation Items with Sliding Pill */}
              <div
                ref={navRef}
                className="relative flex items-center gap-2 px-3 py-2 rounded-full flex-1 justify-center max-w-md"
              >
                {/* Animated pill background */}
                <motion.div
                  className="absolute top-2 bottom-2 rounded-full bg-white/90 shadow-lg shadow-emerald-600/10 backdrop-blur-sm border border-white/50"
                  style={{
                    left: pillLeft,
                    width: pillWidth,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />

                {/* Nav items */}
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
                        ? "text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Link
                    href="/auth/login"
                    className="relative z-10 px-5 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Sign In
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/auth"
                    className="relative z-10 px-7 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-300 overflow-hidden group"
                  >
                    <span className="relative z-10">Get Started</span>
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </Link>
                </motion.div>
              </div>
            </div>
          </GlassSurface>
        </div>

        {/* Subtle glow effect */}
        {scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-x-0 top-[72px] h-px bg-gradient-to-r from-transparent via-emerald-600/20 to-transparent max-w-6xl mx-auto px-6"
          />
        )}
      </motion.nav>

      {/* Mobile Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 left-0 right-0 z-50 px-4 md:hidden"
      >
        <div className="max-w-full mx-auto">
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={20}
            brightness={scrolled ? 98 : 95}
            opacity={scrolled ? 0.85 : 0.75}
            blur={scrolled ? 16 : 20}
            backgroundOpacity={scrolled ? 0.7 : 0.5}
            saturation={1.2}
            className="transition-all duration-500 shadow-xl shadow-black/5"
          >
            <div className="w-full px-6 py-4 flex items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="text-lg font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent tracking-tight"
              >
                ReeTrack
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </GlassSurface>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-4 right-4 z-40 md:hidden"
        >
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={20}
            brightness={98}
            opacity={0.95}
            blur={20}
            backgroundOpacity={0.8}
            saturation={1.2}
            className="shadow-xl shadow-black/10"
          >
            <div className="p-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-gray-900 font-semibold text-lg py-2 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 space-y-3 border-t border-gray-200">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center py-2.5 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-semibold shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30 transition-all"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </GlassSurface>
        </motion.div>
      )}
    </>
  );
};

// Export with dynamic import to disable SSR
export const Navigation = dynamic(() => Promise.resolve(ClientOnlyNavigation), {
  ssr: false,
  loading: () => (
    <div className="fixed top-6 left-0 right-0 z-50 px-6">
      <div className="max-w-6xl mx-auto h-16" />
    </div>
  ),
});
