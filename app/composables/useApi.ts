export const useApi = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;

  const fetchWithAuth = async (url: string, options: any = {}) => {
    const token = useCookie('auth_token').value;
    
    const headers = {
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return $fetch(`${apiBase}${url}`, {
      ...options,
      headers,
    });
  };

  return {
    fetchWithAuth,
    apiBase,
  };
};
