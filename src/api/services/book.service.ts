import apiClient from '../client/apiClient';
import { 
  BookRequestDTO, 
  BookResponseDTO, 
  DeletedBookResponseDTO 
} from '../types/book.types';

export const bookService = {
  getAll: async () => {
    const { data } = await apiClient.get<BookResponseDTO[]>('books');
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<BookResponseDTO>(`books/${id}`);
    return data;
  },

  getByAuthor: async (authorId: number) => {
    const { data } = await apiClient.get<BookResponseDTO[]>(`books/author/${authorId}`);
    return data;
  },

  getByUploader: async (userId: number) => {
    const { data } = await apiClient.get<BookResponseDTO[]>(`books/uploader/${userId}`);
    return data;
  },

  getDeleted: async () => {
    const { data } = await apiClient.get<DeletedBookResponseDTO[]>('books/deleted');
    return data;
  },

  create: async (book: BookRequestDTO) => {
    const { data } = await apiClient.post<BookResponseDTO>('books', book);
    return data;
  },

  update: async (id: number, book: BookRequestDTO) => {
    const { data } = await apiClient.put<BookResponseDTO>(`books/${id}`, book);
    return data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`books/${id}`);
  },

  uploadPdf: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post<BookResponseDTO>(`books/${id}/pdf`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  downloadPdf: async (id: number) => {
    const { data } = await apiClient.get(`books/${id}/pdf`, {
      responseType: 'blob',
    });
    return data;
  },
};
