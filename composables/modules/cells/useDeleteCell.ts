import { ref } from 'vue';
import { cells_api } from '@/api_factory/modules/cells';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useDeleteCell = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const deleteCell = async (id: string) => {
    loading.value = true;
    try {
      const res = await cells_api.deleteCell(id) as any;

      if ([200, 201].includes(res?.status)) {
        showToast({
          title: 'Success',
          message: 'Cell deleted successfully',
          toastType: 'success',
          duration: 3000,
        });
      }

      return res;
    } catch (err: any) {
      showToast({
        title: 'Error',
        message: err?.message || 'Failed to delete cell',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { loading, deleteCell };
};
