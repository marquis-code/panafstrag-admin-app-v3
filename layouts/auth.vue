<template>
  <div class="min-h-screen bg-white flex font-sans overflow-hidden selection:bg-blue-100">
    <!-- Left Side: Strategic Branding & Visual -->
    <div class="hidden lg:flex lg:w-1/2 bg-blue-900 relative items-center justify-center overflow-hidden">
      <div class="relative z-10 max-w-xl px-16 text-center space-y-12">
        <div class="flex justify-center flex-col items-center gap-6">
          <div class="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
             <Logo class="h-10 w-auto brightness-0 invert" />
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-center gap-2">
               <div class="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
               <p class="text-[10px] font-bold uppercase tracking-widest text-blue-200">Admin Management Portal</p>
            </div>
            <h1 class="text-4xl font-black text-white tracking-tight leading-tight">
              PANAFSTRAG <span class="text-blue-300">Admin</span>
            </h1>
          </div>
        </div>

        <p class="text-lg text-blue-100/80 font-medium leading-relaxed max-w-md mx-auto">
          Access the administrative dashboard to manage content, programs, and research hubs.
        </p>

        <div class="flex items-center justify-center gap-4 pt-4">
          <div class="px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2.5">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span class="text-[10px] font-bold text-white uppercase tracking-wider">Secure Access</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side: Login Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-16 bg-white relative">
      <div class="lg:hidden absolute top-12 left-1/2 -translate-x-1/2">
        <Logo />
      </div>

      <div class="max-w-md w-full mx-auto relative z-10">
        <slot />

        <!-- Footer -->
        <div class="mt-20 pt-10 border-t border-gray-100 text-center lg:text-left space-y-6">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">
            &copy; {{ new Date().getFullYear() }} Pan-African Strategic and Policy Group. <br>
            Authorized Personnel Only.
          </p>
          <div class="flex justify-center lg:justify-start gap-6">
            <template v-for="link in [
              { label: 'Security', href: '#' },
              { label: 'Privacy', href: '#' },
              { label: 'Support', href: '#' }
            ]" :key="link.label">
              <a :href="link.href" class="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                {{ link.label }}
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Institutional auth layout with dual-panel strategic design
</script>
