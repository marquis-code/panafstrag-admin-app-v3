import { ref } from 'vue';
import { responsibilityApiFactory } from "@/api_factory/modules/responsibility";
import { useCustomToast } from '../../core/useCustomToast';

export const useCreateResponsibility = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const createResponsibility = async (data: any) => {
    loading.value = true;
    try {
      const res = await responsibilityApiFactory.create(data) as any;

      if ([200, 201].includes(res?.status)) {
        showToast({
          title: 'Success',
          message: 'Responsibility created successfully',
          toastType: 'success',
          duration: 3000,
        });
      }

      return res;
    } catch (err: any) {
      showToast({
        title: 'Error',
        message: err?.message || 'Failed to create responsibility',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { createResponsibility, loading };
};
