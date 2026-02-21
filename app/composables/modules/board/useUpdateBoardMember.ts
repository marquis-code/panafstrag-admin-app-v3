import { ref } from 'vue';
import { board_api } from '../../../api_factory/modules/board';
import { useCustomToast } from '../../core/useCustomToast';

export const useUpdateBoardMember = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const updateMember = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const res = await board_api.updateMember(id, payload) as any;
      if (res.type === 'SUCCESS') {
        showToast({
          title: 'Success',
          message: 'Board member updated successfully',
          toastType: 'success',
        });
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, updateMember };
};
