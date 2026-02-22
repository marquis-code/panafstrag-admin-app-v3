import { ref } from 'vue'
import { languageGroupApiFactory } from '@/api_factory/modules/languageGroups'

export const useUpdateLanguageGroup = () => {
  const updating = ref(false)

  const updateLanguageGroup = async (id: string, payload: any) => {
    updating.value = true
    try {
      const response = await languageGroupApiFactory.updateLanguageGroup(id, payload)
      return response
    } catch (error) {
      console.error('Error updating language group:', error)
      throw error
    } finally {
      updating.value = false
    }
  }

  return {
    updating,
    updateLanguageGroup
  }
}
