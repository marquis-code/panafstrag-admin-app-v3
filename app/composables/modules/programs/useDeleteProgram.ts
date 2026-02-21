import { ref } from 'vue';
import { programs_api } from '../../../api_factory/modules/programs';
import { useCustomToast } from '../../core/useCustomToast';

export const useDeleteProgram = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const deleteProgram = async (id: string) => {
    loading.value = true;
    try {
      const res = await programs_api.deleteProgram(id) as any;
      if (res.type === 'SUCCESS') {
        showToast({
          title: 'Success',
          message: 'Program deleted successfully',
          toastType: 'success',
        });
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, deleteProgram };
};
