import { ref, onMounted } from 'vue';
import { admin_api } from '@/api_factory/modules/admin';

export const useFetchStats = () => {
  const loading = ref(false);
  const stats = ref<any>(null);
  const error = ref<string | null>(null);

  const fetchStats = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await admin_api.getStats() as any;

      if ([200, 201].includes(res?.status)) {
        stats.value = res.data?.data ?? res.data ?? null;
      }

      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch stats';
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchStats);

  return { loading, stats, error, fetchStats };
};
