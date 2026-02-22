<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div v-if="show" class="bg-white w-full max-w-md border border-gray-100 shadow-2xl overflow-hidden p-10">
            <div class="mb-8 flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div class="text-center mb-10">
              <h3 class="text-lg font-black uppercase tracking-widest mb-4">{{ title || 'CONFIRM ACTION' }}</h3>
              <p class="text-gray-400 text-sm font-medium leading-relaxed uppercase tracking-widest text-[10px]">
                {{ message || 'Are you sure you want to proceed with this operation? This action cannot be revoked.' }}
              </p>
            </div>

            <div class="flex flex-col gap-3">
              <button 
                @click="$emit('confirm')" 
                :disabled="loading"
                class="w-full py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 disabled:opacity-30 transition-all shadow-xl shadow-red-600/10"
              >
                {{ loading ? 'PROCESSING...' : 'AUTHORIZE DELETE' }}
              </button>
              <button 
                @click="$emit('close')" 
                :disabled="loading"
                class="w-full py-4 bg-transparent text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-black transition-colors"
              >
                ABORT MISSION
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  message: String,
  loading: Boolean
})
defineEmits(['close', 'confirm'])
</script>
