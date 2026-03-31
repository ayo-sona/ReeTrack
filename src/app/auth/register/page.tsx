"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input, Spinner } from "@heroui/react";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/layout/Logo";
import { useAuth } from "@/hooks/useAuth";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const inputClassNames = {
  input:
    "outline-none focus:outline-none !text-gray-900 dark:!text-gray-100 placeholder:text-gray-400",
  inputWrapper: "bg-white dark:bg-black",
};

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  const { register, registering, registerError, resetErrors } = useAuth();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    resetErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (success) {
      toast.success("Account created! Please verify your email.");

      // ✅ FIXED: Use your actual OTP page route
      router.push(
        `/auth/OTPVerification?email=${encodeURIComponent(formData.email)}`,
      );
    }
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

      {/* Scattered Avatar Illustrations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[25%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/walking_call.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-[8%] right-[19%] w-28 h-28 sm:w-36 sm:h-36 opacity-90">
          <Image
            src="/undraw/knowledge_sharing.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-[34%] left-[23%] w-20 h-20 sm:w-28 sm:h-28 opacity-90">
          <Image
            src="/undraw/working.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-[15%] left-[16%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/mindfulness.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[30%] right-[20%] w-20 h-20 sm:w-28 sm:h-28 opacity-90">
          <Image
            src="/undraw/accept_task.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-[8%] right-[23%] w-24 h-24 sm:w-32 sm:h-32 opacity-90">
          <Image
            src="/undraw/processing.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden lg:block absolute top-[28%] left-[18%] w-28 h-28 opacity-80">
          <Image
            src="/undraw/walking_email.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="hidden lg:block absolute bottom-[32%] right-[25%] w-24 h-24 opacity-80">
          <Image
            src="/undraw/absorbed.svg"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 backdrop-blur-sm bg-white/95">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Link href="/">
                  <Logo size={32} />
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
                Create Your Account
              </h1>
              <p className="text-[#1F2937]/60">
                {redirectParam
                  ? "Create an account to finish joining the organization"
                  : "Join the community and start building"}
              </p>
            </div>

            {/* Error Message */}
            {registerError && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-sm text-red-700">{registerError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold text-[#1F2937] mb-2"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={registering}
                    startContent={<User className="w-4 h-4 text-gray-400" />}
                    classNames={inputClassNames}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold text-[#1F2937] mb-2"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={registering}
                    startContent={<User className="w-4 h-4 text-gray-400" />}
                    classNames={inputClassNames}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-[#1F2937] mb-2"
                >
                  Email Address
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
                  disabled={registering}
                  startContent={<Mail className="w-4 h-4 text-gray-400" />}
                  classNames={inputClassNames}
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-[#1F2937] mb-2"
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={registering}
                  startContent={<Phone className="w-4 h-4 text-gray-400" />}
                  classNames={inputClassNames}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#1F2937] mb-2"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type={isVisible ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={registering}
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
                    formData.password.length > 0 && formData.password.length < 8
                  }
                  errorMessage={
                    formData.password.length > 0 && formData.password.length < 8
                      ? "Password should be at least 8 characters long"
                      : ""
                  }
                  classNames={inputClassNames}
                />
              </div>
              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-[#1F2937] mb-2"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={isVisible ? "text" : "password"}
                  required
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={registering}
                  startContent={<Lock className="w-4 h-4 text-gray-400" />}
                  isInvalid={
                    formData.confirmPassword.length > 0 &&
                    formData.confirmPassword !== formData.password
                  }
                  errorMessage={
                    formData.confirmPassword.length > 0 &&
                    formData.confirmPassword !== formData.password
                      ? "Passwords do not match"
                      : ""
                  }
                  classNames={inputClassNames}
                />
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={registering}
                className="w-full mt-6"
              >
                {registering ? "Creating account..." : "Create Account"}
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
                href={
                  redirectParam
                    ? `/auth/login?redirect=${encodeURIComponent(redirectParam)}`
                    : "/auth/login"
                }
                className="text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors block"
              >
                Sign in instead →
              </Link>

              {!redirectParam && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-[#1F2937]/50 mb-2">
                    Building a community?
                  </p>
                  <Link
                    href="/auth/org/register"
                    className="text-xs font-semibold text-[#F06543] hover:text-[#D85436] transition-colors"
                  >
                    Register as an organization →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Spinner color="success" size="lg" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
