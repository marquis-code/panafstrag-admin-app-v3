import { ref } from 'vue';
import { responsibilityApiFactory } from "@/api_factory/modules/responsibility";
import { useCustomToast } from '../../core/useCustomToast';

export const useDeleteResponsibility = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const deleteResponsibility = async (id: string) => {
    loading.value = true;
    try {
      const res = await responsibilityApiFactory.delete(id) as any;

      if ([200, 201].includes(res?.status)) {
        showToast({
          title: 'Success',
          message: 'Responsibility deleted successfully',
          toastType: 'success',
          duration: 3000,
        });
      }

      return res;
    } catch (err: any) {
      showToast({
        title: 'Error',
        message: err?.message || 'Failed to delete responsibility',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { deleteResponsibility, loading };
};
