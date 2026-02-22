import { GATEWAY_ENDPOINT_WITH_AUTH } from "../axios.config";

export const objectiveApiFactory = {
  create(data: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.post("/objective", data);
  },
  getAll() {
    return GATEWAY_ENDPOINT_WITH_AUTH.get("/objective");
  },
  getById(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/objective/${id}`);
  },
  update(id: string, data: any) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/objective/${id}`, data);
  },
  delete(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/objective/${id}`);
  },
};
