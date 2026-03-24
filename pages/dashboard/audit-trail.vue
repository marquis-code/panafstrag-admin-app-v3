<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Activity Log</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">
          Track website activity, page visits, and user interactions.
        </p>
      </div>
      <button 
        @click="fetchData" 
        class="p-3 bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 rounded-lg transition-all  active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" :class="{'animate-spin': loading}">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(stat, key) in statConfig" :key="key" class="bg-white p-6 rounded-lg border border-gray-200  transition-all">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white" :class="stat.iconBg">
            <component :is="stat.icon" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wider text-gray-400">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900 tabular-nums">
              <span v-if="loading" class="inline-block w-8 h-6 bg-gray-100 animate-pulse rounded"></span>
              <template v-else>{{ stat.value }}</template>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Activity List -->
      <div class="lg:col-span-2 bg-white rounded-lg  border border-gray-200 flex flex-col h-[700px] overflow-hidden">
        <div class="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h3 class="text-sm font-bold text-gray-700">Recent Activity</h3>
          <div class="relative">
            <select v-model="filterEvent" @change="fetchData" class="appearance-none text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 outline-none focus:border-blue-500 transition-all cursor-pointer">
              <option value="">All Events</option>
              <option value="page_visit">Page Visits</option>
              <option value="chat_message">Messages</option>
              <option value="bot_reply">Bot Replies</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div v-if="loading && activities.length === 0" class="flex flex-col items-center justify-center h-full text-gray-300">
            <div class="w-10 h-10 border-2 border-gray-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p class="text-xs font-bold uppercase tracking-widest">Loading activity...</p>
          </div>

          <div v-else-if="!activities.length" class="flex flex-col items-center justify-center h-full text-gray-300">
            <p class="text-xs font-bold uppercase tracking-widest">No activity found</p>
          </div>

          <div v-for="(act, index) in activities" :key="act._id" class="relative pl-8 pb-6 border-l border-gray-100 last:border-0 last:pb-0">
            <!-- Timeline Dot -->
            <div :class="['absolute left-[-5px] top-1 w-2 h-2 rounded-full', getEventColor(act.event)]"></div>

            <div class="bg-gray-50 rounded-lg p-4 transition-colors hover:bg-gray-100 border border-transparent hover:border-gray-200">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <span class="text-xs font-bold text-gray-900">{{ formatEvent(act.event) }}</span>
                  <p class="text-xs text-gray-400 mt-0.5">{{ act.guestName || 'Guest User' }}</p>
                </div>
                <span class="text-[10px] text-gray-400 font-medium">{{ formatDate(act.createdAt) }}</span>
              </div>

              <div class="space-y-2">
                <div v-if="act.page" class="flex items-center gap-2">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Page:</span>
                  <code class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{{ act.page }}</code>
                </div>
                
                <div v-if="act.metadata?.contentPreview" class="bg-white p-3 rounded-lg border border-gray-100">
                  <p class="text-xs text-gray-500 italic">"{{ act.metadata.contentPreview }}..."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Insights -->
      <div class="space-y-8">
        <!-- Most Visited Pages -->
        <div class="bg-white rounded-lg  border border-gray-200 overflow-hidden">
          <div class="p-6 border-b border-gray-200 bg-gray-50">
            <h3 class="text-sm font-bold text-gray-700">Top Pages</h3>
          </div>
          <div class="p-4 space-y-1">
            <div v-for="page in stats.topPages" :key="page._id" class="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-all">
              <span class="text-xs font-bold text-gray-500 truncate max-w-[150px]">{{ page._id || '/' }}</span>
              <span class="text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">{{ page.count }} Views</span>
            </div>
          </div>
        </div>

        <!-- Active Sessions -->
        <div class="bg-white rounded-lg  border border-gray-200 overflow-hidden">
          <div class="p-6 border-b border-gray-200 bg-gray-50">
            <h3 class="text-sm font-bold text-gray-700">Recent Sessions</h3>
          </div>
          <div class="p-4 space-y-3">
            <div v-for="session in stats.recentSessions?.slice(0, 5)" :key="session._id" class="p-4 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-white transition-all">
              <div class="mb-3">
                <p class="text-xs font-bold text-gray-900 truncate">{{ session.guestName || 'Guest User' }}</p>
                <p class="text-[10px] text-gray-400 truncate">{{ session.guestEmail || 'No email' }}</p>
              </div>
              <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                <span class="text-[10px] font-bold text-gray-400 uppercase">{{ session.events }} Events</span>
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
import { ref, onMounted, computed, markRaw } from 'vue'
import { useCookie } from '#app'

// Icons (using simple functional components with SVGs)
const IconUsers = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
}
const IconCalendar = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`
}
const IconEye = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>`
}
const IconActivity = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`
}
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

const statConfig = computed(() => [
  { 
    label: 'Total Visitors', 
    value: stats.value.totalVisitors || 0, 
    bg: 'bg-blue-400', 
    iconBg: 'bg-blue-500 -blue-200', 
    icon: markRaw(IconUsers) 
  },
  { 
    label: "Today's Engagement", 
    value: stats.value.todayVisitors || 0, 
    bg: 'bg-emerald-400', 
    iconBg: 'bg-emerald-500 -emerald-200', 
    icon: markRaw(IconCalendar) 
  },
  { 
    label: 'Aggregate Views', 
    value: stats.value.totalPageViews || 0, 
    bg: 'bg-indigo-400', 
    iconBg: 'bg-indigo-500 -indigo-200', 
    icon: markRaw(IconEye) 
  },
  { 
    label: 'Live Sequences', 
    value: stats.value.recentSessions?.length || 0, 
    bg: 'bg-amber-400', 
    iconBg: 'bg-amber-500 -amber-200', 
    icon: markRaw(IconActivity) 
  }
])

onMounted(() => {
  fetchData()
})

const getEventColor = (event: string) => {
  const colors: any = {
    'page_visit': 'bg-blue-500',
    'chat_message': 'bg-emerald-500',
    'bot_reply': 'bg-indigo-500',
    'form_submit': 'bg-amber-500',
    'session_start': 'bg-slate-900'
  }
  return colors[event] || 'bg-slate-400'
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

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>
