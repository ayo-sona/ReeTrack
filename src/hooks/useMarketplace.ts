import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  marketplaceApi,
} from "../lib/organizationAPI/marketplaceApi";
import { CreateListingDto, UpdateListingDto } from "@/types/marketplace";

export const useListings = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ["marketplace", "listings", page, limit],
    queryFn: () => marketplaceApi.getAll(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useListing = (id: string) => {
  return useQuery({
    queryKey: ["marketplace", "listings", id],
    queryFn: () => marketplaceApi.getById(id),
    enabled: !!id,
  });
};

export const usePublicListings = () => {
  return useQuery({
    queryKey: ["marketplace", "listings", "public"],
    queryFn: () => marketplaceApi.getPublic(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateListingDto) => marketplaceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateListingDto }) =>
      marketplaceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketplaceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
};

export const useToggleListingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketplaceApi.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
};
