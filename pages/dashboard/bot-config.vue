<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Chat Assistant</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">
          Set up automatic replies and greetings for the website chat assistant.
        </p>
      </div>
      <button 
        @click="openModal()" 
        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors  active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Reply
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2 p-1 bg-gray-50 rounded-lg border border-gray-200 w-fit">
      <button 
        v-for="filter in ['all', 'greeting', 'page_trigger', 'faq', 'fallback']" 
        :key="filter"
        @click="activeFilter = filter"
        :class="['px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all',
          activeFilter === filter ? 'bg-white text-blue-600  border border-gray-200' : 'text-gray-500 hover:text-gray-900']"
      >
        {{ filter.replace('_', ' ') }}
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-200 rounded-lg  overflow-hidden">
      <div v-if="loading" class="py-32 flex justify-center">
        <LoadingState />
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Type</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Message</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Triggers</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Status</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-if="filteredConfigs.length === 0">
              <td colspan="5" class="py-20 text-center">
                <EmptyState title="No Replies Found" message="You haven't added any automatic replies for this category yet." />
              </td>
            </tr>
            <tr v-for="config in filteredConfigs" :key="config._id" class="hover:bg-gray-50 transition-colors group">
              <td class="px-6 py-6 align-top">
                <div class="space-y-1">
                  <p class="font-bold text-gray-900 text-sm">{{ config.key }}</p>
                  <span class="inline-flex px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold uppercase text-gray-500 border border-gray-200">
                    {{ config.type }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-6 align-top max-w-sm">
                <div class="space-y-3">
                  <p class="text-sm text-gray-600 leading-relaxed italic line-clamp-3">"{{ config.message }}"</p>
                  <div v-if="config.quickReplies?.length" class="flex flex-wrap gap-1.5">
                    <span v-for="qr in config.quickReplies" :key="qr" class="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded border border-blue-100">
                      {{ qr }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-6 align-top">
                <div class="space-y-3">
                  <div v-if="config.type === 'page_trigger'" class="flex items-center gap-2">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Path:</span>
                    <code class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{{ config.pagePath }}</code>
                  </div>
                  <div v-if="config.type === 'faq' && config.keywords?.length" class="space-y-1.5">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter block">Keywords:</span>
                    <div class="flex flex-wrap gap-1.5">
                      <span v-for="kw in config.keywords" :key="kw" class="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded border border-gray-200">
                        {{ kw }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 text-[10px] font-bold text-gray-400">
                    <span>{{ config.delayMs }}ms delay</span>
                    <span class="text-blue-500">Priority {{ config.priority }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-6 align-top text-right">
                <button 
                  @click="toggleStatus(config)"
                  :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors',
                    config.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100']"
                >
                  <div class="w-1.5 h-1.5 rounded-full" :class="config.isActive ? 'bg-emerald-500' : 'bg-gray-400'"></div>
                  {{ config.isActive ? 'Active' : 'Offline' }}
                </button>
              </td>
              <td class="px-6 py-6 align-top text-right text-gray-400">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openModal(config)" class="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(config)" class="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
    <Modal :show="showModal" :title="editMode ? 'Edit Reply' : 'Add New Reply'" @close="showModal = false">
      <div class="space-y-6 p-4">
        <section class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <AnimatedInput v-model="form.key" label="Name / Reference" placeholder="e.g. welcome_message" />
            <SelectInput 
              v-model="form.type" 
              label="Reply Type" 
              :options="[
                { label: 'Greeting', value: 'greeting' },
                { label: 'Page Trigger', value: 'page_trigger' },
                { label: 'FAQ Response', value: 'faq' },
                { label: 'Fallback Message', value: 'fallback' }
              ]" 
            />
          </div>

          <AnimatedInput v-model="form.message" label="Message" type="textarea" placeholder="Enter the text the assistant should say..." />
          
          <div v-if="form.type === 'page_trigger'">
            <AnimatedInput v-model="form.pagePath" label="Page Path" placeholder="e.g. /programs" />
          </div>

          <div v-if="form.type === 'faq'">
            <AnimatedInput v-model="form.keywords" label="Trigger Keywords (comma separated)" placeholder="e.g. help, contact, join" />
          </div>

          <AnimatedInput v-model="form.quickReplies" label="Quick Reply Buttons (comma separated)" placeholder="e.g. Learn More, Get in Touch" />

          <div class="grid md:grid-cols-2 gap-6">
            <AnimatedInput v-model.number="form.delayMs" label="Delay (ms)" type="number" />
            <AnimatedInput v-model.number="form.priority" label="Priority Level" type="number" />
          </div>
        </section>
      </div>

      <template #actions>
        <div class="flex items-center justify-end gap-3 w-full border-t border-gray-100 p-4">
          <button @click="showModal = false" class="px-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-900">Cancel</button>
          <button 
            type="button" 
            @click="saveConfig" 
            class="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors  active:scale-95"
          >
            {{ editMode ? 'Save Changes' : 'Add Reply' }}
          </button>
        </div>
      </template>
    </Modal>

    <!-- Delete Modal -->
    <ConfirmModal 
      :show="showDeleteModal" 
      title="Delete Reply" 
      :message="`Are you sure you want to delete the reply '${selectedConfig?.key}'? This will stop the assistant from using it.`"
      @close="showDeleteModal = false" 
      @confirm="deleteConfig" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCookie } from '#app'

const config = useRuntimeConfig()
const token = useCookie('auth_token')

const configs = ref<any[]>([])
const loading = ref(true)
const activeFilter = ref('all')

const showModal = ref(false)
const showDeleteModal = ref(false)
const editMode = ref(false)
const selectedConfig = ref<any>(null)

const form = ref({
  key: '',
  type: 'faq',
  message: '',
  pagePath: '',
  keywords: '',
  quickReplies: '',
  delayMs: 1000,
  priority: 10,
  isActive: true
})

const filteredConfigs = computed(() => {
  if (activeFilter.value === 'all') return configs.value
  return configs.value.filter(c => c.type === activeFilter.value)
})

const fetchConfigs = async () => {
  loading.value = true
  try {
    const data = await $fetch<any[]>(`${config.public.apiBase}/chat/bot-configs`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    configs.value = data || []
  } catch (err) {
    console.error('Failed to fetch bot configs', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchConfigs()
})

const openModal = (item?: any) => {
  if (item) {
    editMode.value = true
    selectedConfig.value = item
    form.value = {
      ...item,
      keywords: item.keywords?.join(', ') || '',
      quickReplies: item.quickReplies?.join(', ') || ''
    }
  } else {
    editMode.value = false
    selectedConfig.value = null
    form.value = {
      key: '', type: 'faq', message: '', pagePath: '', keywords: '', quickReplies: '', delayMs: 1000, priority: 10, isActive: true
    }
  }
  showModal.value = true
}

const saveConfig = async () => {
  try {
    const payload = {
      ...form.value,
      keywords: form.value.keywords ? form.value.keywords.split(',').map(s => s.trim()).filter(Boolean) : [],
      quickReplies: form.value.quickReplies ? form.value.quickReplies.split(',').map(s => s.trim()).filter(Boolean) : []
    }
    
    if (editMode.value && selectedConfig.value) {
      await $fetch(`${config.public.apiBase}/chat/bot-configs/${selectedConfig.value._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token.value}` },
        body: payload
      })
    } else {
      await $fetch(`${config.public.apiBase}/chat/bot-configs`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: payload
      })
    }
    showModal.value = false
    fetchConfigs()
  } catch (err) {
    console.error('Save failed', err)
  }
}

const toggleStatus = async (item: any) => {
  try {
    await $fetch(`${config.public.apiBase}/chat/bot-configs/${item._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { isActive: !item.isActive }
    })
    item.isActive = !item.isActive
  } catch (err) {}
}

const confirmDelete = (item: any) => {
  selectedConfig.value = item
  showDeleteModal.value = true
}

const deleteConfig = async () => {
  if (!selectedConfig.value) return
  try {
    await $fetch(`${config.public.apiBase}/chat/bot-configs/${selectedConfig.value._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    showDeleteModal.value = false
    fetchConfigs()
  } catch (err) {
    console.error('Delete failed', err)
  }
}

useHead({ title: 'Bot Configurations | Admin' })

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
