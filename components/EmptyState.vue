<script setup lang="ts">
defineProps<{
  title?: string
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
    <div class="mb-10 opacity-20 group relative">
      <div class="absolute inset-0 bg-black/10 rounded-full blur-2xl group-hover:bg-black/20 transition-all"></div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    </div>
    
    <h3 class="text-2xl font-black uppercase tracking-tighter italic mb-4">
      {{ title || 'NO RECORDS' }} <span class="not-italic text-gray-400">FOUND.</span>
    </h3>
    <p class="text-gray-400 max-w-xs mx-auto text-sm font-medium leading-relaxed uppercase tracking-widest text-[10px]">
      {{ message || 'The requested data sector is currently empty or has been restricted.' }}
    </p>

    <div class="mt-12 flex gap-4">
      <div class="w-12 h-[1px] bg-gray-200"></div>
      <div class="w-4 h-[1px] bg-gray-200"></div>
      <div class="w-12 h-[1px] bg-gray-200"></div>
    </div>
  </div>
</template>
