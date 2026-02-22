import { ref } from 'vue';
import { board_api } from '@/api_factory/modules/board';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useUpdateBoardMember = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const updateMember = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const res = await board_api.updateMember(id, payload) as any;

      if ([200, 201].includes(res?.status)) {
        showToast({
          title: 'Success',
          message: 'Board member updated successfully',
          toastType: 'success',
          duration: 3000,
        });
      }

      return res;
    } catch (err: any) {
      showToast({
        title: 'Error',
        message: err?.message || 'Failed to update board member',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { loading, updateMember };
};
