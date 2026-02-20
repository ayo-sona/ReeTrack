"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SubscriptionPlan } from "../../types/organization";
import { Button } from "@/components/ui/button";

interface PlanFormData {
  name: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
}

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planData: PlanFormData) => void;
  editingPlan?: SubscriptionPlan | null;
}

export function CreatePlanModal({
  isOpen,
  onClose,
  onSave,
  editingPlan,
}: CreatePlanModalProps) {
  const [formData, setFormData] = useState(() =>
    editingPlan
      ? {
          name: editingPlan.name,
          description: editingPlan.description || "",
          price: editingPlan.price.toString(),
          duration: editingPlan.duration,
        }
      : { name: "", description: "", price: "", duration: "monthly" },
  );

  const [features, setFeatures] = useState<string[]>(() => {
    const featureStrings = editingPlan?.features
      ?.map((f) => (typeof f === "string" ? f : f.name || ""))
      .filter(Boolean);
    return featureStrings?.length ? featureStrings : [""];
  });

  const handleClose = () => {
    setFormData({ name: "", description: "", price: "", duration: "monthly" });
    setFeatures([""]);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, features: features.filter((f) => f.trim() !== "") });
    handleClose();
  };

  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (index: number) => {
    if (features.length === 1) {
      setFeatures([""]);
    } else {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };
  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-[#F9FAFB] px-4 py-2.5 text-[#1F2937] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all";
  const labelClass = "block text-sm font-semibold text-[#1F2937] mb-1.5";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl border border-gray-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5 flex-shrink-0">
          <h2 className="text-lg font-bold text-[#1F2937]">
            {editingPlan ? "Edit Plan" : "Create New Plan"}
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            {editingPlan
              ? "Update the details for this plan"
              : "Set up a new subscription plan for your members"}
          </p>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto flex-1">
          <form
            onSubmit={handleSubmit}
            id="plan-form"
            className="p-6 space-y-5"
          >
            {/* Plan Name */}
            <div>
              <label className={labelClass}>
                Plan Name <span className="text-[#F06543]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={inputClass}
                placeholder="e.g., Premium Membership"
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Brief description of what this plan includes..."
              />
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Price (₦) <span className="text-[#F06543]">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className={inputClass}
                  placeholder="15000"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className={labelClass}>
                  Billing Cycle <span className="text-[#F06543]">*</span>
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
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
                <label className={labelClass} style={{ marginBottom: 0 }}>
                  Features
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addFeature}
                  className="text-[#0D9488] hover:text-[#0B7A70] px-2 h-auto py-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className={`${inputClass} flex-1`}
                      placeholder={`Feature ${index + 1}`}
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="plan-form" variant="secondary" size="sm">
            {editingPlan ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
