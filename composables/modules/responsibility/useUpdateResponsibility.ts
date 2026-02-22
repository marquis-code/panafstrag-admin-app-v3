import { ref } from 'vue';
import { responsibilityApiFactory } from "@/api_factory/modules/responsibility";
import { useCustomToast } from '../../core/useCustomToast';

export const useUpdateResponsibility = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const updateResponsibility = async (id: string, data: any) => {
    loading.value = true;
    try {
      const res = await responsibilityApiFactory.update(id, data) as any;

      if ([200, 201].includes(res?.status)) {
        showToast({
          title: 'Success',
          message: 'Responsibility updated successfully',
          toastType: 'success',
          duration: 3000,
        });
      }

      return res;
    } catch (err: any) {
      showToast({
        title: 'Error',
        message: err?.message || 'Failed to update responsibility',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { updateResponsibility, loading };
};
