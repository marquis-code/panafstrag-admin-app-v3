import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export const board_api = {
  getMembers: () => {
    return GATEWAY_ENDPOINT.get('/board');
  },
  getMember: (id: string) => {
    return GATEWAY_ENDPOINT.get(`/board/${id}`);
  },
  createMember: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/board', payload);
  },
  updateMember: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT.patch(`/board/${id}`, payload);
  },
  deleteMember: (id: string) => {
    return GATEWAY_ENDPOINT.delete(`/board/${id}`);
  },
};
