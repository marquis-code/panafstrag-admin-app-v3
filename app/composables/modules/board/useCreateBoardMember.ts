import { ref } from 'vue';
import { board_api } from '../../../api_factory/modules/board';
import { useCustomToast } from '../../core/useCustomToast';

export const useCreateBoardMember = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const createMember = async (payload: any) => {
    loading.value = true;
    try {
      const res = await board_api.createMember(payload) as any;
      if (res.type === 'SUCCESS') {
        showToast({
          title: 'Success',
          message: 'Board member created successfully',
          toastType: 'success',
        });
      } else {
        showToast({
          title: 'Error',
          message: res.message || 'Failed to create member',
          toastType: 'error',
        });
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, createMember };
};
