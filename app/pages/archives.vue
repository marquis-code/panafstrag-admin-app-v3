<script setup lang="ts">
const { fetchArchives, archives, loading: fetchLoading } = useFetchArchives()
const { createArchive } = useCreateArchive()
const { updateArchive } = useUpdateArchive()
const { deleteArchive } = useDeleteArchive()

await fetchArchives()

const showModal = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  title: '',
  description: '',
  type: 'speech',
  date: '',
  year: new Date().getFullYear(),
  month: '',
  fileUrl: '',
  thumbnailUrl: ''
})
const loading = ref(false)

const openCreate = () => {
  editingId.value = null
  Object.assign(form, { title: '', description: '', type: 'speech', date: '', year: new Date().getFullYear(), month: '', fileUrl: '', thumbnailUrl: '' })
  showModal.value = true
}

const openEdit = (archive: any) => {
  editingId.value = archive._id
  Object.assign(form, { ...archive, date: archive.date ? new Date(archive.date).toISOString().split('T')[0] : '' })
  showModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (editingId.value) {
      await updateArchive(editingId.value, form)
    } else {
      await createArchive(form)
    }
    await fetchArchives()
    showModal.value = false
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this archive item?')) {
    await deleteArchive(id)
    await fetchArchives()
  }
}

useHead({
  title: 'Archives Management | PANAFSTRAG',
})

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="space-y-12">
    <div class="flex items-center justify-between animate-fade-in-up">
      <div>
        <h1 class="text-4xl lg:text-5xl font-black mb-2 tracking-tighter uppercase italic">Archives <span class="not-italic text-gray-400">Management.</span></h1>
        <p class="text-slate-500 font-medium uppercase tracking-[0.2em] text-[10px]">Institutional Knowledge Base</p>
      </div>
      <button @click="openCreate" class="px-10 py-5 bg-black text-white font-black text-[10px] tracking-[0.3em] uppercase rounded-xl hover:scale-105 active:scale-95 transition-all">
        ADD RESOURCE
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading">
      <LoadingState />
    </div>

    <div v-else-if="!(archives as any[])?.length">
      <EmptyState title="REPO EMPTY" message="The library sector contains no indexed materials." />
    </div>

    <!-- Table -->
    <div v-else class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in-up delay-100">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-800/50">
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Resource</th>
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Year</th>
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="item in (archives as any[])" :key="item._id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
            <td class="px-8 py-6">
              <div>
                <p class="font-black text-black dark:text-white uppercase tracking-tight">{{ item.title }}</p>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest line-clamp-1 italic">{{ item.description }}</p>
              </div>
            </td>
             <td class="px-8 py-6">
              <span class="px-3 py-1 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                {{ item.type }}
              </span>
            </td>
            <td class="px-8 py-6 font-black text-[10px] uppercase tracking-widest text-slate-400">{{ item.year }}</td>
            <td class="px-8 py-6 text-right">
              <div class="flex items-center justify-end gap-2">
                 <button @click="openEdit(item)" class="p-2 hover:bg-black hover:text-white rounded-lg transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button @click="handleDelete(item._id)" class="p-2 hover:bg-black hover:text-white text-red-500 hover:text-red-300 rounded-lg transition-all shadow-sm">
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

    <!-- Modal -->
    <Modal :show="showModal" :title="editingId ? 'Edit Resource' : 'New Resource'" @close="showModal = false">
      <div class="space-y-8">
        <div class="space-y-6">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Title</label>
            <input v-model="form.title" type="text" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium" />
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Type</label>
              <select v-model="form.type" class="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-black tracking-widest uppercase">
                <option value="speech">Speech</option>
                <option value="report">Annual Report</option>
                <option value="media">Media</option>
                <option value="research">Research Paper</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Year</label>
              <input v-model.number="form.year" type="number" class="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Date</label>
              <input v-model="form.date" type="date" class="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold" />
            </div>
          </div>
        </div>

        <div>
           <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Description</label>
           <textarea v-model="form.description" rows="3" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium text-sm"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Resource File (URL)</label>
            <input v-model="form.fileUrl" type="url" placeholder="https://..." class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium text-sm" />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Thumbnail Image</label>
            <MediaUpload v-model="form.thumbnailUrl" folder="archives" />
          </div>
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
