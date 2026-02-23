<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black uppercase tracking-widest">Bot Configuration</h2>
        <p class="text-sm text-gray-500 mt-1">Manage automated chat greetings, FAQ responses, and page triggers.</p>
      </div>
      <button @click="openModal()" class="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all rounded-lg">
        Add Configuration
      </button>
    </div>

    <!-- Stats/Filters (Optional) -->
    <div class="flex gap-4 border-b border-gray-200">
      <button 
        v-for="filter in ['all', 'greeting', 'page_trigger', 'faq', 'fallback']" 
        :key="filter"
        @click="activeFilter = filter"
        :class="['px-4 py-3 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 transition-all',
          activeFilter === filter ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black']"
      >
        {{ filter.replace('_', ' ') }}
      </button>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-12 flex justify-center">
        <div class="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
      
      <table v-else class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50/50">
            <th class="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Key / Type</th>
            <th class="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Message</th>
            <th class="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Triggers</th>
            <th class="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
            <th class="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredConfigs.length === 0">
            <td colspan="5" class="py-8 px-6 text-center text-sm text-gray-500 italic">No configurations found.</td>
          </tr>
          <tr v-for="config in filteredConfigs" :key="config._id" class="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td class="py-4 px-6 align-top">
              <p class="font-bold text-sm">{{ config.key }}</p>
              <span class="inline-block mt-1 px-2 py-0.5 bg-gray-100 rounded text-[9px] font-bold uppercase tracking-wider text-gray-500">
                {{ config.type }}
              </span>
            </td>
            <td class="py-4 px-6 align-top max-w-xs">
              <p class="text-sm text-gray-700 line-clamp-3">{{ config.message }}</p>
              <div v-if="config.quickReplies?.length" class="mt-2 flex flex-wrap gap-1">
                <span v-for="qr in config.quickReplies" :key="qr" class="px-1.5 py-0.5 bg-[#d9fdd3] text-[#075e54] text-[9px] font-semibold rounded-sm">
                  {{ qr }}
                </span>
              </div>
            </td>
            <td class="py-4 px-6 align-top text-sm text-gray-600">
              <div v-if="config.type === 'page_trigger'">
                <span class="font-semibold">Path:</span> {{ config.pagePath }}
              </div>
              <div v-if="config.type === 'faq' && config.keywords?.length">
                <span class="font-semibold">Keywords:</span> {{ config.keywords.join(', ') }}
              </div>
              <div class="mt-1 text-xs text-gray-400">Delay: {{ config.delayMs }}ms | Priority: {{ config.priority }}</div>
            </td>
            <td class="py-4 px-6 align-top">
              <button 
                @click="toggleStatus(config)"
                :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors',
                  config.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200']"
              >
                {{ config.isActive ? 'Active' : 'Inactive' }}
              </button>
            </td>
            <td class="py-4 px-6 align-top text-right space-x-2">
              <button @click="openModal(config)" class="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button @click="confirmDelete(config)" class="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Modal -->
    <Modal :show="showModal" :title="editMode ? 'Edit Bot Configuration' : 'New Bot Configuration'" @close="showModal = false">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Key</label>
            <input v-model="form.key" type="text" placeholder="e.g. welcome_msg" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-black focus:bg-white transition-all" />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Type</label>
            <select v-model="form.type" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-black focus:bg-white transition-all">
              <option value="greeting">Greeting (Auto-open)</option>
              <option value="page_trigger">Page Trigger</option>
              <option value="faq">FAQ Response</option>
              <option value="fallback">Fallback Match</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Message</label>
          <textarea v-model="form.message" rows="3" placeholder="Bot response text..." class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-black focus:bg-white transition-all resize-none"></textarea>
        </div>

        <div v-if="form.type === 'page_trigger'">
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Target Page Path</label>
          <input v-model="form.pagePath" type="text" placeholder="e.g. /programs" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-black focus:bg-white transition-all" />
        </div>

        <div v-if="form.type === 'faq'">
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Keywords (comma-separated)</label>
          <input v-model="form.keywords" type="text" placeholder="e.g. about, who are you, panafstrag" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-black focus:bg-white transition-all" />
        </div>

        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Quick Replies (comma-separated)</label>
          <input v-model="form.quickReplies" type="text" placeholder="e.g. Tell me more, Contact Support" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-black focus:bg-white transition-all" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Delay (ms)</label>
            <input v-model.number="form.delayMs" type="number" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-black focus:bg-white transition-all" />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Priority</label>
            <input v-model.number="form.priority" type="number" class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-black focus:bg-white transition-all" />
          </div>
        </div>
      </div>
      <template #actions>
        <button @click="showModal = false" class="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Cancel</button>
        <button @click="saveConfig" class="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all rounded-lg">
          {{ editMode ? 'Save Changes' : 'Create Config' }}
        </button>
      </template>
    </Modal>

    <!-- Delete Modal -->
    <Modal :show="showDeleteModal" title="Confirm Deletion" @close="showDeleteModal = false">
      <div class="py-4">
        <p class="text-sm text-gray-600">Are you sure you want to delete the configuration <strong>{{ selectedConfig?.key }}</strong>? This action cannot be undone.</p>
      </div>
      <template #actions>
        <button @click="showDeleteModal = false" class="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Cancel</button>
        <button @click="deleteConfig" class="px-8 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all rounded-lg">Delete</button>
      </template>
    </Modal>
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
</script>
