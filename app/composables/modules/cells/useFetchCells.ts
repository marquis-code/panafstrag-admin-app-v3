import { ref } from 'vue';
import { cells_api } from '../../../api_factory/modules/cells';

export const useFetchCells = () => {
  const loading = ref(false);
  const cells = ref([]);

  const fetchCells = async () => {
    loading.value = true;
    try {
      const res = await cells_api.getCells() as any;
      if (res.type === 'SUCCESS') {
        cells.value = res.data;
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, cells, fetchCells };
};
