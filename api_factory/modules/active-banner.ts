import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export const activeBannerApi = {
  getCurrent() {
    return GATEWAY_ENDPOINT.get('/active-banner/current');
  },
  getAll() {
    return GATEWAY_ENDPOINT.get('/active-banner');
  },
  getOne(id: string) {
    return GATEWAY_ENDPOINT.get(`/active-banner/${id}`);
  },
  create(data: any) {
    return GATEWAY_ENDPOINT.post('/active-banner', data);
  },
  update(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/active-banner/${id}`, data);
  },
  remove(id: string) {
    return GATEWAY_ENDPOINT.delete(`/active-banner/${id}`);
  },
};
