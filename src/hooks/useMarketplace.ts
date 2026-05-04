import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketplaceApi } from "../lib/organizationAPI/marketplaceApi";
import { CreateListingDto, ListingStatus } from "@/types/marketplace";

type CreateFormData = Omit<CreateListingDto, "images">;
type UpdateFormData = Partial<CreateFormData> & { files?: File[] };

// Current org's own listings (org-side management)
export const useMyListings = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: ["marketplace", "my", page, limit],
    queryFn: () => marketplaceApi.getMyListings(page, limit),
    staleTime: 2 * 60 * 1000,
  });
};

// All listings (paginated, no org filter)
export const useListings = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["marketplace", "listings", page, limit],
    queryFn: () => marketplaceApi.getAll(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

// Active listings for a specific org (member-side browsing)
export const usePublicListingsByOrg = (orgId: string) => {
  return useQuery({
    queryKey: ["marketplace", "org", orgId],
    queryFn: () => marketplaceApi.getByOrgId(orgId),
    enabled: !!orgId,
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

export const useCreateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, files }: { data: CreateFormData; files: File[] }) =>
      marketplaceApi.create(data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFormData }) =>
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
    mutationFn: ({
      id,
      currentStatus,
    }: {
      id: string;
      currentStatus: ListingStatus;
    }) => marketplaceApi.toggleStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });
};
