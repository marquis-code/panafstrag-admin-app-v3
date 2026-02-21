import { ref } from 'vue';
import { auth_api } from '../../../api_factory/modules/auth';
import { useCustomToast } from '../../core/useCustomToast';

export const useRegister = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { showToast } = useCustomToast();

  const registerUser = async (payload: any) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await auth_api.register(payload) as any;
      if (res.type === 'SUCCESS') {
        showToast({
          title: 'Success',
          message: 'Account created successfully',
          toastType: 'success',
        });
        return res.data;
      } else {
        error.value = res.message;
        showToast({
          title: 'Error',
          message: res.message || 'Registration failed',
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

  return { loading, error, register: registerUser };
};
