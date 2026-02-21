import { ref } from 'vue';
import { programs_api } from '../../../api_factory/modules/programs';
import { useCustomToast } from '../../core/useCustomToast';

export const useUpdateProgram = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const updateProgram = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const res = await programs_api.updateProgram(id, payload) as any;
      if (res.type === 'SUCCESS') {
        showToast({
          title: 'Success',
          message: 'Program updated successfully',
          toastType: 'success',
        });
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, updateProgram };
};
