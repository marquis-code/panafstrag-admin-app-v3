<script setup lang="ts">
import { ref, reactive } from 'vue'
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
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  bannerImages: [] as string[],
  speakers: [] as { name: string; role: string; bio: string; imageUrl: string }[],
  agenda: [] as { time: string; title: string; description: string }[]
})
const loading = ref(false)
const docInput = ref('')

const filterType = ref('all')
const filterYear = ref('all')
const filterMonth = ref('all')

const yearOptions = computed(() => {
  const years = Array.from({ length: 40 }, (_, i) => 1990 + i);
  return years.map(y => ({ label: y.toString(), value: y.toString() }));
});

const monthOptions = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
].map((m, i) => ({ label: m, value: (i + 1).toString() }))

watch([filterType, filterYear, filterMonth], () => {
  const query: any = {}
  if (filterType.value !== 'all') query.type = filterType.value
  if (filterYear.value !== 'all') query.year = filterYear.value
  if (filterMonth.value !== 'all') query.month = filterMonth.value
  fetchPrograms(query)
})

watch(filterYear, (newVal) => {
  if (newVal === 'all') filterMonth.value = 'all'
})

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
    year: program.year || new Date(program.date || Date.now()).getFullYear(),
    month: program.month || (new Date(program.date || Date.now()).getMonth() + 1),
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
    showToast({ title: 'Success', message: editingId.value ? 'Program updated' : 'Program created', toastType: 'success', duration: 3000 })
  } catch (err) {
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
    await deleteProgram(deleteId.value)
    await fetchPrograms()
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

useHead({ title: 'Programs Management | PANAFSTRAG' })
definePageMeta({ middleware: 'auth' })
</script>

<template>
  <div class="space-y-12">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Operational Sector</p>
        <h1 class="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-black">
          Programs <span class="not-italic text-gray-400 leading-none">Management</span>
        </h1>
      </div>
      <button @click="openCreate" class="px-10 py-5 bg-black text-white font-black text-[10px] tracking-[0.3em] uppercase hover:bg-gray-800 active:scale-95 transition-all shadow-xl shadow-black/10">
        NEW PROGRAM
      </button>
    </div>

    <!-- Filter Toolbar -->
    <div class="flex flex-col md:flex-row items-center gap-6 bg-white p-4 border border-gray-100 shadow-sm">
      <div class="flex p-1 bg-gray-50 rounded-xl">
        <button
          v-for="f in ['all', 'upcoming', 'past']" :key="f"
          @click="filterType = f"
          class="px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
          :class="filterType === f ? 'bg-black text-white' : 'text-gray-400 hover:text-black'"
        >
          {{ f }}
        </button>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-40">
          <CustomDropdown v-model="filterYear" :options="[{ label: 'ALL YEARS', value: 'all' }, ...yearOptions]" placeholder="FILTER YEAR" />
        </div>
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-x-4" enter-to-class="opacity-100 translate-x-0">
          <div v-if="filterYear !== 'all'" class="w-40">
            <CustomDropdown v-model="filterMonth" :options="[{ label: 'ALL MONTHS', value: 'all' }, ...monthOptions]" placeholder="FILTER MONTH" />
          </div>
        </Transition>
      </div>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-24 flex justify-center"><LoadingState /></div>
    <div v-else-if="!(programs as any[])?.length">
      <EmptyState title="NO DATA" message="The institutional calendar sector is currently unpopulated." />
    </div>

    <!-- Table -->
    <div v-else class="bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Initiative</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Classification</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Lifecycle</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Timeline</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="program in (programs as any[])" :key="program._id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gray-100 overflow-hidden border border-gray-100 grayscale hover:grayscale-0 transition-all duration-500">
                    <img v-if="program.imageUrl" :src="program.imageUrl" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-300 uppercase">NO_IMG</div>
                  </div>
                  <div class="max-w-xs">
                    <p class="font-black text-black uppercase tracking-tight line-clamp-1 group-hover:text-black transition-colors">{{ program.title }}</p>
                    <p class="text-[9px] font-black text-gray-400 uppercase italic line-clamp-1">{{ program.theme }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="px-3 py-1 border border-black text-black text-[9px] font-black uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-colors">{{ program.type }}</span>
              </td>
              <td class="px-8 py-6">
                <span class="px-2 py-0.5 border text-[8px] font-black uppercase tracking-widest" :class="program.status === 'completed' ? 'border-gray-900 text-gray-900' : 'border-gray-200 text-gray-400 italic'">{{ program.status }}</span>
              </td>
              <td class="px-8 py-6">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-black transition-colors">{{ new Date(program.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() }}</p>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button @click="openEdit(program)" class="p-2 hover:bg-black hover:text-white border border-transparent hover:border-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button @click="handleDelete(program._id)" class="p-2 text-gray-300 hover:text-black hover:bg-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Modal :show="showModal" :title="editingId ? 'EDIT INITIATIVE' : 'NEW INITIATIVE'" @close="showModal = false">
      <!-- Tab Switcher -->
      <div class="flex p-1 bg-gray-50 rounded-xl mb-8">
        <button @click="activeTab = 'edit'" class="flex-1 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all" :class="activeTab === 'edit' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'">
          EDITOR
        </button>
        <button @click="activeTab = 'preview'" class="flex-1 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all" :class="activeTab === 'preview' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'">
          PREVIEW
        </button>
      </div>

      <!-- EDIT TAB -->
      <div v-show="activeTab === 'edit'" class="space-y-12 py-4">
        <!-- Identification -->
        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Identification</h3>
          <div class="grid md:grid-cols-2 gap-10">
            <div class="space-y-6">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Program Title</label>
                <input v-model="form.title" type="text" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Strategic Theme</label>
                <input v-model="form.theme" type="text" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm italic" />
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Classification</label>
                  <select v-model="form.type" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase">
                    <option value="upcoming">UPCOMING</option>
                    <option value="past">PAST RECORD</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Lifecycle Status</label>
                  <select v-model="form.status" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase">
                    <option value="pending">PENDING</option>
                    <option value="completed">COMPLETED</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Visual Identifier</label>
              <MediaUpload v-model="form.imageUrl" folder="programs" />
            </div>
          </div>
        </section>

        <!-- Banner Images -->
        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Banner Images</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="(img, idx) in form.bannerImages" :key="idx" class="relative group aspect-video bg-gray-100 overflow-hidden border border-gray-100">
              <img :src="img" class="w-full h-full object-cover" />
              <button @click="form.bannerImages.splice(idx, 1)" class="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div class="aspect-video border-2 border-dashed border-gray-200 flex items-center justify-center">
              <MediaUpload :model-value="''" @update:model-value="(v: string) => { if(v) form.bannerImages.push(v) }" folder="banners" />
            </div>
          </div>
        </section>

        <!-- Location & Timeline -->
        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Location & Timeline</h3>
          <div class="grid md:grid-cols-4 gap-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Location / Venue</label>
              <input v-model="form.location" type="text" placeholder="e.g. Virtual / Abuja, Nigeria" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Commencement</label>
              <input v-model="form.startDate" type="text" placeholder="e.g. MON JAN 01" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Termination</label>
              <input v-model="form.endDate" type="text" placeholder="e.g. WED JAN 03" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Index Date</label>
              <input v-model="form.date" type="date" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase" />
            </div>
          </div>
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Year of Record</label>
              <select v-model="form.year" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase">
                <option v-for="y in Array.from({length: 40}, (_, i) => 1990 + i)" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Month of Record</label>
              <select v-model="form.month" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase">
                <option v-for="m in 12" :key="m" :value="m">{{ new Date(0, m-1).toLocaleString('default', { month: 'long' }).toUpperCase() }}</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Virtual Event (Meet/Zoom/Video) -->
        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Virtual Event Links</h3>
          <div class="grid md:grid-cols-3 gap-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Video URL (YouTube)</label>
              <input v-model="form.uploadedVideoUrl" type="url" placeholder="https://youtube.com/..." class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Zoom Meeting</label>
              <input v-model="form.zoomMeetingUrl" type="url" placeholder="https://zoom.us/..." class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Google Meet</label>
              <input v-model="form.googleMeetUrl" type="url" placeholder="https://meet.google.com/..." class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
          </div>
        </section>

        <!-- Program Content (Rich Text) -->
        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Program Content</h3>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Brief Description</label>
            <textarea v-model="form.description" rows="3" placeholder="Short summary of the program..." class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed rounded-lg"></textarea>
          </div>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Detailed Content (Rich Text)</label>
            <RichTextEditor v-model="form.content" placeholder="Write the full program details, objectives, and information..." />
          </div>
        </section>

        <!-- Speakers -->
        <section class="space-y-6">
          <div class="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Speakers & Panelists</h3>
            <button @click="addSpeaker" class="px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">+ ADD SPEAKER</button>
          </div>
          <div v-if="!form.speakers.length" class="py-8 text-center bg-gray-50 rounded-lg">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">No speakers added yet</p>
          </div>
          <div v-for="(speaker, idx) in form.speakers" :key="idx" class="bg-gray-50 p-6 rounded-lg space-y-4 relative group">
            <button @click="removeSpeaker(idx)" class="absolute top-4 right-4 p-1.5 text-gray-300 hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div class="grid md:grid-cols-3 gap-6">
              <div class="md:col-span-2 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Name</label>
                    <input v-model="speaker.name" type="text" placeholder="Dr. Jane Doe" class="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black outline-none text-sm font-bold" />
                  </div>
                  <div>
                    <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Role / Title</label>
                    <input v-model="speaker.role" type="text" placeholder="Keynote Speaker" class="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black outline-none text-sm font-bold" />
                  </div>
                </div>
                <div>
                  <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Bio</label>
                  <textarea v-model="speaker.bio" rows="2" placeholder="Short bio..." class="w-full p-3 bg-white border border-gray-100 outline-none focus:ring-1 focus:ring-black text-sm rounded-lg"></textarea>
                </div>
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Speaker Photo</label>
                <MediaUpload v-model="speaker.imageUrl" folder="speakers" />
              </div>
            </div>
          </div>
        </section>

        <!-- Agenda -->
        <section class="space-y-6">
          <div class="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Program Agenda</h3>
            <button @click="addAgendaItem" class="px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">+ ADD ITEM</button>
          </div>
          <div v-if="!form.agenda.length" class="py-8 text-center bg-gray-50 rounded-lg">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">No agenda items added yet</p>
          </div>
          <div v-for="(item, idx) in form.agenda" :key="idx" class="flex items-start gap-4 bg-gray-50 p-4 rounded-lg group">
            <div class="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-1">{{ idx + 1 }}</div>
            <div class="flex-1 grid md:grid-cols-3 gap-4">
              <div>
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Time</label>
                <input v-model="item.time" type="text" placeholder="09:00 AM" class="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black outline-none text-sm font-bold" />
              </div>
              <div>
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Title</label>
                <input v-model="item.title" type="text" placeholder="Opening Remarks" class="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black outline-none text-sm font-bold" />
              </div>
              <div>
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Description</label>
                <input v-model="item.description" type="text" placeholder="Brief details..." class="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black outline-none text-sm" />
              </div>
            </div>
            <button @click="removeAgendaItem(idx)" class="p-1.5 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </section>

        <!-- Documents & Links -->
        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Documents & Registration</h3>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Annexed Files</label>
            <div class="flex gap-4 mb-4">
              <input v-model="docInput" @keyup.enter="() => { if(docInput) { form.uploadedDocumentFiles.push(docInput); docInput = '' } }" type="url" placeholder="https://doc-url.pdf" class="flex-1 px-4 py-3 bg-gray-50 border-none text-[10px] font-black tracking-widest uppercase outline-none focus:ring-1 focus:ring-black rounded-lg" />
              <button @click="() => { if(docInput) { form.uploadedDocumentFiles.push(docInput); docInput = '' } }" class="px-6 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-lg">ADD</button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="(doc, index) in form.uploadedDocumentFiles" :key="index" class="pl-4 pr-1 py-1.5 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-black flex items-center gap-3 italic">
                {{ doc?.split('/').pop()?.toUpperCase() || 'DOCUMENT' }}
                <button @click="form.uploadedDocumentFiles.splice(index, 1)" class="p-1 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            </div>
          </div>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Registration Link (Optional)</label>
            <input v-model="form.registerLink" type="url" placeholder="https://portal.access" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
          </div>
        </section>
      </div>

      <!-- PREVIEW TAB -->
      <div v-show="activeTab === 'preview'" class="py-4">
        <div class="border border-gray-200 rounded-xl overflow-hidden bg-white">
          <!-- Preview Hero -->
          <div class="relative bg-black text-white p-8 md:p-12 overflow-hidden">
            <div v-if="form.bannerImages?.length || form.imageUrl" class="absolute inset-0">
              <img :src="form.bannerImages?.[0] || form.imageUrl" class="w-full h-full object-cover opacity-30" />
              <div class="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black"></div>
            </div>
            <div class="relative z-10 space-y-4">
              <div class="flex gap-2">
                <span class="px-3 py-1 border border-white/20 text-[9px] font-black uppercase tracking-widest">{{ form.type || 'UPCOMING' }}</span>
                <span v-if="form.location" class="px-3 py-1 border border-white/20 text-[9px] font-black uppercase tracking-widest">{{ form.location }}</span>
              </div>
              <h1 class="text-2xl md:text-4xl font-black tracking-tighter uppercase italic leading-tight">{{ form.title || 'Program Title' }}</h1>
              <p v-if="form.theme" class="text-lg italic text-white/60">"{{ form.theme }}"</p>
              <div class="flex gap-6 pt-4 border-t border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                <span v-if="form.startDate">{{ form.startDate }}</span>
                <span v-if="form.endDate">— {{ form.endDate }}</span>
              </div>
            </div>
          </div>

          <!-- Preview Virtual Event Bar -->
          <div v-if="form.zoomMeetingUrl || form.googleMeetUrl || form.uploadedVideoUrl" class="bg-[#2E7D32] text-white p-4 flex flex-wrap items-center justify-center gap-4">
            <span class="text-[9px] font-black uppercase tracking-widest">VIRTUAL EVENT:</span>
            <span v-if="form.zoomMeetingUrl" class="px-4 py-2 bg-white/20 text-[9px] font-black uppercase tracking-widest rounded-lg">📹 ZOOM</span>
            <span v-if="form.googleMeetUrl" class="px-4 py-2 bg-white/20 text-[9px] font-black uppercase tracking-widest rounded-lg">📞 GOOGLE MEET</span>
            <span v-if="form.uploadedVideoUrl" class="px-4 py-2 bg-white/20 text-[9px] font-black uppercase tracking-widest rounded-lg">▶ VIDEO</span>
          </div>

          <!-- Preview Content -->
          <div class="p-8 md:p-12 space-y-12">
            <div v-if="form.description" class="text-gray-600 text-sm leading-relaxed">{{ form.description }}</div>
            <div v-if="form.content" class="prose prose-sm max-w-none rich-preview-content" v-html="form.content"></div>

            <!-- Preview Agenda -->
            <div v-if="form.agenda.length" class="space-y-6">
              <h3 class="text-lg font-black uppercase tracking-tight">PROGRAM AGENDA</h3>
              <div v-for="(item, idx) in form.agenda" :key="idx" class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div class="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">{{ idx + 1 }}</div>
                <div>
                  <p class="text-[10px] font-black text-[#2E7D32] uppercase tracking-widest mb-1">{{ item.time }}</p>
                  <p class="font-bold text-sm">{{ item.title }}</p>
                  <p v-if="item.description" class="text-gray-500 text-xs mt-1">{{ item.description }}</p>
                </div>
              </div>
            </div>

            <!-- Preview Speakers -->
            <div v-if="form.speakers.length" class="space-y-6">
              <h3 class="text-lg font-black uppercase tracking-tight">SPEAKERS & PANELISTS</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div v-for="(speaker, idx) in form.speakers" :key="idx" class="text-center space-y-3 p-4 bg-gray-50 rounded-xl">
                  <div class="w-20 h-20 mx-auto rounded-full bg-gray-200 overflow-hidden">
                    <img v-if="speaker.imageUrl" :src="speaker.imageUrl" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-black">{{ speaker.name?.[0]?.toUpperCase() || '?' }}</div>
                  </div>
                  <div>
                    <p class="font-black text-sm uppercase tracking-tight">{{ speaker.name || 'Speaker Name' }}</p>
                    <p class="text-[9px] font-black text-[#2E7D32] uppercase tracking-widest">{{ speaker.role || 'Role' }}</p>
                    <p v-if="speaker.bio" class="text-gray-500 text-xs mt-2 line-clamp-3">{{ speaker.bio }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #actions>
        <button @click="showModal = false" class="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">ABORT</button>
        <button @click="handleSubmit" :disabled="loading" class="px-12 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-30 transition-all">
          {{ loading ? 'PROCESSING...' : 'AUTHORIZE INITIATIVE' }}
        </button>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal
      :show="showConfirmModal"
      title="DELETE INITIATIVE"
      message="Are you sure you want to remove this initiative from the operational calendar? This operation is permanent."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style>
.rich-preview-content h1 { font-size: 1.75rem; font-weight: 900; margin: 1rem 0 0.5rem; }
.rich-preview-content h2 { font-size: 1.375rem; font-weight: 800; margin: 0.75rem 0 0.5rem; }
.rich-preview-content h3 { font-size: 1.125rem; font-weight: 700; margin: 0.5rem 0 0.25rem; }
.rich-preview-content p { margin: 0.375rem 0; line-height: 1.7; color: #4b5563; }
.rich-preview-content ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
.rich-preview-content ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
.rich-preview-content li { margin: 0.25rem 0; color: #4b5563; }
.rich-preview-content blockquote { border-left: 4px solid #2E7D32; padding: 0.5rem 1rem; margin: 1rem 0; background: #f9fafb; font-style: italic; color: #6b7280; }
.rich-preview-content a { color: #2E7D32; text-decoration: underline; }
.rich-preview-content strong { font-weight: 800; }
.rich-preview-content img { max-width: 100%; border-radius: 0.5rem; margin: 1rem 0; }
</style>
