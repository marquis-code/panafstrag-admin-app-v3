import { ref } from 'vue';
import { objectiveApiFactory } from "@/api_factory/modules/objective";
import { useCustomToast } from '../../core/useCustomToast';

export const useDeleteObjective = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const deleteObjective = async (id: string) => {
    loading.value = true;
    try {
      const res = await objectiveApiFactory.delete(id) as any;

      if ([200, 201].includes(res?.status)) {
        showToast({
          title: 'Success',
          message: 'Objective deleted successfully',
          toastType: 'success',
          duration: 3000,
        });
      }

      return res;
    } catch (err: any) {
      showToast({
        title: 'Error',
        message: err?.message || 'Failed to delete objective',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { deleteObjective, loading };
};
