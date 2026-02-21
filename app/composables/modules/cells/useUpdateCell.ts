import { ref } from 'vue';
import { cells_api } from '../../../api_factory/modules/cells';
import { useCustomToast } from '../../core/useCustomToast';

export const useUpdateCell = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const updateCell = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const res = await cells_api.updateCell(id, payload) as any;
      if (res.type === 'SUCCESS') {
        showToast({
          title: 'Success',
          message: 'Cell updated successfully',
          toastType: 'success',
        });
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, updateCell };
};
