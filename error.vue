<script setup lang="ts">
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen bg-black text-white flex items-center justify-center px-6 overflow-hidden relative">
    <!-- Abstract Background Elements -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-pulse"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full animate-pulse delay-700"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/20 rounded-full animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-xl w-full text-center relative z-10">
      <div class="mb-12 inline-block">
        <div class="relative">
          <span class="text-[12rem] font-black leading-none tracking-tighter opacity-10 italic">404</span>
          <div class="absolute inset-0 flex items-center justify-center">
            <h1 class="text-4xl font-black uppercase tracking-[0.5em] italic">LOST IN <span class="text-gray-400">RESEARCH.</span></h1>
          </div>
        </div>
      </div>
      
      <p class="text-gray-400 text-lg mb-16 font-medium leading-relaxed">
        The intelligence you are looking for has been moved, archived, or never existed in this sector of the database.
      </p>

      <button 
        @click="handleError" 
        class="group relative inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-black text-[10px] tracking-[0.4em] uppercase rounded-xl overflow-hidden transition-all hover:scale-105"
      >
        <span class="relative z-10">BACK TO HEADQUARTERS</span>
        <div class="absolute inset-0 bg-gray-200 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
      </button>
    </div>

    <!-- Navigation Background Pattern -->
    <div class="absolute bottom-12 left-12 opacity-20">
      <div class="flex gap-2">
        <div v-for="i in 5" :key="i" class="w-1 h-8 bg-white/20 rounded-full animate-bounce" :style="{ animationDelay: `${i * 0.1}s` }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.1; }
  50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.3; }
  100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.1; }
}
.animate-pulse {
  animation: pulse 8s infinite ease-in-out;
}
</style>
