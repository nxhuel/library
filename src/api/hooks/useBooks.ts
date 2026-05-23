import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookService } from '../services/book.service';
import { queryKeys } from '../constants/queryKeys';
import { BookRequestDTO, BookResponseDTO } from '../types/book.types';

export const useBooks = () => {
  return useQuery({
    queryKey: queryKeys.books.all,
    queryFn: bookService.getAll,
    initialData: [] as BookResponseDTO[],
  });
};

export const useBook = (id: number) => {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => bookService.getById(id),
    enabled: !!id,
  });
};

export const useBooksByAuthor = (authorId: number) => {
  return useQuery({
    queryKey: queryKeys.books.byAuthor(authorId),
    queryFn: () => bookService.getByAuthor(authorId),
    enabled: !!authorId,
  });
};

export const useBooksByUploader = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.books.byUploader(userId),
    queryFn: () => bookService.getByUploader(userId),
    enabled: !!userId,
  });
};

export const useDeletedBooks = () => {
  return useQuery({
    queryKey: queryKeys.books.deleted,
    queryFn: bookService.getDeleted,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (book: BookRequestDTO) => bookService.create(book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, book }: { id: number; book: BookRequestDTO }) => bookService.update(id, book),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(variables.id) });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => bookService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.deleted });
    },
  });
};

export const useUploadPdf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => bookService.uploadPdf(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(variables.id) });
    },
  });
};

