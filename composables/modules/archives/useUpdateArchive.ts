import { ref } from 'vue';
import { archives_api } from '@/api_factory/modules/archives';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useUpdateArchive = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const updateArchive = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const res = await archives_api.updateArchive(id, payload) as any;

      if ([200, 201].includes(res?.status)) {
        showToast({
          title: 'Success',
          message: 'Archive updated successfully',
          toastType: 'success',
          duration: 3000,
        });
      }

      return res;
    } catch (err: any) {
      showToast({
        title: 'Error',
        message: err?.message || 'Failed to update archive',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { loading, updateArchive };
};
