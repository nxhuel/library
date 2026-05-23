import apiClient from '../client/apiClient';
import { AuthResponseDTO } from '../types/auth.types';
import { UserRole } from '../types/user.types';

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post<AuthResponseDTO>('auth/login', { email, password });
    return data;
  },

  register: async (name: string, email: string, password: string, role: UserRole) => {
    const { data } = await apiClient.post<AuthResponseDTO>('auth/register', { name, email, password, role });
    return data;
  }
};
