import { GATEWAY_ENDPOINT } from '../axios.config';

export const cells_api = {
  getCells: () => {
    return GATEWAY_ENDPOINT.get('/cell');
  },
  getCell: (id: string) => {
    return GATEWAY_ENDPOINT.get(`/cell/${id}`);
  },
  createCell: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/cell', payload);
  },
  updateCell: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT.patch(`/cell/${id}`, payload);
  },
  deleteCell: (id: string) => {
    return GATEWAY_ENDPOINT.delete(`/cell/${id}`);
  },
};
