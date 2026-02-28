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
      <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div v-if="show" class="bg-white w-full max-w-4xl border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div class="px-6 sm:px-10 py-6 sm:py-8 flex items-center justify-between border-b border-gray-50 shrink-0">
              <h3 class="text-[14px] font-black uppercase tracking-[0.3em] leading-none">{{ title }}</h3>
              <button @click="$emit('close')" class="p-2 hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="px-6 sm:px-10 py-6 sm:py-10 overflow-y-auto custom-scrollbar flex-1">
              <slot />
            </div>
            <div v-if="$slots.actions" class="px-6 sm:px-10 py-6 sm:py-8 bg-gray-50/50 flex justify-end gap-6 border-t border-gray-50 shrink-0">
              <slot name="actions" />
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
  title: String
})
defineEmits(['close'])
</script>
