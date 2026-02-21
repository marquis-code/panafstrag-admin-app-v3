const { fetchCells, cells, loading: fetchLoading } = useFetchCells()
const { createCell } = useCreateCell()
const { updateCell } = useUpdateCell()
const { deleteCell } = useDeleteCell()

await fetchCells()

const showModal = ref(false)
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

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this cell?')) {
    await deleteCell(id)
    await fetchCells()
  }
}

useHead({
  title: 'Cells Management | PANAFSTRAG',
})

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="space-y-12">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-black mb-2 tracking-tight">Cells Management</h1>
        <p class="text-slate-500 font-bold">Manage organizational cells and regional leads</p>
      </div>
      <button @click="openCreate" class="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none hover:-translate-y-1 active:scale-95 transition-all">
        NEW CELL
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-800/50">
            <th class="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Cell Name</th>
            <th class="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Location</th>
            <th class="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Lead</th>
            <th class="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="cell in (cells as any[])" :key="cell._id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
            <td class="px-8 py-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img v-if="cell.imageUrl" :src="cell.imageUrl" class="w-full h-full object-cover" />
                </div>
                <p class="font-black text-slate-900 dark:text-white">{{ cell.name }}</p>
              </div>
            </td>
            <td class="px-8 py-6">
              <span class="text-sm font-bold text-slate-600 dark:text-slate-400">{{ cell.location }}</span>
            </td>
            <td class="px-8 py-6">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black uppercase">
                  {{ cell.leadName?.charAt(0) }}
                </div>
                <p class="text-xs font-bold">{{ cell.leadName }}</p>
              </div>
            </td>
            <td class="px-8 py-6 text-right">
              <div class="flex items-center justify-end gap-2">
                 <button @click="openEdit(cell)" class="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button @click="handleDelete(cell._id)" class="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <Modal :show="showModal" :title="editingId ? 'Edit Cell' : 'New Cell'" @close="showModal = false">
      <div class="space-y-8">
        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Cell Name</label>
              <input v-model="form.name" type="text" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Location</label>
              <input v-model="form.location" type="text" placeholder="e.g. Lagos, Nigeria" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium" />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Cover Image</label>
            <MediaUpload v-model="form.imageUrl" folder="cells" />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Description</label>
          <textarea v-model="form.description" rows="4" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"></textarea>
        </div>

        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Lead Researcher Name</label>
          <input v-model="form.leadName" type="text" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium" />
        </div>
      </div>

      <template #actions>
        <button @click="showModal = false" class="px-8 py-4 text-slate-500 font-black text-xs uppercase tracking-widest">CANCEL</button>
        <button @click="handleSubmit" :disabled="loading" class="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50">
          {{ loading ? 'SAVING...' : 'SAVE CHANGES' }}
        </button>
      </template>
    </Modal>
  </div>
</template>
