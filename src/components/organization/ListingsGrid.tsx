"use client";

import { useState } from "react";
import { MoreVertical, Edit, Trash2, Power, PowerOff, ShoppingBag } from "lucide-react";
import { MarketplaceListing } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ListingsGridProps {
  listings: MarketplaceListing[];
  onEdit: (listing: MarketplaceListing) => void;
  onToggleStatus: (listingId: string) => void;
  onDelete: (listingId: string) => void;
}

const PALETTE = [
  { bg: "#0D9488", light: "#E6F7F5" },
  { bg: "#0284C7", light: "#E0F2FE" },
  { bg: "#7C3AED", light: "#EDE9FE" },
  { bg: "#DB2777", light: "#FCE7F3" },
  { bg: "#EA580C", light: "#FEF3C7" },
  { bg: "#16A34A", light: "#DCFCE7" },
];

function getPalette(title: string) {
  let h = 0;
  for (const c of title) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return PALETTE[h % PALETTE.length];
}

function PlaceholderCover({ title }: { title: string }) {
  const { bg, light } = getPalette(title);
  const initial = title.trim().charAt(0).toUpperCase();
  return (
    <div
      style={{ background: light, position: "relative", width: "100%", height: "100%" }}
    >
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: bg, opacity: 0.15 }} />
      <div style={{ position: "absolute", bottom: -10, left: -10, width: 56, height: 56, borderRadius: "50%", background: bg, opacity: 0.1 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: "#fff", boxShadow: `0 6px 16px ${bg}40` }}>
          {initial}
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  available: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    label: "Available",
  },
  sold: {
    bg: "bg-gray-100",
    text: "text-[#9CA3AF]",
    border: "border-gray-200",
    label: "Sold",
  },
  inactive: {
    bg: "bg-gray-100",
    text: "text-[#9CA3AF]",
    border: "border-gray-200",
    label: "Draft",
  },
};

export function ListingsGrid({
  listings,
  onEdit,
  onToggleStatus,
  onDelete,
}: ListingsGridProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (listings.length === 0) {
    return (
      <div
        className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <div className="mx-auto w-16 h-16 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-[#0D9488]" />
        </div>
        <h3 className="text-base font-bold text-[#1F2937] mb-1">
          No listings yet
        </h3>
        <p className="text-sm text-[#9CA3AF]">
          Create your first listing to start selling to your members
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {listings.map((listing) => {
        const statusStyle =
          STATUS_STYLES[listing.status] ?? STATUS_STYLES.inactive;
        const coverImage = listing.images?.[0]?.url ?? null;

        return (
          <div
            key={listing.id}
            className="relative rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#0D9488]/30 flex flex-col overflow-hidden"
          >
            {/* Cover image */}
            <div className="relative w-full aspect-video flex-shrink-0 overflow-hidden">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <PlaceholderCover title={listing.title} />
              )}
              {listing.images.length > 1 && (
                <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  +{listing.images.length - 1}
                </span>
              )}
            </div>

            <div className="p-5 flex flex-col flex-1">
              {/* Header row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-2 min-w-0">
                  <h3
                    className="text-base font-bold text-[#1F2937] truncate"
                    title={listing.title}
                  >
                    {listing.title}
                  </h3>
                  {listing.description && (
                    <p className="mt-1 text-sm text-[#9CA3AF] line-clamp-2">
                      {listing.description}
                    </p>
                  )}
                </div>

                {/* Kebab menu */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === listing.id ? null : listing.id,
                      )
                    }
                    className="rounded-lg p-1.5 hover:bg-[#F9FAFB] transition-colors"
                  >
                    <MoreVertical className="h-4 w-4 text-[#9CA3AF]" />
                  </button>

                  {openMenuId === listing.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white shadow-lg border border-gray-100 z-20 overflow-hidden">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              onEdit(listing);
                              setOpenMenuId(null);
                            }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-[#F9FAFB] transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5 text-[#9CA3AF]" />
                            Edit
                          </button>
                          {listing.status !== "sold" && (
                            <button
                              onClick={() => {
                                onToggleStatus(listing.id);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-[#F9FAFB] transition-colors"
                            >
                              {listing.status === "available" ? (
                                <PowerOff className="h-3.5 w-3.5 text-[#9CA3AF]" />
                              ) : (
                                <Power className="h-3.5 w-3.5 text-[#9CA3AF]" />
                              )}
                              {listing.status === "available"
                                ? "Hide (draft)"
                                : "Make available"}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onDelete(listing.id);
                              setOpenMenuId(null);
                            }}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="mb-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-[#1F2937]">
                    ₦{listing.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
                    one-time
                  </span>
                </div>
                {listing.installment?.enabled && (
                  <p className="mt-1 text-xs font-semibold text-[#0D9488]">
                    or {listing.installment.count}×{" "}
                    ₦{(listing.price / listing.installment.count).toLocaleString("en-NG", { maximumFractionDigits: 0 })}/
                    {listing.installment.interval === "monthly" ? "mo" : "wk"}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-gray-100 mt-auto flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                >
                  {statusStyle.label}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(listing)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
