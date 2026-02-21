<script setup lang="ts">
const { register, loading: registerLoading, error: registerError } = useRegister()
const form = reactive({
  name: '',
  email: '',
  password: ''
})

const handleRegister = async () => {
  try {
    const res = await register(form)
    if (res) navigateTo('/login')
  } catch (err: any) {
    // Error is handled inside the composable via toast and ref
  }
}

useHead({
  title: 'Register | PANAFSTRAG',
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
        <h1 class="text-3xl font-black tracking-tight">Create Account</h1>
        <p class="text-slate-500 text-sm font-bold mt-2">Join the Panafstrag network</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            required 
            placeholder="John Doe"
            class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
          />
        </div>
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

        <div v-if="registerError" class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl text-center">
          {{ registerError }}
        </div>

        <button 
          type="submit" 
          :disabled="registerLoading"
          class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
        >
          {{ registerLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT' }}
        </button>
      </form>

      <div class="mt-8 text-center">
        <p class="text-slate-500 text-sm font-bold">
          Already have an account? 
          <NuxtLink to="/login" class="text-indigo-600 hover:underline">Log in here</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
