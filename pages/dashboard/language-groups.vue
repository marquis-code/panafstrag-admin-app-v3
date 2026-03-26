<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useFetchLanguageGroups } from '@/composables/modules/languageGroups/useFetchLanguageGroups'
import { useCreateLanguageGroup } from '@/composables/modules/languageGroups/useCreateLanguageGroup'
import { useUpdateLanguageGroup } from '@/composables/modules/languageGroups/useUpdateLanguageGroup'
import { useDeleteLanguageGroup } from '@/composables/modules/languageGroups/useDeleteLanguageGroup'

const { fetchLanguageGroups, languageGroups, loading: fetchLoading } = useFetchLanguageGroups()
const { createLanguageGroup } = useCreateLanguageGroup()
const { updateLanguageGroup } = useUpdateLanguageGroup()
const { deleteLanguageGroup } = useDeleteLanguageGroup()

const showModal = ref(false)
const showConfirmModal = ref(false)
const deleteId = ref<string | null>(null)
const deleteLoading = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  name: '',
  description: '',
  url: '',
  imageUrl: ''
})
const loading = ref(false)

const openCreate = () => {
  editingId.value = null
  Object.assign(form, { name: '', description: '', url: '', imageUrl: '' })
  showModal.value = true
}

const openEdit = (group: any) => {
  editingId.value = group._id
  Object.assign(form, { ...group })
  showModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (editingId.value) {
      await updateLanguageGroup(editingId.value, form)
    } else {
      await createLanguageGroup(form)
    }
    await fetchLanguageGroups()
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
    await deleteLanguageGroup(deleteId.value)
    await fetchLanguageGroups()
    showConfirmModal.value = false
  } finally {
    deleteLoading.value = false
    deleteId.value = null
  }
}

onMounted(() => {
  fetchLanguageGroups()
})

useHead({ title: 'Language Groups | Admin' })
definePageMeta({
  layout: 'dashboard', middleware: 'auth' })
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Language Groups</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">
          Manage and categorize regional language groups for community engagement.
        </p>
      </div>
      <button 
        @click="openCreate" 
        class="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all  flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Create Group
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-32 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(languageGroups as any[])?.length">
      <EmptyState 
        title="No Language Groups Found" 
        message="Get started by creating your first language group." 
        @action="openCreate"
      />
    </div>

    <!-- Table Container -->
    <div v-else class="bg-white border border-gray-200 rounded-lg  overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Group Name</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Description</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="group in (languageGroups as any[])" :key="group._id" class="hover:bg-gray-50 transition-colors group">
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                    <img v-if="group.imageUrl" :src="group.imageUrl" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">LNG</div>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm">{{ group.name }}</p>
                    <p class="text-[10px] text-gray-400 uppercase tracking-wider mt-1">ID: {{ group._id?.slice(-8) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="max-w-md space-y-2">
                  <p class="text-sm text-gray-500 line-clamp-2">{{ group.description || 'No description provided.' }}</p>
                  <a v-if="group.url" :href="group.url" target="_blank" class="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-bold">
                    View Website
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </td>
              <td class="px-6 py-5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openEdit(group)" 
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    @click="handleDelete(group._id)" 
                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

    <!-- Edit/Create Modal -->
    <Modal :show="showModal" :title="editingId ? 'Edit Language Group' : 'Create Language Group'" @close="showModal = false" size="lg">
      <div class="space-y-10 py-8 px-6">
        <!-- Section 1: Basic Info -->
        <section class="space-y-6">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">Basic Information</h3>
          </div>
          
          <div class="grid lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <AnimatedInput 
                v-model="form.name" 
                label="Group Name" 
                
              />
              <AnimatedInput 
                v-model="form.url" 
                label="Website URL" 
                
              />
            </div>
            <div class="space-y-2 text-center">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Cover Image</label>
              <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <MediaUpload v-model="form.imageUrl" folder="language-groups" />
              </div>
            </div>
          </div>
        </section>

        <!-- Section 2: Description -->
        <section class="space-y-6">
          <div class="border-l-4 border-blue-600 pl-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900">Description</h3>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-1 ">
            <AnimatedInput 
              v-model="form.description" 
              label="Brief Overview" 
              type="textarea" 
              :rows="4" 
              
            />
          </div>
        </section>
      </div>

      <template #actions>
        <div class="flex items-center justify-end gap-4 w-full px-8 pb-8">
          <button @click="showModal = false" class="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900">Cancel</button>
          <button 
            type="button" 
            @click="handleSubmit" 
            :disabled="loading" 
            class="px-8 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg  hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <div v-if="loading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span v-if="!loading">{{ editingId ? 'Save Changes' : 'Create Group' }}</span>
          </button>
        </div>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="Delete Language Group" 
      message="Are you sure you want to delete this language group? This action cannot be undone."
      :loading="deleteLoading"
      @close="showConfirmModal = false" 
      @confirm="confirmDelete" 
    />
  </div>
</template>
