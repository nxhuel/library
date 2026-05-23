import apiClient from '../client/apiClient';
import { AdminMetricsResponseDTO } from '../types/admin.types';

export const adminService = {
  getMetrics: async () => {
    const { data } = await apiClient.get<AdminMetricsResponseDTO>('admin/metrics');
    return data;
  },
};
