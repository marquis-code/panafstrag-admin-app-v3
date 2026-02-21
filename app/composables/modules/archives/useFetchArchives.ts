import { ref } from 'vue';
import { archives_api } from '../../../api_factory/modules/archives';

export const useFetchArchives = () => {
  const loading = ref(false);
  const archives = ref([]);

  const fetchArchives = async () => {
    loading.value = true;
    try {
      const res = await archives_api.getArchives() as any;
      if (res.type === 'SUCCESS') {
        archives.value = res.data;
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, archives, fetchArchives };
};
