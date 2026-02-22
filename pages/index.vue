<script setup lang="ts">
import { ref } from 'vue'
import { useFetchStats } from '@/composables/modules/admin/useFetchStats'
const { fetchStats, stats, loading: pending } = useFetchStats()

useHead({
  title: 'Admin Dashboard | PANAFSTRAG',
})

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="space-y-12">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Sector Overview</p>
        <h1 class="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
          Intelligence<br /><span class="not-italic text-gray-400 leading-none">Dashboard.</span>
        </h1>
      </div>
      <div class="flex items-center gap-3 px-6 py-4 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() }}
      </div>
    </div>

    <div v-if="pending" class="py-24 flex justify-center">
      <LoadingState />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(val, key) in (stats as any)" :key="key" class="bg-white p-10 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-black transition-colors duration-500">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
           </svg>
        </div>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 group-hover:text-black transition-colors">{{ String(key).replace('Count', '') }}</p>
        <p class="text-6xl font-black tracking-tighter">{{ val }}</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white p-12 text-black border border-gray-100 overflow-hidden relative group">
        <div class="relative z-10">
          <h3 class="text-3xl font-black mb-6 tracking-tighter uppercase italic">Institutional <span class="text-gray-400">Framework.</span></h3>
          <p class="text-gray-400 text-sm mb-12 font-medium leading-relaxed max-w-xl uppercase tracking-widest text-[10px]">
            Access and manage the core operational entities of the Panafstrag Strategic Hub. All changes are logged for security and audit purposes.
          </p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <NuxtLink v-for="link in [
              { label: 'Board', to: '/board' },
              { label: 'Cells', to: '/cells' },
              { label: 'Programs', to: '/programs' },
              { label: 'Archives', to: '/archives' }
            ]" :key="link.to" :to="link.to" 
              class="px-4 py-4 border border-black hover:bg-black hover:text-white text-center text-[10px] font-black tracking-widest uppercase transition-all">
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>
        <div class="absolute -right-20 -bottom-20 w-80 h-80 border-[40px] border-black/5 rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
      </div>

      <div class="bg-white p-12 border border-gray-100">
        <h3 class="text-xl font-black mb-8 tracking-tighter uppercase italic border-b border-gray-100 pb-4">Security <span class="text-gray-400">Status.</span></h3>
        <div class="space-y-8">
          <div v-for="stat in [
            { label: 'Database Connection', status: 'Stable' },
            { label: 'API Gateway', status: 'Active' },
            { label: 'Storage Sector', status: 'Nominal' }
          ]" :key="stat.label" class="flex justify-between items-center">
            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">{{ stat.label }}</span>
            <span class="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-50 border border-gray-100">{{ stat.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
