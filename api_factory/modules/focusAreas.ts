import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config';

export const focusAreaApiFactory = {
  getFocusAreas() {
    return GATEWAY_ENDPOINT.get('/focus-area')
  },
  getFocusAreaById(id: string) {
    return GATEWAY_ENDPOINT.get(`/focus-area/${id}`)
  },
  createFocusArea(payload: any) {
    return GATEWAY_ENDPOINT.post('/focus-area', payload)
  },
  updateFocusArea(id: string, payload: any) {
    return GATEWAY_ENDPOINT.patch(`/focus-area/${id}`, payload)
  },
  deleteFocusArea(id: string) {
    return GATEWAY_ENDPOINT.delete(`/focus-area/${id}`)
  },
}
