<script setup>
defineProps({
  show: Boolean,
  title: String,
  size: {
    type: String,
    default: '4xl'
  }
})
defineEmits(['close'])

const modalClasses = {
  'sm': 'max-w-sm',
  'md': 'max-w-md',
  'lg': 'max-w-lg',
  'xl': 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  'fullscreen': 'max-w-none h-screen rounded-none'
}
</script>

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
      <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50" :class="size === 'fullscreen' ? 'p-0' : 'p-4'">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div v-if="show" class="bg-white w-full border border-gray-200 shadow-xl overflow-hidden flex flex-col" :class="[modalClasses[size] || 'max-w-4xl', size === 'fullscreen' ? 'h-screen' : 'max-h-[90vh] rounded-xl']">
            <div class="px-8 py-5 flex items-center justify-between border-b border-gray-100 shrink-0">
              <h3 class="text-base font-bold text-gray-900">{{ title }}</h3>
              <button @click="$emit('close')" class="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="px-8 py-8 overflow-y-auto custom-scrollbar flex-1">
              <slot />
            </div>
            <div v-if="$slots.actions" class="px-8 py-6 bg-gray-50 flex justify-end gap-3 border-t border-gray-100 shrink-0">
              <slot name="actions" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
