<template>
  <div class="h-[100dvh] bg-gray-50 text-gray-900 font-sans flex flex-col lg:flex-row overflow-hidden">
    <!-- Sidebar -->
    <aside 
      v-if="!route.meta.hideSidebar"
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:relative lg:translate-x-0 overflow-y-auto custom-scrollbar-hidden"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Branding -->
      <div class="flex items-center justify-between h-20 px-6 border-b border-gray-100 bg-white">
        <div class="flex items-center gap-3 cursor-pointer" @click="navigateTo('/dashboard')">
          <Logo />
        </div>
        <button @click="isSidebarOpen = false" class="lg:hidden p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-1">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group"
          :class="isRouteActive(item.path) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          @click="isSidebarOpen = false"
        >
          <div class="h-4 w-4 shrink-0 flex items-center justify-center" :class="isRouteActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'">
            <component :is="item.icon" />
          </div>
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Footer Info -->
      <div class="mt-auto p-6 border-t border-gray-100">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
          v2.4.1 • Secure
        </p>
      </div>
    </aside>

    <!-- Mobile Overlay -->
    <div 
      v-if="isSidebarOpen && !route.meta.hideSidebar" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-gray-900/40 z-40 lg:hidden backdrop-blur-sm"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 relative">
      <!-- Top Bar -->
      <header v-if="!route.meta.hideHeader" class="h-20 border-b border-gray-100 flex items-center justify-between px-6 sm:px-10 bg-white sticky top-0 z-30">
        <div class="flex items-center gap-4">
          <button @click="isSidebarOpen = true" class="lg:hidden p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-0.5">{{ currentRouteName }}</h2>
            <div class="flex items-center gap-1.5">
               <div class="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
               <span class="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Active</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <LanguageSwitcher />
          
          <!-- Profile Dropdown -->
          <div class="relative">
            <button 
              @click="isProfileOpen = !isProfileOpen"
              class="flex items-center gap-2.5 p-1 rounded-lg hover:bg-gray-50 transition-all group"
            >
              <div class="h-8 w-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-bold text-[10px] group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                {{ userInitials }}
              </div>
              <div class="hidden sm:flex flex-col items-start">
                <span class="text-xs font-bold text-gray-900 leading-none">{{ user?.firstName || 'Admin' }}</span>
                <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Administrator</span>
              </div>
            </button>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0 translate-y-1"
              enter-to-class="transform scale-100 opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform scale-100 opacity-100 translate-y-0"
              leave-to-class="transform scale-95 opacity-0 translate-y-1"
            >
              <div v-if="isProfileOpen" class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg py-1.5 z-50 overflow-hidden">
                <div class="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <p class="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Account</p>
                  <p class="text-xs font-bold text-gray-900 truncate">{{ user?.email }}</p>
                </div>
                
                <div class="p-1">
                  <button @click="triggerLogout" class="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all text-left uppercase tracking-wider">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto bg-white custom-scrollbar relative p-6">
        <div class="container mx-auto">
          <slot />
        </div>
      </main>
    </div>

    <!-- Logout Confirmation Modal -->
    <Modal :show="showLogoutModal" title="Confirm Logout" @close="showLogoutModal = false">
      <div class="py-10 text-center">
        <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
        </div>
        <h3 class="text-base font-black text-gray-900 mb-2 uppercase tracking-tight">Are you sure?</h3>
        <p class="text-xs text-gray-500 font-medium max-w-[240px] mx-auto leading-relaxed">
          You will need to login again to access the admin panel.
        </p>
      </div>
      <template #actions>
        <div class="flex gap-4 justify-center w-full pb-8">
          <button @click="showLogoutModal = false" class="px-6 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">Cancel</button>
          <button @click="handleLogout" class="px-8 py-2.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all uppercase tracking-widest">Yes, Logout</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { useUser } from "@/composables/modules/auth/user";
import { markRaw, defineComponent, h, ref, computed } from 'vue'

const { logOut, user } = useUser();
const isSidebarOpen = ref(false)
const isProfileOpen = ref(false)
const showLogoutModal = ref(false)
const route = useRoute()

const isRouteActive = (path) => {
  if (path === '/dashboard') return route.path === '/dashboard' || route.path === '/dashboard/'
  return route.path.startsWith(path)
}

const userInitials = computed(() => {
  if (!user.value) return 'AD'
  const first = user.value.firstName?.charAt(0) || ''
  const last = user.value.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || 'AD'
})

const triggerLogout = () => {
  isProfileOpen.value = false
  showLogoutModal.value = true
}

const handleLogout = () => {
  logOut()
  navigateTo('/login')
}

const currentRouteName = computed(() => {
  const activeItem = navItems.find(item => isRouteActive(item.path))
  return activeItem ? activeItem.label : 'Dashboard'
})

const navItems = [
  { 
    label: 'Overview', 
    path: '/dashboard', 
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' })
      ])
    }))
  },
  { 
    label: 'Home Slides', 
    path: '/dashboard/home-content',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
      ])
    }))
  },
  { 
    label: 'Team Members', 
    path: '/dashboard/board',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
      ])
    }))
  },
  { 
    label: 'Research Hubs', 
    path: '/dashboard/cells',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2 2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' })
      ])
    }))
  },
  { 
    label: 'Programs', 
    path: '/dashboard/programs',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z' })
      ])
    }))
  },
  { 
    label: 'Banners', 
    path: '/dashboard/active-banners',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' })
      ])
    }))
  },
  { 
    label: 'Archives', 
    path: '/dashboard/archives',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4v3H3V7z' })
      ])
    }))
  },
  { 
    label: 'Objectives', 
    path: '/dashboard/objectives',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' })
      ])
    }))
  },
  { 
    label: 'Responsibilities', 
    path: '/dashboard/responsibilities',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })
      ])
    }))
  },
  { 
    label: 'Structure', 
    path: '/dashboard/organogram',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' }),
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' })
      ])
    }))
  },
  { 
    label: 'Focus Areas', 
    path: '/dashboard/focus-areas',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M13 10V3L4 14h7v7l9-11h-7z' })
      ])
    }))
  },
  { 
    label: 'Language Groups', 
    path: '/dashboard/language-groups',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129' })
      ])
    }))
  },
  { 
    label: 'Enquiries', 
    path: '/dashboard/enquiries',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z' })
      ])
    }))
  },
  { 
    label: 'Live Chat', 
    path: '/dashboard/chat',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' })
      ])
    }))
  },
  { 
    label: 'Bot Settings', 
    path: '/dashboard/bot-config',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })
      ])
    }))
  },
  { 
    label: 'Activity Log', 
    path: '/dashboard/audit-trail',
    icon: markRaw(defineComponent({
      render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-4 h-4', 'stroke-width': '2.5' }, [
        h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
      ])
    }))
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
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
.custom-scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
.custom-scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
