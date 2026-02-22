import { ref } from 'vue'
import { organogramApiFactory } from '@/api_factory/modules/organogram'

export const useDeleteOrganogramNode = () => {
  const deleting = ref(false)

  const deleteOrganogramNode = async (id: string) => {
    deleting.value = true
    try {
      const response = await organogramApiFactory.deleteOrganogramNode(id)
      return response
    } catch (error) {
      console.error('Error deleting organogram node:', error)
      throw error
    } finally {
      deleting.value = false
    }
  }

  return {
    deleting,
    deleteOrganogramNode
  }
}
