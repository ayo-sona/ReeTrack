"use client";

import { useState } from "react";
import {
  MoreVertical, Edit, Trash2, Power, PowerOff, ShoppingBag,
  X, ChevronLeft, ChevronRight, ZoomIn,
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

function PlaceholderCover({ title }: { title: string }) {
  const { bg, light } = getPalette(title);
  const initial = title.trim().charAt(0).toUpperCase();
  return (
    <div style={{ background: light, position: "relative", width: "100%", height: "100%" }}>
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

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  available: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100", label: "Available" },
  sold: { bg: "bg-gray-100", text: "text-[#9CA3AF]", border: "border-gray-200", label: "Sold" },
  inactive: { bg: "bg-gray-100", text: "text-[#9CA3AF]", border: "border-gray-200", label: "Draft" },
};

/* ── Listing detail modal ── */
function ListingDetailModal({ listing, onClose, onEdit }: { listing: MarketplaceListing; onClose: () => void; onEdit: () => void }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = listing.images ?? [];
  const hasImages = images.length > 0;
  const { bg } = getPalette(listing.title);
  const statusStyle = STATUS_STYLES[listing.status] ?? STATUS_STYLES.inactive;

  const prev = () => setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "Nunito, sans-serif" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 680, background: "#fff", borderRadius: 20, overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}
      >
        {/* Image gallery */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#F3F4F6", flexShrink: 0 }}>
          {hasImages ? (
            <>
              <Image src={images[imgIndex].url} alt={listing.title} fill className="object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={prev} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={next} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                    <ChevronRight size={18} />
                  </button>
                  {/* Dot indicators */}
                  <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIndex(i)} style={{ width: i === imgIndex ? 20 : 8, height: 8, borderRadius: 4, background: i === imgIndex ? "#fff" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", padding: 0, transition: "all 200ms" }} />
                    ))}
                  </div>
                  {/* Counter */}
                  <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>
                    {imgIndex + 1} / {images.length}
                  </span>
                </>
              )}
            </>
          ) : (
            <PlaceholderCover title={listing.title} />
          )}
          {/* Close button */}
          <button onClick={onClose} style={{ position: "absolute", top: 12, left: 12, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <X size={16} />
          </button>
        </div>

        {/* Thumbnail strip (if >1 image) */}
        {images.length > 1 && (
          <div style={{ display: "flex", gap: 8, padding: "10px 16px", overflowX: "auto", borderBottom: "1px solid #F3F4F6", flexShrink: 0 }}>
            {images.map((img, i) => (
              <button key={i} onClick={() => setImgIndex(i)} style={{ width: 52, height: 52, borderRadius: 8, overflow: "hidden", position: "relative", flexShrink: 0, border: `2px solid ${i === imgIndex ? bg : "transparent"}`, cursor: "pointer", padding: 0, background: "none", transition: "border-color 150ms" }}>
                <Image src={img.url} alt={`img-${i}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Details */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <h2 style={{ fontWeight: 800, fontSize: 20, color: "#1F2937", margin: 0, letterSpacing: "-0.3px", lineHeight: 1.25 }}>{listing.title}</h2>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`} style={{ flexShrink: 0, marginTop: 3 }}>
              {statusStyle.label}
            </span>
          </div>

          {listing.description && (
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, marginBottom: 18 }}>{listing.description}</p>
          )}

          <div style={{ padding: "14px 16px", borderRadius: 12, background: "#F9FAFB", border: "1px solid #F0F0F0", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontWeight: 900, fontSize: 28, color: "#1F2937" }}>₦{listing.price.toLocaleString()}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px" }}>one-time</span>
            </div>
            {listing.installment?.enabled && (
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0D9488", marginTop: 4 }}>
                or {listing.installment.count}× ₦{(listing.price / listing.installment.count).toLocaleString("en-NG", { maximumFractionDigits: 0 })}/{listing.installment.interval === "monthly" ? "mo" : "wk"}
              </p>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: "14px 22px 20px", borderTop: "1px solid #F3F4F6", display: "flex", gap: 10, flexShrink: 0 }}>
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Close</Button>
          <Button type="button" className="flex-1 bg-[#0D9488] hover:bg-[#0B8076] text-white font-bold" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" /> Edit listing
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ListingsGrid({ listings, onEdit, onToggleStatus, onDelete }: ListingsGridProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [viewingListing, setViewingListing] = useState<MarketplaceListing | null>(null);

  if (listings.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm" style={{ fontFamily: "Nunito, sans-serif" }}>
        <div className="mx-auto w-16 h-16 bg-[#0D9488]/10 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-[#0D9488]" />
        </div>
        <h3 className="text-base font-bold text-[#1F2937] mb-1">No listings yet</h3>
        <p className="text-sm text-[#9CA3AF]">Create your first listing to start selling to your members</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" style={{ fontFamily: "Nunito, sans-serif" }}>
        {listings.map((listing) => {
          const statusStyle = STATUS_STYLES[listing.status] ?? STATUS_STYLES.inactive;
          const coverImage = listing.images?.[0]?.url ?? null;

          return (
            <div key={listing.id} className="relative rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#0D9488]/30 flex flex-col overflow-hidden">
              {/* Cover image — clickable to open expanded view */}
              <div
                className="relative w-full aspect-video flex-shrink-0 overflow-hidden cursor-pointer group"
                onClick={() => setViewingListing(listing)}
              >
                {coverImage ? (
                  <Image src={coverImage} alt={listing.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <PlaceholderCover title={listing.title} />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-2">
                    <ZoomIn className="h-5 w-5 text-[#1F2937]" />
                  </div>
                </div>
                {listing.images.length > 1 && (
                  <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    +{listing.images.length - 1}
                  </span>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-2 min-w-0">
                    <h3 className="text-base font-bold text-[#1F2937] truncate cursor-pointer hover:text-[#0D9488] transition-colors" title={listing.title} onClick={() => setViewingListing(listing)}>
                      {listing.title}
                    </h3>
                    {listing.description && (
                      <p className="mt-1 text-sm text-[#9CA3AF] line-clamp-2">{listing.description}</p>
                    )}
                  </div>

                  {/* Kebab menu */}
                  <div className="relative flex-shrink-0">
                    <button onClick={() => setOpenMenuId(openMenuId === listing.id ? null : listing.id)} className="rounded-lg p-1.5 hover:bg-[#F9FAFB] transition-colors">
                      <MoreVertical className="h-4 w-4 text-[#9CA3AF]" />
                    </button>
                    {openMenuId === listing.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                        <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white shadow-lg border border-gray-100 z-20 overflow-hidden">
                          <div className="py-1">
                            <button onClick={() => { setViewingListing(listing); setOpenMenuId(null); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-[#F9FAFB] transition-colors">
                              <ZoomIn className="h-3.5 w-3.5 text-[#9CA3AF]" />
                              View details
                            </button>
                            <button onClick={() => { onEdit(listing); setOpenMenuId(null); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-[#F9FAFB] transition-colors">
                              <Edit className="h-3.5 w-3.5 text-[#9CA3AF]" />
                              Edit
                            </button>
                            {listing.status !== "sold" && (
                              <button onClick={() => { onToggleStatus(listing.id); setOpenMenuId(null); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-[#F9FAFB] transition-colors">
                                {listing.status === "available" ? <PowerOff className="h-3.5 w-3.5 text-[#9CA3AF]" /> : <Power className="h-3.5 w-3.5 text-[#9CA3AF]" />}
                                {listing.status === "available" ? "Hide (draft)" : "Make available"}
                              </button>
                            )}
                            <button onClick={() => { onDelete(listing.id); setOpenMenuId(null); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
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
                    <span className="text-2xl font-extrabold text-[#1F2937]">₦{listing.price.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">one-time</span>
                  </div>
                  {listing.installment?.enabled && (
                    <p className="mt-1 text-xs font-semibold text-[#0D9488]">
                      or {listing.installment.count}× ₦{(listing.price / listing.installment.count).toLocaleString("en-NG", { maximumFractionDigits: 0 })}/{listing.installment.interval === "monthly" ? "mo" : "wk"}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-gray-100 mt-auto flex items-center justify-between">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                    {statusStyle.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setViewingListing(listing)} className="text-[#9CA3AF] hover:text-[#0D9488]">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => onEdit(listing)}>Edit</Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded listing modal */}
      {viewingListing && (
        <ListingDetailModal
          listing={viewingListing}
          onClose={() => setViewingListing(null)}
          onEdit={() => { onEdit(viewingListing); setViewingListing(null); }}
        />
      )}
    </>
  );
}