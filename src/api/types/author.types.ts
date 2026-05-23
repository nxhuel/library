export interface AuthorRequestDTO {
  nationality?: string;
  bio?: string;
}

export interface AuthorResponseDTO {
  userId: number;
  userName: string;
  userEmail: string;
  nationality: string;
  bio: string;
  starCounts: number;
}

export interface AuthorStatsResponseDTO {
  authorId: number;
  authorName: string;
  totalBooks: number;
  totalDownloads: number;
  totalComments: number;
  totalFavorites: number;
  averageRating: number;
}
