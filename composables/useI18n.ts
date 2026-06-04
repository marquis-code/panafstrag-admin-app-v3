import { ref } from 'vue';
import { refreshNuxtData } from '#imports';

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
      await refreshNuxtData();
    }
  };

  const initLocale = async () => {
    if (typeof window === 'undefined') return;
    
    // Only detect if there's no explicitly saved preference
    if (localStorage.getItem('app-lang')) {
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout
      const response = await fetch('https://get.geojs.io/v1/ip/country.json', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) return;
      
      const data = await response.json();
      const countryCode = data.country;

      const frenchCountries = ['FR', 'CA', 'BE', 'CH', 'LU', 'MC', 'CI', 'SN', 'ML', 'NE', 'BF', 'TG', 'BJ', 'CG', 'CD', 'GA', 'CM', 'MG', 'HT', 'DZ', 'MA', 'TN'];
      const spanishCountries = ['ES', 'MX', 'CO', 'AR', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'GQ', 'PR'];
      const portugueseCountries = ['PT', 'BR', 'MZ', 'AO', 'GW', 'TL', 'CV', 'ST', 'GQ', 'MO'];
      
      let detectedLang = defaultLocale;
      if (frenchCountries.includes(countryCode)) {
        detectedLang = 'fr';
      } else if (spanishCountries.includes(countryCode)) {
        detectedLang = 'es';
      } else if (portugueseCountries.includes(countryCode)) {
        detectedLang = 'pt';
      }

      await setLocale(detectedLang);
    } catch (error) {
      console.warn('Geolocation language detection failed:', error);
    }
  };

  return { locale, locales, setLocale, initLocale };
};
