import { ref, onMounted } from 'vue';
import { board_api } from '@/api_factory/modules/board';

export const useFetchBoard = () => {
  const loading = ref(false);
  const boardMembers = ref<any[]>([]);
  const error = ref<string | null>(null);

  const fetchBoard = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await board_api.getMembers() as any;

      if ([200, 201].includes(res?.status)) {
        boardMembers.value = res.data?.data ?? res.data ?? [];
      }

      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch board members';
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchBoard);

  return { loading, boardMembers, error, fetchBoard };
};
