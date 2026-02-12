import apiClient from "../apiClient";

export interface SendNotificationDto {
  member_ids: string[];
  message: string;
  channel: "email" | "sms" | "both";
}

export interface SentNotification {
  id: string;
  message: string;
  sent_to: number;
  sent_at: string;
  channel: "email" | "sms" | "both";
  status: "sent" | "failed" | "pending";
}

export const notificationsApi = {
  // Get notification history
  getHistory: async (): Promise<SentNotification[]> => {
    const response = await apiClient.get("/notifications/history");
    return response.data.data;
  },

  // Send notification to members
  send: async (data: SendNotificationDto): Promise<{
    success: boolean;
    notification_id: string;
    sent_to: number;
    channel: string;
    message: string;
  }> => {
    const response = await apiClient.post("/notifications/send", data);
    return response.data.data;
  },
};