<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useFetchObjectives } from '@/composables/modules/objective/useFetchObjectives'
import { useCreateObjective } from '@/composables/modules/objective/useCreateObjective'
import { useUpdateObjective } from '@/composables/modules/objective/useUpdateObjective'
import { useDeleteObjective } from '@/composables/modules/objective/useDeleteObjective'

const { fetchObjectives, objectives, loading: fetchLoading } = useFetchObjectives()
const { createObjective } = useCreateObjective()
const { updateObjective } = useUpdateObjective()
const { deleteObjective } = useDeleteObjective()


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

const openEdit = (obj: any) => {
  editingId.value = obj._id
  form.description = obj.description
  showModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (editingId.value) {
      await updateObjective(editingId.value, form)
    } else {
      await createObjective(form)
    }
    await fetchObjectives()
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
    await deleteObjective(deleteId.value)
    await fetchObjectives()
    showConfirmModal.value = false
  } finally {
    deleteLoading.value = false
    deleteId.value = null
  }
}

useHead({ title: 'Objectives | PANAFSTRAG' })
definePageMeta({ middleware: 'auth' })
</script>

<template>
  <div class="space-y-12">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Strategic Direction</p>
        <h1 class="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-black">
          Objectives <span class="not-italic text-gray-400 leading-none">Management.</span>
        </h1>
      </div>
      <button @click="openCreate" class="px-10 py-5 bg-black text-white font-black text-[10px] tracking-[0.3em] uppercase hover:bg-gray-800 active:scale-95 transition-all shadow-xl shadow-black/10">
        ADD OBJECTIVE
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-24 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(objectives as any[])?.length">
      <EmptyState title="NO DATA" message="The strategic mission sector is currently unpopulated." />
    </div>

    <!-- Responsive Table -->
    <div v-else class="bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Mission Description</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="obj in (objectives as any[])" :key="obj._id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-8 py-6">
                <p class="text-sm font-medium text-black leading-relaxed group-hover:text-black transition-colors">{{ obj.description }}</p>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-3">
                   <button @click="openEdit(obj)" class="p-2 hover:bg-black hover:text-white border border-transparent hover:border-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(obj._id)" class="p-2 text-gray-300 hover:text-black hover:bg-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Redesign -->
    <Modal :show="showModal" :title="editingId ? 'EDIT MISSION OBJECTIVE' : 'NEW STRATEGIC TARGET'" @close="showModal = false">
      <div class="space-y-8 py-4">
        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Target Parameters</h3>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Detailed Mission Description</label>
            <textarea v-model="form.description" rows="5" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed" placeholder="DEFINE THE STRATEGIC GOAL..."></textarea>
          </div>
        </section>
      </div>

      <template #actions>
        <button @click="showModal = false" class="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">ABORT</button>
        <button @click="handleSubmit" :disabled="loading" class="px-12 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-30 transition-all">
          {{ loading ? 'AUTHORIZING...' : 'CONFIRM MISSION' }}
        </button>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="DELETE OBJECTIVE" 
      message="Are you sure you want to remove this strategic objective? This operation is permanent."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
