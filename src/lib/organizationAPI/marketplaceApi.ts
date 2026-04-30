import apiClient from "../apiClient";
import {
  MarketplaceListing,
  CreateListingDto,
  UpdateListingDto,
} from "@/types/marketplace";

export interface PaginatedListings {
  data: MarketplaceListing[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const marketplaceApi = {
  getAll: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedListings> => {
    const response = await apiClient.get("/marketplace/listings", {
      params: { page, limit },
    });
    const listings = response.data.data || [];
    return {
      data: listings,
      meta: {
        page,
        limit,
        total: listings.length,
        totalPages: Math.ceil(listings.length / limit),
      },
    };
  },

  getById: async (id: string): Promise<MarketplaceListing> => {
    const response = await apiClient.get(`/marketplace/listings/${id}`);
    return response.data.data;
  },

  create: async (data: CreateListingDto): Promise<MarketplaceListing> => {
    const response = await apiClient.post("/marketplace/listings", data);
    return response.data.data;
  },

  update: async (
    id: string,
    data: UpdateListingDto,
  ): Promise<MarketplaceListing> => {
    const response = await apiClient.put(`/marketplace/listings/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/marketplace/listings/${id}`);
  },

  toggleStatus: async (id: string): Promise<MarketplaceListing> => {
    const response = await apiClient.patch(
      `/marketplace/listings/${id}/toggle`,
    );
    return response.data.data;
  },

  getPublic: async (): Promise<MarketplaceListing[]> => {
    const response = await apiClient.get("/marketplace/listings/public");
    return response.data.data || [];
  },
};
