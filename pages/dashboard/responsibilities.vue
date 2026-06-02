<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
import { ref, reactive } from 'vue'
import { useFetchResponsibilities } from '@/composables/modules/responsibility/useFetchResponsibilities'
import { useCreateResponsibility } from '@/composables/modules/responsibility/useCreateResponsibility'
import { useUpdateResponsibility } from '@/composables/modules/responsibility/useUpdateResponsibility'
import { useDeleteResponsibility } from '@/composables/modules/responsibility/useDeleteResponsibility'

const { fetchResponsibilities, responsibilities, loading: fetchLoading } = useFetchResponsibilities()
const { createResponsibility } = useCreateResponsibility()
const { updateResponsibility } = useUpdateResponsibility()
const { deleteResponsibility } = useDeleteResponsibility()

const showModal = ref(false)
const showConfirmModal = ref(false)
const deleteId = ref<string | null>(null)
const deleteLoading = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  description: ''
})
const loading = ref(false)

const openCreate = () => {
  editingId.value = null
  form.description = ''
  showModal.value = true
}

const openEdit = (res: any) => {
  editingId.value = res._id
  form.description = res.description
  showModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (editingId.value) {
      await updateResponsibility(editingId.value, form)
    } else {
      await createResponsibility(form)
    }
    await fetchResponsibilities()
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
    await deleteResponsibility(deleteId.value)
    await fetchResponsibilities()
    showConfirmModal.value = false
  } finally {
    deleteLoading.value = false
    deleteId.value = null
  }
}

useHead({ title: 'Responsibilities | Admin' })
definePageMeta({
  layout: 'dashboard', middleware: 'auth' })
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ t('Responsibilities') }}</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">
          {{ t('Manage the core responsibilities and operational mandates of the institution.') }}
        </p>
      </div>
      <button 
        @click="openCreate" 
        class="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all  flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('Add Responsibility') }}
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-32 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(responsibilities as any[])?.length">
      <EmptyState 
        title="No Responsibilities Found" 
        message="Get started by adding your first responsibility." 
        @action="openCreate"
      />
    </div>

    <!-- Table Container -->
    <div v-else class="bg-white border border-gray-200 rounded-lg  overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-16 text-center">#</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{{ t('Description') }}</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">{{ t('Actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="(res, index) in (responsibilities as any[])" :key="res._id" class="hover:bg-gray-50 transition-colors group">
              <td class="px-6 py-6">
                <div class="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400 tabular-nums">
                  {{ index + 1 }}
                </div>
              </td>
              <td class="px-6 py-6">
                <div class="flex items-start gap-4">
                  <div class="w-1 h-5 bg-blue-600/20 rounded-full group-hover:bg-blue-600 transition-colors mt-0.5"></div>
                  <p class="text-sm font-medium text-gray-700 leading-relaxed max-w-2xl">{{ res.description }}</p>
                </div>
              </td>
              <td class="px-6 py-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openEdit(res)" 
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit Responsibility"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    @click="handleDelete(res._id)" 
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Responsibility"
                  >
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
    <Modal :show="showModal" :title="editingId ? 'Edit Responsibility' : 'Add Responsibility'" @close="showModal = false" size="lg">
      <div class="space-y-8 py-8 px-6">
        <section class="space-y-6">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Details') }}</h3>
          </div>
          <div class="bg-white rounded-lg p-1 border border-gray-200 ">
            <AnimatedInput 
              v-model="form.description" 
              label="Responsibility Description" 
              type="textarea" 
              :rows="5" 
              
            />
          </div>
        </section>
      </div>

      <template #actions>
        <div class="flex items-center justify-end gap-4 w-full px-8 pb-8">
          <button @click="showModal = false" class="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900">{{ t('Cancel') }}</button>
          <button 
            type="button" 
            @click="handleSubmit" 
            :disabled="loading" 
            class="px-8 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg  hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <div v-if="loading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span v-if="!loading">{{ editingId ? 'Save Changes' : 'Add Responsibility' }}</span>
          </button>
        </div>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="Delete Responsibility" 
      message="Are you sure you want to delete this responsibility? This action cannot be undone."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete" 
    />
  </div>
</template>
