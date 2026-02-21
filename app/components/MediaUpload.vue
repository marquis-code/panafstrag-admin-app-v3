<template>
  <div class="space-y-4">
    <div 
      class="relative aspect-video w-full rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900/50 hover:border-indigo-600 transition-all group overflow-hidden"
      :class="{ 'border-indigo-600 bg-indigo-50/10': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <img v-if="previewUrl" :src="previewUrl" class="absolute inset-0 w-full h-full object-cover" />
      
      <div v-if="!loading" class="relative z-10 flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-7-3l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="text-xs font-black text-slate-400 mt-2 uppercase tracking-widest">Click or drag to upload</p>
        <input type="file" @change="handleFileSelect" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
      </div>

      <div v-if="loading" class="relative z-10 flex flex-col items-center">
        <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs font-black text-indigo-600 mt-4 uppercase tracking-widest">Uploading...</p>
      </div>
    </div>
    <div v-if="error" class="text-xs font-bold text-red-500">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string,
  folder?: string
}>()
const emit = defineEmits(['update:modelValue'])

const { fetchWithAuth } = useApi()
const loading = ref(false)
const error = ref('')
const isDragging = ref(false)
const previewUrl = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  previewUrl.value = val
})

const uploadFile = async (file: File) => {
  loading.value = true
  error.value = ''
  
  const formData = new FormData()
  formData.append('file', file)
  if (props.folder) formData.append('folder', props.folder)

  try {
    const res: any = await fetchWithAuth('/media/upload', {
      method: 'POST',
      body: formData
    })
    previewUrl.value = res.secure_url
    emit('update:modelValue', res.secure_url)
  } catch (err: any) {
    error.value = 'Upload failed. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleFileSelect = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) uploadFile(file)
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) uploadFile(file)
}
</script>
