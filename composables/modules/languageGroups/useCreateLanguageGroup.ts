import { ref } from 'vue'
import { languageGroupApiFactory } from '@/api_factory/modules/languageGroups'

export const useCreateLanguageGroup = () => {
  const creating = ref(false)

  const createLanguageGroup = async (payload: any) => {
    creating.value = true
    try {
      const response = await languageGroupApiFactory.createLanguageGroup(payload)
      return response
    } catch (error) {
      console.error('Error creating language group:', error)
      throw error
    } finally {
      creating.value = false
    }
  }

  return {
    creating,
    createLanguageGroup
  }
}
