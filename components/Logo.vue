<template>
  <div class="flex items-center gap-1.5">
    <div class="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
      <span class="text-white font-black text-sm tracking-tighter">{{ t('P') }}</span>
    </div>
    <span class="font-black text-lg tracking-tighter text-gray-900 uppercase">
      {{ t('PANA') }}<span class="text-blue-600">{{ t('FSTRAG') }}</span>
    </span>
  </div>
</template>

<script setup>
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
</script>
