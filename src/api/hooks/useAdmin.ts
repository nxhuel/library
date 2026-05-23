import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';
import { queryKeys } from '../constants/queryKeys';

export const useAdminMetrics = () => {
  return useQuery({
    queryKey: queryKeys.admin.metrics,
    queryFn: adminService.getMetrics,
  });
};
