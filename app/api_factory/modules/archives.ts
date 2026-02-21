import { GATEWAY_ENDPOINT } from '../axios.config';

export const archives_api = {
  getArchives: () => {
    return GATEWAY_ENDPOINT.get('/archive');
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
