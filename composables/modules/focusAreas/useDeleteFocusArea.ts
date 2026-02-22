import { ref } from 'vue'
import { focusAreaApiFactory } from '@/api_factory/modules/focusAreas'

export const useDeleteFocusArea = () => {
  const deleting = ref(false)

  const deleteFocusArea = async (id: string) => {
    deleting.value = true
    try {
      const response = await focusAreaApiFactory.deleteFocusArea(id)
      return response
    } catch (error) {
      console.error('Error deleting focus area:', error)
      throw error
    } finally {
      deleting.value = false
    }
  }

  return {
    deleting,
    deleteFocusArea
  }
}
