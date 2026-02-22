import { ref } from 'vue'
import { focusAreaApiFactory } from '@/api_factory/modules/focusAreas'

export const useCreateFocusArea = () => {
  const creating = ref(false)

  const createFocusArea = async (payload: any) => {
    creating.value = true
    try {
      const response = await focusAreaApiFactory.createFocusArea(payload)
      return response
    } catch (error) {
      console.error('Error creating focus area:', error)
      throw error
    } finally {
      creating.value = false
    }
  }

  return {
    creating,
    createFocusArea
  }
}
