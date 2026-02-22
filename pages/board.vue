<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useFetchBoard } from '@/composables/modules/board/useFetchBoard'
import { useCreateBoardMember } from '@/composables/modules/board/useCreateBoardMember'
import { useUpdateBoardMember } from '@/composables/modules/board/useUpdateBoardMember'
import { useDeleteBoardMember } from '@/composables/modules/board/useDeleteBoardMember'

const { fetchBoard, boardMembers: members, loading: fetchLoading } = useFetchBoard()
const { createMember } = useCreateBoardMember()
const { updateMember } = useUpdateBoardMember()
const { deleteMember } = useDeleteBoardMember()


const showModal = ref(false)
const showConfirmModal = ref(false)
const deleteId = ref<string | null>(null)
const deleteLoading = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  name: '',
  position: 'Board member',
  email: [] as string[],
  university: '',
  department: '',
  faculty: '',
  bio: '',
  avatar: '',
  dateJoined: '',
  duties: [] as string[]
})
const loading = ref(false)
const dutyInput = ref('')
const emailInput = ref('')

const openCreate = () => {
  editingId.value = null
  Object.assign(form, { 
    name: '', 
    position: 'Board member', 
    email: [], 
    university: '', 
    department: '', 
    faculty: '', 
    bio: '', 
    avatar: '', 
    dateJoined: '', 
    duties: [] 
  })
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

const handleDelete = (id: string) => {
  deleteId.value = id
  showConfirmModal.value = true
}

const confirmDelete = async () => {
  if (!deleteId.value) return
  deleteLoading.value = true
  try {
    await deleteMember(deleteId.value)
    await fetchBoard()
    showConfirmModal.value = false
  } finally {
    deleteLoading.value = false
    deleteId.value = null
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
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Institutional Sector</p>
        <h1 class="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-black">
          Board <span class="not-italic text-gray-400 leading-none">Management.</span>
        </h1>
      </div>
      <button @click="openCreate" class="px-10 py-5 bg-black text-white font-black text-[10px] tracking-[0.3em] uppercase hover:bg-gray-800 active:scale-95 transition-all shadow-xl shadow-black/10">
        ADD MEMBER
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-24 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(members as any[])?.length">
      <EmptyState title="NO DATA" message="The board registration sector is currently empty." />
    </div>

    <!-- Responsive Table -->
    <div v-else class="bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Personnel</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Sector / Position</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Affiliation</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="member in (members as any[])" :key="member._id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gray-100 overflow-hidden border border-gray-100 grayscale hover:grayscale-0 transition-all duration-500">
                    <img v-if="member.avatar" :src="member.avatar" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-xs font-black text-gray-300 uppercase">
                      {{ member.name.charAt(0) }}
                    </div>
                  </div>
                  <div>
                    <p class="font-black text-black uppercase tracking-tight">{{ member.name }}</p>
                    <p v-if="member.email?.[0]" class="text-[9px] font-medium text-gray-400 lowercase tracking-tight">{{ member.email[0] }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="px-3 py-1 border border-black text-black text-[9px] font-black uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-colors">
                  {{ member.position }}
                </span>
              </td>
              <td class="px-8 py-6">
                <p class="text-[10px] font-black text-gray-400 uppercase italic line-clamp-1 group-hover:text-black transition-colors">{{ member.university || 'N/A' }}</p>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button @click="openEdit(member)" class="p-2 hover:bg-black hover:text-white border border-transparent hover:border-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 uppercase" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(member._id)" class="p-2 text-gray-300 hover:text-black hover:bg-white transition-all">
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
    <Modal :show="showModal" :title="editingId ? 'EDIT PERSONNEL' : 'NEW REGISTRATION'" @close="showModal = false">
      <div class="space-y-12 py-4">
        <section class="space-y-6">
           <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Primary Identity</h3>
           <div class="grid md:grid-cols-2 gap-10">
            <div class="space-y-6">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Legal Full Name</label>
                <input v-model="form.name" type="text" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Institutional Position</label>
                <input v-model="form.position" type="text" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Identification Photo</label>
              <MediaUpload v-model="form.avatar" folder="board" />
            </div>
          </div>
        </section>

        <section class="space-y-6">
           <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Academic & Institutional</h3>
           <div class="grid md:grid-cols-3 gap-8">
             <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">University</label>
                <input v-model="form.university" type="text" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Department</label>
                <input v-model="form.department" type="text" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Faculty</label>
                <input v-model="form.faculty" type="text" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
          </div>
        </section>

        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Communication Hub</h3>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Registered Email Addresses</label>
            <div class="flex gap-4 mb-6">
              <input v-model="emailInput" @keyup.enter="() => { if(emailInput) { form.email.push(emailInput); emailInput = '' } }" type="email" placeholder="SECURE EMAIL..." class="flex-1 px-4 py-3 bg-gray-50 border-none text-[10px] font-black tracking-widest uppercase outline-none focus:ring-1 focus:ring-black" />
              <button @click="() => { if(emailInput) { form.email.push(emailInput); emailInput = '' } }" class="px-8 bg-black text-white text-[9px] font-black uppercase tracking-widest">ADD</button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="(email, index) in form.email" :key="index" class="pl-4 pr-1 py-1.5 bg-gray-50 border border-gray-100 rounded-sm text-[10px] font-black flex items-center gap-3">
                {{ email.toUpperCase() }}
                <button @click="form.email.splice(index, 1)" class="p-1 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </section>

        <section class="space-y-6">
           <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Profile & Biography</h3>
           <div class="grid md:grid-cols-2 gap-8">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Record Date Joined</label>
                <input v-model="form.dateJoined" type="text" placeholder="YYYY-MM-DD" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
           </div>
           <div>
             <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Executive Biography</label>
             <textarea v-model="form.bio" rows="4" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
           </div>
        </section>

        <section class="space-y-6 pb-8">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Sector Responsibilities</h3>
          <div class="flex gap-4 mb-6">
            <input v-model="dutyInput" @keyup.enter="addDuty" type="text" placeholder="SPECIFY DUTY..." class="flex-1 px-4 py-3 bg-gray-50 border-none text-[10px] font-black tracking-widest uppercase outline-none focus:ring-1 focus:ring-black" />
            <button @click="addDuty" class="px-8 bg-black text-white text-[9px] font-black uppercase tracking-widest">SPECIFY</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span v-for="(duty, index) in form.duties" :key="index" class="pl-4 pr-1 py-1.5 bg-gray-50 border border-gray-100 rounded-sm text-[10px] font-black flex items-center gap-3 italic">
              {{ duty.toUpperCase() }}
              <button @click="removeDuty(index)" class="p-1 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
        </section>
      </div>

      <template #actions>
        <button @click="showModal = false" class="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">ABORT</button>
        <button @click="handleSubmit" :disabled="loading" class="px-12 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-30 transition-all">
          {{ loading ? 'PROCESSING...' : 'AUTHORIZE CHANGES' }}
        </button>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="DELETE PERSONNEL" 
      message="Are you sure you want to remove this member from the board? This operation is permanent."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
