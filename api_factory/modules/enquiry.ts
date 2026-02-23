import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export const enquiryApiFactory = {
  getAll() {
    return GATEWAY_ENDPOINT.get('/enquiries');
  },
  updateStatus(id: string, data: { status: string }) {
    return GATEWAY_ENDPOINT.patch(`/enquiries/${id}/status`, data);
  },
  delete(id: string) {
    return GATEWAY_ENDPOINT.delete(`/enquiries/${id}`);
  }
};
