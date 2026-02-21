const { fetchBoard, boardMembers: members, loading: fetchLoading } = useFetchBoard()
const { createMember } = useCreateBoardMember()
const { updateMember } = useUpdateBoardMember()
const { deleteMember } = useDeleteBoardMember()

await fetchBoard()

const showModal = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  name: '',
  role: 'MEMBER',
  bio: '',
  imageUrl: '',
  duties: [] as string[]
})
const loading = ref(false)
const dutyInput = ref('')

const openCreate = () => {
  editingId.value = null
  Object.assign(form, { name: '', role: 'MEMBER', bio: '', imageUrl: '', duties: [] })
  showModal.value = true
}

const openEdit = (member: any) => {
  editingId.value = member._id
  Object.assign(form, { ...member })
  showModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (editingId.value) {
      await updateMember(editingId.value, form)
    } else {
      await createMember(form)
    }
    await fetchBoard()
    showModal.value = false
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this member?')) {
    await deleteMember(id)
    await fetchBoard()
  }
}

const addDuty = () => {
  if (dutyInput.value) {
    form.duties.push(dutyInput.value)
    dutyInput.value = ''
  }
}

const removeDuty = (index: number) => {
  form.duties.splice(index, 1)
}

useHead({
  title: 'Board Management | PANAFSTRAG',
})

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="space-y-12">
    <div class="flex items-center justify-between animate-fade-in-up">
      <div>
        <h1 class="text-4xl lg:text-5xl font-black mb-2 tracking-tighter uppercase italic">Board <span class="not-italic text-gray-400">Management.</span></h1>
        <p class="text-slate-500 font-medium uppercase tracking-[0.2em] text-[10px]">Institutional Governance & Trustees</p>
      </div>
      <button @click="openCreate" class="px-10 py-5 bg-black text-white font-black text-[10px] tracking-[0.3em] uppercase rounded-xl hover:scale-105 active:scale-95 transition-all">
        ADD MEMBER
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading">
      <LoadingState />
    </div>

    <div v-else-if="!(members as any[])?.length">
      <EmptyState title="NO TRUSTEES" message="The board database sector is currently unpopulated." />
    </div>

    <!-- Table -->
    <div v-else class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in-up delay-100">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-800/50">
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Member</th>
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Duties</th>
            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="member in (members as any[])" :key="member._id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
            <td class="px-8 py-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
                  <img v-if="member.imageUrl" :src="member.imageUrl" class="w-full h-full object-cover grayscale" />
                </div>
                <div>
                  <p class="font-black text-black dark:text-white uppercase tracking-tight">{{ member.name }}</p>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{{ member._id }}</p>
                </div>
              </div>
            </td>
            <td class="px-8 py-6">
              <span class="px-3 py-1 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                {{ member.role }}
              </span>
            </td>
            <td class="px-8 py-6">
              <div class="flex flex-wrap gap-2">
                <span v-for="duty in member.duties" :key="duty" class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">
                  {{ duty }}
                </span>
              </div>
            </td>
            <td class="px-8 py-6 text-right">
              <div class="flex items-center justify-end gap-2">
                <button @click="openEdit(member)" class="p-2 hover:bg-black hover:text-white rounded-lg transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button @click="handleDelete(member._id)" class="p-2 hover:bg-black hover:text-white text-red-400 hover:text-red-300 rounded-lg transition-all shadow-sm">
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

    <!-- Edit/Create Modal -->
    <Modal :show="showModal" :title="editingId ? 'Edit Member' : 'Add New Member'" @close="showModal = false">
      <div class="space-y-8">
        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
              <input v-model="form.name" type="text" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Role</label>
              <select v-model="form.role" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all uppercase text-xs font-black tracking-widest">
                <option value="MEMBER">Member</option>
                <option value="TRUSTEE">Trustee</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Profile Photo</label>
            <MediaUpload v-model="form.imageUrl" folder="board" />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Biography</label>
          <textarea v-model="form.bio" rows="4" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"></textarea>
        </div>

        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Duties</label>
          <div class="flex gap-2 mb-4">
            <input v-model="dutyInput" @keyup.enter="addDuty" type="text" placeholder="Add a duty..." class="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium text-sm" />
            <button @click="addDuty" class="px-6 bg-indigo-600 text-white font-black rounded-2xl">ADD</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="(duty, index) in form.duties" :key="index" class="pl-4 pr-2 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-2">
              {{ duty }}
              <button @click="removeDuty(index)" class="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
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
