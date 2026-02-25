<script setup lang="ts">
import { ref, reactive } from 'vue'
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
  if (!banner.isActive) return { label: 'INACTIVE', class: 'text-gray-400 border-gray-200' }
  if (now < start) return { label: 'SCHEDULED', class: 'text-blue-500 border-blue-200' }
  if (now > end) return { label: 'EXPIRED', class: 'text-red-400 border-red-200' }
  return { label: 'LIVE', class: 'text-green-500 border-green-400' }
}

useHead({ title: 'Active Banners | PANAFSTRAG' })
definePageMeta({ middleware: 'auth' })
</script>

<template>
  <div class="space-y-12">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Promotional Sector</p>
        <h1 class="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-black">
          Active <span class="not-italic text-gray-400 leading-none">Banners.</span>
        </h1>
      </div>
      <button @click="openCreate" class="px-10 py-5 bg-black text-white font-black text-[10px] tracking-[0.3em] uppercase hover:bg-gray-800 active:scale-95 transition-all shadow-xl shadow-black/10">
        NEW BANNER
      </button>
    </div>

    <div v-if="fetchLoading" class="py-24 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(banners as any[])?.length">
      <EmptyState title="NO BANNERS" message="No active program banners configured. Create one to promote a program on the homepage." />
    </div>

    <div v-else class="bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Program</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Start</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">End</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="banner in (banners as any[])" :key="banner._id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gray-100 overflow-hidden border border-gray-100">
                    <img v-if="banner.programId?.bannerImages?.length" :src="banner.programId.bannerImages[0]" class="w-full h-full object-cover" />
                    <img v-else-if="banner.programId?.imageUrl" :src="banner.programId.imageUrl" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-[8px] font-black text-gray-300 uppercase">NO IMG</div>
                  </div>
                  <div class="max-w-xs">
                    <p class="font-black text-black uppercase tracking-tight line-clamp-1">{{ banner.programId?.title || 'Unknown Program' }}</p>
                    <p class="text-[9px] font-black text-gray-400 uppercase italic line-clamp-1">{{ banner.programId?.theme || '' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ new Date(banner.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() }}</p>
              </td>
              <td class="px-8 py-6">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ new Date(banner.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() }}</p>
              </td>
              <td class="px-8 py-6">
                <span class="px-3 py-1 border text-[9px] font-black uppercase tracking-widest" :class="getBannerStatus(banner).class">
                  {{ getBannerStatus(banner).label }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button @click="openEdit(banner)" class="p-2 hover:bg-black hover:text-white border border-transparent hover:border-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(banner._id)" class="p-2 text-gray-300 hover:text-black hover:bg-white transition-all">
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

    <!-- Create/Edit Modal -->
    <Modal :show="showModal" :title="editingId ? 'EDIT BANNER' : 'NEW BANNER'" @close="showModal = false">
      <div class="space-y-12 py-4">
        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Banner Configuration</h3>
          
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Select Program</label>
            <select v-model="form.programId" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase">
              <option value="" disabled>SELECT A PROGRAM...</option>
              <option v-for="p in (programs as any[])" :key="p._id" :value="p._id">{{ p.title }}</option>
            </select>
          </div>

          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Start Date & Time</label>
              <input v-model="form.startDate" type="datetime-local" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">End Date & Time</label>
              <input v-model="form.endDate" type="datetime-local" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase" />
            </div>
          </div>

          <div class="flex items-center gap-4 pt-4">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.isActive" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-200 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
            </label>
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">{{ form.isActive ? 'ACTIVE' : 'INACTIVE' }}</span>
          </div>
        </section>
      </div>

      <template #actions>
        <button @click="showModal = false" class="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">ABORT</button>
        <button @click="handleSubmit" :disabled="loading || !form.programId" class="px-12 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-30 transition-all">
          {{ loading ? 'PROCESSING...' : 'AUTHORIZE BANNER' }}
        </button>
      </template>
    </Modal>

    <ConfirmModal 
      :show="showConfirmModal" 
      title="DELETE BANNER" 
      message="Are you sure you want to remove this banner? The associated program will no longer be promoted."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
