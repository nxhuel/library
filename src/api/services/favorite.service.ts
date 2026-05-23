import apiClient from '../client/apiClient';
import { FavoriteResponseDTO } from '../types/favorite.types';

export const favoriteService = {
  getByUser: async (userId: number) => {
    const { data } = await apiClient.get<FavoriteResponseDTO[]>(`users/${userId}/favorites`);
    return data;
  },

  isFavorite: async (userId: number, bookId: number) => {
    const { data } = await apiClient.get<boolean>(`users/${userId}/favorites/${bookId}`);
    return data;
  },

  add: async (userId: number, bookId: number) => {
    const { data } = await apiClient.post<FavoriteResponseDTO>('favorites', { userId, bookId });
    return data;
  },

  remove: async (userId: number, bookId: number) => {
    await apiClient.delete(`favorites/user/${userId}/book/${bookId}`);
  },
};
