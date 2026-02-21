import { ref } from 'vue';
import { cells_api } from '../../../api_factory/modules/cells';
import { useCustomToast } from '../../core/useCustomToast';

export const useDeleteCell = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const deleteCell = async (id: string) => {
    loading.value = true;
    try {
      const res = await cells_api.deleteCell(id) as any;
      if (res.type === 'SUCCESS') {
        showToast({
          title: 'Success',
          message: 'Cell deleted successfully',
          toastType: 'success',
        });
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, deleteCell };
};
