<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useFetchOrganogram } from '@/composables/modules/organogram/useFetchOrganogram'
import { useCreateOrganogramNode } from '@/composables/modules/organogram/useCreateOrganogramNode'
import { useUpdateOrganogramNode } from '@/composables/modules/organogram/useUpdateOrganogramNode'
import { useDeleteOrganogramNode } from '@/composables/modules/organogram/useDeleteOrganogramNode'

const { fetchOrganogram, organogramNodes, loading: fetchLoading } = useFetchOrganogram()
const { createOrganogramNode } = useCreateOrganogramNode()
const { updateOrganogramNode } = useUpdateOrganogramNode()
const { deleteOrganogramNode } = useDeleteOrganogramNode()

const showModal = ref(false)
const showConfirmModal = ref(false)
const deleteId = ref<string | null>(null)
const deleteLoading = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  title: '',
  description: '',
  level: 1,
  parentId: '',
  order: 0
})
const loading = ref(false)

const openCreate = () => {
  editingId.value = null
  Object.assign(form, { title: '', description: '', level: 1, parentId: '', order: 0 })
  showModal.value = true
}

const openEdit = (node: any) => {
  editingId.value = node._id
  Object.assign(form, { ...node })
  showModal.value = true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (editingId.value) {
      await updateOrganogramNode(editingId.value, form)
    } else {
      await createOrganogramNode(form)
    }
    await fetchOrganogram()
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
    await deleteOrganogramNode(deleteId.value)
    await fetchOrganogram()
    showConfirmModal.value = false
  } finally {
    deleteLoading.value = false
    deleteId.value = null
  }
}

useHead({
  title: 'Organogram Management | PANAFSTRAG',
})

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Organogram</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">
          Manage the organizational levels and reporting structure.
        </p>
      </div>
      <button 
        @click="openCreate" 
        class="px-8 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all  flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Node</span>
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-32 flex justify-center">
      <LoadingState />
    </div>

    <div v-else-if="!(organogramNodes as any[])?.length">
      <EmptyState 
        title="No Nodes Found" 
        message="Add your first organizational node to get started." 
      />
    </div>

    <!-- Table -->
    <div v-else class="bg-white border border-gray-200 rounded-lg overflow-hidden ">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Name</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Level</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Order</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="node in (organogramNodes as any[])" :key="node._id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div :style="{ marginLeft: `${(node.level - 1) * 1.5}rem` }" class="flex items-center gap-3">
                  <div class="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <div>
                    <p class="text-sm font-bold text-gray-900">{{ node.title }}</p>
                    <p v-if="node.parentId" class="text-xs text-gray-400">Parent ID: {{ node.parentId }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                  Level {{ node.level }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-500">{{ node.order }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEdit(node)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="handleDelete(node._id)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
    <Modal :show="showModal" :title="editingId ? 'Edit Node' : 'Add New Node'" @close="showModal = false">
      <div class="space-y-6 p-4">
        <AnimatedInput v-model="form.title" label="Name" />
        
        <div class="grid grid-cols-2 gap-4">
          <AnimatedInput v-model.number="form.level" label="Level" type="number" />
          <AnimatedInput v-model.number="form.order" label="Order" type="number" />
        </div>

        <AnimatedInput v-model="form.parentId" label="Parent ID" />
        
        <AnimatedInput v-model="form.description" label="Description" type="textarea" :rows="4" />
      </div>

      <template #actions>
        <div class="flex items-center justify-end gap-3 w-full border-t border-gray-100 p-4">
          <button @click="showModal = false" class="px-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-900">
            Cancel
          </button>
          <button 
            @click="handleSubmit" 
            :disabled="loading" 
            class="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <div v-if="loading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>{{ editingId ? 'Update Node' : 'Add Node' }}</span>
          </button>
        </div>
      </template>
    </Modal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      :show="showConfirmModal" 
      title="Delete Node" 
      message="Are you sure you want to delete this node? This cannot be undone."
      :loading="deleteLoading"
      @close="showConfirmModal = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

