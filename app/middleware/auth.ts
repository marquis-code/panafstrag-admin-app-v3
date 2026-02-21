export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn.value && !['/login', '/register'].includes(to.path)) {
    return navigateTo('/login');
  }
});
