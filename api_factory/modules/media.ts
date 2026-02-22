import { GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA } from '@/api_factory/axios.config';

export const media_api = {
  uploadFile: (payload: FormData) => {
    return GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA.post('/media/upload', payload);
  },
};
