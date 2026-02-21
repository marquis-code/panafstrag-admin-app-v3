<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <nav class="container mx-auto px-4 h-20 flex items-center justify-between">
        <NuxtLink to="/" class="hover:opacity-90 transition-opacity">
          <Logo />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-10">
          <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" 
            class="text-[10px] font-black uppercase tracking-[0.3em] hover:text-gray-400 transition-colors"
            active-class="text-black dark:text-white border-b-2 border-black dark:border-white pb-1">
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="lg:hidden p-2 text-black dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="isMobileMenuOpen" class="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-8 shadow-2xl">
          <div class="flex flex-col gap-6">
            <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" 
              class="text-sm font-black uppercase tracking-[0.3em] hover:text-gray-400 transition-colors"
              @click="isMobileMenuOpen = false">
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-20">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-16">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center gap-10">
          <Logo />
          <p class="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
            © {{ new Date().getFullYear() }} PANAFSTRAG STRATEGIC HUB.
          </p>
          <div class="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em]">
            <a href="#" class="text-slate-400 hover:text-black dark:hover:text-white transition-colors">TWITTER</a>
            <a href="#" class="text-slate-400 hover:text-black dark:hover:text-white transition-colors">LINKEDIN</a>
          </div>
        </div>
      </div>
    </footer>
    <!-- Chat Widget -->
    <ChatWidget />
  </div>
</template>

<script setup>
const isMobileMenuOpen = ref(false)

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Board', path: '/board' },
  { label: 'Cells', path: '/cells' },
  { label: 'Programs', path: '/programs' },
  { label: 'Archives', path: '/archives' }
]
</script>
