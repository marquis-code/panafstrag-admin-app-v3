import { ref } from 'vue'
import { organogramApiFactory } from '@/api_factory/modules/organogram'

export const useCreateOrganogramNode = () => {
  const creating = ref(false)

  const createOrganogramNode = async (payload: any) => {
    creating.value = true
    try {
      const response = await organogramApiFactory.createOrganogramNode(payload)
      return response
    } catch (error) {
      console.error('Error creating organogram node:', error)
      throw error
    } finally {
      creating.value = false
    }
  }

  return {
    creating,
    createOrganogramNode
  }
}
