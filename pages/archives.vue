<script setup lang="ts">
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
  agenda: [] as { time: string; title: string; description: string }[]
})
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
    title: '', description: '', type: 'speech', date: '', year: new Date().getFullYear(), month: '', fileUrl: '', thumbnailUrl: '',
    theme: '', content: '', startDate: '', endDate: '', imageUrl: '', uploadedDocumentFiles: [], uploadedVideoUrl: '',
    zoomMeetingUrl: '', googleMeetUrl: '', location: '', status: 'pending', registerLink: '', bannerImages: [], speakers: [], agenda: []
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
    uploadedDocumentFiles: archive.uploadedDocumentFiles || []
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
  middleware: 'auth'
})
</script>

<template>
  <div class="space-y-12">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Intellectual Property</p>
        <h1 class="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-black">
          Archives <span class="not-italic text-gray-400 leading-none">Management</span>
        </h1>
      </div>
      <button @click="openCreate" class="px-10 py-5 bg-black text-white font-black text-[10px] tracking-[0.3em] uppercase hover:bg-gray-800 active:scale-95 transition-all shadow-xl shadow-black/10">
        ADD RESOURCE
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-24 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(archives as any[])?.length">
      <EmptyState title="REPO EMPTY" message="The library sector contains no indexed materials." />
    </div>

    <!-- Responsive Table -->
    <div v-else class="bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Resource Narrative</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Classification</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Month</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Year</th>
              <th class="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in (archives as any[])" :key="item._id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div v-if="item.type === 'programme'" class="w-12 h-12 bg-gray-100 overflow-hidden border border-gray-100 grayscale hover:grayscale-0 transition-all duration-500">
                    <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-300 uppercase">NO_IMG</div>
                  </div>
                  <div>
                    <p class="font-black text-black uppercase tracking-tight group-hover:text-black transition-colors">{{ item.title }}</p>
                    <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest line-clamp-1 italic">{{ item.description }}</p>
                  </div>
                </div>
              </td>
               <td class="px-8 py-6">
                <span class="px-3 py-1 border border-black text-black text-[9px] font-black uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-colors">
                  {{ item.type }}
                </span>
              </td>
              <td class="px-8 py-6 font-black text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">{{ formatedMonth(item.month) }}</td>
              <td class="px-8 py-6 font-black text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">{{ item.year }}</td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-3">
                   <button @click="openEdit(item)" class="p-2 hover:bg-black hover:text-white border border-transparent hover:border-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(item._id)" class="p-2 text-gray-300 hover:text-black hover:bg-white transition-all">
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
    <Modal :show="showModal" :title="editingId ? 'EDIT RESOURCE LOG' : 'NEW RESIDENTIAL ENTRY'" @close="showModal = false">
      <div class="space-y-12 py-4">
        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Resource Identity</h3>
          <div class="space-y-6">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Primary Title</label>
              <input v-model="form.title" type="text" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm uppercase tracking-widest" />
            </div>
            <div class="grid grid-cols-3 gap-6">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Classification</label>
                <select v-model="form.type" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase">
                  <option value="speech">SPEECH</option>
                  <option value="report">ANNUAL REPORT</option>
                  <option value="publication">PUBLICATION</option>
                  <option value="media">MEDIA</option>
                  <option value="research">RESEARCH PAPER</option>
                  <option value="programme">ARCHIVED PROGRAMME</option>
                </select>
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Fiscal Year</label>
                <input v-model.number="form.year" type="number" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none font-bold text-sm uppercase tracking-widest" />
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Month</label>
                <select v-model.number="form.month" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase">
                  <option value="">SELECT MONTH</option>
                  <option v-for="(m, i) in months" :key="i" :value="i + 1">{{ m }}</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Index Date</label>
              <input v-model="form.date" type="date" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase" />
            </div>
          </div>
        </section>

        <!-- Programme Specific Sections -->
        <template v-if="form.type === 'programme'">
          <!-- Identification -->
          <section class="space-y-6">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Programme Identification</h3>
            <div class="grid md:grid-cols-2 gap-10">
              <div class="space-y-6">
                <div>
                  <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Strategic Theme</label>
                  <input v-model="form.theme" type="text" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm italic" />
                </div>
                <div>
                  <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Lifecycle Status</label>
                  <select v-model="form.status" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase">
                    <option value="pending">PENDING</option>
                    <option value="completed">COMPLETED</option>
                  </select>
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
            <div class="grid md:grid-cols-3 gap-8">
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
            </div>
          </section>

          <!-- Virtual Event Links -->
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

          <!-- Program Content -->
          <section class="space-y-6">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Programme Content</h3>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Detailed Content (Rich Text)</label>
              <RichTextEditor v-model="form.content" placeholder="Write the full program details..." />
            </div>
          </section>

          <!-- Speakers -->
          <section class="space-y-6">
            <div class="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Speakers & Panelists</h3>
              <button @click="addSpeaker" class="px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">+ ADD SPEAKER</button>
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
              <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Programme Agenda</h3>
              <button @click="addAgendaItem" class="px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">+ ADD ITEM</button>
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

          <!-- Documents & Registration -->
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
        </template>

        <section v-else class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Narrative Profile</h3>
          <div>
             <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Executive Summary</label>
             <textarea v-model="form.description" rows="3" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
          </div>
        </section>

        <section v-if="form.type !== 'programme'" class="space-y-6 pb-8">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">File Repository</h3>
          <div class="grid md:grid-cols-2 gap-10">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Master Document URL</label>
              <input v-model="form.fileUrl" type="url" placeholder="HTTPS://DOC-VAULT.NET/..." class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm uppercase tracking-tighter" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Identification Thumbnail</label>
              <MediaUpload v-model="form.thumbnailUrl" folder="archives" />
            </div>
          </div>
        </section>
      </div>

      <template #actions>
        <button @click="showModal = false" class="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">ABORT</button>
        <button @click="handleSubmit" :disabled="loading" class="px-12 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-30 transition-all">
          {{ loading ? 'INDEXING...' : 'AUTHORIZE ARCHIVE' }}
        </button>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="DELETE ARCHIVE ITEM" 
      message="Are you sure you want to remove this resource from the library? This operation is permanent."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
