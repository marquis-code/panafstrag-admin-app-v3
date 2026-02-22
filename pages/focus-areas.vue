<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useFetchFocusAreas } from '@/composables/modules/focusAreas/useFetchFocusAreas'
import { useCreateFocusArea } from '@/composables/modules/focusAreas/useCreateFocusArea'
import { useUpdateFocusArea } from '@/composables/modules/focusAreas/useUpdateFocusArea'
import { useDeleteFocusArea } from '@/composables/modules/focusAreas/useDeleteFocusArea'

const { fetchFocusAreas, focusAreas, loading: fetchLoading } = useFetchFocusAreas()
const { createFocusArea } = useCreateFocusArea()
const { updateFocusArea } = useUpdateFocusArea()
const { deleteFocusArea } = useDeleteFocusArea()

const showModal = ref(false)
const showConfirmModal = ref(false)
const deleteId = ref<string | null>(null)
const deleteLoading = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  name: '',
  description: ''
})
const loading = ref(false)

const openCreate = () => {
  editingId.value = null
  Object.assign(form, { name: '', description: '' })
  showModal.value = true
}

const openEdit = (area: any) => {
  editingId.value = area._id
  Object.assign(form, { ...area })
  showModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (editingId.value) {
      await updateFocusArea(editingId.value, form)
    } else {
      await createFocusArea(form)
    }
    await fetchFocusAreas()
    showModal.value = false
  } finally {
    loading.value = false
  }
}

const handleDelete = (id: string) => {
  deleteId.value = id
  showConfirmModal.value = true
}

const confirmDelete = async () => {
  if (!deleteId.value) return
  deleteLoading.value = true
  try {
    await deleteFocusArea(deleteId.value)
    await fetchFocusAreas()
    showConfirmModal.value = false
  } finally {
    deleteLoading.value = false
    deleteId.value = null
  }
}

useHead({
  title: 'Focus Areas Management | PANAFSTRAG',
})

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="space-y-12">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Research Priorities</p>
        <h1 class="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-black">
          Focus <span class="not-italic text-gray-400 leading-none">Areas.</span>
        </h1>
      </div>
      <button @click="openCreate" class="px-10 py-5 bg-black text-white font-black text-[10px] tracking-[0.3em] uppercase hover:bg-gray-800 active:scale-95 transition-all shadow-xl shadow-black/10">
        NEW FOCUS AREA
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-24 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(focusAreas as any[])?.length">
      <EmptyState title="NO DATA" message="No focus areas have been defined yet." />
    </div>

    <!-- Content List -->
    <div v-else class="grid gap-6">
      <div v-for="area in (focusAreas as any[])" :key="area._id" class="p-8 bg-white border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-black transition-all group">
         <div class="space-y-4 max-w-4xl">
           <h3 class="text-2xl font-black uppercase tracking-tighter italic">{{ area.name }}</h3>
           <p class="text-[10px] font-medium text-gray-500 line-clamp-2 uppercase tracking-tight italic">{{ area.description || 'Mission parameters pending definition...' }}</p>
         </div>
         <div class="flex items-center gap-3">
            <button @click="openEdit(area)" class="px-6 py-4 border border-transparent hover:border-black transition-all text-[10px] font-black uppercase tracking-widest bg-gray-50 hover:bg-black hover:text-white">
              EDIT
            </button>
            <button @click="handleDelete(area._id)" class="p-4 text-gray-300 hover:text-red-600 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
         </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal :show="showModal" :title="editingId ? 'EDIT FOCUS AREA' : 'NEW FOCUS AREA INITIALIZATION'" @close="showModal = false">
      <div class="space-y-12 py-4">
        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Area Identity</h3>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Area Designation</label>
            <input v-model="form.name" type="text" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm uppercase tracking-widest" />
          </div>
        </section>

        <section class="space-y-6 pb-8">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Mission Parameters</h3>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Scope & Description</label>
            <textarea v-model="form.description" rows="4" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
          </div>
        </section>
      </div>

      <template #actions>
        <button @click="showModal = false" class="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">ABORT</button>
        <button @click="handleSubmit" :disabled="loading" class="px-12 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-30 transition-all">
          {{ loading ? 'SAVING...' : 'AUTHORIZE AREA' }}
        </button>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="DELETE FOCUS AREA" 
      message="Are you sure you want to remove this focus area from research priorities? This operation is permanent."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
