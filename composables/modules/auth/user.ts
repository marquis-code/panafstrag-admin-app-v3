export const useUser = () => {
  const user = useState('auth_user', () => null);
  const token = useCookie('auth_token');
  
  const logOut = () => {
    token.value = null;
    user.value = null;
    navigateTo('/login');
  };

  return {
    user,
    token,
    logOut
  };
};
