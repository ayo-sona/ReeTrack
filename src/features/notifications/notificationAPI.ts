import { apiClient } from '../../lib/apiClient';
import { Notification } from '../../types/notification';
import { MOCK_NOTIFICATIONS } from '../../lib/mockData';

export const notificationAPI = {
  async getAll(): Promise<Notification[]> {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<Notification[]>('/notifications');
    // return response.data!;
    
    // Mock for now
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_NOTIFICATIONS), 500);
    });
  },

  async markAsRead(notificationId: string): Promise<void> {
    // TODO: Replace with actual API call
    // await apiClient.put(`/notifications/${notificationId}/read`);
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 200);
    });
  },

  async markAllAsRead(): Promise<void> {
    // TODO: Replace with actual API call
    // await apiClient.put('/notifications/read-all');
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },

  async delete(notificationId: string): Promise<void> {
    // TODO: Replace with actual API call
    // await apiClient.delete(`/notifications/${notificationId}`);
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 200);
    });
  },
};