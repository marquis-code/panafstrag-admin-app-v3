import { ref } from 'vue';
import { archives_api } from '../../../api_factory/modules/archives';
import { useCustomToast } from '../../core/useCustomToast';

export const useUpdateArchive = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const updateArchive = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const res = await archives_api.updateArchive(id, payload) as any;
      if (res.type === 'SUCCESS') {
        showToast({
          title: 'Success',
          message: 'Archive updated successfully',
          toastType: 'success',
        });
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, updateArchive };
};
