"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@heroui/react";
import { Mail, User, Building, Phone, Lock, Eye, EyeOff } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import Logo from "@/components/layout/Logo";
import { deleteCookie } from "cookies-next";

const inputClassNames = {
  input:
    "outline-none focus-visible:outline-none !text-gray-900 dark:!text-gray-900 placeholder:text-gray-400",
  inputWrapper:
    "bg-white hover:bg-white focus-within:!bg-white dark:bg-white dark:hover:bg-white dark:focus-within:!bg-white [&_input]:!text-gray-900",
};

export default function AdminRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    organizationName: "",
    organizationEmail: "",
    email: "",
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const baseFields = [
      "email",
      "password",
      "organizationName",
      "organizationEmail",
    ];
    const newUserFields = ["firstName", "lastName", "phone"];
    const requiredFields = isExistingUser
      ? baseFields
      : [...baseFields, ...newUserFields];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError("Please fill in all required fields");
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

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    // Step 1: Register user — only if they're new
    if (!isExistingUser) {
      try {
        await apiClient.post("/auth/register-user", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
      } catch (err: any) {
        const status = err?.response?.data?.statusCode;
        const message = err?.response?.data?.message || "";

        if (
          status === 409 ||
          message.toLowerCase().includes("exist") ||
          message.toLowerCase().includes("already")
        ) {
          setError(
            'This login email is already registered. Switch to "I already have an account" above to create your organization.',
          );
          setIsLoading(false);
          return;
        }

        const fallback =
          message || "Failed to create account. Please try again.";
        setError(fallback);
        toast.error(fallback);
        setIsLoading(false);
        return;
      }
    }

    // Step 2: Login with credential
    try {
      const response = await apiClient.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log("Logging in");
    } catch (err: any) {
      console.error("Login error:", err.response);
      const { statusCode, message } = err.response.data;
      if (err.response) setError(message);
      setError(err.message || "Failed to complete registration");
      setIsLoading(false);
      return;
    }

    // Step 3: Create organization
    try {
      const response = await apiClient.post("/auth/register-organization", {
        organizationName: formData.organizationName,
        organizationEmail: formData.organizationEmail,
        email: formData.email,
      });

      console.log(response);
      if (response.data.statusCode === 201) {
        localStorage.setItem(
          "newOrganizationId",
          response.data.data.organization.id,
        );
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Failed to create organization. Please try again.";
      // Account was created but org failed — flip to existing user mode silently
      // so if they retry, register-user is skipped and we go straight to org creation
      setIsExistingUser(true);
      setError(message);
      setIsLoading(false);
      return;
    }

    // Delete cookies
    deleteCookie("access_token");
    deleteCookie("user_roles");
    deleteCookie("current_role");

    // Registration complete — set flag so login page redirects to onboarding
    localStorage.setItem("onboarding_pending", "true");
    toast.success("Organization created! Please log in to continue.");
    router.push("/auth/login");
    setIsLoading(false);
  };

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
        <div className="hidden md:block absolute top-[8%] left-[10%] w-26 h-26 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/analytics.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden md:block absolute top-[5%] left-[42%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/organizing.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden md:block absolute top-[12%] right-[8%] w-28 h-28 sm:w-36 sm:h-36 opacity-90">
          <Image
            src="/undraw/shared_dashboard.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden md:block absolute top-[40%] left-[12%] w-24 h-24 sm:w-30 sm:h-30 opacity-90">
          <Image
            src="/undraw/data.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden md:block absolute top-[45%] right-[10%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/observe.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden md:block absolute bottom-[12%] left-[15%] w-22 h-22 sm:w-28 sm:h-28 opacity-85">
          <Image
            src="/undraw/working_together.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden md:block absolute bottom-[8%] left-[40%] w-24 h-24 sm:w-30 sm:h-30 opacity-90">
          <Image
            src="/undraw/sit_on_screen.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
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
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-sm bg-white/95">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <Link href="/">
                  <Logo size={32} />
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                Create Your Organization
              </h1>
              <p className="text-[#1F2937]/60">
                Set up your community and start managing memberships
              </p>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsExistingUser(false);
                    setError(null);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    !isExistingUser
                      ? "bg-white text-[#0D9488] shadow-sm"
                      : "text-[#9CA3AF] hover:text-[#1F2937]"
                  }`}
                >
                  I'm new here
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsExistingUser(true);
                    setError(null);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    isExistingUser
                      ? "bg-white text-[#0D9488] shadow-sm"
                      : "text-[#9CA3AF] hover:text-[#1F2937]"
                  }`}
                >
                  I already have an account
                </button>
              </div>
            </div>

            {/* Existing user info banner */}
            <AnimatePresence>
              {isExistingUser && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-[#0D9488]/5 border border-[#0D9488]/15 rounded-xl px-4 py-3">
                    <p className="text-xs text-[#0D9488] leading-relaxed">
                      Enter your existing ReeTrack email and password along with
                      your organization details — we'll link everything
                      together.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New user fields — hidden for existing users */}
              <AnimatePresence>
                {!isExistingUser && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <User className="w-5 h-5 text-[#F06543]" />
                      <h3 className="text-base font-bold text-[#1F2937]">
                        Your Account
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-semibold text-[#1F2937] mb-2"
                        >
                          First Name *
                        </label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required={!isExistingUser}
                          placeholder="John"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={isLoading}
                          startContent={
                            <User className="w-4 h-4 text-gray-400" />
                          }
                          classNames={inputClassNames}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-semibold text-[#1F2937] mb-2"
                        >
                          Last Name *
                        </label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required={!isExistingUser}
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={isLoading}
                          startContent={
                            <User className="w-4 h-4 text-gray-400" />
                          }
                          classNames={inputClassNames}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-[#1F2937] mb-2"
                      >
                        Phone Number *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required={!isExistingUser}
                        placeholder="+234 800 000 0000"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isLoading}
                        startContent={
                          <Phone className="w-4 h-4 text-gray-400" />
                        }
                        classNames={inputClassNames}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email + Password — always shown */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Mail className="w-5 h-5 text-[#F06543]" />
                  <h3 className="text-base font-bold text-[#1F2937]">
                    {isExistingUser ? "Your Account" : "Login Details"}
                  </h3>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-[#1F2937] mb-2"
                  >
                    Email Address *
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
                    startContent={<Mail className="w-4 h-4 text-gray-400" />}
                    classNames={inputClassNames}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#1F2937] mb-2"
                  >
                    {isExistingUser ? "Your Password *" : "Password *"}
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type={isVisible ? "text" : "password"}
                    autoComplete={
                      isExistingUser ? "current-password" : "new-password"
                    }
                    required
                    placeholder={
                      isExistingUser
                        ? "Enter your existing password"
                        : "Create a strong password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    startContent={<Lock className="w-4 h-4 text-gray-400" />}
                    endContent={
                      <button
                        type="button"
                        onClick={toggleVisibility}
                        className="focus:outline-none"
                      >
                        {isVisible ? (
                          <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    }
                    isInvalid={
                      !isExistingUser &&
                      formData.password.length > 0 &&
                      formData.password.length < 8
                    }
                    errorMessage={
                      !isExistingUser &&
                      formData.password.length > 0 &&
                      formData.password.length < 8
                        ? "Password must be at least 8 characters"
                        : ""
                    }
                    classNames={inputClassNames}
                  />
                </div>
              </div>

              {/* Organization Details */}
              <div className="space-y-5 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Building className="w-5 h-5 text-[#0D9488]" />
                  <h3 className="text-base font-bold text-[#1F2937]">
                    Organization Details
                  </h3>
                </div>

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
                    classNames={inputClassNames}
                  />
                </div>

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
                    classNames={inputClassNames}
                  />
                </div>
              </div>

              {/* Terms */}
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

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={isLoading}
                className="w-full mt-6"
              >
                {isLoading
                  ? "Setting up your organization..."
                  : "Create Organization"}
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

            <div className="text-center space-y-3">
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors block"
              >
                Sign in instead →
              </Link>
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
