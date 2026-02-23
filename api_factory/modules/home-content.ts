import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export const homeContentApiFactory = {
  getHomeContent() {
    return GATEWAY_ENDPOINT.get("/home-content");
  },
  updateHomeContent(data: any) {
    return GATEWAY_ENDPOINT.post("/home-content", data);
  }
};
