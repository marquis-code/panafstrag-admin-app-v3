<template>
  <div class="flex flex-col items-center justify-center py-24 animate-fade-in">
    <div class="relative w-16 h-16 mb-8">
      <div class="absolute inset-0 border-2 border-gray-100 rounded-full"></div>
      <div class="absolute inset-0 border-2 border-t-black rounded-full animate-spin"></div>
    </div>
    <div class="flex flex-col items-center gap-2">
      <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Synchronizing</h3>
      <div class="flex gap-1">
        <div v-for="i in 3" :key="i" class="w-1 h-1 bg-black rounded-full animate-bounce" :style="{ animationDelay: `${i * 0.2}s` }"></div>
      </div>
    </div>
  </div>
</template>
