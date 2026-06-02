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
      <div v-if="show" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/50">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div v-if="show" class="bg-white w-full max-w-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden p-8">
            <div class="mb-6 flex items-center justify-center w-14 h-14 bg-red-50 rounded-full mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div class="text-center mb-8">
              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title || 'Confirm Action' }}</h3>
              <p class="text-gray-500 text-sm font-medium leading-relaxed">
                {{ message || 'Are you sure you want to proceed? This action cannot be undone.' }}
              </p>
            </div>

            <div class="flex flex-col gap-3">
              <button 
                @click="$emit('confirm')" 
                :disabled="loading"
                class="w-full py-3 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all shadow-sm"
              >
                {{ loading ? 'Processing...' : (confirmText || 'Confirm') }}
              </button>
              <button 
                @click="$emit('close')" 
                :disabled="loading"
                class="w-full py-3 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                {{ t('Cancel') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
defineProps({
  show: Boolean,
  title: String,
  message: String,
  loading: Boolean
})
defineEmits(['close', 'confirm'])
</script>
