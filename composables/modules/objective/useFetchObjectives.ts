import { ref, onMounted } from 'vue';
import { objectiveApiFactory } from "@/api_factory/modules/objective";

export const useFetchObjectives = () => {
  const loading = ref(false);
  const objectives = ref<any[]>([]);
  const error = ref<string | null>(null);

  const fetchObjectives = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await objectiveApiFactory.getAll() as any;

      if ([200, 201].includes(res?.status)) {
        objectives.value = res.data?.data ?? res.data ?? [];
      }

      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch objectives';
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchObjectives);

  return { fetchObjectives, objectives, loading, error };
};
