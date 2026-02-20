"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreatePlan } from "@/hooks/usePlans";
import { toast } from "sonner";

export default function OnboardingCreatePlanPage() {
  const router = useRouter();
  const createPlan = useCreatePlan();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [features, setFeatures] = useState<string[]>([""] );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "monthly",
  });

  const addFeature = () => setFeatures((prev) => [...prev, ""]);
  const removeFeature = (i: number) => {
    if (features.length === 1) { setFeatures([""]); return; }
    setFeatures((prev) => prev.filter((_, idx) => idx !== i));
  };
  const updateFeature = (i: number, value: string) => {
    const updated = [...features];
    updated[i] = value;
    setFeatures(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.price) {
      setError("Plan name and price are required.");
      return;
    }

    setIsLoading(true);
    try {
      await createPlan.mutateAsync({
        name: formData.name,
        description: formData.description,
        amount: parseFloat(formData.price),
        currency: "NGN",
        interval: formData.duration as "daily" | "weekly" | "monthly" | "yearly",
        intervalCount: 1,
        features: features.filter((f) => f.trim() !== ""),
      });
      setSuccess(true);
      toast.success("Plan created!");
      setTimeout(() => router.push("/onboarding/add-member"), 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all disabled:opacity-50";
  const labelClass = "block text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1.5";

  return (
    <div
      className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-4 py-12"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <div className="w-full max-w-lg">

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#0D9488]">
            Step 2 of 4
          </p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  s < 2 ? "bg-[#0D9488] w-6" : s === 2 ? "bg-[#0D9488]/50 w-6" : "bg-gray-200 w-4"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#0D9488] mb-3">
              Subscription Plans
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] leading-snug mb-3">
              Start collecting payments
            </h1>
            <p className="text-sm text-[#1F2937]/70 leading-relaxed">
              Plans are what your members subscribe to. You set the name, price, and billing
              cycle. Members can be on different plans at the same time, and you can create
              as many plans as you need.
            </p>

            <div className="mt-5 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/10 px-4 py-3">
              <p className="text-xs text-[#0D9488] leading-relaxed">
                💡 Start with one simple plan. You can always add more from your dashboard later.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-8 py-6 space-y-4 max-h-[380px] overflow-y-auto">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-[#0D9488]/5 border border-[#0D9488]/20 text-[#0D9488] px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <span>✓</span> Plan created — moving on...
                </div>
              )}

              <div>
                <label className={labelClass}>Plan Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading || success}
                  placeholder="e.g. Premium Membership"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isLoading || success}
                  rows={2}
                  placeholder="What's included in this plan..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Price (₦) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    disabled={isLoading || success}
                    placeholder="15000"
                    min="0"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Billing Cycle *</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    disabled={isLoading || success}
                    className={inputClass}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelClass} style={{ marginBottom: 0 }}>Features</label>
                  <button
                    type="button"
                    onClick={addFeature}
                    disabled={isLoading || success}
                    className="flex items-center gap-1 text-xs font-bold text-[#0D9488] hover:text-[#0B7A70] transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(i, e.target.value)}
                        disabled={isLoading || success}
                        placeholder={`Feature ${i + 1}`}
                        className={`${inputClass} flex-1`}
                      />
                      {features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          disabled={isLoading || success}
                          className="p-2 text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0 disabled:opacity-40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-[#F9FAFB] flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => router.push("/onboarding/add-member")}
                disabled={isLoading}
              >
                Skip for now
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/onboarding/bank-account")}
                  disabled={isLoading}
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  disabled={isLoading || success}
                >
                  {isLoading ? "Creating..." : "Create Plan"}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}