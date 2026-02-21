export const useAuth = () => {
  const { fetchWithAuth } = useApi();
  const user = useState('auth_user', () => null);
  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  const isLoggedIn = computed(() => !!token.value);

  const register = async (data: any) => {
    try {
      const response = await fetchWithAuth('/auth/register', {
        method: 'POST',
        body: data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (data: any) => {
    try {
      const response: any = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: data,
      });
      token.value = response.accessToken;
      user.value = response.user;
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    navigateTo('/login');
  };

  return {
    user,
    token,
    isLoggedIn,
    register,
    login,
    logout,
  };
};
