<template>
  <div class="space-y-4">
    <div 
      class="relative aspect-video w-full border border-gray-100 flex flex-col items-center justify-center gap-4 bg-gray-50/50 hover:bg-gray-50 transition-all group overflow-hidden"
      :class="{ 'bg-gray-100': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <img v-if="previewUrl" :src="previewUrl" class="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
      
      <div v-if="!loading" class="relative z-10 flex flex-col items-center p-8">
        <div class="w-12 h-12 bg-white shadow-xl shadow-black/5 flex items-center justify-center rounded-sm mb-4 transform group-hover:-translate-y-1 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-7-3l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Drop Media or Click</p>
        <input type="file" @change="handleFileSelect" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
      </div>

      <div v-if="loading" class="relative z-10 flex flex-col items-center">
        <div class="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <p class="text-[8px] font-black text-black mt-4 uppercase tracking-[0.4em]">Uploading</p>
      </div>
    </div>
    <div v-if="uploadError" class="text-[9px] font-black text-black uppercase tracking-widest">{{ uploadError }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUploadFile } from '@/composables/media/useUploadFile'

const props = defineProps<{
  modelValue?: string,
  folder?: string
}>()
const emit = defineEmits(['update:modelValue'])

const { uploadFile, loading, error: uploadError } = useUploadFile()
const isDragging = ref(false)
const previewUrl = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  previewUrl.value = val
})

const handleUpload = async (file: File) => {
  const url = await uploadFile(file, props.folder)
  if (url) {
    previewUrl.value = url
    emit('update:modelValue', url)
  }
}

const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleUpload(file)
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) handleUpload(file)
}
</script>
