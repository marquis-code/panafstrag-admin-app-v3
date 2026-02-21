import { ref } from 'vue';
import { board_api } from '../../../api_factory/modules/board';
import { useCustomToast } from '../../core/useCustomToast';

export const useDeleteBoardMember = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const deleteMember = async (id: string) => {
    loading.value = true;
    try {
      const res = await board_api.deleteMember(id) as any;
      if (res.type === 'SUCCESS') {
        showToast({
          title: 'Success',
          message: 'Board member deleted successfully',
          toastType: 'success',
        });
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, deleteMember };
};
