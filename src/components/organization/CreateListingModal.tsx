"use client";

import { useState, useRef } from "react";
import { ImagePlus, X, Trash2 } from "lucide-react";
import { MarketplaceListing } from "@/types/marketplace";
import { Button } from "@/components/ui/button";

export interface ListingFormData {
  title: string;
  description: string;
  price: string;
  status: "available" | "inactive";
  files: File[];
  installment: {
    enabled: boolean;
    count: number;
    interval: "weekly" | "monthly";
  };
}

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ListingFormData) => void;
  editingListing?: MarketplaceListing | null;
  isSaving?: boolean;
}

export function CreateListingModal({
  isOpen,
  onClose,
  onSave,
  editingListing,
  isSaving = false,
}: CreateListingModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(() =>
    editingListing
      ? {
          title: editingListing.title,
          description: editingListing.description || "",
          price: editingListing.price.toString(),
          status: editingListing.status === "sold" ? "available" as const : editingListing.status as "available" | "inactive",
        }
      : { title: "", description: "", price: "", status: "available" as const },
  );

  const [installment, setInstallment] = useState(() => ({
    enabled: editingListing?.installment?.enabled ?? false,
    count: editingListing?.installment?.count ?? 3,
    interval: (editingListing?.installment?.interval ?? "monthly") as "weekly" | "monthly",
  }));

  const [previewFiles, setPreviewFiles] = useState<
    { file: File; previewUrl: string }[]
  >([]);

  const perPayment =
    installment.enabled && formData.price && parseFloat(formData.price) > 0
      ? parseFloat(formData.price) / installment.count
      : null;

  const handleClose = () => {
    setFormData({ title: "", description: "", price: "", status: "available" });
    setInstallment({ enabled: false, count: 3, interval: "monthly" });
    previewFiles.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    setPreviewFiles([]);
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const newPreviews = selected.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPreviewFiles((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePreview = (index: number) => {
    setPreviewFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      files: previewFiles.map((p) => p.file),
      installment,
    });
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
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl border border-gray-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5 flex-shrink-0">
          <h2 className="text-lg font-bold text-[#1F2937]">
            {editingListing ? "Edit Listing" : "Create New Listing"}
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            {editingListing
              ? "Update the details for this listing"
              : "Add an item your members can purchase one time"}
          </p>
        </div>

        {/* Scrollable Form */}
        <div className="overflow-y-auto flex-1">
          <form
            onSubmit={handleSubmit}
            id="listing-form"
            className="p-6 space-y-5"
          >
            {/* Title */}
            <div>
              <label className={labelClass}>
                Title <span className="text-[#F06543]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={inputClass}
                placeholder="e.g., 3-Bedroom Apartment, Online Course, Merch Bundle"
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
                placeholder="Describe what's included, key features, location, etc."
              />
            </div>

            {/* Price & Status */}
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
                  placeholder="50000"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "available" | "inactive",
                    })
                  }
                  className={inputClass}
                >
                  <option value="available">Available</option>
                  <option value="inactive">Hidden (draft)</option>
                </select>
              </div>
            </div>

            {/* Installment payments */}
            <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">
                    Spread payments
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    Let members pay in instalments instead of all at once
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setInstallment((prev) => ({ ...prev, enabled: !prev.enabled }))
                  }
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    installment.enabled ? "bg-[#0D9488]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      installment.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {installment.enabled && (
                <div className="space-y-3 pt-1">
                  {/* Number of payments */}
                  <div>
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
                      Number of payments
                    </p>
                    <div className="flex gap-2">
                      {[2, 3, 6, 12].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() =>
                            setInstallment((prev) => ({ ...prev, count: n }))
                          }
                          className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${
                            installment.count === n
                              ? "bg-[#0D9488] text-white border-[#0D9488]"
                              : "bg-white text-[#1F2937] border-gray-200 hover:border-[#0D9488]"
                          }`}
                        >
                          {n}×
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interval */}
                  <div>
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
                      Frequency
                    </p>
                    <div className="flex gap-2">
                      {(["weekly", "monthly"] as const).map((interval) => (
                        <button
                          key={interval}
                          type="button"
                          onClick={() =>
                            setInstallment((prev) => ({ ...prev, interval }))
                          }
                          className={`flex-1 py-2 rounded-lg text-sm font-bold border capitalize transition-all ${
                            installment.interval === interval
                              ? "bg-[#0D9488] text-white border-[#0D9488]"
                              : "bg-white text-[#1F2937] border-gray-200 hover:border-[#0D9488]"
                          }`}
                        >
                          {interval}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  {perPayment !== null && (
                    <div className="bg-white rounded-lg border border-[#0D9488]/20 px-4 py-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#9CA3AF]">
                        Per payment
                      </span>
                      <span className="text-sm font-extrabold text-[#0D9488]">
                        ₦{perPayment.toLocaleString("en-NG", { maximumFractionDigits: 2 })}
                        <span className="font-normal text-[#9CA3AF]">
                          {" "}
                          × {installment.count} {installment.interval}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass} style={{ marginBottom: 0 }}>
                  Images
                </label>
                <span className="text-xs text-[#9CA3AF]">
                  {previewFiles.length}/10
                </span>
              </div>

              {/* Image previews */}
              {previewFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {previewFiles.map((p, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.previewUrl}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={11} color="#fff" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload trigger */}
              {previewFiles.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 hover:border-[#0D9488] rounded-lg py-6 flex flex-col items-center gap-2 text-[#9CA3AF] hover:text-[#0D9488] transition-colors"
                >
                  <ImagePlus size={22} />
                  <span className="text-sm font-semibold">
                    Click to add photos
                  </span>
                  <span className="text-xs">JPG, PNG, WebP — max 5MB each</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Existing images (edit mode) */}
            {editingListing && editingListing.images.length > 0 && previewFiles.length === 0 && (
              <div>
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
                  Current images
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {editingListing.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={`Listing image ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1.5">
                  Uploading new images will replace the current ones.
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="listing-form"
            variant="secondary"
            size="sm"
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : editingListing
                ? "Update Listing"
                : "Create Listing"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Trash2 };
