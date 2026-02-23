<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-black uppercase tracking-widest">Audit Trail</h2>
        <p class="text-sm text-gray-500 mt-1">Track user flow, page visits, and chat interactions.</p>
      </div>
      <button @click="fetchData" class="p-3 bg-white text-gray-600 hover:text-black border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" :class="{'animate-spin': loading}">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl"></div>
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Visitors</p>
        <p class="text-3xl font-light">{{ stats.totalVisitors || 0 }}</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full blur-2xl"></div>
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Today's Visitors</p>
        <p class="text-3xl font-light">{{ stats.todayVisitors || 0 }}</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full blur-2xl"></div>
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Page Views</p>
        <p class="text-3xl font-light">{{ stats.totalPageViews || 0 }}</p>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-yellow-50 rounded-full blur-2xl"></div>
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Active Sessions</p>
        <p class="text-3xl font-light">{{ stats.recentSessions?.length || 0 }}</p>
      </div>
    </div>

    <!-- Logs and Top Pages -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Activity Log -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
        <div class="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 class="text-sm font-black uppercase tracking-widest">Recent Activity Streams</h3>
          <select v-model="filterEvent" @change="fetchData" class="text-xs border-gray-200 rounded-lg px-2 py-1 outline-none">
            <option value="">All Events</option>
            <option value="page_visit">Page Visits</option>
            <option value="chat_message">Chat Messages</option>
            <option value="bot_reply">Bot Replies</option>
          </select>
        </div>
        <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          <div v-if="loading && activities.length === 0" class="text-center py-8">
            <div class="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin mx-auto"></div>
          </div>
          <div v-for="act in activities" :key="act._id" class="flex gap-4">
            <div class="mt-1 flex flex-col items-center">
              <div :class="['w-2 h-2 rounded-full ring-4', getEventColor(act.event)]"></div>
              <div class="w-px h-full bg-gray-100 mt-2"></div>
            </div>
            <div class="flex-1 pb-4">
              <div class="flex justify-between items-start mb-1">
                <div>
                  <span class="text-sm font-bold text-gray-900">{{ formatEvent(act.event) }}</span>
                  <span class="text-xs text-gray-500 ml-2">{{ act.guestName || 'Anonymous User' }}</span>
                </div>
                <span class="text-[10px] text-gray-400 font-medium">{{ formatDate(act.createdAt) }}</span>
              </div>
              <p v-if="act.page" class="text-sm text-gray-600">Visited: <span class="font-mono text-xs bg-gray-50 px-1 py-0.5 rounded">{{ act.page }}</span></p>
              <p v-if="act.metadata?.contentPreview" class="text-sm text-gray-600 italic">"{{ act.metadata.contentPreview }}..."</p>
              <p class="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Session ID: {{ act.sessionId.substring(0, 8) }}...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Pages & Sessions Sidebar -->
      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-50">
            <h3 class="text-sm font-black uppercase tracking-widest">Top Visited Pages</h3>
          </div>
          <div class="p-4 space-y-2">
            <div v-for="page in stats.topPages" :key="page._id" class="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
              <span class="text-sm font-mono text-gray-600 truncate mr-4">{{ page._id || '/' }}</span>
              <span class="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{{ page.count }} views</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-6 border-b border-gray-50">
            <h3 class="text-sm font-black uppercase tracking-widest">Recent Sessions</h3>
          </div>
          <div class="p-4 space-y-3">
            <div v-for="session in stats.recentSessions?.slice(0, 5)" :key="session._id" class="p-3 border border-gray-100 rounded-xl bg-gray-50/50">
              <p class="text-sm font-bold">{{ session.guestName || 'Anonymous' }}</p>
              <p class="text-[10px] text-gray-500">{{ session.guestEmail || 'No Email' }}</p>
              <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">{{ session.events }} events</span>
                <span class="text-[10px] text-gray-400">{{ timeAgo(session.lastActivity) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCookie } from '#app'

const config = useRuntimeConfig()
const token = useCookie('auth_token')

const activities = ref<any[]>([])
const stats = ref<any>({})
const loading = ref(false)
const filterEvent = ref('')

const fetchData = async () => {
  loading.value = true
  try {
    const [actRes, statsRes] = await Promise.all([
      $fetch<any>(`${config.public.apiBase}/chat/activities`, {
        headers: { Authorization: `Bearer ${token.value}` },
        query: { limit: 50, event: filterEvent.value || undefined }
      }),
      $fetch<any>(`${config.public.apiBase}/chat/activity-stats`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
    ])
    activities.value = actRes.activities || []
    stats.value = statsRes || {}
  } catch (err) {
    console.error('Failed to fetch audit trail data', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const getEventColor = (event: string) => {
  const colors: any = {
    'page_visit': 'bg-blue-500 ring-blue-100',
    'chat_message': 'bg-green-500 ring-green-100',
    'bot_reply': 'bg-purple-500 ring-purple-100',
    'form_submit': 'bg-yellow-500 ring-yellow-100',
    'session_start': 'bg-gray-800 ring-gray-100'
  }
  return colors[event] || 'bg-gray-400 ring-gray-50'
}

const formatEvent = (event: string) => {
  return event.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const timeAgo = (dateStr: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds/3600)}h ago`
  return `${Math.floor(seconds/86400)}d ago`
}

useHead({ title: 'Audit Trail | Admin' })
</script>
