import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export const admin_api = {
  getStats: () => {
    return GATEWAY_ENDPOINT.get('/admin/stats');
  },
};
