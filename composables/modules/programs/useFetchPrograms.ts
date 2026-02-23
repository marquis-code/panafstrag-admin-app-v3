import { ref, onMounted } from 'vue';
import { programs_api } from '@/api_factory/modules/programs';

export const useFetchPrograms = () => {
  const loading = ref(false);
  const programs = ref<any[]>([]);
  const error = ref<string | null>(null);

  const fetchPrograms = async (query?: any) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await programs_api.getPrograms(query) as any;

      if ([200, 201].includes(res?.status)) {
        programs.value = res.data?.data ?? res.data ?? [];
      }

      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch programs';
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchPrograms);

  return { loading, programs, error, fetchPrograms };
};
