<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">
          Summary of website activity and content.
        </p>
      </div>
      <div class="flex items-center gap-4 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
        <div class="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="text-sm font-bold text-gray-700">
          {{ new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }}
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="py-32 flex justify-center">
      <LoadingState />
    </div>

    <!-- Stats Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(val, key) in (stats as any)" :key="key" class="bg-white p-6 rounded-lg border border-gray-200 transition-all hover:border-blue-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            {{ String(key).replace('Count', '').replace(/([A-Z])/g, ' $1').trim() }}
          </p>
          <p class="text-3xl font-extrabold text-gray-900 tracking-tight tabular-nums">{{ val }}</p>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Quick Actions -->
      <div class="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 space-y-6">
        <div>
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Quick Actions</h3>
          <p class="text-gray-500 text-xs mt-1 font-medium">
            Quickly access common management features.
          </p>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <NuxtLink v-for="link in [
            { label: 'Programs', to: '/dashboard/programs', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12' },
            { label: 'Language', to: '/dashboard/language-groups', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2 2v-6a2 2 0 012-2' },
            { label: 'Activity', to: '/dashboard/audit-trail', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Bot Settings', to: '/dashboard/bot-config', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
          ]" :key="link.to" :to="link.to"
            class="flex flex-col items-center gap-3 p-5 rounded-lg bg-gray-50 border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all group"
          >
            <div class="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="link.icon" />
              </svg>
            </div>
            <span class="text-[10px] font-bold text-gray-600 uppercase tracking-wider text-center">{{ link.label }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- System Status -->
      <div class="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">System Status</h3>
          <div class="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span class="text-[9px] font-bold uppercase tracking-wider">Active</span>
          </div>
        </div>

        <div class="space-y-5">
          <div v-for="indicator in [
            { label: 'Database', status: 'Healthy', color: 'bg-emerald-500', val: 100 },
            { label: 'API Server', status: 'Running', color: 'bg-blue-600', val: 100 },
            { label: 'Storage', status: 'Connected', color: 'bg-indigo-500', val: 100 }
          ]" :key="indicator.label" class="space-y-1.5">
            <div class="flex justify-between items-end">
              <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">{{ indicator.label }}</span>
              <span class="text-[10px] font-bold text-gray-600">{{ indicator.status }}</span>
            </div>
            <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div :class="['h-full rounded-full', indicator.color]" :style="{ width: indicator.val + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-50 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last updated: 2 mins ago</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetchStats } from '@/composables/modules/admin/useFetchStats'
const { fetchStats, stats, loading: pending } = useFetchStats()

useHead({
  title: 'Dashboard | PANAFSTRAG',
})

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
