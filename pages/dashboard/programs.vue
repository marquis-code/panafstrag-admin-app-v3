<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useFetchPrograms } from '@/composables/modules/programs/useFetchPrograms'
import { useCreateProgram } from '@/composables/modules/programs/useCreateProgram'
import { useUpdateProgram } from '@/composables/modules/programs/useUpdateProgram'
import { useDeleteProgram } from '@/composables/modules/programs/useDeleteProgram'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { fetchPrograms, programs, loading: fetchLoading } = useFetchPrograms()
const { createProgram } = useCreateProgram()
const { updateProgram } = useUpdateProgram()
const { deleteProgram } = useDeleteProgram()
const { showToast } = useCustomToast()

const showModal = ref(false)
const showConfirmModal = ref(false)
const deleteId = ref<string | null>(null)
const deleteLoading = ref(false)
const editingId = ref<string | null>(null)
const activeTab = ref<'edit' | 'preview'>('edit')

const form = reactive({
  title: '',
  theme: '',
  description: '',
  content: '',
  type: 'upcoming',
  startDate: '',
  endDate: '',
  date: '',
  imageUrl: '',
  uploadedDocumentFiles: [] as string[],
  uploadedVideoUrl: '',
  zoomMeetingUrl: '',
  googleMeetUrl: '',
  location: '',
  status: 'pending',
  registerLink: '',
  year: new Date().getFullYear().toString(),
  month: (new Date().getMonth() + 1).toString(),
  bannerImages: [] as string[],
  speakers: [] as { name: string; role: string; bio: string; imageUrl: string }[],
  agenda: [] as { time: string; title: string; description: string }[]
})

const loading = ref(false)
const filterType = ref('all')
const filterYear = ref('all')
const filterMonth = ref('all')

const yearOptions = computed(() => {
  const years = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - 5 + i);
  return years.map(y => ({ label: y.toString(), value: y.toString() }));
});

const monthOptions = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
].map((m, i) => ({ label: m, value: (i + 1).toString() }))

const fetchWithFilters = () => {
  const query: any = {}
  if (filterType.value !== 'all') query.type = filterType.value
  if (filterYear.value !== 'all') query.year = filterYear.value
  if (filterMonth.value !== 'all') query.month = filterMonth.value
  fetchPrograms(query)
}

watch([filterType, filterYear, filterMonth], fetchWithFilters)

const resetForm = () => ({
  title: '', theme: '', description: '', content: '', type: 'upcoming',
  startDate: '', endDate: '', date: '', imageUrl: '',
  uploadedDocumentFiles: [], uploadedVideoUrl: '', zoomMeetingUrl: '',
  googleMeetUrl: '', location: '', status: 'pending', registerLink: '',
  year: new Date().getFullYear(), month: new Date().getMonth() + 1,
  bannerImages: [], speakers: [], agenda: []
})

const openCreate = () => {
  editingId.value = null
  activeTab.value = 'edit'
  Object.assign(form, resetForm())
  showModal.value = true
}

