import { GATEWAY_ENDPOINT } from '../axios.config'

export const languageGroupApiFactory = {
  getLanguageGroups() {
    return GATEWAY_ENDPOINT.get('/language-group')
  },
  getLanguageGroupById(id: string) {
    return GATEWAY_ENDPOINT.get(`/language-group/${id}`)
  },
  createLanguageGroup(payload: any) {
    return GATEWAY_ENDPOINT.post('/language-group', payload)
  },
  updateLanguageGroup(id: string, payload: any) {
    return GATEWAY_ENDPOINT.patch(`/language-group/${id}`, payload)
  },
  deleteLanguageGroup(id: string) {
    return GATEWAY_ENDPOINT.delete(`/language-group/${id}`)
  },
}
