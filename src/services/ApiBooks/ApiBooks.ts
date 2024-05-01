export interface Book {
  id: number;
  image_url: string;
  authors: string;
  title: string;
}

export const API_URL = "https://example-data.draftbit.com/books?_limit=50";
