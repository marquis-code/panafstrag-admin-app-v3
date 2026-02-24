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
  thumbnailUrl: ''
})
const loading = ref(false)

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
  Object.assign(form, { title: '', description: '', type: 'speech', date: '', year: new Date().getFullYear(), month: '', fileUrl: '', thumbnailUrl: '' })
  showModal.value = true
}

const openEdit = (archive: any) => {
  editingId.value = archive._id
  Object.assign(form, { ...archive, date: archive.date ? new Date(archive.date).toISOString().split('T')[0] : '' })
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
                <div>
                  <p class="font-black text-black uppercase tracking-tight group-hover:text-black transition-colors">{{ item.title }}</p>
                  <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest line-clamp-1 italic">{{ item.description }}</p>
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
          </div>
        </section>

        <section class="space-y-6">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Narrative Profile</h3>
          <div>
             <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Executive Summary</label>
             <textarea v-model="form.description" rows="3" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
          </div>
        </section>

        <section class="space-y-6 pb-8">
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
