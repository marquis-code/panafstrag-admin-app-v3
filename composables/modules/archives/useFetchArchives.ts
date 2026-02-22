import { ref, onMounted } from 'vue';
import { archives_api } from '@/api_factory/modules/archives';

export const useFetchArchives = () => {
  const loading = ref(false);
  const archives = ref<any[]>([]);
  const error = ref<string | null>(null);

  const fetchArchives = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await archives_api.getArchives() as any;

      if ([200, 201].includes(res?.status)) {
        archives.value = res.data?.data ?? res.data ?? [];
      }

      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch archives';
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchArchives);

  return { loading, archives, error, fetchArchives };
};
