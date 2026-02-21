import { ref } from 'vue';
import { archives_api } from '../../../api_factory/modules/archives';
import { useCustomToast } from '../../core/useCustomToast';

export const useCreateArchive = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const createArchive = async (payload: any) => {
    loading.value = true;
    try {
      const res = await archives_api.createArchive(payload) as any;
      if (res.type === 'SUCCESS') {
        showToast({
          title: 'Success',
          message: 'Archive created successfully',
          toastType: 'success',
        });
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, createArchive };
};
