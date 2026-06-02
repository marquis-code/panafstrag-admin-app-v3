<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
import { ref, onMounted } from 'vue'
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
definePageMeta({
  layout: 'dashboard', middleware: 'auth' })
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ t('Enquiries') }}</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">
          {{ t('View and manage messages sent from the website contact form.') }}
        </p>
      </div>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-32 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!enquiries?.length">
      <EmptyState 
        title="No Enquiries Found" 
        message="You haven't received any messages yet." 
      />
    </div>

    <!-- Table -->
    <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden ">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{{ t('Date') }}</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{{ t('Sender') }}</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{{ t('Subject') }}</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{{ t('Status') }}</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">{{ t('Actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="e in (enquiries as any[])" :key="e._id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="text-sm font-bold text-gray-900">
                  {{ new Date(e.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-0.5">
                  <p class="text-sm font-bold text-gray-900">{{ e.name }}</p>
                  <p class="text-xs text-gray-400">{{ e.email }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-600">{{ e.subject }}</span>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  :class="e.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'"
                >
                  {{ e.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openView(e)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(e._id)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
    </div>

    <!-- Modal -->
    <Modal :show="showModal" title="Enquiry Details" @close="showModal = false">
      <div v-if="selectedEnquiry" class="space-y-6 p-4">
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-1">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ t('Sender') }}</span>
            <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p class="text-sm font-bold text-gray-900">{{ selectedEnquiry.name }}</p>
              <p class="text-xs text-gray-500">{{ selectedEnquiry.email }}</p>
            </div>
          </div>
          <div class="space-y-1">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ t('Time Received') }}</span>
            <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p class="text-sm text-gray-600">{{ new Date(selectedEnquiry.createdAt).toLocaleString('en-GB') }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ t('Subject') }}</span>
          <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p class="text-sm font-bold text-blue-600">{{ selectedEnquiry.subject }}</p>
          </div>
        </div>

        <div class="space-y-1">
          <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ t('Message') }}</span>
          <div class="p-4 bg-white border border-gray-200 rounded-lg">
            <p class="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{{ selectedEnquiry.message }}</p>
          </div>
        </div>
      </div>

      <template #actions>
        <div class="flex items-center justify-end gap-3 w-full border-t border-gray-100 p-4">
          <button @click="showModal = false" class="px-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-900">
            {{ t('Close') }}
          </button>
          <button 
            v-if="selectedEnquiry?.status === 'pending'" 
            @click="handleStatusUpdate(selectedEnquiry._id, 'resolved')" 
            :disabled="actionLoading" 
            class="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <div v-if="actionLoading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>{{ t('Mark as Resolved') }}</span>
          </button>
        </div>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="Delete Enquiry" 
      message="Are you sure you want to delete this enquiry? This cannot be undone."
      :loading="actionLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
