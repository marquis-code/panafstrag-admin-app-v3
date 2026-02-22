import { ref } from 'vue'
import { organogramApiFactory } from '@/api_factory/modules/organogram'

export const useUpdateOrganogramNode = () => {
  const updating = ref(false)

  const updateOrganogramNode = async (id: string, payload: any) => {
    updating.value = true
    try {
      const response = await organogramApiFactory.updateOrganogramNode(id, payload)
      return response
    } catch (error) {
      console.error('Error updating organogram node:', error)
      throw error
    } finally {
      updating.value = false
    }
  }

  return {
    updating,
    updateOrganogramNode
  }
}
