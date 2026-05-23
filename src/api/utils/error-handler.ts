import { AxiosError } from 'axios';

export interface APIErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export class APIError extends Error {
  public status: number;
  public code?: string;
  public errors?: Record<string, string[]>;

  constructor(message: string, status: number, code?: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

export const parseAPIError = (error: unknown): APIError => {
  if (error instanceof APIError) return error;

  if (error instanceof AxiosError) {
    const data = error.response?.data as APIErrorResponse;
    const status = error.response?.status || 500;
    const message = data?.message || error.message || 'An unexpected error occurred';
    
    return new APIError(
      message,
      status,
      data?.code,
      data?.errors
    );
  }

  return new APIError(
    error instanceof Error ? error.message : 'An unknown error occurred',
    500
  );
};
