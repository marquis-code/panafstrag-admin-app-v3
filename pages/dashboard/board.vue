<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useFetchBoard } from '@/composables/modules/board/useFetchBoard'
import { useCreateBoardMember } from '@/composables/modules/board/useCreateBoardMember'
import { useUpdateBoardMember } from '@/composables/modules/board/useUpdateBoardMember'
import { useDeleteBoardMember } from '@/composables/modules/board/useDeleteBoardMember'

const { fetchBoard, boardMembers: members, loading: fetchLoading } = useFetchBoard()
const { createMember, loading: createLoading } = useCreateBoardMember()
const { updateMember, loading: updateLoading } = useUpdateBoardMember()
const { deleteMember, loading: deleteMemberLoading } = useDeleteBoardMember()

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
    if(!form.duties) form.duties = []
    form.duties.push(dutyInput.value)
    dutyInput.value = ''
  }
}

const removeDuty = (index: number) => {
  form.duties.splice(index, 1)
}

useHead({ title: 'Board Members | Admin' })
definePageMeta({
  layout: 'dashboard', middleware: 'auth' })
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Board Members</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">
          Manage the members of the board, including their roles and affiliations.
        </p>
      </div>
      <button 
        @click="openCreate" 
        class="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all  flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Member
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-32 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(members as any[])?.length">
      <EmptyState 
        title="No Board Members Found" 
        message="Get started by adding your first board member." 
        @action="openCreate"
      />
    </div>

    <!-- Table Container -->
    <div v-else class="bg-white border border-gray-200 rounded-lg  overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Name</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Position</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Affiliation</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="member in (members as any[])" :key="member._id" class="hover:bg-gray-50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                    <img v-if="member.avatar" :src="member.avatar" class="h-full w-full object-cover" />
                    <div v-else class="h-full w-full flex items-center justify-center text-blue-600 font-bold text-lg">
                      {{ member.name.charAt(0) }}
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{{ member.name }}</p>
                    <p v-if="member.email?.[0]" class="text-xs text-gray-400">{{ member.email[0] }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                  {{ member.position }}
                </span>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-medium text-gray-700">{{ member.university || 'Independent' }}</p>
                <p v-if="member.department" class="text-xs text-gray-400">{{ member.department }}</p>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEdit(member)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit Member">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(member._id)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Member">
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
    <Modal :show="showModal" :title="editingId ? 'Edit Member' : 'Add New Member'" @close="showModal = false" size="lg">
      <div class="space-y-12 py-8 px-6 pb-12">
        <!-- Personal Details -->
        <section class="space-y-6">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">Personal Details</h3>
          </div>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-6">
              <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                <AnimatedInput v-model="form.name" label="Full Name" placeholder="e.g. Dr. Sarah Johnson" />
              </div>
              <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                <AnimatedInput v-model="form.position" label="Position" placeholder="e.g. Executive Director" />
              </div>
              <div class="bg-white rounded-lg p-4 border border-gray-200 ">
                 <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date Joined</label>
                 <CustomDatePicker v-model="form.dateJoined" placeholder="Select Date" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Profile Photo</label>
              <MediaUpload v-model="form.avatar" folder="board" />
            </div>
          </div>
        </section>

        <!-- Affiliation -->
        <section class="space-y-6">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">Affiliation</h3>
          </div>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg p-1 border border-gray-200 ">
              <AnimatedInput v-model="form.university" label="University" placeholder="e.g. University of Lagos" />
            </div>
            <div class="bg-white rounded-lg p-1 border border-gray-200 ">
              <AnimatedInput v-model="form.faculty" label="Faculty" placeholder="e.g. Social Sciences" />
            </div>
            <div class="bg-white rounded-lg p-1 border border-gray-200 ">
              <AnimatedInput v-model="form.department" label="Department" placeholder="e.g. Political Science" />
            </div>
          </div>
        </section>

        <!-- Emails & Responsibilities -->
        <section class="grid md:grid-cols-2 gap-8">
          <!-- Emails -->
          <div class="bg-gray-50 rounded-lg border border-gray-200 p-6 space-y-6">
            <h4 class="text-xs font-bold uppercase tracking-wider text-blue-700 pb-2 border-b border-gray-200">Email Addresses</h4>
            <div class="flex gap-2">
              <div class="flex-1 bg-white rounded-lg p-1 border border-gray-200">
                <AnimatedInput v-model="emailInput" label="Add Email" placeholder="name@domain.com" @keyup.enter="() => { if(emailInput) { form.email.push(emailInput); emailInput = '' } }" />
              </div>
              <button type="button" @click="() => { if(emailInput) { form.email.push(emailInput); emailInput = '' } }" class="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all ">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div v-for="(email, index) in form.email" :key="index" class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 ">
                <span class="text-xs font-medium text-gray-700">{{ email }}</span>
                <button @click="form.email.splice(index, 1)" class="text-gray-300 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p v-if="!form.email.length" class="text-xs text-gray-400 text-center py-4 italic">No emails added</p>
            </div>
          </div>

          <!-- Responsibilities -->
          <div class="bg-gray-50 rounded-lg border border-gray-200 p-6 space-y-6">
            <h4 class="text-xs font-bold uppercase tracking-wider text-blue-700 pb-2 border-b border-gray-200">Responsibilities</h4>
            <div class="flex gap-2">
              <div class="flex-1 bg-white rounded-lg p-1 border border-gray-200">
                <AnimatedInput v-model="dutyInput" label="Add Responsibility" placeholder="e.g. Project Oversight" @keyup.enter="addDuty" />
              </div>
              <button type="button" @click="addDuty" class="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all ">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div v-for="(duty, index) in form.duties" :key="index" class="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 ">
                <span class="text-xs font-medium text-gray-700 leading-snug">{{ duty }}</span>
                <button @click="removeDuty(index)" class="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p v-if="!form.duties.length" class="text-xs text-gray-400 text-center py-4 italic">No responsibilities defined</p>
            </div>
          </div>
        </section>

        <!-- Biography -->
        <section class="space-y-6">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">Biography</h3>
          </div>
          <div class="bg-white rounded-lg p-1 border border-gray-200  overflow-hidden">
             <RichTextEditor v-model="form.bio" placeholder="Provide a brief overview of the member's background..." />
          </div>
        </section>
      </div>

      <template #actions>
        <div class="flex items-center justify-end gap-4 w-full px-8 pb-8">
          <button @click="showModal = false" class="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900">Cancel</button>
          <button @click="handleSubmit" :disabled="loading" class="px-8 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg  hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2">
            <div v-if="loading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>{{ loading ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Member') }}</span>
          </button>
        </div>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="Delete Member" 
      message="Are you sure you want to delete this board member? This action cannot be undone."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
