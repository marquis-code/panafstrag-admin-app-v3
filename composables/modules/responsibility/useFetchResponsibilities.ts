import { ref, onMounted } from 'vue';
import { responsibilityApiFactory } from "@/api_factory/modules/responsibility";

export const useFetchResponsibilities = () => {
  const loading = ref(false);
  const responsibilities = ref<any[]>([]);
  const error = ref<string | null>(null);

  const fetchResponsibilities = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await responsibilityApiFactory.getAll() as any;

      if ([200, 201].includes(res?.status)) {
        responsibilities.value = res.data?.data ?? res.data ?? [];
      }

      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch responsibilities';
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchResponsibilities);

  return { fetchResponsibilities, responsibilities, loading, error };
};
