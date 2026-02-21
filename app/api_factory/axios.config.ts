import axios, { type AxiosResponse } from "axios";
import { useCustomToast } from "@/composables/core/useCustomToast";

const $GATEWAY_ENDPOINT_WITHOUT_VERSION = import.meta.env.VITE_BASE_URL as string;
const $GATEWAY_ENDPOINT = import.meta.env.VITE_BASE_URL;
const $GATEWAY_ENDPOINT_V2 = import.meta.env.VITE_BASE_URL + "/v2";
const $IMAGE_UPLOAD_ENDPOINT = import.meta.env.VITE_IMAGE_UPLOAD_BASE_URL as string;

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export const GATEWAY_ENDPOINT_V2 = axios.create({
  baseURL: $GATEWAY_ENDPOINT_V2
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const GATEWAY_ENDPOINT_WITHOUT_VERSION = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});

export const GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});

export const IMAGE_UPLOAD_ENDPOINT = axios.create({
  baseURL: $IMAGE_UPLOAD_ENDPOINT,
});

export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

const instanceArray = [
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_V2,
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITHOUT_VERSION,
  GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH,
];

instanceArray.forEach((instance) => {
  instance.interceptors.request.use((config: any) => {
    // Access cookie directly to ensure it is the latest
    const token = useCookie('auth_token').value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      return response;
    },
    (err: any) => {
      const { showToast } = useCustomToast();
      const token = useCookie('auth_token');
      const user = useState('auth_user');

      const logOut = () => {
        token.value = null;
        user.value = null;
        navigateTo('/login');
      };

      if (typeof err.response === "undefined") {
        showToast({
          title: "Error",
          message: "kindly check your network connection",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      }
      if (err.response.status === 401) {
        logOut();
        showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "Session expired",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status >= 400 && err.response.status < 500) {
        if (err.response.data.message || err.response.data.error) {
          showToast({
            title: "Error",
            message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
            toastType: "error",
            duration: 3000
          });
        }
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 500) {
        showToast({
          title: "Error",
          message: "Internal server error. Please try again later.",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      }
      return Promise.reject(err);
    }
  );
});
