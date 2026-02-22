import { ref } from 'vue';
import { programs_api } from '@/api_factory/modules/programs';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useCreateProgram = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const createProgram = async (payload: any) => {
    loading.value = true;
    try {
      const res = await programs_api.createProgram(payload) as any;

      if ([200, 201].includes(res?.status)) {
        showToast({
          title: 'Success',
          message: 'Program created successfully',
          toastType: 'success',
          duration: 3000,
        });
      }

      return res;
    } catch (err: any) {
      showToast({
        title: 'Error',
        message: err?.message || 'Failed to create program',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { loading, createProgram };
};
