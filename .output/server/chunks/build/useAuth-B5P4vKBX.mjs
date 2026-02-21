import { u as useApi, a as useCookie } from './useApi-WHzNNEGF.mjs';
import { computed, toRef, isRef } from 'vue';
import { u as useNuxtApp, n as navigateTo } from './server.mjs';

const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useAuth = () => {
  const { fetchWithAuth } = useApi();
  const user = useState("auth_user", () => null);
  const token = useCookie("auth_token", {
    maxAge: 60 * 60 * 24,
    // 1 day
    path: "/"
  });
  const isLoggedIn = computed(() => !!token.value);
  const register = async (data) => {
    try {
      const response = await fetchWithAuth("/auth/register", {
        method: "POST",
        body: data
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
  const login = async (data) => {
    try {
      const response = await fetchWithAuth("/auth/login", {
        method: "POST",
        body: data
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
    navigateTo("/login");
  };
  return {
    user,
    token,
    isLoggedIn,
    register,
    login,
    logout
  };
};

export { useAuth as u };
//# sourceMappingURL=useAuth-B5P4vKBX.mjs.map
