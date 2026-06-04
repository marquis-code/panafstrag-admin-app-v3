export const useApiCache = () => {
  const getCacheKey = (baseKey: string) => {
    if (typeof window === 'undefined') return `${baseKey}_en`;
    const lang = localStorage.getItem('app-lang') || 'en';
    return `${baseKey}_${lang}`;
  };

  const readCache = (baseKey: string): any | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(getCacheKey(baseKey));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const writeCache = (baseKey: string, data: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(getCacheKey(baseKey), JSON.stringify(data));
    } catch {}
  };

  return { readCache, writeCache, getCacheKey };
};
