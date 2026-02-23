<script setup lang="ts">
import { useEnquiry } from '@/composables/useEnquiry'

const { enquiries, loading: fetchLoading, fetchEnquiries, updateEnquiryStatus, deleteEnquiry } = useEnquiry()

const showModal = ref(false)
const showConfirmModal = ref(false)
const selectedEnquiry = ref<any>(null)
const deleteId = ref<string | null>(null)
const actionLoading = ref(false)

onMounted(() => {
  fetchEnquiries()
})

const openView = (enquiry: any) => {
  selectedEnquiry.value = enquiry
  showModal.value = true
}

const handleStatusUpdate = async (id: string, status: string) => {
  actionLoading.value = true
  try {
    await updateEnquiryStatus(id, status)
    showModal.value = false
  } finally {
    actionLoading.value = false
  }
}

const handleDelete = (id: string) => {
  deleteId.value = id
  showConfirmModal.value = true
}

const confirmDelete = async () => {
  if (!deleteId.value) return
  actionLoading.value = true
  try {
    await deleteEnquiry(deleteId.value)
    showConfirmModal.value = false
  } finally {
    actionLoading.value = false
    deleteId.value = null
  }
}

useHead({ title: 'Enquiries | PANAFSTRAG' })
definePageMeta({ middleware: 'auth' })
</script>

<template>
  <div class="space-y-12">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Communications</p>
        <h1 class="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-black">
          Enquiries <span class="not-italic text-gray-400 leading-none">& Support.</span>
        </h1>
      </div>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-24 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!enquiries?.length">
      <EmptyState title="NO ENQUIRIES" message="There are currently no incoming messages from the contact portal." />
    </div>

    <!-- Responsive Table -->
    <div v-else class="bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Sender</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Subject</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="e in (enquiries as any[])" :key="e._id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-8 py-6">
                <p class="text-[10px] font-bold text-gray-400 tabular-nums">{{ new Date(e.createdAt).toLocaleDateString() }}</p>
              </td>
              <td class="px-8 py-6">
                <div class="space-y-1">
                  <p class="text-sm font-black uppercase tracking-tighter">{{ e.name }}</p>
                  <p class="text-[10px] text-gray-400 font-medium">{{ e.email }}</p>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="px-3 py-1 bg-gray-100 text-[9px] font-black uppercase tracking-widest rounded-full">{{ e.subject }}</span>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <div :class="['w-1.5 h-1.5 rounded-full', e.status === 'pending' ? 'bg-amber-500' : 'bg-green-500']"></div>
                  <span class="text-[10px] font-black uppercase tracking-widest italic" :class="e.status === 'pending' ? 'text-amber-600' : 'text-green-600'">{{ e.status }}</span>
                </div>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-3">
                   <button @click="openView(e)" class="p-2 hover:bg-black hover:text-white border border-transparent hover:border-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(e._id)" class="p-2 text-gray-300 hover:text-black hover:bg-white transition-all">
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

    <!-- View Modal -->
    <Modal :show="showModal" title="ENQUIRY DETAILS" @close="showModal = false">
      <div v-if="selectedEnquiry" class="space-y-8 py-4">
        <section class="grid grid-cols-2 gap-8 border-b border-gray-100 pb-8">
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Sender Name</label>
            <p class="text-sm font-black uppercase tracking-tighter">{{ selectedEnquiry.name }}</p>
          </div>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
            <p class="text-sm font-medium">{{ selectedEnquiry.email }}</p>
          </div>
        </section>

        <section class="space-y-4">
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Subject Matter</label>
            <p class="text-xs font-black uppercase tracking-[0.2em] italic">{{ selectedEnquiry.subject }}</p>
          </div>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Internal Message</label>
            <div class="p-6 bg-gray-50 rounded-xl">
              <p class="text-sm font-medium leading-relaxed text-gray-700 whitespace-pre-wrap">{{ selectedEnquiry.message }}</p>
            </div>
          </div>
        </section>
      </div>

      <template #actions>
        <button @click="showModal = false" class="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">CLOSE</button>
        <button v-if="selectedEnquiry?.status === 'pending'" @click="handleStatusUpdate(selectedEnquiry._id, 'resolved')" :disabled="actionLoading" class="px-12 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-30 transition-all">
          {{ actionLoading ? 'UPDATING...' : 'MARK AS RESOLVED' }}
        </button>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="DELETE ENQUIRY" 
      message="Are you sure you want to remove this enquiry? This action cannot be undone."
      :loading="actionLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
