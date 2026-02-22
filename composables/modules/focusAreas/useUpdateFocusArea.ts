import { ref } from 'vue'
import { focusAreaApiFactory } from '@/api_factory/modules/focusAreas'

export const useUpdateFocusArea = () => {
  const updating = ref(false)

  const updateFocusArea = async (id: string, payload: any) => {
    updating.value = true
    try {
      const response = await focusAreaApiFactory.updateFocusArea(id, payload)
      return response
    } catch (error) {
      console.error('Error updating focus area:', error)
      throw error
    } finally {
      updating.value = false
    }
  }

  return {
    updating,
    updateFocusArea
  }
}
