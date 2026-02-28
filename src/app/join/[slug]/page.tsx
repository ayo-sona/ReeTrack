"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { Users, ArrowRight, AlertCircle, Home } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const PENDING_JOIN_SLUG_KEY = "pendingJoinSlug";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ── Shared background ─────────────────────────────────────────────────────────
function AuthBackground() {
  return (
    <>
      {/* Diagonal split */}
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

      {/* Scattered illustrations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[5%] left-[40%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/relaxing_hammock.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-[35%] right-[25%] w-26 h-26 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/eating_together.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[3%] right-[35%] w-20 h-20 sm:w-24 sm:h-24 opacity-85">
          <Image
            src="/undraw/hot_air_balloon.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[30%] right-[20%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/skateboarding.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[44%] left-[27%] w-24 h-24 opacity-90">
          <Image
            src="/undraw/fitness.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[25%] left-[22%] w-22 h-22 sm:w-28 sm:h-28 opacity-85">
          <Image
            src="/undraw/floating_balloon.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-[10%] left-[25%] w-20 h-20 sm:w-28 sm:h-28 opacity-90">
          <Image
            src="/undraw/playing_with_dog.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-[10%] right-[24%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/bike_driving.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
    </>
  );
}

export default function JoinPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await apiClient.get(`/organizations/${slug}`);
        // console.log(res.data.data);
        const name = res.data?.data?.name;
        if (!name) {
          setError("Organization not found.");
          setFetchLoading(false);
          return;
        }
        setOrganizationName(name);

        if (typeof window !== "undefined") {
          localStorage.setItem(PENDING_JOIN_SLUG_KEY, slug);
        }

        const token = getCookie("access_token");
        if (token) {
          await joinOrganization(slug, name);
          return;
        }
      } catch (err: any) {
        const { statusCode, message } = err.response.data;
        if (err.response) {
          setError(message);
        } else {
          setError(err.message || "Failed to join. Please try later.");
        }
        return;
      } finally {
        setFetchLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const joinOrganization = async (orgSlug: string, name: string) => {
    setJoining(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const email = userData?.user?.email;

      await apiClient.post("/auth/register-member", {
        organizationSlug: orgSlug,
        email,
      });

      if (typeof window !== "undefined") {
        localStorage.removeItem(PENDING_JOIN_SLUG_KEY);
      }

      toast.success(`Welcome to ${name}! 🎉`);
      router.replace("/member/communities");
    } catch (err: any) {
      console.log(err.response?.data?.data?.message);
      // const message = String(
      //   err.response?.data?.data?.message ?? "Failed to join organization.",
      // );

      // if (message.toLowerCase().includes("already")) {
      //   if (typeof window !== "undefined") {
      //     localStorage.removeItem(PENDING_JOIN_SLUG_KEY);
      //   }
      //   router.replace("/member");
      //   return;
      // }
      // setError(message);
      setJoining(false);
      setFetchLoading(false);
      throw err;
    }
  };

  // ── Loading / Joining ──────────────────────────────────────────────────────
  if (fetchLoading || joining) {
    return (
      <div
        className="min-h-screen relative overflow-hidden"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <AuthBackground />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center">
            <div
              className="w-7 h-7 rounded-full animate-spin"
              style={{
                borderWidth: "3px",
                borderColor: "#e5e7eb",
                borderTopColor: "#0D9488",
              }}
            />
          </div>
          <p className="text-sm font-bold text-white/80 bg-black/10 backdrop-blur-sm px-4 py-2 rounded-full">
            {joining
              ? `Joining ${organizationName ?? "organization"}...`
              : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        className="min-h-screen relative overflow-hidden"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <AuthBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center space-y-6"
          >
            <div className="flex justify-center">
              <Link href="/">
                <Logo size={32} />
              </Link>
            </div>
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-extrabold text-[#1F2937]">
                Oops, an error occured!
              </h2>
              <p className="text-sm text-[#9CA3AF]">{error}</p>
            </div>
            <Link href="/">
              <Button variant="outline" className="w-full" size="lg">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Main invite screen ─────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <AuthBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10"
          >
            {/* Logo */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="flex justify-center mb-8"
            >
              <Link href="/">
                <Logo size={32} />
              </Link>
            </motion.div>

            {/* Org icon + text */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-center mb-8 space-y-4"
            >
              {/* Icon */}
              <div className="relative inline-flex">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F06543] to-[#D85436] flex items-center justify-center shadow-lg shadow-[#F06543]/25">
                  <Users className="w-9 h-9 text-white" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#0D9488] rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                  <span className="text-white text-[10px] font-extrabold">
                    +
                  </span>
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-extrabold tracking-widest uppercase text-[#F06543]">
                  You've been invited
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] leading-tight">
                  Join{" "}
                  <span className="text-[#0D9488]">{organizationName}</span>
                </h1>
                <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-xs mx-auto">
                  Sign in or create a free account to accept your invitation and
                  become a member.
                </p>
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="relative mb-6"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest">
                  Continue with
                </span>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="space-y-3 mb-8"
            >
              <Link
                href={`/auth/login?redirect=/join/${slug}`}
                className="block"
              >
                <Button className="w-full group" size="lg">
                  Log in to join
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link
                href={`/auth/register?redirect=/join/${slug}`}
                className="block"
              >
                <Button variant="outline" className="w-full" size="lg">
                  Create an account
                </Button>
              </Link>
            </motion.div>

            {/* Terms */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="text-center text-xs text-[#9CA3AF] leading-relaxed"
            >
              By joining, you agree to our{" "}
              <a
                href="/terms"
                className="font-semibold text-[#1F2937] hover:text-[#0D9488] transition-colors underline underline-offset-2"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="font-semibold text-[#1F2937] hover:text-[#0D9488] transition-colors underline underline-offset-2"
              >
                Privacy Policy
              </a>
            </motion.p>
          </motion.div>

          {/* Powered by */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex justify-center mt-5"
          >
            <p className="text-xs text-white/60 font-medium">
              Powered by{" "}
              <span className="font-extrabold text-white">ReeTrack</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
