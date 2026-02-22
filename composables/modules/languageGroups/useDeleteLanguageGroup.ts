import { ref } from 'vue'
import { languageGroupApiFactory } from '@/api_factory/modules/languageGroups'

export const useDeleteLanguageGroup = () => {
  const deleting = ref(false)

  const deleteLanguageGroup = async (id: string) => {
    deleting.value = true
    try {
      const response = await languageGroupApiFactory.deleteLanguageGroup(id)
      return response
    } catch (error) {
      console.error('Error deleting language group:', error)
      throw error
    } finally {
      deleting.value = false
    }
  }

  return {
    deleting,
    deleteLanguageGroup
  }
}
