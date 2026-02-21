import { ref } from 'vue';
import { archives_api } from '../../../api_factory/modules/archives';
import { useCustomToast } from '../../core/useCustomToast';

export const useDeleteArchive = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const deleteArchive = async (id: string) => {
    loading.value = true;
    try {
      const res = await archives_api.deleteArchive(id) as any;
      if (res.type === 'SUCCESS') {
        showToast({
          title: 'Success',
          message: 'Archive deleted successfully',
          toastType: 'success',
        });
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, deleteArchive };
};
