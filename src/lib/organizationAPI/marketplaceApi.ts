import apiClient from "../apiClient";
import {
  MarketplaceListing,
  ListingImage,
  CreateListingDto,
  ListingStatus,
} from "@/types/marketplace";

type CreateFormData = Omit<CreateListingDto, "images">;
type UpdateFormData = Partial<CreateFormData> & { files?: File[] };

export interface PaginatedListings {
  data: MarketplaceListing[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// The API may return imageUrl/image (string) instead of images (array).
// Normalize everything to the images-array shape the UI expects.
function normalizeListing(raw: Record<string, unknown>): MarketplaceListing {
  const rawImages = raw.images as ListingImage[] | undefined;
  const singleUrl = (raw.imageUrl ?? raw.image_url ?? raw.image) as
    | string
    | undefined;

  let images: ListingImage[] | undefined;
  if (rawImages && rawImages.length > 0) {
    images = rawImages;
  } else if (typeof singleUrl === "string" && singleUrl) {
    images = [{ url: singleUrl, publicId: "" }];
  }

  return {
    ...(raw as unknown as MarketplaceListing),
    images,
    price: Number(raw.price),
  };
}

function normalizeMany(raws: unknown[]): MarketplaceListing[] {
  return (raws as Record<string, unknown>[]).map(normalizeListing);
}

function buildMeta(
  response: { meta?: PaginatedListings["meta"] },
  data: unknown[],
  page: number,
  limit: number,
): PaginatedListings["meta"] {
  return (
    response.meta ?? {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
    }
  );
}

function buildListingForm(
  data: Partial<CreateFormData>,
  files: File[],
): FormData {
  const form = new FormData();
  if (data.title !== undefined) form.append("title", data.title);
  if (data.description !== undefined)
    form.append("description", data.description);
  if (data.price !== undefined) form.append("price", data.price.toString());
  if (data.currency !== undefined) form.append("currency", data.currency);
  if (data.status !== undefined) form.append("status", data.status);
  if (data.installment?.enabled) {
    form.append("installment[enabled]", "true");
    form.append("installment[count]", data.installment.count.toString());
    form.append("installment[interval]", data.installment.interval);
  }
  if (files.length > 0) form.append("image", files[0]);
  return form;
}

export const marketplaceApi = {
  // All public listings (optional filters)
  getAll: async (
    page = 1,
    limit = 20,
    status?: ListingStatus,
    organizationId?: string,
  ): Promise<PaginatedListings> => {
    const response = await apiClient.get("/marketplace/listings", {
      params: { page, limit, status, organization_id: organizationId },
    });
    const raw: unknown[] = response.data.data ?? [];
    const data = normalizeMany(raw);
    return { data, meta: buildMeta(response.data, data, page, limit) };
  },

  // Current org's own listings
  getMyListings: async (
    page = 1,
    limit = 50,
    status?: ListingStatus,
  ): Promise<PaginatedListings> => {
    const response = await apiClient.get("/marketplace/listings/my", {
      params: { page, limit, status },
    });
    const raw: unknown[] = response.data.data ?? [];
    const data = normalizeMany(raw);
    return { data, meta: buildMeta(response.data, data, page, limit) };
  },

  // Active listings for a specific org (member-side browsing)
  getByOrgId: async (orgId: string): Promise<MarketplaceListing[]> => {
    const response = await apiClient.get(
      `/marketplace/listings/org/${orgId}`,
      { params: { status: "active" } },
    );
    const raw: unknown[] = response.data.data ?? response.data ?? [];
    return normalizeMany(raw);
  },

  getById: async (id: string): Promise<MarketplaceListing> => {
    const response = await apiClient.get(`/marketplace/listings/${id}`);
    return normalizeListing(response.data.data as Record<string, unknown>);
  },

  create: async (
    data: CreateFormData,
    files: File[],
  ): Promise<MarketplaceListing> => {
    const form = buildListingForm(data, files);
    const response = await apiClient.post("/marketplace/listings", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeListing(response.data.data as Record<string, unknown>);
  },

  update: async (
    id: string,
    data: UpdateFormData,
  ): Promise<MarketplaceListing> => {
    const form = buildListingForm(data, data.files ?? []);
    try {
      const response = await apiClient.put(
        `/marketplace/listings/${id}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return normalizeListing(response.data.data as Record<string, unknown>);
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: unknown } };
      console.log(
        "[marketplace] update error:",
        JSON.stringify(axErr.response?.data),
      );
      throw err;
    }
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/marketplace/listings/${id}`);
  },

  toggleStatus: async (
    id: string,
    currentStatus: ListingStatus,
  ): Promise<MarketplaceListing> => {
    const newStatus: ListingStatus =
      currentStatus === "active" ? "inactive" : "active";
    const form = new FormData();
    form.append("status", newStatus);
    const response = await apiClient.put(`/marketplace/listings/${id}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeListing(response.data.data as Record<string, unknown>);
  },

  search: async (
    q: string,
    page?: number,
    limit?: number,
  ): Promise<MarketplaceListing[]> => {
    const response = await apiClient.get("/marketplace/search", {
      params: { q, page, limit },
    });
    const raw: unknown[] = response.data.data ?? [];
    return normalizeMany(raw);
  },
};
