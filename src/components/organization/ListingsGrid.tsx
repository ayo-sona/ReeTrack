"use client";

import { useState } from "react";
import {
  MoreVertical,
  Edit,
  Trash2,
  Power,
  PowerOff,
  ShoppingBag,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

function PlaceholderCover({
  title,
  large = false,
}: {
  title: string;
  large?: boolean;
}) {
  const { bg, light } = getPalette(title);
  const initial = title.trim().charAt(0).toUpperCase();
  return (
    <div
      style={{
        background: light,
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: bg,
          opacity: 0.15,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -10,
          left: -10,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: bg,
          opacity: 0.1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: large ? 72 : 48,
            height: large ? 72 : 48,
            borderRadius: large ? 20 : 14,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: large ? 32 : 22,
            color: "#fff",
            boxShadow: `0 6px 16px ${bg}40`,
          }}
        >
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
  active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    label: "Active",
  },
  draft: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
    label: "Draft",
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
    label: "Hidden",
  },
};

function ListingDetailModal({
  listing,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
}: {
  listing: MarketplaceListing;
  onClose: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const statusStyle = STATUS_STYLES[listing.status] ?? STATUS_STYLES.inactive;
  const images = listing.images ?? [];
  const hasImages = images.length > 0;
  const imgCount = images.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ fontFamily: "Nunito, sans-serif" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gallery */}
        <div
          className="relative w-full bg-gray-50 overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          {hasImages ? (
            <>
              <Image
                src={images[imgIdx].url}
                alt={listing.title}
                fill
                className="object-cover"
              />
              {imgCount > 1 && (
                <>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                  {imgIdx > 0 && (
                    <button
                      onClick={() => setImgIdx((v) => v - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  {imgIdx < imgCount - 1 && (
                    <button
                      onClick={() => setImgIdx((v) => v + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
            </>
          ) : (
            <PlaceholderCover title={listing.title} large />
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/60 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <span
            className={`absolute top-3 left-3 z-10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
          >
            {statusStyle.label}
          </span>

          {imgCount > 1 && (
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">
              {imgIdx + 1} / {imgCount}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-lg font-extrabold text-[#1F2937] mb-2 leading-snug">
            {listing.title}
          </h2>
          {listing.description && (
            <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
              {listing.description}
            </p>
          )}

          <div className="mb-5 pb-5 border-b border-gray-100">
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
                ₦
                {(listing.price / listing.installment.count).toLocaleString(
                  "en-NG",
                  { maximumFractionDigits: 0 },
                )}
                /{listing.installment.interval === "monthly" ? "mo" : "wk"}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={onEdit}
            >
              <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
            </Button>
            {listing.status !== "sold" && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleStatus}
                title={
                  listing.status === "active"
                    ? "Hide (draft)"
                    : "Make active"
                }
              >
                {listing.status === "active" ? (
                  <PowerOff className="h-3.5 w-3.5" />
                ) : (
                  <Power className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ListingsGrid({
  listings,
  onEdit,
  onToggleStatus,
  onDelete,
}: ListingsGridProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [viewingListing, setViewingListing] =
    useState<MarketplaceListing | null>(null);

  const handleView = (listing: MarketplaceListing) => {
    setOpenMenuId(null);
    setViewingListing(listing);
  };

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
    <>
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
              className="relative rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#0D9488]/30 flex flex-col"
            >
              {/* Cover — click to preview */}
              <div
                className="relative w-full aspect-video flex-shrink-0 overflow-hidden rounded-t-xl cursor-pointer group"
                onClick={() => handleView(listing)}
              >
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
                {(listing.images?.length ?? 0) > 1 && (
                  <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">
                    +{(listing.images?.length ?? 1) - 1}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 text-white rounded-full p-2">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
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
                              onClick={() => handleView(listing)}
                              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-[#F9FAFB] transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5 text-[#9CA3AF]" />
                              Preview
                            </button>
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
                                {listing.status === "active" ? (
                                  <PowerOff className="h-3.5 w-3.5 text-[#9CA3AF]" />
                                ) : (
                                  <Power className="h-3.5 w-3.5 text-[#9CA3AF]" />
                                )}
                                {listing.status === "active"
                                  ? "Hide (draft)"
                                  : "Make active"}
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
                      ₦
                      {(
                        listing.price / listing.installment.count
                      ).toLocaleString("en-NG", { maximumFractionDigits: 0 })}
                      /
                      {listing.installment.interval === "monthly"
                        ? "mo"
                        : "wk"}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 mt-auto flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                  >
                    {statusStyle.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(listing)}
                      title="Preview"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
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
            </div>
          );
        })}
      </div>

      {viewingListing && (
        <ListingDetailModal
          listing={viewingListing}
          onClose={() => setViewingListing(null)}
          onEdit={() => {
            setViewingListing(null);
            onEdit(viewingListing);
          }}
          onToggleStatus={() => {
            setViewingListing(null);
            onToggleStatus(viewingListing.id);
          }}
          onDelete={() => {
            setViewingListing(null);
            onDelete(viewingListing.id);
          }}
        />
      )}
    </>
  );
}
