import { GATEWAY_ENDPOINT } from '../axios.config';

export const auth_api = {
  register: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/auth/register', payload);
  },
  login: (payload: any) => {
    return GATEWAY_ENDPOINT.post('/auth/login', payload);
  },
  getProfile: () => {
    return GATEWAY_ENDPOINT.get('/auth/profile');
  },
};
