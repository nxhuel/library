import apiClient from '../client/apiClient';
import { 
  CommentRequestDTO, 
  CommentResponseDTO, 
  DeletedCommentResponseDTO 
} from '../types/comment.types';

export const commentService = {
  getById: async (id: number) => {
    const { data } = await apiClient.get<CommentResponseDTO>(`comments/${id}`);
    return data;
  },

  getByBook: async (bookId: number) => {
    const { data } = await apiClient.get<CommentResponseDTO[]>(`books/${bookId}/comments`);
    return data;
  },

  getDeleted: async () => {
    try {
      const { data } = await apiClient.get<DeletedCommentResponseDTO[]>('comments/deleted');
      return data;
    } catch (e) {
      console.warn("Deleted comments endpoint not available or returned 405");
      return [];
    }
  },

  create: async (comment: CommentRequestDTO) => {
    const { bookId, ...body } = comment;
    const { data } = await apiClient.post<CommentResponseDTO>(`books/${bookId}/comments`, body);
    return data;
  },

  reply: async (parentId: number, comment: CommentRequestDTO) => {
    const { data } = await apiClient.post<CommentResponseDTO>(`comments/${parentId}/reply`, comment);
    return data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`comments/${id}`);
  },
};
