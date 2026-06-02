<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
import { ref, reactive } from 'vue'
import { useFetchCells } from '@/composables/modules/cells/useFetchCells'
import { useCreateCell } from '@/composables/modules/cells/useCreateCell'
import { useUpdateCell } from '@/composables/modules/cells/useUpdateCell'
import { useDeleteCell } from '@/composables/modules/cells/useDeleteCell'

const { fetchCells, cells, loading: fetchLoading } = useFetchCells()
const { createCell } = useCreateCell()
const { updateCell } = useUpdateCell()
const { deleteCell } = useDeleteCell()

const showModal = ref(false)
const showConfirmModal = ref(false)
const deleteId = ref<string | null>(null)
const deleteLoading = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  name: '',
  location: '',
  description: '',
  leadName: '',
  imageUrl: ''
})
const loading = ref(false)

const openCreate = () => {
  editingId.value = null
  Object.assign(form, { name: '', location: '', description: '', leadName: '', imageUrl: '' })
  showModal.value = true
}

const openEdit = (cell: any) => {
  editingId.value = cell._id
  Object.assign(form, { ...cell })
  showModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (editingId.value) {
      await updateCell(editingId.value, form)
    } else {
      await createCell(form)
    }
    await fetchCells()
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
    await deleteCell(deleteId.value)
    await fetchCells()
    showConfirmModal.value = false
  } finally {
    deleteLoading.value = false
    deleteId.value = null
  }
}

useHead({
  title: 'Research Network | Admin',
})

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ t('Research Cells & Hubs') }}</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">
          {{ t('Manage research hubs, their locations, and lead investigators.') }}
        </p>
      </div>
      <button 
        @click="openCreate" 
        class="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all  flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('Add New Hub') }}
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-32 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(cells as any[])?.length">
      <EmptyState 
        title="No Research Hubs Found" 
        message="Get started by adding your first research hub." 
        @action="openCreate"
      />
    </div>

    <!-- Table Container -->
    <div v-else class="bg-white border border-gray-200 rounded-lg  overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{{ t('Hub Name') }}</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{{ t('Location') }}</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{{ t('Lead Person') }}</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">{{ t('Actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="cell in (cells as any[])" :key="cell._id" class="hover:bg-gray-50 transition-colors group">
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                    <img v-if="cell.imageUrl" :src="cell.imageUrl" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">{{ t('HUB') }}</div>
                  </div>
                  <p class="text-sm font-bold text-gray-900">{{ cell.name }}</p>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-sm font-medium">{{ cell.location }}</span>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {{ cell.leadName?.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-900">{{ cell.leadName }}</p>
                    <p class="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{{ t('Lead Investigator') }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEdit(cell)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit Hub">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(cell._id)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Hub">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit/Create Modal -->
    <Modal :show="showModal" :title="editingId ? 'Edit Research Hub' : 'Add Research Hub'" @close="showModal = false" size="lg">
      <div class="space-y-10 py-8 px-6">
        <!-- Hub Basic Info -->
        <section class="space-y-6">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Hub Details') }}</h3>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8 items-start">
            <div class="space-y-6">
              <AnimatedInput 
                v-model="form.name" 
                label="Hub Name" 
                
              />
              <AnimatedInput 
                v-model="form.location" 
                label="Location" 
                
              />
              <AnimatedInput 
                v-model="form.leadName" 
                label="Lead Person Name" 
                
              />
            </div>
            <div class="space-y-2 text-center">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">{{ t('Hub Image') }}</label>
              <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <MediaUpload v-model="form.imageUrl" folder="cells" />
              </div>
            </div>
          </div>
        </section>

        <!-- Mandate / Description -->
        <section class="space-y-6 pb-4">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Description') }}</h3>
          </div>
          <div class="bg-white rounded-lg p-1 border border-gray-200 ">
             <RichTextEditor v-model="form.description" />
          </div>
        </section>
      </div>

      <template #actions>
        <div class="flex items-center justify-end gap-4 w-full px-8 pb-8">
          <button @click="showModal = false" class="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900">{{ t('Cancel') }}</button>
          <button 
            @click="handleSubmit" 
            :disabled="loading" 
            class="px-8 py-3 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg  hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <div v-if="loading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>{{ editingId ? 'Save Changes' : 'Add Hub' }}</span>
          </button>
        </div>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="Delete Research Hub" 
      message="Are you sure you want to delete this research hub? This action cannot be undone."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
