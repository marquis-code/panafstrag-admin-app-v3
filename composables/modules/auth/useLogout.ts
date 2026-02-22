export const useLogout = () => {
  const logout = () => {
    const token = useCookie('auth_token');
    token.value = null;
    const userCookie = useCookie('user_data');
    userCookie.value = null;
    navigateTo('/login');
  };

  return { logout };
};
