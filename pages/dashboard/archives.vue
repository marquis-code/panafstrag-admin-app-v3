<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
import { ref, reactive } from 'vue'
import { useFetchArchives } from '@/composables/modules/archives/useFetchArchives'
import { useCreateArchive } from '@/composables/modules/archives/useCreateArchive'
import { useUpdateArchive } from '@/composables/modules/archives/useUpdateArchive'
import { useDeleteArchive } from '@/composables/modules/archives/useDeleteArchive'
const { fetchArchives, archives, loading: fetchLoading } = useFetchArchives()
const { createArchive } = useCreateArchive()
const { updateArchive } = useUpdateArchive()
const { deleteArchive } = useDeleteArchive()


const showModal = ref(false)
const showConfirmModal = ref(false)
const deleteId = ref<string | null>(null)
const deleteLoading = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  title: '',
  description: '',
  type: 'speech',
  date: '',
  year: new Date().getFullYear(),
  month: '',
  fileUrl: '',
  thumbnailUrl: '',
  // Program specific fields
  theme: '',
  content: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  imageUrl: '',
  uploadedDocumentFiles: [] as string[],
  uploadedVideoUrl: '',
  zoomMeetingUrl: '',
  googleMeetUrl: '',
  location: '',
  status: 'pending',
  registerLink: '',
  bannerImages: [] as string[],
  speakers: [] as { name: string; role: string; bio: string; imageUrl: string }[],
  agenda: [] as { time: string; title: string; description: string }[],
  sectionOrder: [] as string[]
})

const availableSections = [
  { id: 'description', label: 'Main Description' },
  { id: 'speakers', label: 'Speakers & Panel' },
  { id: 'agenda', label: 'Program Agenda' },
  { id: 'documents', label: 'Document Resources' },
  { id: 'gallery', label: 'Image Gallery' },
  { id: 'video', label: 'Video Showcase' }
]

const loading = ref(false)
const docInput = ref('')

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const formatedMonth = (m: number) => {
  if (!m) return '-'
  return months[m - 1]
}

const openCreate = () => {
  editingId.value = null
  Object.assign(form, { 
    title: '', description: '', type: 'speech',
  date: '',
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  fileUrl: '',
  thumbnailUrl: '',
  theme: '',
  content: '',
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  imageUrl: '',
  uploadedDocumentFiles: [], uploadedVideoUrl: '',
    zoomMeetingUrl: '', googleMeetUrl: '', location: '', status: 'pending', registerLink: '', bannerImages: [], speakers: [], agenda: [],
    sectionOrder: ['description', 'speakers', 'agenda', 'documents', 'gallery', 'video']
  })
  showModal.value = true
}

