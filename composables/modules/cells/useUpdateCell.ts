import { ref } from 'vue';
import { cells_api } from '@/api_factory/modules/cells';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useUpdateCell = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const updateCell = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const res = await cells_api.updateCell(id, payload) as any;

      if ([200, 201].includes(res?.status)) {
        showToast({
          title: 'Success',
          message: 'Cell updated successfully',
          toastType: 'success',
          duration: 3000,
        });
      }

      return res;
    } catch (err: any) {
      showToast({
        title: 'Error',
        message: err?.message || 'Failed to update cell',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { loading, updateCell };
};
