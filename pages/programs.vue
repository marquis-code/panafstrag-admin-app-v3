<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useFetchPrograms } from '@/composables/modules/programs/useFetchPrograms'
import { useCreateProgram } from '@/composables/modules/programs/useCreateProgram'
import { useUpdateProgram } from '@/composables/modules/programs/useUpdateProgram'
import { useDeleteProgram } from '@/composables/modules/programs/useDeleteProgram'
const { fetchPrograms, programs, loading: fetchLoading } = useFetchPrograms()
const { createProgram } = useCreateProgram()
const { updateProgram } = useUpdateProgram()
const { deleteProgram } = useDeleteProgram()


const showModal = ref(false)
const showConfirmModal = ref(false)
const deleteId = ref<string | null>(null)
const deleteLoading = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  title: '',
  theme: '',
  description: '',
  type: 'upcoming',
  startDate: '',
  endDate: '',
  date: '',
  imageUrl: '',
  uploadedDocumentFiles: [] as string[],
  uploadedVideoUrl: '',
  zoomMeetingUrl: '',
  status: 'pending',
  registerLink: '',
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
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

const openCreate = () => {
  editingId.value = null
  Object.assign(form, { 
    title: '', 
    theme: '',
    description: '', 
    type: 'upcoming', 
    startDate: '',
    endDate: '',
    date: '', 
    imageUrl: '', 
    uploadedDocumentFiles: [],
    uploadedVideoUrl: '',
    zoomMeetingUrl: '',
    status: 'pending',
    registerLink: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  })
  showModal.value = true
}

const openEdit = (program: any) => {
  editingId.value = program._id
  Object.assign(form, { 
    ...program, 
    date: program.date ? new Date(program.date).toISOString().split('T')[0] : '',
    year: program.year || new Date(program.date || Date.now()).getFullYear(),
    month: program.month || (new Date(program.date || Date.now()).getMonth() + 1)
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

useHead({
  title: 'Programs Management | PANAFSTRAG',
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
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Operational Sector</p>
        <h1 class="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-black">
          Programs <span class="not-italic text-gray-400 leading-none">Management.</span>
        </h1>
      </div>
      <button @click="openCreate" class="px-10 py-5 bg-black text-white font-black text-[10px] tracking-[0.3em] uppercase hover:bg-gray-800 active:scale-95 transition-all shadow-xl shadow-black/10">
        NEW PROGRAM
      </button>
    </div>

    <!-- Aggressive Filter Toolbar -->
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
          <CustomDropdown
            v-model="filterYear"
            :options="[{ label: 'ALL YEARS', value: 'all' }, ...yearOptions]"
            placeholder="FILTER YEAR"
          />
        </div>
        
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-x-4"
          enter-to-class="opacity-100 translate-x-0"
        >
          <div v-if="filterYear !== 'all'" class="w-40">
            <CustomDropdown
              v-model="filterMonth"
              :options="[{ label: 'ALL MONTHS', value: 'all' }, ...monthOptions]"
              placeholder="FILTER MONTH"
            />
          </div>
        </Transition>
      </div>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-24 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(programs as any[])?.length">
      <EmptyState title="NO DATA" message="The institutional calendar sector is currently unpopulated." />
    </div>

    <!-- Responsive Table -->
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
                    <div v-else class="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-300 uppercase">
                      NO_IMG
                    </div>
                  </div>
                  <div class="max-w-xs">
                    <p class="font-black text-black uppercase tracking-tight line-clamp-1 group-hover:text-black transition-colors">{{ program.title }}</p>
                    <p class="text-[9px] font-black text-gray-400 uppercase italic line-clamp-1">{{ program.theme }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="px-3 py-1 border border-black text-black text-[9px] font-black uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-colors">
                  {{ program.type }}
                </span>
              </td>
              <td class="px-8 py-6">
                <span class="px-2 py-0.5 border text-[8px] font-black uppercase tracking-widest" :class="program.status === 'completed' ? 'border-gray-900 text-gray-900' : 'border-gray-200 text-gray-400 italic'">
                  {{ program.status }}
                </span>
              </td>
              <td class="px-8 py-6">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-black transition-colors">{{ new Date(program.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() }}</p>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-3">
                   <button @click="openEdit(program)" class="p-2 hover:bg-black hover:text-white border border-transparent hover:border-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(program._id)" class="p-2 text-gray-300 hover:text-black hover:bg-white transition-all">
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
    <Modal :show="showModal" :title="editingId ? 'EDIT INITIATIVE' : 'NEW INITIATIVE'" @close="showModal = false">
      <div class="space-y-12 py-4">
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
                  <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center md:text-left">Classification</label>
                  <select v-model="form.type" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase">
                    <option value="upcoming">UPCOMING</option>
                    <option value="past">PAST RECORD</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center md:text-left">Lifecycle Status</label>
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

        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Operational Timeline</h3>
          <div class="grid md:grid-cols-3 gap-8">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Commencement</label>
                <input v-model="form.startDate" type="text" placeholder="e.g. MON JAN 01" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Termination</label>
                <input v-model="form.endDate" type="text" placeholder="e.g. WED JAN 03" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Index Date (System)</label>
                <input v-model="form.date" type="date" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none text-[10px] font-black tracking-widest uppercase" />
              </div>
          </div>
        </section>

        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Temporal Indexing</h3>
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

        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Digital Sector</h3>
          <div class="grid md:grid-cols-2 gap-8">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Broadcast Stream URL</label>
                <input v-model="form.uploadedVideoUrl" type="url" placeholder="HTTPS://YOUTUBE.COM/..." class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Virtual Hub (Zoom)</label>
                <input v-model="form.zoomMeetingUrl" type="url" placeholder="HTTPS://ZOOM.US/..." class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
          </div>
        </section>

        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Document Repository</h3>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Annexed Intelligence Files</label>
            <div class="flex gap-4 mb-6">
              <input v-model="docInput" @keyup.enter="() => { if(docInput) { form.uploadedDocumentFiles.push(docInput); docInput = '' } }" type="url" placeholder="HTTPS://DOC-ALPHA.PDF" class="flex-1 px-4 py-3 bg-gray-50 border-none text-[10px] font-black tracking-widest uppercase outline-none focus:ring-1 focus:ring-black" />
              <button @click="() => { if(docInput) { form.uploadedDocumentFiles.push(docInput); docInput = '' } }" class="px-8 bg-black text-white text-[9px] font-black uppercase tracking-widest">ANNEX</button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="(doc, index) in form.uploadedDocumentFiles" :key="index" class="pl-4 pr-1 py-1.5 bg-gray-50 border border-gray-100 rounded-sm text-[10px] font-black flex items-center gap-3 italic">
                {{ doc?.split('/').pop()?.toUpperCase() || 'DOCUMENT' }}
                <button @click="form.uploadedDocumentFiles.splice(index, 1)" class="p-1 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Narrative Framework</h3>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Detailed Briefing</label>
            <textarea v-model="form.description" rows="4" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
          </div>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Portal Access Link (Optional)</label>
            <input v-model="form.registerLink" type="url" placeholder="HTTPS://PORTAL.ACCESS" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
          </div>
        </section>
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
