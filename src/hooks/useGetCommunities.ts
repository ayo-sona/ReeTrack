import { useQuery } from "@tanstack/react-query";
import { communitiesApi } from "@/lib/memberAPI/communitiesAPI";

export function useAllCommunities() {
  return useQuery({
    queryKey: ["communities"],
    queryFn: () => communitiesApi.getAll(),
    staleTime: 10 * 60 * 1000, // 10 min
  });
}

export function useCommunityById(id: string) {
  return useQuery({
    queryKey: ["communities", id],
    queryFn: () => communitiesApi.getById(id),
    enabled: !!id,
  });
}