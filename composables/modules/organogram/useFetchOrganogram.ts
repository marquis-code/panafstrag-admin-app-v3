import { organogramApiFactory } from '@/api_factory/modules/organogram'

export const useFetchOrganogram = () => {
  const loading = ref(false)
  const organogramNodes = ref([])

  const fetchOrganogram = async () => {
    loading.value = true
    try {
      const response = await organogramApiFactory.getOrganogramNodes()
      organogramNodes.value = response.data
    } catch (error) {
      console.error('Error fetching organogram nodes:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchOrganogram()
  })

  return {
    loading,
    organogramNodes,
    fetchOrganogram
  }
}
