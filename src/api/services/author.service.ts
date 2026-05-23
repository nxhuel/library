import apiClient from '../client/apiClient';
import { 
  AuthorRequestDTO, 
  AuthorResponseDTO, 
  AuthorStatsResponseDTO 
} from '../types/author.types';

export const authorService = {
  getAll: async () => {
    const { data } = await apiClient.get<AuthorResponseDTO[]>('authors');
    return data;
  },

  getById: async (userId: number) => {
    const { data } = await apiClient.get<AuthorResponseDTO>(`authors/${userId}`);
    return data;
  },

  create: async (userId: number, author: AuthorRequestDTO) => {
    const { data } = await apiClient.post<AuthorResponseDTO>(`authors/user/${userId}`, author);
    return data;
  },

  update: async (userId: number, author: AuthorRequestDTO) => {
    const { data } = await apiClient.put<AuthorResponseDTO>(`authors/${userId}`, author);
    return data;
  },

  delete: async (userId: number) => {
    await apiClient.delete(`authors/${userId}`);
  },

  getStats: async (authorId: number) => {
    const { data } = await apiClient.get<AuthorStatsResponseDTO>(`authors/${authorId}/stats`);
    return data;
  },
};
