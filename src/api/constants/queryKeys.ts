export const queryKeys = {
  users: {
    all: ['users'] as const,
    detail: (id: number | string) => ['users', id] as const,
    byRole: (role: string) => ['users', 'role', role] as const,
  },
  books: {
    all: ['books'] as const,
    detail: (id: number | string) => ['books', id] as const,
    byAuthor: (authorId: number | string) => ['books', 'author', authorId] as const,
    byUploader: (userId: number | string) => ['books', 'uploader', userId] as const,
    deleted: ['books', 'deleted'] as const,
  },
  authors: {
    all: ['authors'] as const,
    detail: (userId: number | string) => ['authors', userId] as const,
    stats: (authorId: number | string) => ['authors', authorId, 'stats'] as const,
  },
  comments: {
    byBook: (bookId: number | string) => ['comments', 'book', bookId] as const,
    deleted: ['comments', 'deleted'] as const,
  },
  notifications: {
    all: (userId: number | string) => ['notifications', 'user', userId] as const,
    unread: (userId: number | string) => ['notifications', 'user', userId, 'unread'] as const,
    unreadCount: (userId: number | string) => ['notifications', 'user', userId, 'unread-count'] as const,
  },
  favorites: {
    user: (userId: number | string) => ['favorites', 'user', userId] as const,
    isFavorite: (userId: number | string, bookId: number | string) => ['favorites', 'user', userId, 'book', bookId] as const,
  },
  admin: {
    metrics: ['admin', 'metrics'] as const,
  },
};
