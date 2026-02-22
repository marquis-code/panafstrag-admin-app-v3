import { ref } from 'vue';
import { auth_api } from '@/api_factory/modules/auth';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useRegister = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { showToast } = useCustomToast();

  const registerUser = async (payload: any) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await auth_api.register(payload) as any;

      if ([200, 201].includes(res?.status)) {
        showToast({
          title: 'Success',
          message: 'Account created successfully',
          toastType: 'success',
          duration: 3000,
        });

        return res.data;
      }

      return res;
    } catch (err: any) {
      error.value = err?.message || 'Registration failed';
      showToast({
        title: 'Error',
        message: err?.message || 'Registration failed',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, register: registerUser };
};
