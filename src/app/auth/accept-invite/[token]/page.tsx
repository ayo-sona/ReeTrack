"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Mail, Building2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@heroui/react";
import { toast } from "sonner";
import Logo from "@/components/layout/Logo";

interface InvitationData {
  valid: boolean;
  email: string;
  organization: string;
}

const inputClassNames = {
  input:
    "outline-none focus-visible:outline-none !text-gray-900 dark:!text-gray-900 placeholder:text-gray-400",
  inputWrapper:
    "bg-white hover:bg-white focus-within:!bg-white dark:bg-white dark:hover:bg-white dark:focus-within:!bg-white [&_input]:!text-gray-900",
};

export default function AcceptInvitationPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  // Validate invitation on component mount
  useEffect(() => {
    const validateInvitation = async () => {
      try {
        const response = await apiClient.get(`/invitations/validate/${token}`);
        setFormData((prev) => ({
          ...prev,
          email: response?.data?.data?.email,
        }));
        setInvitation(response?.data?.data);
      } catch (err) {
        setError("Invalid or expired invitation");
      } finally {
        setLoading(false);
      }
    };
    validateInvitation();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        email: formData.email,
        token,
      };

      await apiClient.post(`/auth/register-staff`, payload);
      toast.success("Successfully joined organization!");
      router.push("/auth/login");
    } catch (err: any) {
      console.error("Accept invitation error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to accept invitation. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-white">
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

        <div
          className="relative z-10 min-h-screen flex items-center justify-center px-4"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-base font-bold text-white">
              Validating your invitation...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !invitation?.valid) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-white">
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

        {/* Illustrations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="hidden md:block absolute top-[15%] left-[15%] w-24 h-24 opacity-80">
            <Image
              src="/undraw/analytics.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          <div className="hidden md:block absolute bottom-[20%] right-[15%] w-28 h-28 opacity-80">
            <Image
              src="/undraw/working_together.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div
          className="relative z-10 min-h-screen flex items-center justify-center px-4"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-sm bg-white/95">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-extrabold text-[#1F2937] mb-2">
                  Invalid Invitation
                </h1>
                <p className="text-sm text-[#1F2937]/60">
                  {error || "This invitation link is invalid or has expired."}
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <p className="text-sm text-red-700 leading-relaxed">
                  The invitation link may have expired or been used already.
                  Please contact the organization administrator for a new
                  invitation.
                </p>
              </div>

              <Link href="/auth/login">
                <Button variant="secondary" size="lg" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
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

      {/* Illustrations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden md:block absolute top-[10%] left-[12%] w-28 h-28 opacity-85">
          <Image
            src="/undraw/working_together.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden md:block absolute top-[15%] right-[15%] w-32 h-32 opacity-85">
          <Image
            src="/undraw/shared_dashboard.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden md:block absolute bottom-[15%] left-[18%] w-24 h-24 opacity-80">
          <Image
            src="/undraw/organizing.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden md:block absolute bottom-[20%] right-[12%] w-28 h-28 opacity-85">
          <Image
            src="/undraw/analytics.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-sm bg-white/95">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Link href="/">
                  <Logo size={32} />
                </Link>
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0D9488]/10 mb-4">
                <Building2 className="w-8 h-8 text-[#0D9488]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mb-2">
                Join Organization
              </h1>
              <p className="text-sm sm:text-base text-[#1F2937]/60">
                You've been invited to join
              </p>
              <p className="text-lg font-bold text-[#0D9488] mt-1">
                {invitation?.organization}
              </p>
            </div>

            {/* Success Info */}
            <div className="bg-[#0D9488]/5 border border-[#0D9488]/15 rounded-xl px-4 py-3 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0D9488] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#0D9488] leading-relaxed">
                  Your invitation is valid! Click "Join Organization" below to
                  accept and gain access to your new team.
                </p>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-[#1F2937] mb-2"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  startContent={<Mail className="w-4 h-4 text-gray-400" />}
                  classNames={{
                    ...inputClassNames,
                    inputWrapper:
                      "bg-[#F9FAFB] hover:bg-[#F9FAFB] focus-within:!bg-[#F9FAFB] dark:bg-[#F9FAFB] dark:hover:bg-[#F9FAFB] dark:focus-within:!bg-[#F9FAFB] [&_input]:!text-gray-900",
                  }}
                />
                <p className="mt-2 text-xs text-[#1F2937]/50">
                  This is the email associated with your invitation
                </p>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={isSubmitting}
                className="w-full mt-6"
              >
                {isSubmitting ? "Joining..." : "Join Organization"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#1F2937]/60">
                  Need help?
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center space-y-3">
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors block"
              >
                Already have an account? Sign in →
              </Link>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-[#1F2937]/50 mb-2">
                  Want to create your own organization?
                </p>
                <Link
                  href="/auth/org/register"
                  className="text-xs font-semibold text-[#F06543] hover:text-[#D85436] transition-colors"
                >
                  Register as an organization →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}