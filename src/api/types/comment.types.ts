export interface CommentRequestDTO {
  content?: string;
  bookId: number;
  userId: number;
  parentId?: number;
}

export interface CommentResponseDTO {
  id: number;
  content: string;
  createdAt: string;
  deleted?: boolean;
  bookId: number;
  userId: number;
  userName: string;
  parentId?: number;
  replies?: CommentResponseDTO[];
}

export interface DeletedCommentResponseDTO {
  id: number;
  content: string;
  userName: string;
  bookTitle: string;
  createdAt: string;
}
