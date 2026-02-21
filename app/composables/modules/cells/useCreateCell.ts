import { ref } from 'vue';
import { cells_api } from '../../../api_factory/modules/cells';
import { useCustomToast } from '../../core/useCustomToast';

export const useCreateCell = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const createCell = async (payload: any) => {
    loading.value = true;
    try {
      const res = await cells_api.createCell(payload) as any;
      if (res.type === 'SUCCESS') {
        showToast({
          title: 'Success',
          message: 'Cell created successfully',
          toastType: 'success',
        });
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, createCell };
};
