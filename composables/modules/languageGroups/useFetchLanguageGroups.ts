import { languageGroupApiFactory } from '@/api_factory/modules/languageGroups'

export const useFetchLanguageGroups = () => {
  const loading = ref(false)
  const languageGroups = ref([])

  const fetchLanguageGroups = async () => {
    loading.value = true
    try {
      const response = await languageGroupApiFactory.getLanguageGroups()
      languageGroups.value = response.data
    } catch (error) {
      console.error('Error fetching language groups:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchLanguageGroups()
  })

  return {
    loading,
    languageGroups,
    fetchLanguageGroups
  }
}
