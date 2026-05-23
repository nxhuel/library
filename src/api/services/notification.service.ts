import apiClient from '../client/apiClient';
import { NotificationResponseDTO } from '../types/notification.types';

export const notificationService = {
  getByUser: async (userId: number) => {
    const { data } = await apiClient.get<NotificationResponseDTO[]>(`notifications/user/${userId}`);
    return data;
  },

  getUnread: async (userId: number) => {
    const { data } = await apiClient.get<NotificationResponseDTO[]>(`notifications/user/${userId}/unread`);
    return data;
  },

  getUnreadCount: async (userId: number) => {
    const { data } = await apiClient.get<number>(`notifications/user/${userId}/unread-count`);
    return data;
  },

  create: async (userId: number, message: string) => {
    const { data } = await apiClient.post<NotificationResponseDTO>(`notifications/user/${userId}`, null, {
      params: { message },
    });
    return data;
  },

  markAsRead: async (id: number) => {
    await apiClient.patch(`notifications/${id}/read`);
  },

  markAllAsRead: async (userId: number) => {
    await apiClient.patch(`notifications/user/${userId}/read-all`);
  },
};
