import { GATEWAY_ENDPOINT } from '../axios.config';

export const programs_api = {
  getPrograms: (params?: any) => {
    return GATEWAY_ENDPOINT.get('/program', { params });
  },
  getProgram: (id: string) => {
    return GATEWAY_ENDPOINT.get(`/program/${id}`);
  },
  createProgram: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/program', payload);
  },
  updateProgram: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT.patch(`/program/${id}`, payload);
  },
  deleteProgram: (id: string) => {
    return GATEWAY_ENDPOINT.delete(`/program/${id}`);
  },
};
