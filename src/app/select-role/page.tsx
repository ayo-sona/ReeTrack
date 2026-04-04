"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Building2, User, ArrowRight } from "lucide-react";
import { deleteCookie, setCookie } from "cookies-next";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/layout/Logo";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { Spinner } from "@heroui/react";

export default function SelectRolePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    setUserData(user);
    setLoading(false);
  }, []);

  const handleRoleSelect = (role: "member" | "organization") => {
    if (role === "member") {
      setCookie("current_role", "MEMBER", {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        // secure: true,
        secure: false,
        path: "/",
      });
      router.push("/member/dashboard");
    } else {
      setCookie("current_role", "ORG", {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        // secure: true,
        secure: false,
        path: "/",
      });
      router.push("/select-org");
    }
  };

  const isMember = userData?.organizations
    ?.map((org: any) => org.role)
    .includes("MEMBER");

  const isOrgAdmin =
    userData?.organizations?.map((org: any) => org.role).includes("STAFF") ||
    userData?.organizations?.map((org: any) => org.role).includes("ADMIN");

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await apiClient.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      if (typeof window !== "undefined") localStorage.clear();
      // deleteCookie("access_token");
      deleteCookie("current_role");
      deleteCookie("user_roles");
      setLoggingOut(false);
      router.push("/auth/login");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-white flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#F06543] to-[#D85436]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 55%)" }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#0D9488] to-[#0B7A70]"
            style={{ clipPath: "polygon(0 55%, 100% 45%, 100% 100%, 0 100%)" }}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-base font-bold text-white">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-white"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Diagonal Split Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#F06543] to-[#D85436]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 55%)" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0D9488] to-[#0B7A70]"
          style={{ clipPath: "polygon(0 55%, 100% 45%, 100% 100%, 0 100%)" }}
        />
      </div>

      {/* Scattered Illustrations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden md:block absolute top-[8%] left-[8%] w-28 h-28 opacity-80">
          <Image
            src="/undraw/working_together.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden md:block absolute top-[12%] right-[10%] w-32 h-32 opacity-80">
          <Image
            src="/undraw/shared_dashboard.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden md:block absolute bottom-[15%] left-[12%] w-28 h-28 opacity-80">
          <Image
            src="/undraw/observe.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden md:block absolute bottom-[12%] right-[15%] w-30 h-30 opacity-80">
          <Image
            src="/undraw/organizing.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4 text-white">
              <Link href="/">
                <Logo size={32} variant="white" />
              </Link>
            </div>
            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome back, {userData?.firstName || "there"}! 👋
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg text-white/90 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Choose your workspace to continue
            </motion.p>
          </div>

          {/* Role Selection Cards */}
          <div
            className={`grid ${
              isMember && isOrgAdmin
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1 max-w-xl mx-auto"
            } gap-6`}
          >
            {/* Member Card */}
            {isMember && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="relative"
              >
                <button
                  onClick={() => handleRoleSelect("member")}
                  onMouseEnter={() => setHoveredCard("member")}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_rgba(13,148,136,0.3)] hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="p-8 sm:p-10 relative">
                    {/* Gradient Overlay on Hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-[#0D9488]/10 to-transparent transition-opacity duration-300 ${
                        hoveredCard === "member" ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {/* Icon */}
                    <div className="relative mb-6 flex justify-center">
                      <div
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          hoveredCard === "member"
                            ? "bg-[#0D9488] shadow-lg shadow-[#0D9488]/30"
                            : "bg-[#0D9488]/10"
                        }`}
                      >
                        <User
                          className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-300 ${
                            hoveredCard === "member"
                              ? "text-white"
                              : "text-[#0D9488]"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative text-center space-y-3">
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
                        Member Portal
                      </h3>
                      <p className="text-base text-[#1F2937]/70 font-semibold leading-relaxed">
                        Access your personal dashboard, view check-ins, and
                        manage your membership
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="relative mt-6 flex items-center justify-center">
                      <div
                        className={`flex items-center gap-2 font-bold text-[#0D9488] transition-all duration-300 ${
                          hoveredCard === "member"
                            ? "translate-x-2"
                            : "translate-x-0"
                        }`}
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            )}

            {/* Organization Card */}
            {isOrgAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="relative"
              >
                <button
                  onClick={() => handleRoleSelect("organization")}
                  onMouseEnter={() => setHoveredCard("organization")}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_rgba(240,101,67,0.3)] hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="p-8 sm:p-10 relative">
                    {/* Gradient Overlay on Hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-[#F06543]/10 to-transparent transition-opacity duration-300 ${
                        hoveredCard === "organization"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />

                    {/* Icon */}
                    <div className="relative mb-6 flex justify-center">
                      <div
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          hoveredCard === "organization"
                            ? "bg-[#F06543] shadow-lg shadow-[#F06543]/30"
                            : "bg-[#F06543]/10"
                        }`}
                      >
                        <Building2
                          className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-300 ${
                            hoveredCard === "organization"
                              ? "text-white"
                              : "text-[#F06543]"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative text-center space-y-3">
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
                        Organization Hub
                      </h3>
                      <p className="text-base text-[#1F2937]/70 font-semibold leading-relaxed">
                        Manage your community, track member activity, and grow
                        your organization
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="relative mt-6 flex items-center justify-center">
                      <div
                        className={`flex items-center gap-2 font-bold text-[#F06543] transition-all duration-300 ${
                          hoveredCard === "organization"
                            ? "translate-x-2"
                            : "translate-x-0"
                        }`}
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <motion.div
            className="mt-12 text-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {loggingOut ? (
              <Spinner color="default" />
            ) : (
              <button
                onClick={() => {
                  // localStorage.clear();
                  // document.cookie.split(";").forEach((c) => {
                  //   document.cookie = c
                  //     .replace(/^ +/, "")
                  //     .replace(
                  //       /=.*/,
                  //       "=;expires=" + new Date().toUTCString() + ";path=/",
                  //     );
                  // });
                  // router.push("/auth/login");
                  handleLogout();
                }}
                className="text-sm font-bold text-white/90 hover:text-white transition-colors underline decoration-white/40 hover:decoration-white"
              >
                Not you? Sign out
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Blurs */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
