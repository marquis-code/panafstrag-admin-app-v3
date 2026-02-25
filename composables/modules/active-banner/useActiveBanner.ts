import { ref, onMounted } from 'vue';
import { activeBannerApi } from '@/api_factory/modules/active-banner';

export const useActiveBanner = () => {
  const loading = ref(false);
  const banners = ref<any[]>([]);
  const activeBanner = ref<any>(null);
  const error = ref<string | null>(null);

  const fetchAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await activeBannerApi.getAll() as any;
      if ([200, 201].includes(res?.status)) {
        banners.value = res.data?.data ?? res.data ?? [];
      }
      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch banners';
    } finally {
      loading.value = false;
    }
  };

  const fetchCurrent = async () => {
    try {
      const res = await activeBannerApi.getCurrent() as any;
      if ([200, 201].includes(res?.status)) {
        activeBanner.value = res.data;
      }
      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch active banner';
    }
  };

  const createBanner = async (data: any) => {
    loading.value = true;
    try {
      const res = await activeBannerApi.create(data) as any;
      if ([200, 201].includes(res?.status)) {
        await fetchAll();
      }
      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to create banner';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateBanner = async (id: string, data: any) => {
    loading.value = true;
    try {
      const res = await activeBannerApi.update(id, data) as any;
      if ([200, 201].includes(res?.status)) {
        await fetchAll();
      }
      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to update banner';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteBanner = async (id: string) => {
    loading.value = true;
    try {
      const res = await activeBannerApi.remove(id) as any;
      if ([200, 201].includes(res?.status)) {
        await fetchAll();
      }
      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to delete banner';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchAll);

  return { loading, banners, activeBanner, error, fetchAll, fetchCurrent, createBanner, updateBanner, deleteBanner };
};
