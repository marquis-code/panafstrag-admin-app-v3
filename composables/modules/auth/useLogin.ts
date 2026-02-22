import { ref } from 'vue';
import { auth_api } from '@/api_factory/modules/auth';
import { useCustomToast } from '@/composables/core/useCustomToast';

export const useLogin = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { showToast } = useCustomToast();

  const login = async (payload: any) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await auth_api.login(payload) as any;

      if ([200, 201].includes(res?.status)) {
        const token = useCookie('auth_token');
        token.value = res.data?.accessToken;

        const userCookie = useCookie('user_data');
        userCookie.value = JSON.stringify(res.data?.user);

        showToast({
          title: 'Success',
          message: 'Logged in successfully',
          toastType: 'success',
          duration: 3000,
        });

        return res.data;
      }

      return res;
    } catch (err: any) {
      error.value = err?.message || 'Login failed';
      showToast({
        title: 'Error',
        message: err?.message || 'Login failed',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, login };
};
