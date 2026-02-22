<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useFetchLanguageGroups } from '@/composables/modules/languageGroups/useFetchLanguageGroups'
import { useCreateLanguageGroup } from '@/composables/modules/languageGroups/useCreateLanguageGroup'
import { useUpdateLanguageGroup } from '@/composables/modules/languageGroups/useUpdateLanguageGroup'
import { useDeleteLanguageGroup } from '@/composables/modules/languageGroups/useDeleteLanguageGroup'

const { fetchLanguageGroups, languageGroups, loading: fetchLoading } = useFetchLanguageGroups()
const { createLanguageGroup } = useCreateLanguageGroup()
const { updateLanguageGroup } = useUpdateLanguageGroup()
const { deleteLanguageGroup } = useDeleteLanguageGroup()

const showModal = ref(false)
const showConfirmModal = ref(false)
const deleteId = ref<string | null>(null)
const deleteLoading = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  name: '',
  description: '',
  url: '',
  imageUrl: ''
})
const loading = ref(false)

const openCreate = () => {
  editingId.value = null
  Object.assign(form, { name: '', description: '', url: '', imageUrl: '' })
  showModal.value = true
}

const openEdit = (group: any) => {
  editingId.value = group._id
  Object.assign(form, { ...group })
  showModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (editingId.value) {
      await updateLanguageGroup(editingId.value, form)
    } else {
      await createLanguageGroup(form)
    }
    await fetchLanguageGroups()
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
    await deleteLanguageGroup(deleteId.value)
    await fetchLanguageGroups()
    showConfirmModal.value = false
  } finally {
    deleteLoading.value = false
    deleteId.value = null
  }
}

useHead({
  title: 'Language Groups Management | PANAFSTRAG',
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
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Linguistic Bridges</p>
        <h1 class="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-black">
          Language <span class="not-italic text-gray-400 leading-none">Groups.</span>
        </h1>
      </div>
      <button @click="openCreate" class="px-10 py-5 bg-black text-white font-black text-[10px] tracking-[0.3em] uppercase hover:bg-gray-800 active:scale-95 transition-all shadow-xl shadow-black/10">
        NEW GROUP
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-24 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(languageGroups as any[])?.length">
      <EmptyState title="NO DATA" message="No language groups have been defined yet." />
    </div>

    <!-- Responsive Table -->
    <div v-else class="bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Group Name</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Description</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="group in (languageGroups as any[])" :key="group._id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gray-100 overflow-hidden border border-gray-100 grayscale hover:grayscale-0 transition-all duration-500">
                    <img v-if="group.imageUrl" :src="group.imageUrl" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-300 uppercase">
                      IMG
                    </div>
                  </div>
                  <p class="font-black text-black uppercase tracking-tight group-hover:text-black transition-colors">{{ group.name }}</p>
                </div>
              </td>
              <td class="px-8 py-6">
                <p class="text-[10px] font-medium text-gray-500 line-clamp-2 max-w-md uppercase tracking-tight italic">{{ group.description }}</p>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-3">
                   <button @click="openEdit(group)" class="p-2 hover:bg-black hover:text-white border border-transparent hover:border-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(group._id)" class="p-2 text-gray-300 hover:text-black hover:bg-white transition-all">
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

    <!-- Modal -->
    <Modal :show="showModal" :title="editingId ? 'EDIT LANGUAGE GROUP' : 'NEW LANGUAGE GROUP'" @close="showModal = false">
      <div class="space-y-12 py-4">
        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Group Identity</h3>
          <div class="grid md:grid-cols-2 gap-10">
            <div class="space-y-6">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Group Designation</label>
                <input v-model="form.name" type="text" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm uppercase tracking-widest" />
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Resource Link (URL)</label>
                <input v-model="form.url" type="text" placeholder="https://..." class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Representative Visual</label>
              <MediaUpload v-model="form.imageUrl" folder="language-groups" />
            </div>
          </div>
        </section>

        <section class="space-y-6 pb-8">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Mission Parameters</h3>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Group Briefing & Description</label>
            <textarea v-model="form.description" rows="4" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
          </div>
        </section>
      </div>

      <template #actions>
        <button @click="showModal = false" class="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">ABORT</button>
        <button @click="handleSubmit" :disabled="loading" class="px-12 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-30 transition-all">
          {{ loading ? 'SAVING...' : 'AUTHORIZE GROUP' }}
        </button>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="DELETE LANGUAGE GROUP" 
      message="Are you sure you want to remove this language group? This operation is permanent."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
