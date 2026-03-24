<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useActiveBanner } from '@/composables/modules/active-banner/useActiveBanner'
import { useFetchPrograms } from '@/composables/modules/programs/useFetchPrograms'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { banners, loading: fetchLoading, createBanner, updateBanner, deleteBanner } = useActiveBanner()
const { programs } = useFetchPrograms()
const { showToast } = useCustomToast()

const showModal = ref(false)
const showConfirmModal = ref(false)
const deleteId = ref<string | null>(null)
const deleteLoading = ref(false)
const editingId = ref<string | null>(null)
const loading = ref(false)

const form = reactive({
  programId: '',
  startDate: '',
  endDate: '',
  isActive: true
})

const openCreate = () => {
  editingId.value = null
  Object.assign(form, {
    programId: '',
    startDate: '',
    endDate: '',
    isActive: true
  })
  showModal.value = true
}

const openEdit = (banner: any) => {
  editingId.value = banner._id
  Object.assign(form, {
    programId: banner.programId?._id || banner.programId,
    startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : '',
    endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : '',
    isActive: banner.isActive
  })
  showModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (editingId.value) {
      await updateBanner(editingId.value, form)
    } else {
      await createBanner(form)
    }
    showModal.value = false
    showToast({ title: 'Success', message: editingId.value ? 'Banner updated' : 'Banner created', toastType: 'success', duration: 3000 })
  } catch (error) {
    showToast({ title: 'Error', message: 'Operation failed', toastType: 'error', duration: 3000 })
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
    await deleteBanner(deleteId.value)
    showConfirmModal.value = false
    showToast({ title: 'Success', message: 'Banner removed', toastType: 'success', duration: 3000 })
  } finally {
    deleteLoading.value = false
    deleteId.value = null
  }
}

const getBannerStatus = (banner: any) => {
  const now = new Date()
  const start = new Date(banner.startDate)
  const end = new Date(banner.endDate)
  if (!banner.isActive) return { label: 'Inactive', class: 'bg-slate-100 text-slate-400 border-slate-200' }
  if (now < start) return { label: 'Scheduled', class: 'bg-blue-50 text-blue-500 border-blue-100' }
  if (now > end) return { label: 'Expired', class: 'bg-rose-50 text-rose-500 border-rose-100' }
  return { label: 'Live', class: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
}

const programOptions = computed(() => {
  return (programs.value as any[])?.map(p => ({
    label: p.title,
    value: p._id
  })) || []
})

useHead({ title: 'Active Banners | PANAFSTRAG' })
definePageMeta({
  layout: 'dashboard', middleware: 'auth' })
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Promotional Banners</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">
          Schedule and manage banners for the home page.
        </p>
      </div>
      <button 
        @click="openCreate" 
        class="px-8 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all  flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Banner</span>
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-32 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(banners as any[])?.length">
      <EmptyState 
        title="No Banners Found" 
        message="You haven't added any banners yet." 
        @action="openCreate"
      />
    </div>

    <!-- Table -->
    <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden ">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Program</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Start Date</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">End Date</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="banner in (banners as any[])" :key="banner._id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-10 rounded border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0">
                    <img v-if="banner.programId?.bannerImages?.length" :src="banner.programId.bannerImages[0]" class="w-full h-full object-cover" />
                    <img v-else-if="banner.programId?.imageUrl" :src="banner.programId.imageUrl" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-900 line-clamp-1">{{ banner.programId?.title || 'Unknown Program' }}</p>
                    <p class="text-xs text-gray-400 uppercase tracking-tighter">{{ banner.programId?.theme || 'General' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600">
                  {{ new Date(banner.startDate).toLocaleDateString('en-GB') }}
                  <span class="text-xs text-gray-400 block">{{ new Date(banner.startDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600">
                  {{ new Date(banner.endDate).toLocaleDateString('en-GB') }}
                  <span class="text-xs text-gray-400 block">{{ new Date(banner.endDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  :class="getBannerStatus(banner).class"
                >
                  {{ getBannerStatus(banner).label }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEdit(banner)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(banner._id)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
    <Modal :show="showModal" :title="editingId ? 'Edit Banner' : 'Add New Banner'" @close="showModal = false">
      <div class="space-y-6 p-4">
        <SelectInput 
          v-model="form.programId" 
          label="Program" 
          :options="programOptions"
          placeholder="Select a program..." 
        />

        <div class="grid md:grid-cols-2 gap-4">
          <CustomDatePicker v-model="form.startDate" label="Start Date" />
          <CustomDatePicker v-model="form.endDate" label="End Date" />
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg">
          <div>
            <p class="text-sm font-bold text-gray-900">Active Status</p>
            <p class="text-xs text-gray-500">Should this banner be visible?</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.isActive" class="sr-only peer" />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <template #actions>
        <div class="flex items-center justify-end gap-3 w-full border-t border-gray-100 p-4">
          <button @click="showModal = false" class="px-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-900">Cancel</button>
          <button 
            @click="handleSubmit" 
            :disabled="loading || !form.programId" 
            class="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <div v-if="loading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>{{ editingId ? 'Update Banner' : 'Add Banner' }}</span>
          </button>
        </div>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="Delete Banner" 
      message="Are you sure you want to delete this banner? It will no longer show on the home page."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
