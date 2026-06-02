<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
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

useHead({ title: 'Focus Areas | Admin' })
definePageMeta({
  layout: 'dashboard', middleware: 'auth' })
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ t('Focus Areas') }}</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">
          {{ t('Manage the main research topics and focus areas.') }}
        </p>
      </div>
      <button 
        @click="openCreate" 
        class="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all  flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('Add Area') }}
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-32 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(focusAreas as any[])?.length">
      <EmptyState 
        title="No Areas Found" 
        message="Get started by adding your first focus area." 
        @action="openCreate"
      />
    </div>

    <!-- Grid Layout -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="area in (focusAreas as any[])" 
        :key="area._id" 
        class="bg-white border border-gray-200 rounded-lg p-6  hover:border-blue-200 transition-all flex flex-col group"
      >
        <div class="flex items-start justify-between mb-6">
          <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.674a1 1 0 00.707-.293l6.347-6.347a1 1 0 000-1.414l-3.96-3.96a1 1 0 00-1.414 0l-6.347 6.347a1 1 0 00-.293.707v4.674a1 1 0 001 1z" />
            </svg>
          </div>
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <button 
              @click="openEdit(area)" 
              class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Edit Area"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button 
              @click="handleDelete(area._id)" 
              class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Delete Area"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{{ area.name }}</h3>
          <p class="text-xs text-gray-500 line-clamp-3 mt-3 leading-relaxed">
            {{ area.description || 'No description provided.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Edit/Create Modal -->
    <Modal :show="showModal" :title="editingId ? 'Edit Area' : 'Add Area'" @close="showModal = false" size="lg">
      <div class="space-y-8 py-8 px-6">
        <section class="space-y-6">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Details') }}</h3>
          </div>
          <div class="space-y-6">
            <div class="bg-white rounded-lg p-1 border border-gray-200 ">
              <AnimatedInput 
                v-model="form.name" 
                label="Area Name" 
                
              />
            </div>
            <div class="bg-white rounded-lg p-1 border border-gray-200 ">
              <AnimatedInput 
                v-model="form.description" 
                label="Description" 
                type="textarea" 
                :rows="5" 
                
              />
            </div>
          </div>
        </section>
      </div>

      <template #actions>
        <div class="flex items-center justify-end gap-4 w-full px-8 pb-8">
          <button 
            @click="showModal = false" 
            class="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900"
          >
            {{ t('Cancel') }}
          </button>
          <button 
            @click="handleSubmit" 
            :disabled="loading" 
            class="px-8 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg  hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <div v-if="loading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>{{ loading ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Focus Area') }}</span>
          </button>
        </div>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="Delete Focus Area" 
      message="Are you sure you want to delete this focus area? This action will impact associated records and cannot be undone."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
