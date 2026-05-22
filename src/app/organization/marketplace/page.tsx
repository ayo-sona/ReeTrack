"use client";

import { useState, useMemo } from "react";
import { Plus, ShoppingBag, TrendingUp } from "lucide-react";
import { MarketplaceListing } from "@/types/marketplace";
import {
  CreateListingModal,
  ListingFormData,
} from "@/components/organization/CreateListingModal";
import { ListingsGrid } from "@/components/organization/ListingsGrid";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useMyListings,
  useCreateListing,
  useUpdateListing,
  useDeleteListing,
} from "@/hooks/useMarketplace";

export default function MarketplacePage() {
  const { data: listingsData, isLoading } = useMyListings();
  const { mutate: createListing, isPending: isCreating } = useCreateListing();
  const { mutate: updateListing, isPending: isUpdating } = useUpdateListing();
  const { mutate: deleteListing } = useDeleteListing();

  const [showModal, setShowModal] = useState(false);
  const [editingListing, setEditingListing] =
    useState<MarketplaceListing | null>(null);
  const [deletingListingId, setDeletingListingId] = useState<string | null>(
    null,
  );

  const listings = useMemo(() => listingsData?.data ?? [], [listingsData]);
  const isSaving = isCreating || isUpdating;

  const stats = useMemo(
    () => ({
      total: listings.length,
      active: listings.filter((l) => l.status === "active").length,
      sold: listings.filter((l) => l.status === "sold").length,
      totalValue: listings
        .filter((l) => l.status === "active")
        .reduce((sum, l) => sum + Number(l.price), 0),
    }),
    [listings],
  );

  const handleEdit = (listing: MarketplaceListing) => {
    setEditingListing(listing);
    setShowModal(true);
  };

  const handleToggle = (listingId: string) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;
    updateListing(
      {
        id: listingId,
        data: { status: listing.status === "active" ? "inactive" : "active" },
      },
      {
        onSuccess: () => toast.success("Listing updated"),
        onError: () => toast.error("Failed to update listing"),
      },
    );
  };

  const confirmDelete = () => {
    if (!deletingListingId) return;
    deleteListing(deletingListingId, {
      onSuccess: () => {
        toast.success("Listing deleted");
        setDeletingListingId(null);
      },
      onError: () => toast.error("Failed to delete listing"),
    });
  };

  const handleSave = (formData: ListingFormData) => {
    const basePayload = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      currency: "NGN" as const,
      status: formData.status,
      installment: formData.installment.enabled
        ? formData.installment
        : undefined,
    };

    if (editingListing) {
      updateListing(
        { id: editingListing.id, data: { ...basePayload, files: formData.files } },
        {
          onSuccess: () => {
            toast.success("Listing updated");
            setShowModal(false);
            setEditingListing(null);
          },
          onError: () => toast.error("Failed to update listing"),
        },
      );
    } else {
      createListing(
        { data: basePayload, files: formData.files },
        {
          onSuccess: () => {
            toast.success("Listing created");
            setShowModal(false);
          },
          onError: () => toast.error("Failed to create listing"),
        },
      );
    }
  };

  const deletingListing = listings.find((l) => l.id === deletingListingId);

  if (isLoading) {
    return (
      <div className="font-[Nunito,sans-serif] bg-[#F9FAFB] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          <div className="h-10 w-48 bg-white rounded-xl border border-gray-100 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-white rounded-xl border border-gray-100 animate-pulse"
              />
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-white rounded-xl border border-gray-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
            onClick={() => {
              setEditingListing(null);
              setShowModal(true);
            }}
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
              label: "Active",
              value: stats.active,
              icon: (
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" />
              ),
            },
            {
              label: "Sold",
              value: stats.sold,
              icon: (
                <span className="w-2 h-2 bg-gray-400 rounded-full inline-block" />
              ),
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
          onDelete={(id) => setDeletingListingId(id)}
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
