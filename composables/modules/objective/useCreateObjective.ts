import { ref } from 'vue';
import { objectiveApiFactory } from "@/api_factory/modules/objective";
import { useCustomToast } from '../../core/useCustomToast';

export const useCreateObjective = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const createObjective = async (data: any) => {
    loading.value = true;
    try {
      const res = await objectiveApiFactory.create(data) as any;

      if ([200, 201].includes(res?.status)) {
        showToast({
          title: 'Success',
          message: 'Objective created successfully',
          toastType: 'success',
          duration: 3000,
        });
      }

      return res;
    } catch (err: any) {
      showToast({
        title: 'Error',
        message: err?.message || 'Failed to create objective',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { createObjective, loading };
};
