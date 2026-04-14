<script setup lang="ts">
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useFetchPrograms } from '@/composables/modules/programs/useFetchPrograms'
import { useCreateProgram } from '@/composables/modules/programs/useCreateProgram'
import { useUpdateProgram } from '@/composables/modules/programs/useUpdateProgram'
import { useDeleteProgram } from '@/composables/modules/programs/useDeleteProgram'
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Pencil, 
  Eye, 
  Layout, 
  Calendar, 
  MapPin, 
  Users, 
  Video, 
  Link as LinkIcon, 
  FileText,
  Save,
  X,
  PlusCircle,
  Hash,
  Share2
} from 'lucide-vue-next'

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
  agenda: [] as { time: string; title: string; description: string }[],
  sectionOrder: ['documents', 'description', 'speakers', 'video', 'agenda', 'gallery']
})

const draggedIndex = ref<number | null>(null)

const handleDragStart = (index: number) => {
  draggedIndex.value = index
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = (index: number) => {
  if (draggedIndex.value === null) return
  const item = form.sectionOrder.splice(draggedIndex.value, 1)[0]
  form.sectionOrder.splice(index, 0, item)
  draggedIndex.value = null
}

const draggedSpeakerIndex = ref<number | null>(null)

const handleSpeakerDragStart = (index: number) => {
  draggedSpeakerIndex.value = index
}

const handleSpeakerDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleSpeakerDrop = (index: number) => {
  if (draggedSpeakerIndex.value === null) return
  const item = form.speakers.splice(draggedSpeakerIndex.value, 1)[0]
  form.speakers.splice(index, 0, item)
  draggedSpeakerIndex.value = null
}

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
  bannerImages: [], speakers: [], agenda: [],
  sectionOrder: ['documents', 'description', 'speakers', 'video', 'agenda', 'gallery']
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
    sectionOrder: program.sectionOrder?.length ? [...program.sectionOrder] : ['documents', 'description', 'speakers', 'video', 'agenda', 'gallery'],
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
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">programs</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">manage programs and events.</p>
      </div>
      <button 
        @click="openCreate" 
        class="px-6 py-3 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
      >
        <Plus :size="18" />
        new program
      </button>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-gray-100">
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="f in ['all', 'upcoming', 'past']" :key="f"
          @click="filterType = f"
          :class="['px-6 py-2.5 text-xs font-semibold rounded-xl transition-all',
            filterType === f ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50']"
        >
          {{ f === 'all' ? 'all programs' : f }}
        </button>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <SelectInput 
          v-model="filterYear" 
          label="filter by year" 
          :options="[{ label: 'all years', value: 'all' }, ...yearOptions]" 
        />
        <SelectInput 
          v-model="filterMonth" 
          label="filter by month" 
          :options="[{ label: 'all months', value: 'all' }, ...monthOptions]" 
          :disabled="filterYear === 'all'"
        />
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div v-if="fetchLoading" class="py-32 flex justify-center">
        <LoadingState />
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-bold text-gray-500">name</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 text-center">status</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 text-center">visibility</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 text-center">date</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 text-right">actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="!(programs as any[])?.length">
              <td colspan="5" class="py-24">
                <EmptyState title="no programs found" message="try adjusting your filters or create a new program." />
              </td>
            </tr>
            <tr v-for="program in (programs as any[])" :key="program._id" class="hover:bg-gray-50 transition-colors group">
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                    <img v-if="program.imageUrl" :src="program.imageUrl" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">img</div>
                  </div>
                  <div class="max-w-md">
                    <p class="text-sm font-bold text-gray-900 line-clamp-1">{{ program.title }}</p>
                    <p class="text-xs text-gray-500 line-clamp-1">{{ program.theme || 'no theme' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5 text-center text-xs font-bold text-gray-600">
                {{ program.type }}
              </td>
              <td class="px-6 py-5 text-center">
                <div 
                  :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border',
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
                  <button @click="openEdit(program)" class="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="edit">
                    <Pencil :size="18" />
                  </button>
                  <button @click="deleteId = program._id; showConfirmModal = true" class="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="delete">
                    <Trash2 :size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Program Form Modal -->
    <Modal :show="showModal" :title="editingId ? 'edit program' : 'create new program'" @close="showModal = false" size="fullscreen">
      <!-- Tabs -->
      <div class="flex p-1 bg-gray-100 rounded-xl mb-10 max-w-xs mx-auto">
        <button 
          @click="activeTab = 'edit'" 
          :class="['flex-1 py-2 text-xs font-semibold rounded-lg transition-all',
            activeTab === 'edit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
        >
          edit details
        </button>
        <button 
          @click="activeTab = 'preview'" 
          :class="['flex-1 py-2 text-xs font-semibold rounded-lg transition-all',
            activeTab === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
        >
          preview
        </button>
      </div>

      <!-- EDITOR -->
      <div v-show="activeTab === 'edit'" class="max-w-6xl mx-auto space-y-16 pb-24">
        <!-- Layout & Structure -->
        <section class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
            <div>
              <h3 class="text-sm font-bold text-gray-900">section order</h3>
              <p class="text-xs text-gray-500 mt-0.5">drag and drop to reorder sections on the program page</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div 
              v-for="(section, idx) in form.sectionOrder" 
              :key="section"
              draggable="true"
              @dragstart="handleDragStart(idx)"
              @dragover="handleDragOver"
              @drop="handleDrop(idx)"
              class="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl cursor-move hover:border-blue-500 hover:bg-blue-50/30 transition-all group relative overflow-hidden"
              :class="{ 'opacity-50 border-blue-500 bg-blue-50': draggedIndex === idx }"
            >
              <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical :size="14" class="text-blue-600" />
              </div>
              
              <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors mb-3">
                <Layout v-if="section === 'description'" :size="20" />
                <Users v-else-if="section === 'speakers'" :size="20" />
                <Calendar v-else-if="section === 'agenda'" :size="20" />
                <FileText v-else-if="section === 'documents'" :size="20" />
                <Layout v-else-if="section === 'gallery'" :size="20" />
                <Video v-else-if="section === 'video'" :size="20" />
              </div>
              
              <div class="text-center">
                <p class="text-xs font-bold text-gray-900 capitalize">{{ section.replace(/-/g, ' ') }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Basic Info -->
        <section class="space-y-8">
          <div class="flex items-center gap-3">
            <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
            <h3 class="text-sm font-bold text-gray-900">basic information</h3>
          </div>
          
          <div class="grid lg:grid-cols-3 gap-10">
            <div class="lg:col-span-2 space-y-8">
              <AnimatedInput v-model="form.title" label="program title" />
              <AnimatedInput v-model="form.theme" label="program theme" />
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectInput 
                  v-model="form.type" 
                  label="status" 
                  :options="[{ label: 'upcoming', value: 'upcoming' }, { label: 'past', value: 'past' }]" 
                />
                <SelectInput 
                  v-model="form.status" 
                  label="visibility" 
                  :options="[{ label: 'hidden', value: 'pending' }, { label: 'visible', value: 'completed' }]" 
                />
              </div>
            </div>
            <div class="space-y-3">
              <label class="block text-xs font-semibold text-gray-500">Cover image</label>
              <div class="aspect-[4/3] bg-gray-50 border border-gray-200 rounded-2xl p-2">
                <MediaUpload v-model="form.imageUrl" folder="programs" class="h-full" />
              </div>
            </div>
          </div>
        </section>

        <!-- Schedule & Location -->
        <section class="space-y-8">
          <div class="flex items-center gap-3">
            <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
            <h3 class="text-sm font-bold text-gray-900">Time and location</h3>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             <div class="bg-gray-50 p-6 rounded-2xl space-y-6 border border-gray-100">
               <MapPin :size="20" class="text-gray-400" />
               <AnimatedInput v-model="form.location" label="Venue/location" />
             </div>
             <div class="bg-gray-50 p-6 rounded-2xl space-y-6 border border-gray-100">
               <Calendar :size="20" class="text-gray-400" />
               <div class="grid gap-4">
                 <CustomDatePicker v-model="form.startDate" label="Start date" />
                 <CustomDatePicker v-model="form.endDate" label="End date" />
               </div>
             </div>
             <div class="bg-gray-50 p-6 rounded-2xl space-y-6 border border-gray-100">
               <Hash :size="20" class="text-gray-400" />
               <div class="grid gap-4">
                 <SelectInput v-model="form.year" label="Year" :options="yearOptions" />
                 <SelectInput v-model="form.month" label="Month" :options="monthOptions" />
               </div>
             </div>
          </div>
        </section>

        <!-- Linkages -->
        <section class="space-y-8">
          <div class="flex items-center gap-3">
            <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
            <h3 class="text-sm font-bold text-gray-900">Links</h3>
          </div>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="p-6 bg-white border border-gray-200 rounded-2xl space-y-4">
              <Video :size="20" class="text-gray-400" />
              <AnimatedInput v-model="form.uploadedVideoUrl" label="Video link (youtube)" />
            </div>
            <div class="p-6 bg-white border border-gray-200 rounded-2xl space-y-4">
              <LinkIcon :size="20" class="text-gray-400" />
              <div class="space-y-4">
                <AnimatedInput v-model="form.zoomMeetingUrl" label="Zoom link" />
                <AnimatedInput v-model="form.googleMeetUrl" label="Google meet link" />
              </div>
            </div>
            <div class="p-6 bg-white border border-gray-200 rounded-2xl space-y-4">
              <Share2 :size="20" class="text-gray-400" />
              <AnimatedInput v-model="form.registerLink" label="Registration link" />
            </div>
          </div>
        </section>

        <!-- Content Narrative -->
        <section class="space-y-8">
          <div class="flex items-center gap-3">
            <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
            <h3 class="text-sm font-bold text-gray-900">Program description</h3>
          </div>
          <div class="grid lg:grid-cols-3 gap-10">
            <div class="lg:col-span-1">
              <p class="text-sm text-gray-500 leading-relaxed font-medium">provide a short summary and detailed description for this program.</p>
            </div>
            <div class="lg:col-span-2 space-y-8">
              <AnimatedInput v-model="form.description" label="Short summary" type="textarea" :rows="3" />
              <div class="space-y-3">
                <label class="block text-xs font-semibold text-gray-500">Full description</label>
                <div class="bg-gray-50 border border-gray-200 rounded-2xl p-4 focus-within:bg-white focus-within:border-blue-500 transition-all">
                  <RichTextEditor v-model="form.content" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Distinguished Panel & Tactical Agenda -->
        <div class="grid lg:grid-cols-2 gap-16">
          <!-- Speakers -->
          <section class="space-y-8">
            <div class="flex items-center justify-between border-b border-gray-100 pb-6">
              <div class="flex items-center gap-3">
                <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h3 class="text-sm font-bold text-gray-900">speakers</h3>
              </div>
              <button @click="addSpeaker" class="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-black flex items-center gap-2 transition-all">
                <PlusCircle :size="16" />
                add speaker
              </button>
            </div>
            <div class="space-y-4 max-h-[600px] overflow-y-auto px-1 pr-3 custom-scrollbar">
              <div 
                v-for="(speaker, idx) in form.speakers" :key="idx" 
                draggable="true"
                @dragstart="handleSpeakerDragStart(idx)"
                @dragover="handleSpeakerDragOver"
                @drop="handleSpeakerDrop(idx)"
                class="p-8 bg-white border border-gray-200 rounded-3xl relative group hover:border-blue-300 transition-all cursor-move"
                :class="{ 'opacity-50 border-blue-500 bg-blue-50': draggedSpeakerIndex === idx }"
              >
                <div class="absolute top-4 right-4 flex gap-2">
                   <div class="p-2 text-gray-300 group-hover:text-gray-400 transition-colors">
                      <GripVertical :size="18" />
                   </div>
                   <button @click="removeSpeaker(idx)" class="p-2 text-gray-300 hover:text-red-600 transition-colors">
                      <Trash2 :size="18" />
                   </button>
                </div>
                
                <div class="flex flex-col md:flex-row gap-8">
                  <div class="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 shrink-0 overflow-hidden p-1">
                    <MediaUpload v-model="speaker.imageUrl" folder="speakers" class="h-full" />
                  </div>
                  <div class="flex-1 space-y-6">
                    <div class="grid md:grid-cols-2 gap-4">
                      <AnimatedInput v-model="speaker.name" label="Name" />
                      <AnimatedInput v-model="speaker.role" label="Role" />
                    </div>
                    <AnimatedInput v-model="speaker.bio" label="Biography" type="textarea" :rows="2" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Agenda -->
          <section class="space-y-8">
            <div class="flex items-center justify-between border-b border-gray-100 pb-6">
              <div class="flex items-center gap-3">
                <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h3 class="text-sm font-bold text-gray-900">agenda</h3>
              </div>
              <button @click="addAgendaItem" class="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-black flex items-center gap-2 transition-all">
                <PlusCircle :size="16" />
                add agenda item
              </button>
            </div>
            <div class="space-y-4 max-h-[600px] overflow-y-auto px-1 pr-3 custom-scrollbar">
              <div v-for="(item, idx) in form.agenda" :key="idx" class="p-8 bg-gray-50 border border-gray-200 rounded-3xl relative group hover:bg-white transition-all">
                <button @click="removeAgendaItem(idx)" class="absolute top-4 right-4 text-gray-300 hover:text-red-600 transition-colors">
                  <Trash2 :size="18" />
                </button>
                <div class="space-y-6">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-gray-900 text-white flex items-center justify-center rounded-xl font-bold text-xs">{{ idx + 1 }}</div>
                    <div class="flex-1">
                       <AnimatedInput v-model="item.time" label="Time" />
                    </div>
                  </div>
                  <AnimatedInput v-model="item.title" label="session title" />
                  <AnimatedInput v-model="item.description" label="short description" type="textarea" :rows="2" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Intelligence Repository & Banners -->
        <div class="grid lg:grid-cols-2 gap-16">
           <!-- Gallery -->
           <section class="space-y-8">
              <div class="flex items-center gap-3 border-b border-gray-100 pb-6">
                <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h3 class="text-sm font-bold text-gray-900">program gallery</h3>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="(img, idx) in form.bannerImages" :key="idx" class="relative group aspect-video rounded-2xl overflow-hidden border border-gray-100">
                   <img :src="img" class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                   <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button @click="form.bannerImages.splice(idx, 1)" class="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all">
                        <Trash2 :size="18" />
                     </button>
                   </div>
                </div>
                <div class="aspect-video border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer relative overflow-hidden p-6 text-center group">
                   <MediaUpload :model-value="''" @update:model-value="(v: string) => { if(v) form.bannerImages.push(v) }" folder="banners" class="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                   <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-all mb-2">
                      <Plus :size="24" />
                   </div>
                   <p class="text-[10px] font-bold text-gray-400 group-hover:text-blue-600 transition-all">add image</p>
                </div>
              </div>
           </section>

           <!-- Documents -->
           <section class="space-y-8">
              <div class="flex items-center gap-3 border-b border-gray-100 pb-6">
                <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h3 class="text-sm font-bold text-gray-900">documents</h3>
              </div>
              <div class="grid gap-3">
                 <div v-for="(doc, dIdx) in form.uploadedDocumentFiles" :key="dIdx" class="p-4 bg-gray-50 border border-transparent rounded-2xl hover:bg-white hover:border-gray-200 transition-all group flex items-center justify-between">
                   <div class="flex items-center gap-4">
                      <div class="w-10 h-10 bg-white text-gray-900 rounded-xl flex items-center justify-center">
                        <FileText :size="20" />
                      </div>
                      <div>
                        <p class="text-xs font-bold text-gray-900 truncate max-w-[200px]">{{ doc.split('/').pop() }}</p>
                        <p class="text-[9px] text-blue-600 font-bold mt-0.5">document verified</p>
                      </div>
                   </div>
                   <button @click="form.uploadedDocumentFiles.splice(dIdx, 1)" class="p-2 text-gray-300 hover:text-red-600 transition-colors">
                      <Trash2 :size="18" />
                   </button>
                 </div>
                 <div class="p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 flex flex-col items-center justify-center relative hover:bg-white hover:border-blue-400 transition-all cursor-pointer text-center group">
                    <DocumentUpload :model-value="''" @update:model-value="(v: string) => { if(v) form.uploadedDocumentFiles.push(v) }" folder="programs/annexes" class="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                    <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-all mb-2">
                        <PlusCircle :size="24" />
                    </div>
                    <p class="text-[10px] font-bold text-gray-400 group-hover:text-blue-600">upload document</p>
                 </div>
              </div>
           </section>
        </div>
      </div>

      <!-- PREVIEW -->
      <div v-show="activeTab === 'preview'" class="max-w-4xl mx-auto pb-24">
         <div class="bg-white border border-gray-200 rounded-3xl overflow-hidden">
            <!-- Hero -->
            <div class="relative h-80 bg-gray-900 flex items-end p-12 overflow-hidden">
               <div v-if="form.imageUrl || form.bannerImages.length" class="absolute inset-0 z-0">
                  <img :src="form.bannerImages[0] || form.imageUrl" class="w-full h-full object-cover opacity-30" />
                  <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
               </div>
               <div class="relative z-10 space-y-4">
                  <div class="flex gap-2">
                    <span class="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg">{{ form.type || 'Program' }}</span>
                    <span v-if="form.location" class="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-lg border border-white/20">{{ form.location }}</span>
                  </div>
                  <h1 class="text-4xl font-bold text-white tracking-tight">{{ form.title || 'Untitled program' }}</h1>
                  <p v-if="form.theme" class="text-lg font-medium text-gray-400">{{ form.theme }}</p>
               </div>
            </div>

            <!-- Quick Info -->
            <div class="grid grid-cols-2 md:grid-cols-4 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500">
               <div class="p-6 text-center border-r border-gray-100">Starts: <div class="text-gray-900 text-sm mt-1 font-semibold">{{ form.startDate || 'tbd' }}</div></div>
               <div class="p-6 text-center border-r border-gray-100">Ends: <div class="text-gray-900 text-sm mt-1 font-semibold">{{ form.endDate || 'tbd' }}</div></div>
               <div class="p-6 text-center border-r border-gray-100">Year: <div class="text-gray-900 text-sm mt-1 font-semibold">{{ form.year }} / {{ form.month }}</div></div>
               <div class="p-6 text-center flex flex-col items-center justify-center gap-1.5">
                  <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                  program preview
               </div>
            </div>

            <!-- Content Sections mapped by sectionOrder -->
            <div class="px-12 py-16 space-y-16 bg-white">
               <template v-for="sectionId in form.sectionOrder" :key="sectionId">
                  
                  <!-- Description -->
                  <div v-if="sectionId === 'description' && form.description" class="text-gray-800 text-xl font-bold border-l-4 border-blue-600 pl-8 py-2 leading-relaxed">
                     {{ form.description }}
                  </div>

                  <!-- Rich Content -->
                  <div v-if="sectionId === 'description' && form.content" class="prose prose-lg prose-gray max-w-none text-gray-600 rich-preview-content font-medium" v-html="form.content"></div>

                  <!-- Agenda -->
                  <div v-if="sectionId === 'agenda' && form.agenda.length" class="space-y-10">
                     <h3 class="text-xs font-bold text-gray-400 text-center">Agenda</h3>
                     <div class="space-y-4 max-w-2xl mx-auto">
                        <div v-for="(item, i) in form.agenda" :key="i" class="flex gap-6 p-8 bg-gray-50 rounded-2xl border border-gray-100">
                           <div class="w-12 h-12 bg-white border border-gray-100 text-gray-900 flex items-center justify-center rounded-xl font-bold text-sm shrink-0">{{ i + 1 }}</div>
                           <div class="space-y-3">
                              <div class="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold inline-block">{{ item.time || '00:00' }}</div>
                              <h4 class="text-lg font-bold text-gray-900">{{ item.title || 'Session title' }}</h4>
                              <p class="text-base text-gray-500 font-medium leading-relaxed">{{ item.description }}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <!-- Speakers -->
                  <div v-if="sectionId === 'speakers' && form.speakers.length" class="space-y-12">
                     <h3 class="text-xs font-bold text-gray-400 text-center">Speakers</h3>
                     <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div v-for="(s, i) in form.speakers" :key="i" class="text-center space-y-4">
                           <div class="w-32 h-32 mx-auto rounded-2xl overflow-hidden border border-gray-100">
                               <img v-if="s.imageUrl" :src="s.imageUrl" class="w-full h-full object-cover" />
                               <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center text-4xl font-bold text-gray-200">?</div>
                           </div>
                           <div>
                              <h5 class="text-lg font-bold text-gray-900">{{ s.name || 'Speaker name' }}</h5>
                              <p class="text-[10px] font-bold text-blue-600 mt-1 uppercase">{{ s.role || 'Designation' }}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <!-- Documents -->
                  <div v-if="sectionId === 'documents' && form.uploadedDocumentFiles.length" class="space-y-8">
                    <h3 class="text-xs font-bold text-gray-400 text-center">Resources</h3>
                    <div class="grid grid-cols-2 gap-4">
                      <div v-for="(doc, dIdx) in form.uploadedDocumentFiles" :key="dIdx" class="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-900 shadow-sm">
                          <FileText :size="18" />
                        </div>
                        <span class="text-xs font-bold text-gray-900 truncate">{{ doc.split('/').pop() }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Gallery -->
                  <div v-if="sectionId === 'gallery' && form.bannerImages.length" class="space-y-8">
                    <h3 class="text-xs font-bold text-gray-400 text-center">Gallery</h3>
                    <div class="grid grid-cols-3 gap-3">
                      <div v-for="(img, gIdx) in form.bannerImages" :key="gIdx" class="aspect-video rounded-xl overflow-hidden">
                        <img :src="img" class="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

               </template>
            </div>
         </div>
      </div>

      <template #actions>
        <div class="flex items-center justify-end gap-6 w-full px-10 py-6 bg-white border-t border-gray-100">
          <button @click="showModal = false" class="px-6 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">abort</button>
          <button 
            type="button" 
            @click="handleSubmit" 
            :disabled="loading" 
            class="px-8 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-3 active:scale-95"
          >
            <div v-if="loading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <Save v-else :size="16" />
            {{ editingId ? 'save changes' : 'create program' }}
          </button>
        </div>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="delete program" 
      message="are you sure you want to delete this program? this action cannot be undone."
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
