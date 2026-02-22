<script setup lang="ts">
import { reactive } from 'vue'
import { useRegister } from '@/composables/modules/auth/useRegister'
const { register, loading: registerLoading, error: registerError } = useRegister()
const form = reactive({
  name: '',
  email: '',
  password: ''
})

const handleRegister = async () => {
  try {
    const res = await register(form)
    if (res?._id || res?.email) navigateTo('/login')
  } catch (err: any) {
    // Error is handled by the composable
  }
}

useHead({
  title: 'Register | PANAFSTRAG',
})

definePageMeta({
  layout: 'auth'
})
</script>

<template>
  <div class="max-w-md mx-auto py-20">
    <div class="bg-white border border-gray-100 p-10 shadow-2xl">
      <div class="text-center mb-10">
        <Logo class="justify-center mb-6" />
        <h1 class="text-3xl font-black tracking-tighter uppercase italic">Institutional <span class="not-italic text-gray-400">Registry.</span></h1>
        <p class="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3">New Personnel Entry Protocol</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-8">
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Legal Designation (Name)</label>
          <input 
            v-model="form.name" 
            type="text" 
            required 
            placeholder="JOHN DOE"
            class="w-full px-0 py-4 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all font-bold text-sm uppercase tracking-widest placeholder:text-gray-200"
          />
        </div>
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Master Identity (Email)</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="AUTHORITY@PANAFSTRAG.ORG"
            class="w-full px-0 py-4 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all font-bold text-sm uppercase tracking-widest placeholder:text-gray-200"
          />
        </div>
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Access Protocol (Password)</label>
          <input 
            v-model="form.password" 
            type="password" 
            required 
            placeholder="••••••••"
            class="w-full px-0 py-4 bg-transparent border-b border-gray-100 focus:border-black outline-none transition-all font-bold text-sm uppercase tracking-widest placeholder:text-gray-200"
          />
        </div>

        <div v-if="registerError" class="p-4 border border-black text-black text-[10px] font-black uppercase tracking-widest text-center">
          {{ registerError }}
        </div>

        <button 
          type="submit" 
          :disabled="registerLoading"
          class="w-full py-6 bg-black text-white font-black text-[10px] tracking-[0.3em] uppercase hover:bg-gray-800 active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-30"
        >
          {{ registerLoading ? 'INITIALIZING...' : 'AUTHORIZE REGISTRY' }}
        </button>
      </form>

      <div class="mt-12 text-center">
        <p class="text-gray-400 text-[9px] font-black uppercase tracking-widest">
          Existing institutional record? 
          <NuxtLink to="/login" class="text-black underline underline-offset-4 hover:tracking-widest transition-all">Login Protocol</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
