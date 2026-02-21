import { ref } from 'vue';
import { board_api } from '../../../api_factory/modules/board';

export const useFetchBoard = () => {
  const loading = ref(false);
  const boardMembers = ref([]);

  const fetchBoard = async () => {
    loading.value = true;
    try {
      const res = await board_api.getMembers() as any;
      if (res.type === 'SUCCESS') {
        boardMembers.value = res.data;
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, boardMembers, fetchBoard };
};
