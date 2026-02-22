import { ref, onMounted } from 'vue';
import { cells_api } from '@/api_factory/modules/cells';

export const useFetchCells = () => {
  const loading = ref(false);
  const cells = ref<any[]>([]);
  const error = ref<string | null>(null);

  const fetchCells = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await cells_api.getCells() as any;

      if ([200, 201].includes(res?.status)) {
        cells.value = res.data?.data ?? res.data ?? [];
      }

      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch cells';
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchCells);

  return { loading, cells, error, fetchCells };
};
