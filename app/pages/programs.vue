<script setup lang="ts">
const { fetchPrograms, programs, loading: fetchLoading } = useFetchPrograms()
const { createProgram } = useCreateProgram()
const { updateProgram } = useUpdateProgram()
const { deleteProgram } = useDeleteProgram()

await fetchPrograms()

const showModal = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  title: '',
  description: '',
  type: 'upcoming',
  date: '',
  imageUrl: '',
  registerLink: ''
})
const loading = ref(false)

const openCreate = () => {
  editingId.value = null
  Object.assign(form, { title: '', description: '', type: 'upcoming', date: '', imageUrl: '', registerLink: '' })
  showModal.value = true
}

const openEdit = (program: any) => {
  editingId.value = program._id
  Object.assign(form, { ...program, date: program.date ? new Date(program.date).toISOString().split('T')[0] : '' })
  showModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (editingId.value) {
      await updateProgram(editingId.value, form)
    } else {
      await createProgram(form)
    }
    await fetchPrograms()
    showModal.value = false
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this program?')) {
    await deleteProgram(id)
    await fetchPrograms()
  }
}

useHead({
  title: 'Programs Management | PANAFSTRAG',
})

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="space-y-12">
    <div class="flex items-center justify-between animate-fade-in-up">
      <div>
        <h1 class="text-4xl lg:text-5xl font-black mb-2 tracking-tighter uppercase italic">Programs <span class="not-italic text-gray-400">Management.</span></h1>
        <p class="text-slate-500 font-medium uppercase tracking-[0.2em] text-[10px]">Seminar & Institutional Events</p>
      </div>
      <button @click="openCreate" class="px-10 py-5 bg-black text-white font-black text-[10px] tracking-[0.3em] uppercase rounded-xl hover:scale-105 active:scale-95 transition-all">
        NEW PROGRAM
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading">
      <LoadingState />
    </div>

    <div v-else-if="!(programs as any[])?.length">
      <EmptyState title="NO PROGRAMS" message="The institutional calendar is currently empty." />
    </div>

    <!-- Table -->
    <div v-else class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in-up delay-100">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-800/50">
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Program</th>
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="program in (programs as any[])" :key="program._id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
            <td class="px-8 py-6">
               <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
                  <img v-if="program.imageUrl" :src="program.imageUrl" class="w-full h-full object-cover grayscale" />
                </div>
                <div>
                  <p class="font-black text-black dark:text-white uppercase tracking-tight">{{ program.title }}</p>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{{ program._id }}</p>
                </div>
              </div>
            </td>
            <td class="px-8 py-6">
              <span class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest" :class="program.type === 'upcoming' ? 'bg-black text-white' : 'bg-slate-100 text-slate-400'">
                {{ program.type }}
              </span>
            </td>
            <td class="px-8 py-6">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ new Date(program.date).toLocaleDateString('en-US', { dateStyle: 'medium' }) }}</p>
            </td>
            <td class="px-8 py-6 text-right">
              <div class="flex items-center justify-end gap-2">
                 <button @click="openEdit(program)" class="p-2 hover:bg-black hover:text-white rounded-lg transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button @click="handleDelete(program._id)" class="p-2 hover:bg-black hover:text-white text-red-500 hover:text-red-300 rounded-lg transition-all shadow-sm">
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
    <Modal :show="showModal" :title="editingId ? 'Edit Program' : 'New Program'" @close="showModal = false">
      <div class="space-y-8">
        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Title</label>
              <input v-model="form.title" type="text" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Type</label>
                <select v-model="form.type" class="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-black tracking-widest uppercase">
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Date</label>
                <input v-model="form.date" type="date" class="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold" />
              </div>
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Cover Image</label>
            <MediaUpload v-model="form.imageUrl" folder="programs" />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Description</label>
          <textarea v-model="form.description" rows="4" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"></textarea>
        </div>

        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Registration Link (Optional)</label>
          <input v-model="form.registerLink" type="url" placeholder="https://..." class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium" />
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
