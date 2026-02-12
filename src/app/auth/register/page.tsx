"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@heroui/react";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log(formData);

    try {
      const response = await apiClient.post("auth/register-user", formData);
      console.log(response.data);
      if (response.data.statusCode === 201) {
        toast.success("Registration successful! Please log in.");
        router.push("/auth/login");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        {error && (
          <div>
            <p className="bg-red-300 text-red-600 rounded-full p-4 text-center">
              {error}
            </p>
          </div>
        )}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="First name"
                  startContent={<User className="h-4 w-4 text-gray-400" />}
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                  classNames={{
                    input: "outline-none",
                  }}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Last name"
                  startContent={<User className="h-4 w-4 text-gray-400" />}
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                  classNames={{
                    input: "outline-none",
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                startContent={<Mail className="h-4 w-4 text-gray-400" />}
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                classNames={{
                  input: "outline-none",
                }}
              />
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">
                Phone number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="Phone number"
                startContent={<Phone className="h-4 w-4 text-gray-400" />}
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                classNames={{
                  input: "outline-none",
                }}
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                autoComplete="new-password"
                required
                placeholder="Enter your password"
                startContent={<Lock className="h-4 w-4 text-gray-400" />}
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                classNames={{
                  input: "outline-none",
                }}
                isInvalid={formData.password.length < 8}
                errorMessage="Password should be 8 characters long"
                type={isVisible ? "text" : "password"}
                endContent={
                  <div
                    className="outline-none cursor-pointer"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <Eye className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                }
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
              disabled={isLoading}
              isLoading={isLoading}
            >
              Create account
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
