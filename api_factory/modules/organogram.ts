import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export const organogramApiFactory = {
  getOrganogramNodes() {
    return GATEWAY_ENDPOINT.get('/organogram')
  },
  getOrganogramNodeById(id: string) {
    return GATEWAY_ENDPOINT.get(`/organogram/${id}`)
  },
  createOrganogramNode(payload: any) {
    return GATEWAY_ENDPOINT.post('/organogram', payload)
  },
  updateOrganogramNode(id: string, payload: any) {
    return GATEWAY_ENDPOINT.patch(`/organogram/${id}`, payload)
  },
  deleteOrganogramNode(id: string) {
    return GATEWAY_ENDPOINT.delete(`/organogram/${id}`)
  },
}