const openEdit = (program: any) => {
  editingId.value = program._id
  activeTab.value = 'edit'
  Object.assign(form, {
    ...program,
    date: program.date ? new Date(program.date).toISOString().split('T')[0] : '',
    year: (program.year || new Date(program.date || Date.now()).getFullYear()).toString(),
    month: (program.month || (new Date(program.date || Date.now()).getMonth() + 1)).toString(),
    speakers: program.speakers || [],
    agenda: program.agenda || [],
    bannerImages: program.bannerImages || [],
    content: program.content || '',
    googleMeetUrl: program.googleMeetUrl || '',
    location: program.location || '',
  })
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
    showToast({ title: 'Success', message: editingId.value ? 'Program updated' : 'Program created', toastType: 'success' })
  } catch (err) {
    showToast({ title: 'Error', message: 'Something went wrong', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

const confirmDelete = async () => {
  if (!deleteId.value) return
  deleteLoading.value = true
  try {
    await deleteProgram(deleteId.value)
    await fetchPrograms()
    showConfirmModal.value = false
    showToast({ title: 'Deleted', message: 'Program removed', toastType: 'success' })
  } finally {
    deleteLoading.value = false
    deleteId.value = null
  }
}

const addSpeaker = () => { form.speakers.push({ name: '', role: '', bio: '', imageUrl: '' }) }
const removeSpeaker = (idx: number) => { form.speakers.splice(idx, 1) }
const addAgendaItem = () => { form.agenda.push({ time: '', title: '', description: '' }) }
const removeAgendaItem = (idx: number) => { form.agenda.splice(idx, 1) }

onMounted(() => { fetchPrograms() })

useHead({ title: 'Programs | Admin' })
definePageMeta({
  layout: 'dashboard', middleware: 'auth' })
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Programs</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">Manage programs and events.</p>
      </div>
      <button 
        @click="openCreate" 
        class="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all  flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        New Program
      </button>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center bg-white p-6 rounded-lg border border-gray-200 ">
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="f in ['all', 'upcoming', 'past']" :key="f"
          @click="filterType = f"
          :class="['px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all',
            filterType === f ? 'bg-blue-600 text-white ' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100']"
        >
          {{ f === 'all' ? 'All' : f }}
        </button>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <SelectInput 
          v-model="filterYear" 
          label="Filter by Year" 
          :options="[{ label: 'All Years', value: 'all' }, ...yearOptions]" 
        />
        <SelectInput 
          v-model="filterMonth" 
          label="Filter by Month" 
          :options="[{ label: 'All Months', value: 'all' }, ...monthOptions]" 
          :disabled="filterYear === 'all'"
        />
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-200 rounded-lg  overflow-hidden">
      <div v-if="fetchLoading" class="py-32 flex justify-center">
        <LoadingState />
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Name</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Status</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Visibility</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Date</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="!(programs as any[])?.length">
              <td colspan="5" class="py-24">
                <EmptyState title="No Programs Found" message="Try adjusting your filters or create a new program." />
              </td>
            </tr>
            <tr v-for="program in (programs as any[])" :key="program._id" class="hover:bg-gray-50 transition-colors group">
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                    <img v-if="program.imageUrl" :src="program.imageUrl" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">IMG</div>
                  </div>
                  <div class="max-w-md">
                    <p class="text-sm font-bold text-gray-900 line-clamp-1">{{ program.title }}</p>
                    <p class="text-xs text-gray-500 line-clamp-1">{{ program.theme || 'No theme' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5 text-center">
                <span class="inline-flex px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-gray-200">
                  {{ program.type }}
                </span>
              </td>
              <td class="px-6 py-5 text-center">
                <div 
                  :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
                    program.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100']"
                >
                  <div :class="['w-1.5 h-1.5 rounded-full', program.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500']"></div>
                  {{ program.status }}
                </div>
              </td>
              <td class="px-6 py-5 text-center text-sm font-medium text-gray-600">
                {{ new Date(program.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) }}
              </td>
              <td class="px-6 py-5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEdit(program)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button @click="deleteId = program._id; showConfirmModal = true" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Program Form Modal -->
    <Modal :show="showModal" :title="editingId ? 'Edit Program' : 'New Program'" @close="showModal = false" size="xl">
      <!-- Tabs -->
      <div class="flex p-1 bg-gray-100 rounded-lg mb-8 max-w-xs mx-auto">
        <button 
          @click="activeTab = 'edit'" 
          :class="['flex-1 py-1.5 text-xs font-bold rounded-md transition-all',
            activeTab === 'edit' ? 'bg-white text-gray-900 ' : 'text-gray-500 hover:text-gray-700']"
        >
          Details
        </button>
        <button 
          @click="activeTab = 'preview'" 
          :class="['flex-1 py-1.5 text-xs font-bold rounded-md transition-all',
            activeTab === 'preview' ? 'bg-white text-gray-900 ' : 'text-gray-500 hover:text-gray-700']"
        >
          Preview
        </button>
      </div>

      <!-- EDITOR -->
      <div v-show="activeTab === 'edit'" class="space-y-12 px-6 pb-12">
        <!-- Basic Info -->
        <section class="space-y-6">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">Basic Info</h3>
          </div>
          
          <div class="grid lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <AnimatedInput v-model="form.title" label="Title" />
              <AnimatedInput v-model="form.theme" label="Theme" />
              <div class="grid grid-cols-2 gap-4">
                <SelectInput 
                  v-model="form.type" 
                  label="Status" 
                  :options="[{ label: 'Upcoming', value: 'upcoming' }, { label: 'Past', value: 'past' }]" 
                />
                <SelectInput 
                  v-model="form.status" 
                  label="Visibility" 
                  :options="[{ label: 'Hidden', value: 'pending' }, { label: 'Visible', value: 'completed' }]" 
                />
              </div>
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Cover Image</label>
              <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <MediaUpload v-model="form.imageUrl" folder="programs" />
              </div>
            </div>
          </div>
        </section>

        <!-- Schedule & Location -->
        <section class="space-y-6">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">Schedule</h3>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedInput v-model="form.location" label="Venue" />
            <CustomDatePicker v-model="form.startDate" label="Start Date" />
            <CustomDatePicker v-model="form.endDate" label="End Date" />
            <CustomDatePicker v-model="form.date" label="Date" />
          </div>
          <div class="grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <SelectInput v-model="form.year" label="Year" :options="yearOptions" />
            <SelectInput v-model="form.month" label="Month" :options="monthOptions" />
          </div>
        </section>

        <!-- Section 3: Links -->
        <section class="space-y-6">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">Meeting & Video Links</h3>
          </div>
          <div class="grid md:grid-cols-3 gap-6">
            <AnimatedInput v-model="form.uploadedVideoUrl" label="YouTube Video Link" />
            <AnimatedInput v-model="form.zoomMeetingUrl" label="Zoom Link" />
            <AnimatedInput v-model="form.googleMeetUrl" label="Google Meet Link" />
          </div>
        </section>

        <!-- Content -->
        <section class="space-y-6">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">Content</h3>
          </div>
          <div class="space-y-6">
            <AnimatedInput v-model="form.description" label="Summary" type="textarea" :rows="3" />
            <div class="space-y-2">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Details</label>
              <div class="bg-white border border-gray-200 rounded-lg overflow-hidden  p-1">
                <RichTextEditor v-model="form.content" />
              </div>
            </div>
          </div>
        </section>

        <!-- Section 5: Gallery -->
        <section class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="border-l-4 border-blue-600 pl-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">Gallery Images</h3>
            </div>
            <p class="text-[10px] font-bold text-gray-400">Up to 10 images</p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div v-for="(img, idx) in form.bannerImages" :key="idx" class="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
               <img :src="img" class="absolute inset-0 w-full h-full object-cover" />
               <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button @click="form.bannerImages.splice(idx, 1)" class="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
               </div>
            </div>
            <div class="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer relative overflow-hidden p-4 text-center">
               <MediaUpload :model-value="''" @update:model-value="(v: string) => { if(v) form.bannerImages.push(v) }" folder="banners" />
               <p class="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">Add Image</p>
            </div>
          </div>
        </section>

        <!-- Section 6: Speakers & Agenda -->
        <div class="grid lg:grid-cols-2 gap-12">
          <!-- Speakers -->
          <section class="space-y-6">
            <div class="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">Speakers</h3>
              <button @click="addSpeaker" class="px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-gray-800 flex items-center gap-1.5 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Speaker
              </button>
            </div>
            <div class="space-y-6 max-h-[500px] overflow-y-auto px-1">
              <div v-for="(speaker, idx) in form.speakers" :key="idx" class="p-6 bg-white border border-gray-200 rounded-lg  relative group">
                <button @click="removeSpeaker(idx)" class="absolute top-4 right-4 text-gray-300 hover:text-red-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                <div class="flex gap-6">
                  <div class="w-20 h-20 rounded-lg bg-gray-50 border border-gray-200 shrink-0 overflow-hidden">
                    <MediaUpload v-model="speaker.imageUrl" folder="speakers" />
                  </div>
                  <div class="flex-1 space-y-4">
                    <AnimatedInput v-model="speaker.name" label="Speaker Name" />
                    <AnimatedInput v-model="speaker.role" label="Role / Title" />
                    <AnimatedInput v-model="speaker.bio" label="Biography" type="textarea" :rows="2" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Agenda -->
          <section class="space-y-6">
            <div class="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">Agenda</h3>
              <button @click="addAgendaItem" class="px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-gray-800 flex items-center gap-1.5 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Item
              </button>
            </div>
            <div class="space-y-4 max-h-[500px] overflow-y-auto px-1">
              <div v-for="(item, idx) in form.agenda" :key="idx" class="p-5 bg-gray-50 border border-gray-200 rounded-lg relative group">
                <button @click="removeAgendaItem(idx)" class="absolute top-4 right-4 text-gray-300 hover:text-red-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <div class="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-lg font-bold text-xs">{{ idx + 1 }}</div>
                    <AnimatedInput v-model="item.time" label="Time" class="flex-1" />
                  </div>
                  <AnimatedInput v-model="item.title" label="Session title" />
                  <AnimatedInput v-model="item.description" label="Session description" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Section 7: Documents -->
        <section class="space-y-6">
           <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">Documents & Registration</h3>
          </div>
          <div class="space-y-6">
             <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="(doc, dIdx) in form.uploadedDocumentFiles" :key="dIdx" class="relative p-4 bg-white border border-gray-200 rounded-lg group">
                  <button @click="form.uploadedDocumentFiles.splice(dIdx, 1)" class="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-200 text-red-600 rounded-full flex items-center justify-center ">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                   <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <p class="text-[10px] font-bold text-gray-600 truncate uppercase">{{ doc.split('/').pop()?.slice(-20) }}</p>
                   </div>
                </div>
                <div class="p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center relative hover:bg-gray-100 transition-all cursor-pointer text-center">
                   <DocumentUpload :model-value="''" @update:model-value="(v: string) => { if(v) form.uploadedDocumentFiles.push(v) }" folder="programs/annexes" />
                   <p class="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">Add Document</p>
                </div>
             </div>
             <AnimatedInput v-model="form.registerLink" label="External Registration Link" />
          </div>
        </section>
      </div>v>

      <!-- PREVIEW -->
      <div v-show="activeTab === 'preview'" class="pb-16 px-6">
         <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden  max-w-4xl mx-auto">
            <!-- Hero -->
            <div class="relative h-80 bg-gray-900 flex items-end p-12 overflow-hidden">
               <div v-if="form.imageUrl || form.bannerImages.length" class="absolute inset-0 z-0">
                  <img :src="form.bannerImages[0] || form.imageUrl" class="w-full h-full object-cover opacity-30" />
                  <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
               </div>
               <div class="relative z-10 space-y-4">
                  <div class="flex gap-2">
                    <span class="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">{{ form.type || 'Program' }}</span>
                    <span v-if="form.location" class="px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md">{{ form.location }}</span>
                  </div>
                  <h1 class="text-4xl font-extrabold text-white tracking-tight">{{ form.title || 'Untitled Program' }}</h1>
                  <p v-if="form.theme" class="text-lg font-medium text-gray-300 italic">{{ form.theme }}</p>
               </div>
            </div>

            <!-- Quick Info -->
            <div class="grid grid-cols-2 md:grid-cols-4 bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
               <div class="p-6 text-center border-r border-gray-200">Starts: <span class="text-gray-900 block mt-1">{{ form.startDate || 'TBD' }}</span></div>
               <div class="p-6 text-center border-r border-gray-200">Ends: <span class="text-gray-900 block mt-1">{{ form.endDate || 'TBD' }}</span></div>
               <div class="p-6 text-center border-r border-gray-200">Year: <span class="text-gray-900 block mt-1">{{ form.year }}</span></div>
               <div class="p-6 text-center flex items-center justify-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                  LIVE PREVIEW
               </div>
            </div>

            <!-- Content -->
            <div class="p-12 space-y-12 bg-white">
               <div v-if="form.description" class="text-gray-700 text-xl font-medium border-l-4 border-gray-200 pl-6 py-2">
                  {{ form.description }}
               </div>

               <div v-if="form.content" class="prose prose-blue max-w-none text-gray-600 rich-preview-content" v-html="form.content"></div>

               <!-- Agenda -->
               <div v-if="form.agenda.length" class="space-y-8">
                  <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">Program Agenda</h3>
                  <div class="space-y-4 max-w-2xl mx-auto">
                     <div v-for="(item, i) in form.agenda" :key="i" class="flex gap-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
                        <div class="w-12 h-12 bg-white border border-gray-200 text-blue-600 flex items-center justify-center rounded-lg font-bold text-sm shrink-0">{{ i + 1 }}</div>
                        <div class="space-y-2">
                           <div class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold inline-block">{{ item.time || '00:00' }}</div>
                           <h4 class="text-lg font-bold text-gray-900">{{ item.title || 'Session Title' }}</h4>
                           <p class="text-sm text-gray-500">{{ item.description }}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- Speakers -->
               <div v-if="form.speakers.length" class="space-y-12">
                  <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">Speakers</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div v-for="(s, i) in form.speakers" :key="i" class="text-center space-y-4">
                        <div class="w-32 h-32 mx-auto rounded-lg overflow-hidden border-4 border-gray-50 ">
                            <img v-if="s.imageUrl" :src="s.imageUrl" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center text-4xl font-bold text-gray-200">?</div>
                        </div>
                        <div>
                           <h5 class="text-lg font-bold text-gray-900">{{ s.name || 'Speaker Name' }}</h5>
                           <p class="text-xs font-bold text-blue-600 uppercase tracking-wider">{{ s.role || 'Role' }}</p>
                           <p class="text-gray-500 text-xs mt-2 line-clamp-3 px-4">{{ s.bio }}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <template #actions>
        <div class="flex items-center justify-end gap-4 w-full px-8 pb-8">
          <button @click="showModal = false" class="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900">Cancel</button>
          <button 
            type="button" 
            @click="handleSubmit" 
            :disabled="loading" 
            class="px-8 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg  hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-3"
          >
            <div v-if="loading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            {{ editingId ? 'Save Changes' : 'New Program' }}
          </button>
        </div>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="Delete Program" 
      message="Are you sure you want to delete this program? This action cannot be undone."
      :loading="deleteLoading"
      @close="showConfirmModal = false" 
      @confirm="confirmDelete" 
    />
  </div>
</template>

<style scoped>
.rich-preview-content :deep(h1) { font-size: 2rem; font-weight: 800; color: #111827; margin: 2rem 0 1rem; }
.rich-preview-content :deep(h2) { font-size: 1.5rem; font-weight: 800; color: #1f2937; margin: 1.5rem 0 0.75rem; }
.rich-preview-content :deep(p) { margin-bottom: 1rem; line-height: 1.6; color: #4b5563; }
.rich-preview-content :deep(ul) { list-style: disc; padding-left: 1.5rem; margin: 1rem 0; }
.rich-preview-content :deep(li) { margin-bottom: 0.5rem; color: #4b5563; }
.rich-preview-content :deep(img) { border-radius: 0.75rem; margin: 2rem 0; max-width: 100%; height: auto; }
.custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
.custom-scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
</style>
