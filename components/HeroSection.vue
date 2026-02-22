<template>
  <section class="relative py-20 lg:py-32 overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/50 dark:bg-indigo-900/20 blur-3xl animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/50 dark:bg-purple-900/20 blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <div class="container mx-auto px-4 text-center">
      <div class="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest uppercase bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full">
        Welcome to Panafstrag
      </div>
      <h1 class="text-5xl lg:text-7xl font-black mb-8 leading-tight tracking-tight text-gray-900 dark:text-white">
        Pan-African Strategy and <br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Policy Research</span>
      </h1>
      <p class="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
        We provide deep strategic insights and policy recommendations to foster sustainable development across the African continent through rigorous research and collaborative action.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink to="/programs" class="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-indigo-950/40 transition-all hover:-translate-y-1 active:scale-95">
          Explore Programs
        </NuxtLink>
        <NuxtLink to="/about" class="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:-translate-y-1 active:scale-95">
          Learn More
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
