"use client";

import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Check,
  Globe,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useAvailablePlans } from "@/hooks/memberHook/useCommunity";
import { memberApi } from "@/lib/memberAPI/memberAPI";
import { useQuery } from "@tanstack/react-query";
import { usePublicListingsByOrg } from "@/hooks/useMarketplace";
import { MarketplaceListing } from "@/types/marketplace";
import { addDays, addWeeks, addMonths, addYears, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

const C = {
  teal: "#0D9488",
  coral: "#F06543",
  snow: "#F9FAFB",
  white: "#FFFFFF",
  ink: "#1F2937",
  coolGrey: "#9CA3AF",
  border: "#E5E7EB",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};


const LISTING_PALETTE = [
  { bg: "#0D9488", light: "#E6F7F5" },
  { bg: "#0284C7", light: "#E0F2FE" },
  { bg: "#7C3AED", light: "#EDE9FE" },
  { bg: "#DB2777", light: "#FCE7F3" },
];

function getListingColor(title: string) {
  let h = 0;
  for (const c of title) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return LISTING_PALETTE[h % LISTING_PALETTE.length];
}

/* ── Listing detail modal ── */
function ListingDetailModal({
  listing,
  organizationId,
  onClose,
}: {
  listing: MarketplaceListing;
  organizationId: string;
  onClose: () => void;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const { bg, light } = getListingColor(listing.title);
  const images = listing.images ?? [];
  const hasImages = images.length > 0;

  const prev = () => setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const backHref = encodeURIComponent(`/member/communities/${organizationId}`);
  const checkoutHref = `/member/marketplace/checkout/${listing.id}?title=${encodeURIComponent(listing.title)}&price=${listing.price}&desc=${encodeURIComponent(listing.description)}&backHref=${backHref}&backLabel=${encodeURIComponent("Back to Community")}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 640,
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        }}
      >
        {/* Image / placeholder cover */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            flexShrink: 0,
            background: light,
          }}
        >
          {hasImages ? (
            <>
              <Image
                src={images[imgIndex].url}
                alt={listing.title}
                fill
                className="object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.45)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.45)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 12,
                      left: 0,
                      right: 0,
                      display: "flex",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        style={{
                          width: i === imgIndex ? 20 : 8,
                          height: 8,
                          borderRadius: 4,
                          background:
                            i === imgIndex ? "#fff" : "rgba(255,255,255,0.5)",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          transition: "all 200ms",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 48,
                      background: "rgba(0,0,0,0.5)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {imgIndex + 1} / {images.length}
                  </span>
                </>
              )}
            </>
          ) : (
            /* Styled placeholder */
            <>
              <div
                style={{
                  position: "absolute",
                  top: -24,
                  right: -24,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: bg,
                  opacity: 0.15,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -16,
                  left: -16,
                  width: 80,
                  height: 80,
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
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    background: bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: 32,
                    color: "#fff",
                    boxShadow: `0 10px 28px ${bg}50`,
                  }}
                >
                  {listing.title.charAt(0).toUpperCase()}
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: bg,
                    fontWeight: 700,
                    background: "rgba(255,255,255,0.8)",
                    padding: "3px 10px",
                    borderRadius: 999,
                  }}
                >
                  No photos uploaded yet
                </span>
              </div>
            </>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.4)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "10px 16px",
              overflowX: "auto",
              borderBottom: "1px solid #F3F4F6",
              flexShrink: 0,
            }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 8,
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                  border: `2px solid ${i === imgIndex ? bg : "transparent"}`,
                  cursor: "pointer",
                  padding: 0,
                  background: "none",
                  transition: "border-color 150ms",
                }}
              >
                <Image
                  src={img.url}
                  alt={`img-${i}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Details */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px" }}>
          <h2
            style={{
              fontWeight: 800,
              fontSize: 22,
              color: C.ink,
              margin: "0 0 10px",
              letterSpacing: "-0.3px",
              lineHeight: 1.25,
            }}
          >
            {listing.title}
          </h2>
          <p
            style={{
              fontSize: 14,
              color: C.coolGrey,
              lineHeight: 1.7,
              marginBottom: 20,
            }}
          >
            {listing.description}
          </p>

          <div
            style={{
              padding: "16px 18px",
              borderRadius: 12,
              background: C.snow,
              border: `1px solid ${C.border}`,
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontWeight: 900, fontSize: 30, color: C.ink }}>
                ₦{listing.price.toLocaleString()}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.coolGrey,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                one-time
              </span>
            </div>
            {listing.installment?.enabled && (
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: bg,
                  marginTop: 4,
                }}
              >
                or {listing.installment.count}× ₦
                {(listing.price / listing.installment.count).toLocaleString(
                  "en-NG",
                  { maximumFractionDigits: 0 },
                )}
                /{listing.installment.interval === "monthly" ? "mo" : "wk"}
              </p>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div
          style={{
            padding: "14px 24px 20px",
            borderTop: "1px solid #F0F0F0",
            display: "flex",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Close
          </Button>
          <div style={{ flex: 1, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: "-4px",
                borderRadius: "12px",
                background: `linear-gradient(to right, rgba(240,101,67,0.4), rgba(240,101,67,0.2), rgba(240,101,67,0.4))`,
                filter: "blur(14px)",
                opacity: 0.7,
                zIndex: 0,
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Button
                variant="default"
                size="default"
                className="w-full"
                asChild
              >
                <Link href={checkoutHref}>Buy Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrgMarketplaceTab({ organizationId }: { organizationId: string }) {
  const { data: listings = [], isLoading } = usePublicListingsByOrg(organizationId);
  const [selectedListing, setSelectedListing] =
    useState<MarketplaceListing | null>(null);

  if (isLoading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: 260, borderRadius: 16, background: C.white, border: `1px solid ${C.border}`, animation: "pulse 1.5s ease-in-out infinite" }} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "64px 32px", background: C.white, borderRadius: 16, border: `1px solid ${C.border}` }}>
        <ShoppingBag size={36} color={C.coolGrey} style={{ margin: "0 auto 16px" }} />
        <p style={{ fontWeight: 700, fontSize: 16, color: C.ink, marginBottom: 6 }}>No listings yet</p>
        <p style={{ fontSize: 14, color: C.coolGrey }}>This community hasn&apos;t added any marketplace items.</p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {listings.map((item, i) => {
          const { bg, light } = getListingColor(item.title);
          const coverUrl = item.images?.[0]?.url ?? null;
          return (
            <motion.div
              key={item.id}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i}
              onClick={() => setSelectedListing(item)}
              style={{
                background: C.white,
                borderRadius: "16px",
                border: `1px solid ${C.border}`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                cursor: "pointer",
                transition: "box-shadow 240ms, transform 240ms",
              }}
              whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.10)" }}
            >
              {/* Cover */}
              <div
                style={{
                  background: light,
                  height: 110,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        top: -16,
                        right: -16,
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: bg,
                        opacity: 0.15,
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
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 20,
                          color: "#fff",
                          boxShadow: `0 6px 16px ${bg}40`,
                        }}
                      >
                        {item.title.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </>
                )}
                {/* View hint */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    right: 10,
                    background: "rgba(0,0,0,0.35)",
                    borderRadius: 999,
                    padding: "3px 9px",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <ShoppingBag size={10} color="#fff" />
                  <span
                    style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}
                  >
                    View
                  </span>
                </div>
              </div>

              {/* Body */}
              <div
                style={{
                  padding: "18px 20px 20px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: C.ink,
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: C.coolGrey,
                    lineHeight: 1.6,
                    margin: 0,
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.description}
                </p>
                <div
                  style={{ paddingTop: 12, borderTop: `1px solid ${C.border}` }}
                >
                  <p
                    style={{
                      fontWeight: 800,
                      fontSize: 20,
                      color: C.ink,
                      margin: 0,
                    }}
                  >
                    ₦{item.price.toLocaleString()}
                  </p>
                  {item.installment?.enabled ? (
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: bg,
                        marginTop: 2,
                      }}
                    >
                      or {item.installment.count}× ₦
                      {(item.price / item.installment.count).toLocaleString(
                        "en-NG",
                        { maximumFractionDigits: 0 },
                      )}
                      /{item.installment.interval === "monthly" ? "mo" : "wk"}
                    </p>
                  ) : (
                    <p
                      style={{ fontSize: 12, color: C.coolGrey, marginTop: 2 }}
                    >
                      one-time
                    </p>
                  )}
                </div>
                {/* Buy Now glow button */}
                <div
                  style={{ position: "relative", marginTop: 4 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: "-4px",
                      borderRadius: "12px",
                      background: `linear-gradient(to right, rgba(240,101,67,0.4), rgba(240,101,67,0.2), rgba(240,101,67,0.4))`,
                      filter: "blur(14px)",
                      opacity: 0.7,
                      zIndex: 0,
                    }}
                  />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link
                        href={`/member/marketplace/checkout/${item.id}?title=${encodeURIComponent(item.title)}&price=${item.price}&desc=${encodeURIComponent(item.description)}&backHref=${encodeURIComponent(`/member/communities/${organizationId}`)}&backLabel=${encodeURIComponent("Back to Community")}`}
                      >
                        Buy Now
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedListing && (
          <ListingDetailModal
            listing={selectedListing}
            organizationId={organizationId}
            onClose={() => setSelectedListing(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: C.white,
        borderRadius: "16px",
        border: `1px solid ${C.border}`,
        height: "400px",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number | null;
  interval: string | null;
  features?: string[];
  organization_id: string;
  is_active: boolean;
  organization: {
    name: string;
    description?: string;
    address?: string;
    email?: string;
    phone?: string;
    website?: string;
    logo_url?: string | null;
  };
}

interface PlanCardProps {
  plan: Plan;
  isSubscribed: boolean;
  index: number;
}

function PlanCard({ plan, isSubscribed, index }: PlanCardProps) {
  const [hovered, setHovered] = useState(false);

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "Free";
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getNextBillingDate = (interval: string | null) => {
    if (!interval) return null;
    const today = new Date();
    switch (interval.toLowerCase()) {
      case "daily":
        return addDays(today, 1);
      case "weekly":
        return addWeeks(today, 1);
      case "monthly":
        return addMonths(today, 1);
      case "quarterly":
        return addMonths(today, 3);
      case "yearly":
        return addYears(today, 1);
      default:
        return null;
    }
  };

  const nextBillingDate = getNextBillingDate(plan.interval);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        background: C.white,
        borderRadius: "16px",
        border: isSubscribed
          ? `2px solid ${C.teal}`
          : `1px solid ${hovered ? C.teal : C.border}`,
        padding: "28px",
        boxShadow: isSubscribed
          ? "0 12px 32px rgba(13,148,136,0.15)"
          : hovered
            ? "0 8px 24px rgba(13,148,136,0.1)"
            : "0 1px 4px rgba(0,0,0,0.05)",
        transition: "all 300ms",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isSubscribed && (
        <div style={{ marginBottom: "16px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "6px 12px",
              borderRadius: "999px",
              background: "rgba(13,148,136,0.1)",
              color: C.teal,
              fontFamily: "Nunito, sans-serif",
              fontWeight: 600,
              fontSize: "12px",
            }}
          >
            <Check size={12} />
            Currently Subscribed
          </span>
        </div>
      )}

      <h3
        style={{
          fontWeight: 700,
          fontSize: "18px",
          color: C.ink,
          marginBottom: "8px",
        }}
      >
        {plan.name}
      </h3>
      <p
        style={{
          fontWeight: 400,
          fontSize: "13px",
          color: C.coolGrey,
          marginBottom: "16px",
          lineHeight: 1.6,
        }}
      >
        {plan.description}
      </p>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span
            style={{
              fontWeight: 800,
              fontSize: "32px",
              color: C.teal,
              letterSpacing: "-0.5px",
            }}
          >
            {formatCurrency(plan.price)}
          </span>
          {plan.interval && (
            <span
              style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey }}
            >
              /{plan.interval}
            </span>
          )}
        </div>
      </div>

      {nextBillingDate && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px",
            borderRadius: "8px",
            background: C.snow,
            border: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Calendar size={14} style={{ color: C.coolGrey }} />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "11px",
                    color: C.coolGrey,
                    marginBottom: "2px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Next billing date
                </p>
                <p style={{ fontWeight: 600, fontSize: "13px", color: C.ink }}>
                  {format(nextBillingDate, "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div
              style={{
                paddingTop: "10px",
                borderTop: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Clock size={14} style={{ color: C.coolGrey }} />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontWeight: 400,
                    fontSize: "11px",
                    color: C.coolGrey,
                    marginBottom: "2px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Billing time
                </p>
                <p style={{ fontWeight: 600, fontSize: "13px", color: C.ink }}>
                  {format(nextBillingDate, "hh:mm a")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {plan.features && plan.features.length > 0 && (
        <div style={{ marginBottom: "24px", flex: 1 }}>
          <p
            style={{
              fontWeight: 600,
              fontSize: "11px",
              color: C.coolGrey,
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Features
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {plan.features.map((feature: string, idx: number) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <Check
                  size={14}
                  style={{ color: C.teal, flexShrink: 0, marginTop: "2px" }}
                />
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "13px",
                    color: C.ink,
                    lineHeight: 1.5,
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isSubscribed ? (
        <Button variant="secondary" size="lg" className="w-full" asChild>
          <Link href="/member/subscriptions">Manage Subscription</Link>
        </Button>
      ) : (
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: "-4px",
              borderRadius: "12px",
              background: `linear-gradient(to right, rgba(240,101,67,0.4), rgba(240,101,67,0.2), rgba(240,101,67,0.4))`,
              filter: "blur(14px)",
              opacity: 0.7,
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <Button variant="default" size="lg" className="w-full" asChild>
              <Link href={`/member/checkout/${plan.id}`}>Subscribe Now</Link>
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function OrganizationPlansPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const [activeTab, setActiveTab] = useState<"plans" | "marketplace">("plans");

  const { data: allPlans, isLoading: plansLoading } = useAvailablePlans();

  const { data: subscriptionsData } = useQuery({
    queryKey: ["member", "subscriptions"],
    queryFn: async () => {
      const response = await memberApi
        .getMySubscription()
        .catch(() => ({ data: [] }));
      return Array.isArray(response.data)
        ? response.data
        : response.data
          ? [response.data]
          : [];
    },
  });

  if (plansLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.snow,
          fontFamily: "Nunito, sans-serif",
          padding: "32px 24px",
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap'); @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }`}</style>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              height: "32px",
              width: "200px",
              background: C.white,
              borderRadius: "8px",
              border: `1px solid ${C.border}`,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              height: "240px",
              background: C.white,
              borderRadius: "16px",
              border: `1px solid ${C.border}`,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "20px",
            }}
          >
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const organizationPlans =
    allPlans?.filter(
      (plan) => plan.organization_id === organizationId && plan.is_active,
    ) || [];

  if (organizationPlans.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.snow,
          fontFamily: "Nunito, sans-serif",
          padding: "32px 24px",
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');`}</style>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              background: C.white,
              borderRadius: "16px",
              border: `1px solid ${C.border}`,
              padding: "64px 32px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "18px",
                background: C.snow,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                color: C.coolGrey,
              }}
            >
              <Building2 size={32} />
            </div>
            <h3
              style={{
                fontWeight: 700,
                fontSize: "20px",
                color: C.ink,
                marginBottom: "8px",
              }}
            >
              No Plans Available
            </h3>
            <p
              style={{
                fontWeight: 400,
                fontSize: "15px",
                color: C.coolGrey,
                marginBottom: "24px",
                lineHeight: 1.6,
              }}
            >
              This organization doesn&apos;t have any active plans.
            </p>
            <Button variant="secondary" asChild>
              <Link href="/member/communities">Back to My Community</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const organization = organizationPlans[0].organization;
  const subscriptions = subscriptionsData || [];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.snow,
        fontFamily: "Nunito, sans-serif",
        padding: "32px 24px 96px",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Back button */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          style={{ marginBottom: "24px" }}
        >
          <Button variant="ghost" size="sm" asChild>
            <Link href="/member/communities">
              <ArrowLeft size={16} />
              Back to My Community
            </Link>
          </Button>
        </motion.div>

        {/* Organization header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          style={{
            background: C.white,
            borderRadius: "16px",
            border: `1px solid ${C.border}`,
            padding: "32px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "16px",
                background: C.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.white,
                fontWeight: 800,
                fontSize: "28px",
                flexShrink: 0,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {organization.logo_url ? (
                <Image
                  src={organization.logo_url}
                  alt={organization.name}
                  fill
                  className="object-cover"
                />
              ) : (
                organization.name.charAt(0).toUpperCase()
              )}
            </div>
            <div style={{ flex: 1, minWidth: "0" }}>
              <h1
                style={{
                  fontWeight: 800,
                  fontSize: "28px",
                  color: C.ink,
                  marginBottom: "8px",
                  letterSpacing: "-0.4px",
                }}
              >
                {organization.name}
              </h1>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "14px",
                  color: C.coolGrey,
                  marginBottom: "16px",
                  lineHeight: 1.6,
                }}
              >
                {organization.description}
              </p>
              <div
                style={{ display: "grid", gap: "10px", fontSize: "13px" }}
                className="md:grid-cols-2"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: C.coolGrey,
                  }}
                >
                  <MapPin size={14} style={{ flexShrink: 0 }} />
                  <span>{organization.address}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: C.coolGrey,
                  }}
                >
                  <Mail size={14} style={{ flexShrink: 0 }} />
                  <span>{organization.email}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: C.coolGrey,
                  }}
                >
                  <Phone size={14} style={{ flexShrink: 0 }} />
                  <span>{organization.phone}</span>
                </div>
                {organization.website && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Globe
                      size={14}
                      style={{ color: C.coolGrey, flexShrink: 0 }}
                    />
                    <a
                      href={`https://${organization.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontWeight: 600,
                        color: C.teal,
                        textDecoration: "none",
                      }}
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          style={{ marginBottom: "28px" }}
        >
          <div
            style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}
          >
            {(["plans", "marketplace"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "12px 4px",
                  marginRight: 28,
                  background: "none",
                  border: "none",
                  borderBottom:
                    activeTab === tab
                      ? `2px solid ${C.teal}`
                      : "2px solid transparent",
                  color: activeTab === tab ? C.teal : C.coolGrey,
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 160ms",
                  whiteSpace: "nowrap",
                }}
              >
                {tab === "plans"
                  ? `Plans (${organizationPlans.length})`
                  : "Marketplace"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab content */}
        {activeTab === "plans" ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "20px",
            }}
          >
            {organizationPlans.map((plan, i) => {
              const isSubscribed = subscriptions.find(
                (sub: { plan_id: string; status: string }) =>
                  sub.plan_id === plan.id && sub.status === "active",
              );
              return (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isSubscribed={isSubscribed}
                  index={i + 4}
                />
              );
            })}
          </div>
        ) : (
          <OrgMarketplaceTab organizationId={organizationId} />
        )}
      </div>
    </div>
  );
}
