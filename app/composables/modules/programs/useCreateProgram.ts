import { ref } from 'vue';
import { programs_api } from '../../../api_factory/modules/programs';
import { useCustomToast } from '../../core/useCustomToast';

export const useCreateProgram = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const createProgram = async (payload: any) => {
    loading.value = true;
    try {
      const res = await programs_api.createProgram(payload) as any;
      if (res.type === 'SUCCESS') {
        showToast({
          title: 'Success',
          message: 'Program created successfully',
          toastType: 'success',
        });
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, createProgram };
};
