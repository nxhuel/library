export interface BookRequestDTO {
  title?: string;
  description?: string;
  gender?: string;
  numPages?: number;
  coverImage?: string;
  authorId: number;
  uploadedById: number;
}

export interface BookResponseDTO {
  id: number;
  title: string;
  description: string;
  gender: string;
  numPages: number;
  coverImage: string;
  pdfPath?: string;
  downloadsCount: number;
  rating: number;
  authorId: number;
  authorName: string;
  uploadedById: number;
  uploadedByName: string;
}

export interface DeletedBookResponseDTO {
  id: number;
  title: string;
  description: string;
  gender: string;
  authorName: string;
  uploadedByName: string;
}
