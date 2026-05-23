import apiClient from '../client/apiClient';
import { 
  UserRequestDTO, 
  UserResponseDTO, 
  UserStatusRequestDTO, 
  UserRoleRequestDTO, 
  UserRole 
} from '../types/user.types';

export const userService = {
  getAll: async () => {
    const { data } = await apiClient.get<UserResponseDTO[]>('users');
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<UserResponseDTO>(`users/${id}`);
    return data;
  },

  getByRole: async (role: UserRole) => {
    const { data } = await apiClient.get<UserResponseDTO[]>(`users/role/${role}`);
    return data;
  },

  create: async (user: UserRequestDTO) => {
    const { data } = await apiClient.post<UserResponseDTO>('users', user);
    return data;
  },

  update: async (id: number, user: UserRequestDTO) => {
    const { data } = await apiClient.put<UserResponseDTO>(`users/${id}`, user);
    return data;
  },

  updateStatus: async (id: number, status: UserStatusRequestDTO) => {
    const { data } = await apiClient.patch<UserResponseDTO>(`users/${id}/status`, status);
    return data;
  },

  updateRole: async (id: number, role: UserRoleRequestDTO) => {
    const { data } = await apiClient.patch<UserResponseDTO>(`users/${id}/role`, role);
    return data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`users/${id}`);
  },
};
