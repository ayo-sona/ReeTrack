import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi, SendNotificationDto } from "../lib/organizationAPI/notificationsAPI";

// Get notification history
export const useNotificationHistory = () => {
  return useQuery({
    queryKey: ["notifications", "history"],
    queryFn: () => notificationsApi.getHistory(),
  });
};

// Send notification
export const useSendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendNotificationDto) => notificationsApi.send(data),
    onSuccess: () => {
      // Invalidate and refetch notification history
      queryClient.invalidateQueries({ queryKey: ["notifications", "history"] });
    },
  });
};