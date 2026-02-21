import { ref } from 'vue';

export interface ToastOptions {
  title: string;
  message: string;
  toastType: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const useCustomToast = () => {
  const showToast = (options: ToastOptions) => {
    // In a real app, this would trigger a UI component.
    // For now, we'll use console and browser alerts as a placeholder
    // or you could use a library like vue-toastification.
    console.log(`[${options.toastType.toUpperCase()}] ${options.title}: ${options.message}`);
    
    // Minimal implementation: if you have a toast component, you'd trigger it here.
    // For this boilerplate, let's assume useNuxtApp().$toast if configured.
    // But to keep it simple and follow the user's pattern:
  };

  return { showToast };
};
