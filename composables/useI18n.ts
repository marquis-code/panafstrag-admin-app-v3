import { ref } from 'vue';

export const useI18n = () => {
  const defaultLocale = 'en';
  
  const locale = ref(
    (typeof window !== 'undefined' ? localStorage.getItem('app-lang') : defaultLocale) || defaultLocale
  );

  const locales = ref([
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' }
  ]);

  const setLocale = async (code: string) => {
    locale.value = code;
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-lang', code);
    }
  };

  return { locale, locales, setLocale };
};
