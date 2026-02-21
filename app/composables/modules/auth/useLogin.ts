import { ref } from 'vue';
import { auth_api } from '../../../api_factory/modules/auth';
import { useCustomToast } from '../../core/useCustomToast';

export const useLogin = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { showToast } = useCustomToast();

  const login = async (payload: any) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await auth_api.login(payload) as any;
      if (res.type === 'SUCCESS') {
        const token = (useCookie as any)('auth_token');
        token.value = res.data.accessToken;
        
        const userCookie = (useCookie as any)('user_data');
        userCookie.value = JSON.stringify(res.data.user);

        showToast({
          title: 'Success',
          message: 'Logged in successfully',
          toastType: 'success',
        });
        return res.data;
      } else {
        error.value = res.message;
        showToast({
          title: 'Error',
          message: res.message || 'Login failed',
          toastType: 'error',
        });
        throw new Error(res.message);
      }
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, login };
};
