import { ref } from 'vue';
import { programs_api } from '../../../api_factory/modules/programs';

export const useFetchPrograms = () => {
  const loading = ref(false);
  const programs = ref([]);

  const fetchPrograms = async () => {
    loading.value = true;
    try {
      const res = await programs_api.getPrograms() as any;
      if (res.type === 'SUCCESS') {
        programs.value = res.data;
      }
      return res;
    } finally {
      loading.value = false;
    }
  };

  return { loading, programs, fetchPrograms };
};
