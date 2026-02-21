import { ref } from 'vue';
import { admin_api } from '../../../api_factory/modules/admin';

export const useFetchStats = () => {
  const loading = ref(false);
  const stats = ref(null);

  const fetchStats = async () => {
    loading.value = true;
    try {
      const res = await admin_api.getStats() as any;
      if (res.type === 'SUCCESS') {
        stats.value = res.data;
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, stats, fetchStats };
};