const openEdit = (archive: any) => {
  editingId.value = archive._id
  Object.assign(form, { 
    ...archive, 
    date: archive.date ? new Date(archive.date).toISOString().split('T')[0] : '',
    speakers: archive.speakers || [],
    agenda: archive.agenda || [],
    bannerImages: archive.bannerImages || [],
    uploadedDocumentFiles: archive.uploadedDocumentFiles || [],
    sectionOrder: archive.sectionOrder?.length ? archive.sectionOrder : ['description', 'speakers', 'agenda', 'documents', 'gallery', 'video']
  })
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

const handleDelete = (id: string) => {
  deleteId.value = id
  showConfirmModal.value = true
}

const confirmDelete = async () => {
  if (!deleteId.value) return
  deleteLoading.value = true
  try {
    await deleteArchive(deleteId.value)
    await fetchArchives()
    showConfirmModal.value = false
  } finally {
    deleteLoading.value = false
    deleteId.value = null
  }
}

const addSpeaker = () => {
  form.speakers.push({ name: '', role: '', bio: '', imageUrl: '' })
}

const removeSpeaker = (idx: number) => {
  form.speakers.splice(idx, 1)
}

const addAgendaItem = () => {
  form.agenda.push({ time: '', title: '', description: '' })
}

const removeAgendaItem = (idx: number) => {
  form.agenda.splice(idx, 1)
}

useHead({
  title: 'Archives Management | PANAFSTRAG',
})

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>

<template>
  <div class="space-y-16 pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ t('Archives') }}</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">
          {{ t('Manage documents, reports, and past program records.') }}
        </p>
      </div>
      <button 
        @click="openCreate" 
        class="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all  flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {{ t('Add Item') }}
      </button>
    </div>

    <!-- Main Content -->
    <div class="relative min-h-[400px]">
      <!-- States -->
      <div v-if="fetchLoading" class="py-32 flex justify-center">
        <LoadingState />
      </div>

      <div v-else-if="!(archives as any[])?.length" class="py-24">
        <EmptyState 
          title="No Resources Found" 
          message="Get started by adding your first archived document or report." 
        />
      </div>

      <!-- Table Container -->
      <div v-else class="bg-white border border-gray-200 rounded-lg  overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{{ t('Title') }}</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{{ t('Category') }}</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">{{ t('Date') }}</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">{{ t('Actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in (archives as any[])" :key="item._id" class="hover:bg-gray-50 transition-colors group">
                <td class="px-6 py-5">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center">
                      <img v-if="item.imageUrl || item.thumbnailUrl" :src="item.imageUrl || item.thumbnailUrl" class="w-full h-full object-cover" />
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <p class="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">{{ item.title }}</p>
                      <p class="text-xs text-gray-500 line-clamp-2 mt-1">{{ item.description || 'No description provided.' }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <span 
                    class="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border "
                    :class="{
                      'bg-indigo-50 text-indigo-700 border-indigo-100': item.type === 'publication',
                      'bg-emerald-50 text-emerald-700 border-emerald-100': item.type === 'programme',
                      'bg-blue-50 text-blue-700 border-blue-100': item.type === 'report',
                      'bg-amber-50 text-amber-700 border-amber-100': item.type === 'speech',
                      'bg-purple-50 text-purple-700 border-purple-100': item.type === 'research',
                      'bg-gray-50 text-gray-500 border-gray-200': !['publication', 'programme', 'report', 'speech', 'research'].includes(item.type)
                    }"
                  >
                    {{ item.type }}
                  </span>
                </td>
                <td class="px-6 py-5">
                  <div class="flex flex-col items-center">
                    <span class="text-xs font-bold text-gray-700">{{ formatedMonth(item.month) }}</span>
                    <span class="text-[10px] text-gray-400 font-bold mt-0.5">{{ item.year }}</span>
                  </div>
                </td>
                <td class="px-6 py-5 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="openEdit(item)" 
                      class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit Resource"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      @click="handleDelete(item._id)" 
                      class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Resource"
                    >
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
    </div>

    <!-- Modal -->
    <Modal :show="showModal" :title="editingId ? 'Edit Item' : 'Add Item'" @close="showModal = false" size="xl">
      <div class="space-y-12 px-6 pb-12 pt-8">
        <!-- Basic Info -->
        <section class="space-y-8">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Basic Info') }}</h3>
          </div>
          <div class="grid grid-cols-1 gap-6">
            <div class="bg-white rounded-lg p-1 border border-gray-200 ">
              <AnimatedInput 
                v-model="form.title" 
                label="Title" 
                
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                <SelectInput 
                  v-model="form.type" 
                  label="Category" 
                  :options="[
                    { label: 'Speech', value: 'speech' },
                    { label: 'Report', value: 'report' },
                    { label: 'Publication', value: 'publication' },
                    { label: 'Media', value: 'media' },
                    { label: 'Research', value: 'research' },
                    { label: 'Program', value: 'programme' }
                  ]"
                />
              </div>
              <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                <SelectInput 
                  v-model.number="form.year" 
                  label="Year" 
                  :options="Array.from({length: 40}, (_, i) => 1990 + i).map(y => ({ label: y.toString(), value: y.toString() }))"
                />
              </div>
              <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                <SelectInput 
                  v-model.number="form.month" 
                  label="Month" 
                  :options="Array.from({length: 12}, (_, i) => ({ label: new Date(0, i).toLocaleString('default', { month: 'long' }), value: (i + 1).toString() }))"
                />
              </div>
            </div>
            <div class="max-w-xs bg-white rounded-lg p-4 border border-gray-200 ">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{{ t('Specific Date') }}</label>
              <CustomDatePicker v-model="form.date" label="Date" />
            </div>
          </div>
        </section>

        <!-- Program Specific Details -->
          <section class="space-y-8">
            <div class="border-l-4 border-blue-600 pl-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Program Details') }}</h3>
            </div>
            <div class="grid md:grid-cols-2 gap-8">
              <div class="space-y-6">
                <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                  <AnimatedInput 
                    v-model="form.theme" 
                    label="Theme" 
                    
                  />
                </div>
                <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                  <SelectInput 
                    v-model="form.status" 
                    label="Status" 
                    :options="[
                      { label: 'Pending / Active', value: 'pending' },
                      { label: 'Completed', value: 'completed' }
                    ]"
                  />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{{ t('Banner Image') }}</label>
                <div class="bg-white rounded-lg p-4 border border-gray-200 ">
                  <MediaUpload v-model="form.imageUrl" folder="programs" />
                </div>
              </div>
            </div>
          </section>

          <!-- Image Gallery -->
          <section class="space-y-6">
            <div class="flex items-center justify-between border-b border-gray-100 pb-4">
              <div class="border-l-4 border-blue-600 pl-4">
                <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Image Gallery') }}</h3>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="(img, idx) in form.bannerImages" :key="idx" class="relative group aspect-[16/9] bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <img :src="img" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" @click="form.bannerImages.splice(idx, 1)" class="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all ">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="aspect-[16/9] border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-white hover:border-blue-600/30 transition-all group cursor-pointer relative overflow-hidden">
                <MediaUpload :model-value="''" @update:model-value="(v: string) => { if(v) form.bannerImages.push(v) }" folder="banners" />
                <span class="text-[10px] font-bold text-gray-400 mt-2 group-hover:text-blue-600 transition-colors uppercase tracking-wider">{{ t('Add Image') }}</span>
              </div>
            </div>
          </section>

          <!-- Time & Location -->
          <section class="space-y-6">
            <div class="border-l-4 border-blue-600 pl-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Time & Location') }}</h3>
            </div>
            <div class="flex flex-col gap-6">
              <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                <AnimatedInput v-model="form.location" label="Venue" />
              </div>
              <div class="grid md:grid-cols-4 gap-6">
                <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                  <CustomDatePicker v-model="form.startDate" label="Start Date" />
                </div>
                <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                  <CustomTimeSelect v-model="form.startTime" label="Start Time" />
                </div>
                <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                  <CustomDatePicker v-model="form.endDate" label="End Date" />
                </div>
                <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                  <CustomTimeSelect v-model="form.endTime" label="End Time" />
                </div>
              </div>
            </div>
          </section>

          <!-- Virtual Links -->
          <section class="space-y-6">
            <div class="border-l-4 border-blue-600 pl-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Virtual Links') }}</h3>
            </div>
            <div class="grid md:grid-cols-3 gap-6">
              <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                <AnimatedInput v-model="form.uploadedVideoUrl" label="YouTube Link" />
              </div>
              <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                <AnimatedInput v-model="form.zoomMeetingUrl" label="Zoom Link" />
              </div>
              <div class="bg-white rounded-lg p-1 border border-gray-200 ">
                <AnimatedInput v-model="form.googleMeetUrl" label="Google Meet Link" />
              </div>
            </div>
          </section>

          <!-- Content Description -->
          <section class="space-y-6">
            <div class="border-l-4 border-blue-600 pl-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Description') }}</h3>
            </div>
            <div class="space-y-4">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{{ t('Full Content') }}</label>
              <div class="bg-white rounded-lg p-2 border border-gray-200 ">
                <RichTextEditor v-model="form.content" />
              </div>
            </div>
          </section>

          <!-- Speakers & Leads -->
          <section class="space-y-6">
            <div class="flex items-center justify-between border-b border-gray-100 pb-4">
              <div class="border-l-4 border-blue-600 pl-4">
                <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Speakers & Leads') }}</h3>
              </div>
              <button 
                type="button"
                @click="addSpeaker" 
                class="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 "
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {{ t('Add Speaker') }}
              </button>
            </div>
            
            <div v-if="!form.speakers.length" class="py-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 font-medium">
              {{ t('No speakers added yet.') }}
            </div>

            <div class="grid gap-6">
              <div v-for="(speaker, idx) in form.speakers" :key="idx" class="bg-white border border-gray-200 p-6 rounded-lg  relative group">
                <div class="absolute top-4 right-4">
                  <button 
                    type="button"
                    @click="removeSpeaker(idx)" 
                    class="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div class="grid md:grid-cols-4 gap-8">
                  <div class="md:col-span-3 space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="bg-white rounded-lg p-1 border border-gray-200">
                        <AnimatedInput v-model="speaker.name" label="Full Name" />
                      </div>
                      <div class="bg-white rounded-lg p-1 border border-gray-200">
                        <AnimatedInput v-model="speaker.role" label="Role" />
                      </div>
                    </div>
                    <div class="bg-white rounded-lg p-1 border border-gray-200">
                      <AnimatedInput v-model="speaker.bio" label="Biography" type="textarea" :rows="3" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">{{ t('Photo') }}</label>
                    <div class="bg-white rounded-lg p-4 border border-gray-200">
                      <MediaUpload v-model="speaker.imageUrl" folder="speakers" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Agenda -->
          <section class="space-y-6">
            <div class="flex items-center justify-between border-b border-gray-100 pb-4">
              <div class="border-l-4 border-blue-600 pl-4">
                <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Program Agenda') }}</h3>
              </div>
              <button 
                type="button"
                @click="addAgendaItem" 
                class="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 "
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {{ t('Add Item') }}
              </button>
            </div>

            <div v-if="!form.agenda.length" class="py-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 font-medium">
              {{ t('No agenda items added yet.') }}
            </div>

            <div class="space-y-4">
              <div v-for="(item, idx) in form.agenda" :key="idx" class="flex items-start gap-6 bg-white border border-gray-200 p-6 rounded-lg group  hover:border-blue-200 transition-all">
                <div class="w-10 h-10 rounded-lg bg-gray-50 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0 border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all">{{ idx + 1 }}</div>
                <div class="flex-1 grid md:grid-cols-3 gap-6">
                  <div class="bg-white rounded-lg p-1 border border-gray-200">
                    <AnimatedInput v-model="item.time" label="Time" />
                  </div>
                  <div class="bg-white rounded-lg p-1 border border-gray-200">
                    <AnimatedInput v-model="item.title" label="Title" />
                  </div>
                  <div class="bg-white rounded-lg p-1 border border-gray-200">
                    <AnimatedInput v-model="item.description" label="Details" />
                  </div>
                </div>
                <button 
                  type="button"
                  @click="removeAgendaItem(idx)" 
                  class="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          <!-- Documents -->
          <section class="space-y-6">
            <div class="border-l-4 border-blue-600 pl-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Documents') }}</h3>
            </div>
            <div class="space-y-6">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{{ t('Attached Documents (PDF, Excel, Word, PPT)') }}</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(doc, index) in form.uploadedDocumentFiles" :key="index" class="group relative">
                  <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-4 hover:bg-white hover:border-blue-600/30 transition-all ">
                    <div class="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-blue-600 border border-gray-100 ">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-gray-900 truncate">{{ doc?.split('/').pop()?.split('_').pop() || 'File' }}</p>
                      <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{{ t('Document') }}</p>
                    </div>
                    <button type="button" @click="form.uploadedDocumentFiles.splice(index, 1)" class="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-white hover:border-blue-600/30 transition-all group relative overflow-hidden">
                  <DocumentUpload :model-value="''" @update:model-value="(v: string) => { if(v) form.uploadedDocumentFiles.push(v) }" folder="programs/documents" />
                  <p class="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider group-hover:text-blue-600 transition-colors">{{ t('Upload Document') }}</p>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-lg p-1 border border-gray-200  mt-6">
              <AnimatedInput v-model="form.registerLink" label="Registration Link (Optional)" />
            </div>
          </section>

        <section class="space-y-8">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Summary') }}</h3>
          </div>
          <div class="bg-white rounded-lg p-1 border border-gray-200 ">
             <AnimatedInput 
              v-model="form.description" 
              label="Brief Description" 
              type="textarea" 
              :rows="4" 
              
            />
          </div>
        </section>

        <!-- Section Reordering -->
        <section class="space-y-6">
            <div class="border-l-4 border-blue-600 pl-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Page Section Order') }}</h3>
              <p class="text-[10px] text-gray-400 font-bold uppercase mt-1">{{ t('Reorder how sections appear on the website') }}</p>
            </div>
            
            <div class="space-y-3 max-w-lg">
              <div v-for="(sectionId, idx) in form.sectionOrder" :key="sectionId" 
                class="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl group hover:border-blue-200 transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-black text-blue-600 shadow-sm">
                    {{ idx + 1 }}
                  </div>
                  <span class="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {{ availableSections.find(s => s.id === sectionId)?.label || sectionId }}
                  </span>
                </div>
                
                <div class="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                  <button 
                    type="button"
                    @click="idx > 0 && (form.sectionOrder.splice(idx - 1, 2, form.sectionOrder[idx], form.sectionOrder[idx-1]))"
                    :disabled="idx === 0"
                    class="p-2 hover:bg-white hover:text-blue-600 rounded-lg transition-all disabled:opacity-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button 
                    type="button"
                    @click="idx < form.sectionOrder.length - 1 && (form.sectionOrder.splice(idx, 2, form.sectionOrder[idx+1], form.sectionOrder[idx]))"
                    :disabled="idx === form.sectionOrder.length - 1"
                    class="p-2 hover:bg-white hover:text-blue-600 rounded-lg transition-all disabled:opacity-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

        <section class="space-y-8 pb-4">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">{{ t('Files & Settings') }}</h3>
          </div>
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">{{ t('Resource File Upload') }}</label>
              <div v-if="form.fileUrl" class="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <a :href="form.fileUrl" target="_blank" class="text-xs font-bold text-blue-600 hover:underline truncate max-w-[200px]">{{ form.fileUrl.split('/').pop()?.slice(-20) || 'View File' }}</a>
                </div>
                <button type="button" @click="form.fileUrl = ''" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div v-else class="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-white hover:border-blue-600/30 transition-all group relative overflow-hidden">
                <DocumentUpload :model-value="''" @update:model-value="(v: string) => { if(v) form.fileUrl = v }" folder="archives/resources" />
                <p class="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wider group-hover:text-blue-600 transition-colors">{{ t('Upload Primary File') }}</p>
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">{{ t('Thumbnail') }}</label>
              <div class="bg-white rounded-lg p-4 border border-gray-200 ">
                <MediaUpload v-model="form.thumbnailUrl" folder="archives" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <template #actions>
        <div class="flex items-center justify-end gap-4 w-full px-8 pb-8">
          <button 
            @click="showModal = false" 
            class="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900"
          >
            {{ t('Cancel') }}
          </button>
          <button 
            @click="handleSubmit" 
            :disabled="loading" 
            class="px-8 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg  hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <div v-if="loading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>{{ loading ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Item') }}</span>
          </button>
        </div>
      </template>
    </Modal>

    <!-- Delete Confirmation -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="Delete Resource" 
      message="Are you sure you want to delete this resource? This action cannot be undone."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
