import { ref, onMounted } from 'vue';
import { homeContentApiFactory } from "@/api_factory/modules/home-content";

export const useHomeContent = () => {
  const loading = ref(false);
  const homeContent = ref<any>(null);
  const error = ref<string | null>(null);

  const fetchHomeContent = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await homeContentApiFactory.getHomeContent() as any;
      if ([200, 201].includes(res?.status)) {
        homeContent.value = res.data;
      }
      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch home content';
    } finally {
      loading.value = false;
    }
  };

  const updateHomeContent = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await homeContentApiFactory.updateHomeContent(data) as any;
      if ([200, 201].includes(res?.status)) {
        homeContent.value = res.data;
      }
      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to update home content';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchHomeContent);

  return { fetchHomeContent, updateHomeContent, homeContent, loading, error };
};
