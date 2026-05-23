import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification.service';
import { queryKeys } from '../constants/queryKeys';

export const useNotifications = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.notifications.all(userId),
    queryFn: () => notificationService.getByUser(userId),
    enabled: !!userId,
  });
};

export const useUnreadNotifications = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.notifications.unread(userId),
    queryFn: () => notificationService.getUnread(userId),
    enabled: !!userId,
  });
};

export const useUnreadCount = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(userId),
    queryFn: () => notificationService.getUnreadCount(userId),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkRead = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount(userId) });
    },
  });
};

export const useMarkAllRead = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount(userId) });
    },
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, message }: { userId: number; message: string }) => 
      notificationService.create(userId, message),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount(variables.userId) });
    },
  });
};
