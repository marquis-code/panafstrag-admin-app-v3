import { GATEWAY_ENDPOINT } from '../axios.config';

export const admin_api = {
  getStats: () => {
    return GATEWAY_ENDPOINT.get('/admin/stats');
  },
};
