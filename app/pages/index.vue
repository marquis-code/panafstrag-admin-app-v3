<script setup lang="ts">
const { fetchStats, stats, loading: pending } = useFetchStats()
await fetchStats()

useHead({
  title: 'Admin Dashboard | PANAFSTRAG',
})

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="space-y-12">
    <div class="animate-fade-in-up">
      <h1 class="text-4xl lg:text-5xl font-black mb-2 tracking-tighter uppercase italic">Admin <span class="not-italic text-gray-400">Dashboard.</span></h1>
      <p class="text-gray-500 font-medium uppercase tracking-[0.2em] text-[10px]">Strategic Content Management System</p>
    </div>

    <div v-if="pending">
      <LoadingState />
    </div>

    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-8">
      <div v-for="(val, key) in (stats as any)" :key="key" class="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm animate-fade-in-up">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{{ key.replace('Count', '') }}</p>
        <p class="text-4xl font-black text-black dark:text-white tracking-tighter">{{ val }}</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <div class="bg-black p-10 rounded-[2.5rem] text-white overflow-hidden relative group animate-fade-in-up delay-100">
        <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
        <h3 class="text-2xl font-black mb-4 tracking-tighter uppercase italic">Content <span class="text-gray-400">Hub.</span></h3>
        <p class="text-white/60 text-sm mb-8 font-medium leading-relaxed">Update the institutional knowledge base including Board members, Programs, and Research Archives.</p>
        <div class="grid grid-cols-2 gap-4">
          <NuxtLink to="/board" class="px-5 py-3 bg-white text-black rounded-xl text-center text-[10px] font-black tracking-widest uppercase hover:bg-gray-200 transition-colors">BOARD</NuxtLink>
          <NuxtLink to="/programs" class="px-5 py-3 bg-white text-black rounded-xl text-center text-[10px] font-black tracking-widest uppercase hover:bg-gray-200 transition-colors">PROGRAMS</NuxtLink>
        </div>
      </div>

       <div class="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm animate-fade-in-up delay-200">
        <h3 class="text-2xl font-black mb-6 tracking-tighter uppercase italic">Institutional <span class="text-gray-400">Pulse.</span></h3>
        <div class="space-y-6">
          <div v-for="i in 3" :key="i" class="flex items-center gap-4">
            <div class="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse"></div>
            <div>
              <p class="text-sm font-black uppercase tracking-tight">System Status: Nominal</p>
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ i * 15 }} minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
