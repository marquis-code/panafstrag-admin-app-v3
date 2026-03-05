<template>
  <div class="space-y-4">
    <div 
      class="relative w-full border border-gray-100 flex flex-col items-center justify-center gap-4 bg-gray-50/50 hover:bg-gray-50 transition-all group overflow-hidden py-10 rounded-xl"
      :class="{ 'bg-gray-100 border-black': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div v-if="modelValue" class="relative z-10 flex flex-col items-center p-4 w-full">
        <div class="w-16 h-16 bg-white shadow-xl shadow-black/5 flex items-center justify-center rounded-xl mb-4">
          <component :is="getFileIcon(modelValue)" class="h-8 w-8 text-black" />
        </div>
        <p class="text-[10px] font-black text-black uppercase tracking-widest text-center truncate max-w-xs px-4">
          {{ getFileName(modelValue) }}
        </p>
        <button @click="removeFile" class="mt-4 text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline">
          Remove Document
        </button>
      </div>
      
      <div v-else-if="!loading" class="relative z-10 flex flex-col items-center p-8">
        <div class="w-14 h-14 bg-white shadow-xl shadow-black/5 flex items-center justify-center rounded-xl mb-6 transform group-hover:-translate-y-1 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Drop PDF, Excel, Word or PPT</p>
        <input type="file" @change="handleFileSelect" class="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" />
      </div>

      <div v-if="loading" class="relative z-10 flex flex-col items-center">
        <div class="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        <p class="text-[9px] font-black text-black mt-6 uppercase tracking-[0.4em]">Optimizing & Uploading</p>
      </div>
    </div>
    <div v-if="uploadError" class="text-[9px] font-black text-red-600 uppercase tracking-widest">{{ uploadError }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUploadFile } from '@/composables/media/useUploadFile'

const props = defineProps<{
  modelValue?: string,
  folder?: string
}>()
const emit = defineEmits(['update:modelValue'])

const { uploadFile, loading, error: uploadError } = useUploadFile()
const isDragging = ref(false)

const getFileName = (url: string) => {
  if (!url) return ''
  const parts = url.split('/')
  const name = parts[parts.length - 1]
  // Extract real name if it's a cloudinary URL with random prefix
  return name.includes('_') ? name.split('_').slice(1).join('_') : name
}

const getFileIcon = (url: string) => {
  const ext = url.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf': return PdfIcon
    case 'doc':
    case 'docx': return WordIcon
    case 'xls':
    case 'xlsx': return ExcelIcon
    case 'ppt':
    case 'pptx': return PptIcon
    default: return GenericDocIcon
  }
}

const handleUpload = async (file: File) => {
  const url = await uploadFile(file, props.folder)
  if (url) {
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

const removeFile = (e: Event) => {
  e.stopPropagation()
  emit('update:modelValue', '')
}

// Simple Inline SVG Components for the Icons
const PdfIcon = {
  render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'h-8 w-8' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' }),
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 11h6m-6 4h6' })
  ])
}

const WordIcon = {
  render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'h-8 w-8' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6h16M4 12h16M4 18h16' })
  ])
}

const ExcelIcon = {
  render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'h-8 w-8' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 10h18M3 14h18M3 18h18M3 6h18' })
  ])
}

const PptIcon = {
  render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'h-8 w-8' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 3v18M17 3v18M3 12h18' })
  ])
}

const GenericDocIcon = {
  render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'h-8 w-8' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
  ])
}
</script>
