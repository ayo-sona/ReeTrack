"use client";

import { useState, useMemo } from "react";
import { Plus, ShoppingBag, TrendingUp } from "lucide-react";
import { MarketplaceListing } from "@/types/marketplace";
import { CreateListingModal, ListingFormData } from "@/components/organization/CreateListingModal";
import { ListingsGrid } from "@/components/organization/ListingsGrid";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ── Demo seed — swap for real API data when backend is ready ──────────────────

const DEMO_LISTINGS: MarketplaceListing[] = [
  {
    id: "demo-1",
    organization_id: "demo-org",
    title: "Annual Conference Ticket",
    description: "Full access to our 2-day annual summit. Includes workshops, networking dinner, and speaker sessions.",
    images: [],
    price: 75000,
    currency: "NGN",
    status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    organization_id: "demo-org",
    title: "Business Growth Bootcamp",
    description: "Intensive 4-week cohort for founders and operators. Live sessions, templates, and lifetime community access.",
    images: [],
    price: 120000,
    currency: "NGN",
    status: "available",
    installment: { enabled: true, count: 3, interval: "monthly" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    organization_id: "demo-org",
    title: "Member Kit – Branded Pack",
    description: "Official community merch bundle: notebook, tote bag, pen, and welcome card. Shipped to your door.",
    images: [],
    price: 18500,
    currency: "NGN",
    status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-4",
    organization_id: "demo-org",
    title: "1-on-1 Strategy Session",
    description: "60-minute private session with a senior member of our team. Bring your biggest challenge — walk away with a plan.",
    images: [],
    price: 50000,
    currency: "NGN",
    status: "sold",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ─────────────────────────────────────────────────────────────────────────────

let demoIdCounter = 100;

export default function MarketplacePage() {
  const [listings, setListings] = useState<MarketplaceListing[]>(DEMO_LISTINGS);
  const [showModal, setShowModal] = useState(false);
  const [editingListing, setEditingListing] = useState<MarketplaceListing | null>(null);
  const [deletingListingId, setDeletingListingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const stats = useMemo(
    () => ({
      total: listings.length,
      available: listings.filter((l) => l.status === "available").length,
      sold: listings.filter((l) => l.status === "sold").length,
      totalValue: listings
        .filter((l) => l.status === "available")
        .reduce((sum, l) => sum + l.price, 0),
    }),
    [listings],
  );

  const handleOpenCreate = () => {
    setEditingListing(null);
    setShowModal(true);
  };

  const handleEdit = (listing: MarketplaceListing) => {
    setEditingListing(listing);
    setShowModal(true);
  };

  const handleToggle = (listingId: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId
          ? { ...l, status: l.status === "available" ? "inactive" : "available" }
          : l,
      ),
    );
    toast.success("Listing updated");
  };

  const handleDelete = (listingId: string) => {
    setDeletingListingId(listingId);
  };

  const confirmDelete = () => {
    if (!deletingListingId) return;
    setListings((prev) => prev.filter((l) => l.id !== deletingListingId));
    toast.success("Listing deleted");
    setDeletingListingId(null);
  };

  const handleSave = async (formData: ListingFormData) => {
    setIsSaving(true);

    // Simulate a brief save delay for realism
    await new Promise((r) => setTimeout(r, 600));

    const images = formData.files.map((file) => ({
      url: URL.createObjectURL(file),
      publicId: `demo-${Date.now()}`,
    }));

    if (editingListing) {
      setListings((prev) =>
        prev.map((l) =>
          l.id === editingListing.id
            ? {
                ...l,
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                status: formData.status,
                installment: formData.installment,
                images: images.length > 0 ? images : l.images,
                updated_at: new Date().toISOString(),
              }
            : l,
        ),
      );
      toast.success("Listing updated");
    } else {
      const newListing: MarketplaceListing = {
        id: `demo-${++demoIdCounter}`,
        organization_id: "demo-org",
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: "NGN",
        status: formData.status,
        installment: formData.installment,
        images,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setListings((prev) => [newListing, ...prev]);
      toast.success("Listing created");
    }

    setIsSaving(false);
    setShowModal(false);
    setEditingListing(null);
  };

  const deletingListing = listings.find((l) => l.id === deletingListingId);

  return (
    <div className="font-[Nunito,sans-serif] bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#0D9488] mb-1">
              Marketplace
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">
              Listings
            </h1>
            <p className="text-sm text-[#9CA3AF] mt-0.5">
              make purchase items available to your members
            </p>
          </div>
          <Button
            variant="default"
            size="default"
            onClick={handleOpenCreate}
            className="w-full sm:w-auto self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            New Listing
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              label: "Total Listings",
              value: stats.total,
              icon: <ShoppingBag className="w-4 h-4 text-[#0D9488]" />,
            },
            {
              label: "Available",
              value: stats.available,
              icon: <span className="w-2 h-2 bg-emerald-500 rounded-full" />,
            },
            {
              label: "Sold",
              value: stats.sold,
              icon: <span className="w-2 h-2 bg-gray-400 rounded-full" />,
            },
            {
              label: "Total Value",
              value: `₦${stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
              icon: <TrendingUp className="w-4 h-4 text-[#0D9488]" />,
            },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4 sm:py-5"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide leading-tight">
                  {label}
                </p>
                {icon}
              </div>
              <p
                className="text-xl sm:text-2xl font-extrabold text-[#1F2937]"
                suppressHydrationWarning
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <ListingsGrid
          listings={listings}
          onEdit={handleEdit}
          onToggleStatus={handleToggle}
          onDelete={handleDelete}
        />
      </div>

      {/* Delete confirm */}
      {deletingListingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
          onClick={() => setDeletingListingId(null)}
        >
          <div
            className="bg-white rounded-xl border border-gray-100 shadow-xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-extrabold text-[#1F2937] mb-1">
              Delete listing
            </h2>
            <p className="text-sm text-[#9CA3AF] mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#1F2937]">
                &quot;{deletingListing?.title}&quot;
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeletingListingId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      <CreateListingModal
        key={editingListing?.id ?? "create"}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingListing(null);
        }}
        onSave={handleSave}
        editingListing={editingListing}
        isSaving={isSaving}
      />
    </div>
  );
}
