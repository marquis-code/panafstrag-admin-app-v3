<script setup lang="ts">
const { login, error: authError, loading: authLoading } = useLogin()
const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  try {
    const res = await login(form)
    if (res) navigateTo('/')
  } catch (err: any) {
    // Error is handled by the composable, but we can add secondary handling if needed
  }
}

useHead({
  title: 'Login | PANAFSTRAG',
})

definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div class="max-w-md mx-auto py-20">
    <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-2xl">
      <div class="text-center mb-10">
        <Logo class="justify-center mb-6" />
        <h1 class="text-3xl font-black tracking-tight">Welcome Back</h1>
        <p class="text-slate-500 text-sm font-bold mt-2">Log in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="name@example.com"
            class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
          />
        </div>
        <div>
          <label class="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
          <input 
            v-model="form.password" 
            type="password" 
            required 
            placeholder="••••••••"
            class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
          />
        </div>

        <div v-if="authError" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl text-center">
          {{ authError }}
        </div>

        <button 
          type="submit" 
          :disabled="authLoading"
          class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
        >
          {{ authLoading ? 'LOGGING IN...' : 'LOG IN' }}
        </button>
      </form>

      <div class="mt-8 text-center">
        <p class="text-slate-500 text-sm font-bold">
          Don't have an account? 
          <NuxtLink to="/register" class="text-indigo-600 hover:underline">Register here</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
