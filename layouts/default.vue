<template>
  <div class="h-screen bg-white text-black font-sans flex flex-col lg:flex-row overflow-hidden">
    <!-- Sidebar -->
    <aside 
      v-if="!route.meta.hideSidebar"
      class="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 p-8 transform transition-transform duration-300 lg:relative lg:translate-x-0 overflow-y-auto custom-scrollbar"
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

      <nav class="space-y-2 pb-12">
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
    </aside>

    <!-- Overlay -->
    <div 
      v-if="isSidebarOpen && !route.meta.hideSidebar" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Bar -->
      <header v-if="!route.meta.hideHeader" class="h-20 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-30">
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
          
          <!-- Profile Dropdown -->
          <div class="relative" ref="dropdownRef">
            <button 
              @click="isProfileOpen = !isProfileOpen"
              class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 hover:border-black transition-all overflow-hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0 translate-y-2"
              enter-to-class="transform scale-100 opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform scale-100 opacity-100 translate-y-0"
              leave-to-class="transform scale-95 opacity-0 translate-y-2"
            >
              <div v-if="isProfileOpen" class="absolute right-0 mt-4 w-64 bg-white border border-gray-100 shadow-2xl rounded-2xl py-6 z-50">
                <div class="px-6 pb-6 border-b border-gray-50 mb-4">
                  <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Authenticated Admin</p>
                  <p class="text-xs font-black uppercase tracking-tight truncate">{{ user?.email || 'Administrator' }}</p>
                </div>
                
                <div class="space-y-1">
                  <button @click="isProfileOpen = false" class="w-full flex items-center gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    View Account
                  </button>
                  <button @click="triggerLogout" class="w-full flex items-center gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout Session
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <main :class="['flex-1 overflow-y-auto bg-gray-50/50', route.meta.fullWidth ? '' : 'p-8 lg:p-12']">
        <div :class="[route.meta.fullWidth ? 'w-full h-full' : 'max-w-7xl mx-auto']">
          <slot />
        </div>
      </main>

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
const { logOut, user } = useUser();
const isSidebarOpen = ref(false)
const isProfileOpen = ref(false)
const showLogoutModal = ref(false)
const route = useRoute()
const dropdownRef = ref(null)

const handleLogout = () => {
  showLogoutModal.value = false
  logOut()
}

const triggerLogout = () => {
  isProfileOpen.value = false
  showLogoutModal.value = true
}

// Close dropdown on click outside
if (process.client) {
  window.addEventListener('click', (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
      isProfileOpen.value = false
    }
  })
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
    label: 'Home Content', 
    path: '/home-content',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
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
    label: 'Active Banners', 
    path: '/active-banners',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' })
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
  },
  { 
    label: 'Enquiries', 
    path: '/enquiries',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
      ])
    })
  },
  { 
    label: 'Support Chat', 
    path: '/chat',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' })
      ])
    })
  },
  { 
    label: 'Bot Config', 
    path: '/bot-config',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
      ])
    })
  },
  { 
    label: 'Audit Trail', 
    path: '/audit-trail',
    icon: defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
      ])
    })
  }
]
</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #e5e5e5;
}
</style>
