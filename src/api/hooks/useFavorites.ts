import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favorite.service';
import { queryKeys } from '../constants/queryKeys';

export const useUserFavorites = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.favorites.user(userId),
    queryFn: () => favoriteService.getByUser(userId),
    enabled: !!userId,
  });
};

export const useIsFavorite = (userId: number, bookId: number) => {
  return useQuery({
    queryKey: queryKeys.favorites.isFavorite(userId, bookId),
    queryFn: () => favoriteService.isFavorite(userId, bookId),
    enabled: !!userId && !!bookId,
  });
};

export const useAddFavorite = (userId: number, bookId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => favoriteService.add(userId, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.user(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.isFavorite(userId, bookId) });
    },
  });
};

export const useRemoveFavorite = (userId: number, bookId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => favoriteService.remove(userId, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.user(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.isFavorite(userId, bookId) });
    },
  });
};
