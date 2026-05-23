import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authorService } from '../services/author.service';
import { queryKeys } from '../constants/queryKeys';
import { AuthorRequestDTO } from '../types/author.types';

export const useAuthors = () => {
  return useQuery({
    queryKey: queryKeys.authors.all,
    queryFn: authorService.getAll,
  });
};

export const useAuthor = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.authors.detail(userId),
    queryFn: () => authorService.getById(userId),
    enabled: !!userId,
  });
};

export const useAuthorStats = (authorId: number) => {
  return useQuery({
    queryKey: queryKeys.authors.stats(authorId),
    queryFn: () => authorService.getStats(authorId),
    enabled: !!authorId,
  });
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, author }: { userId: number; author: AuthorRequestDTO }) => authorService.create(userId, author),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authors.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.userId) });
    },
  });
};

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, author }: { userId: number; author: AuthorRequestDTO }) => authorService.update(userId, author),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authors.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.authors.detail(variables.userId) });
    },
  });
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => authorService.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authors.all });
    },
  });
};

