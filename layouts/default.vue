<template>
  <div class="min-h-screen bg-white text-black font-sans flex flex-col lg:flex-row">
    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 p-8 transform transition-transform duration-300 lg:relative lg:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex items-center justify-between mb-16 px-2">
        <Logo />
        <button @click="isSidebarOpen = false" class="lg:hidden p-2 hover:bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="space-y-2">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
          :class="route.path === item.path ? 'bg-black text-white shadow-xl shadow-black/10' : 'hover:bg-gray-50 text-gray-400 hover:text-black'"
          @click="isSidebarOpen = false"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="absolute bottom-12 left-8 right-8">
        <button @click="showLogoutModal = true" class="flex items-center gap-4 px-6 py-4 w-full rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black hover:bg-gray-50 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          LOGOUT
        </button>
      </div>
    </aside>

    <!-- Overlay -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Bar -->
      <header class="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <button @click="isSidebarOpen = true" class="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="flex items-center gap-4">
          <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Panafstrag Administrative Sector</p>
        </div>

        <div class="flex items-center gap-6">
          <div class="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
            <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span class="text-[9px] font-black uppercase tracking-widest">Network Online</span>
          </div>
          <div class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </header>

      <main class="flex-1 p-8 lg:p-12 overflow-y-auto bg-gray-50/50">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>

      <footer class="p-8 border-t border-gray-100 bg-white">
         <div class="max-w-7xl mx-auto flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
            <span>© {{ new Date().getFullYear() }} Hub Security Intelligence</span>
            <div class="flex gap-8">
              <a href="#" class="hover:text-black">Terms</a>
              <a href="#" class="hover:text-black">Privacy</a>
            </div>
         </div>
      </footer>
    </div>

    <!-- Logout Confirmation Modal -->
    <Modal :show="showLogoutModal" title="TERMINATE SESSION" @close="showLogoutModal = false">
      <div class="py-4">
        <p class="text-[11px] font-black uppercase tracking-widest text-gray-400 leading-relaxed">
          You are about to terminate the current administrative session. All unsaved intelligence data may be lost. Do you wish to proceed with the logout protocol?
        </p>
      </div>
      <template #actions>
        <button @click="showLogoutModal = false" class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">ABORT</button>
        <button @click="handleLogout" class="px-10 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">TERMINATE SESSION</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { useUser } from "@/composables/modules/auth/user";
const { logOut } = useUser();
const isSidebarOpen = ref(false)
const showLogoutModal = ref(false)
const route = useRoute()

const handleLogout = () => {
  showLogoutModal.value = false
  logOut()
}

const navItems = [
  { 
    label: 'Dashboard', 
    path: '/', 
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' })
      ])
    })
  },
  { 
    label: 'Board', 
    path: '/board',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
      ])
    })
  },
  { 
    label: 'Cells', 
    path: '/cells',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' })
      ])
    })
  },
  { 
    label: 'Programs', 
    path: '/programs',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z' })
      ])
    })
  },
  { 
    label: 'Archives', 
    path: '/archives',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4v3H3V7z' })
      ])
    })
  },
  { 
    label: 'Objectives', 
    path: '/objectives',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
      ])
    })
  },
  { 
    label: 'Responsibilities', 
    path: '/responsibilities',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })
      ])
    })
  },
  { 
    label: 'Organogram', 
    path: '/organogram',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' }),
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' })
      ])
    })
  },
  { 
    label: 'Focus Areas', 
    path: '/focus-areas',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 10V3L4 14h7v7l9-11h-7z' })
      ])
    })
  },
  { 
    label: 'Language Groups', 
    path: '/language-groups',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129' })
      ])
    })
  }
]
</script>
