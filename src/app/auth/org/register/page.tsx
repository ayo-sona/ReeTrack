"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@heroui/react";
import { Mail, Building } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationEmail: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ["organizationName", "organizationEmail", "email"];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please fill in all required fields`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !emailRegex.test(formData.email) ||
      !emailRegex.test(formData.organizationEmail)
    ) {
      setError("Please enter valid email addresses");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        organizationName: formData.organizationName,
        organizationEmail: formData.organizationEmail,
        email: formData.email,
      };

      await apiClient.post("/auth/register-organization", payload);
      toast.success(
        "Organization created! Please check your email to complete setup.",
      );
      router.push("/auth/login");
    } catch (err: unknown) {
      console.error("Registration error:", err);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message || "Failed to register. Please try again."
          : "Failed to register. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Diagonal Split Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top Coral Section */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#F06543] to-[#D85436]"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 55%)",
          }}
        />
        {/* Bottom Teal Section */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#0D9488] to-[#0B7A70]"
          style={{
            clipPath: "polygon(0 55%, 100% 45%, 100% 100%, 0 100%)",
          }}
        />
      </div>

      {/* Scattered Avatar Illustrations - Different Set for Organizations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left - Analytics */}
        <div className="hidden md:block absolute top-[8%] left-[10%] w-26 h-26 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/analytics.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Top center - Organizing */}
        <div className="hidden md:block absolute top-[5%] left-[42%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/organizing.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Top right - Shared dashboard */}
        <div className="hidden md:block absolute top-[12%] right-[8%] w-28 h-28 sm:w-36 sm:h-36 opacity-90">
          <Image
            src="/undraw/shared_dashboard.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Middle left - Data */}
        <div className="hidden md:block absolute top-[40%] left-[12%] w-24 h-24 sm:w-30 sm:h-30 opacity-90">
          <Image
            src="/undraw/data.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Middle right - Observe */}
        <div className="hidden md:block absolute top-[45%] right-[10%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/observe.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Bottom left - Working together */}
        <div className="hidden md:block absolute bottom-[12%] left-[15%] w-22 h-22 sm:w-28 sm:h-28 opacity-85">
          <Image
            src="/undraw/working_together.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Bottom center - Sit on screen */}
        <div className="hidden md:block absolute bottom-[8%] left-[40%] w-24 h-24 sm:w-30 sm:h-30 opacity-90">
          <Image
            src="/undraw/sit_on_screen.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Bottom right - Trend */}
        <div className="hidden md:block absolute bottom-[15%] right-[12%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/trend.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-sm bg-white/95">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0D9488]/10 mb-4">
                <Building className="w-8 h-8 text-[#0D9488]" />
              </div>
              <Link
                href="/"
                className="text-2xl font-extrabold bg-gradient-to-r from-[#0D9488] to-[#0B7A70] bg-clip-text text-transparent tracking-tight"
              >
                ReeTrack
              </Link>
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                Create Your Organization
              </h1>
              <p className="text-[#1F2937]/60">
                Set up your community and start managing memberships
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Information Section */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Building className="w-5 h-5 text-[#0D9488]" />
                  <h3 className="text-base font-bold text-[#1F2937]">
                    Organization Details
                  </h3>
                </div>

                {/* Organization Name */}
                <div>
                  <label
                    htmlFor="organizationName"
                    className="block text-sm font-semibold text-[#1F2937] mb-2"
                  >
                    Organization Name *
                  </label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    required
                    placeholder="Acme Community"
                    value={formData.organizationName}
                    onChange={handleChange}
                    disabled={isLoading}
                    startContent={
                      <Building className="w-4 h-4 text-gray-400" />
                    }
                    classNames={{
                      input: "outline-none focus-visible:outline-none !text-gray-900 dark:!text-gray-900 placeholder:text-gray-400",
  inputWrapper: "bg-white hover:bg-white focus-within:!bg-white dark:bg-white dark:hover:bg-white dark:focus-within:!bg-white [&_input]:!text-gray-900",
}}
                  />
                </div>

                {/* Organization Email */}
                <div>
                  <label
                    htmlFor="organizationEmail"
                    className="block text-sm font-semibold text-[#1F2937] mb-2"
                  >
                    Organization Email *
                  </label>
                  <Input
                    id="organizationEmail"
                    name="organizationEmail"
                    type="email"
                    required
                    placeholder="contact@organization.com"
                    value={formData.organizationEmail}
                    onChange={handleChange}
                    disabled={isLoading}
                    startContent={<Mail className="w-4 h-4 text-gray-400" />}
                    classNames={{
                      input: "outline-none focus-visible:outline-none !text-gray-900 dark:!text-gray-900 placeholder:text-gray-400",
                      inputWrapper: "bg-white hover:bg-white focus-within:!bg-white dark:bg-white dark:hover:bg-white dark:focus-within:!bg-white [&_input]:!text-gray-900",
                    }}
                  />
                </div>
              </div>

              {/* Admin Information Section */}
              <div className="space-y-5 pt-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Mail className="w-5 h-5 text-[#F06543]" />
                  <h3 className="text-base font-bold text-[#1F2937]">
                    Admin Account
                  </h3>
                </div>

                {/* Admin Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[#1F2937] mb-2"
                  >
                    Your Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    startContent={<Mail className="w-4 h-4 text-[#1F2937]" />}
                    classNames={{
                      input:
                        "outline-none focus-visible:outline-none !text-gray-900 dark:!text-gray-900 placeholder:text-gray-400",
                      inputWrapper:
                        "bg-white hover:bg-white focus-within:!bg-white dark:bg-white dark:hover:bg-white dark:focus-within:!bg-white [&_input]:!text-gray-900",
                    }}
                  />
                  <p className="mt-2 text-xs text-[#1F2937]/50">
                    You&apos;ll receive setup instructions at this email
                  </p>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 text-[#0D9488] focus:ring-[#0D9488] border-gray-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-[#1F2937]/70 leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[#0D9488] hover:underline font-semibold"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-[#0D9488] hover:underline font-semibold"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={isLoading}
                className="w-full mt-6"
              >
                {isLoading ? "Creating organization..." : "Create Organization"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#1F2937]/60">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center space-y-3">
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors block"
              >
                Sign in instead →
              </Link>

              {/* Member Registration Link */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-[#1F2937]/50 mb-2">
                  Just joining a community?
                </p>
                <Link
                  href="/auth/register"
                  className="text-xs font-semibold text-[#F06543] hover:text-[#D85436] transition-colors"
                >
                  Sign up as a member →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
