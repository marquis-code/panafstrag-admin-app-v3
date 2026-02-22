import { GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const responsibilityApiFactory = {
  create(data: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.post("/responsibility", data);
  },
  getAll() {
    return GATEWAY_ENDPOINT_WITH_AUTH.get("/responsibility");
  },
  getById(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/responsibility/${id}`);
  },
  update(id: string, data: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/responsibility/${id}`, data);
  },
  delete(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/responsibility/${id}`);
  },
};
