import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../services/comment.service';
import { queryKeys } from '../constants/queryKeys';
import { CommentRequestDTO } from '../types/comment.types';

export const useCommentsByBook = (bookId: number) => {
  return useQuery({
    queryKey: queryKeys.comments.byBook(bookId),
    queryFn: () => commentService.getByBook(bookId),
    enabled: !!bookId,
  });
};

export const useDeletedComments = () => {
  return useQuery({
    queryKey: queryKeys.comments.deleted,
    queryFn: commentService.getDeleted,
  });
};

export const useCreateComment = (bookId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment: CommentRequestDTO) => commentService.create(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.byBook(bookId) });
    },
  });
};

export const useReplyComment = (bookId: number, parentId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment: CommentRequestDTO) => commentService.reply(parentId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.byBook(bookId) });
    },
  });
};

export const useDeleteComment = (bookId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => commentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.byBook(bookId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.deleted });
    },
  });
};
