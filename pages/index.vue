<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
navigateTo('/dashboard')
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="flex flex-col items-center gap-4">
      <div class="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm font-bold text-gray-500 uppercase tracking-widest">{{ t('Entering Dashboard...') }}</p>
    </div>
  </div>
</template>
