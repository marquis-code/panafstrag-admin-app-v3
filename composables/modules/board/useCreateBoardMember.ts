import { ref } from 'vue';
import { board_api } from '@/api_factory/modules/board';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useCreateBoardMember = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const createMember = async (payload: any) => {
    loading.value = true;
    try {
      const res = await board_api.createMember(payload) as any;

      if ([200, 201].includes(res?.status)) {
        showToast({
          title: 'Success',
          message: 'Board member created successfully',
          toastType: 'success',
          duration: 3000,
        });
      }

      return res;
    } catch (err: any) {
      showToast({
        title: 'Error',
        message: err?.message || 'Failed to create board member',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { loading, createMember };
};
