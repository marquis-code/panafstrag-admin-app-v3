import { focusAreaApiFactory } from '@/api_factory/modules/focusAreas'

export const useFetchFocusAreas = () => {
  const loading = ref(false)
  const focusAreas = ref([])

  const fetchFocusAreas = async () => {
    loading.value = true
    try {
      const response = await focusAreaApiFactory.getFocusAreas()
      focusAreas.value = response.data
    } catch (error) {
      console.error('Error fetching focus areas:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchFocusAreas()
  })

  return {
    loading,
    focusAreas,
    fetchFocusAreas
  }
}
