<template>
  <div class="relative group">
    <button class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
      <span class="text-xs font-bold uppercase tracking-wider text-gray-700 hidden sm:block">{{ currentLocale }}</span>
    </button>
    
    <div class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg py-1.5 shadow-lg opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
      <div class="px-3 py-2 border-b border-gray-100 bg-gray-50/50 mb-1">
        <p class="text-[9px] font-bold uppercase tracking-widest text-gray-400">Language</p>
      </div>
      <button 
        v-for="loc in locales" 
        :key="loc.code"
        @click="switchLanguage(loc.code)"
        class="w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-gray-50"
        :class="{ 'text-blue-600 bg-blue-50/50': currentLocale === loc.code, 'text-gray-600': currentLocale !== loc.code }"
      >
        {{ loc.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from '#imports';

const { locale, locales: i18nLocales, setLocale } = useI18n();

const locales = computed(() => i18nLocales.value || []);
const currentLocale = computed(() => locale.value);

const switchLanguage = async (code) => {
  if (currentLocale.value === code) return;
  await setLocale(code);
  localStorage.setItem('app-lang', code);
  window.location.reload();
};
</script>
