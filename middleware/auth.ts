import { useUser } from '@/composables/modules/auth/user';
export default defineNuxtRouteMiddleware((to, from) => {
const { token } = useUser();

  if (!token.value && !['/login', '/register'].includes(to.path)) {
    return navigateTo('/login');
  }
});
