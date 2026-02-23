import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export const archives_api = {
  getArchives: (params?: any) => {
    return GATEWAY_ENDPOINT.get('/archive', { params });
  },
  getArchive: (id: string) => {
    return GATEWAY_ENDPOINT.get(`/archive/${id}`);
  },
  createArchive: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/archive', payload);
  },
  updateArchive: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT.patch(`/archive/${id}`, payload);
  },
  deleteArchive: (id: string) => {
    return GATEWAY_ENDPOINT.delete(`/archive/${id}`);
  },
};
