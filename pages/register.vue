<template>
  <div class="space-y-8 py-4">
    <div class="space-y-2 text-center lg:text-left">
      <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
      <p class="text-gray-500 font-medium text-sm leading-relaxed max-w-sm">
        Create an account to start managing the platform.
      </p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-6">
      <div class="space-y-4">
        <AnimatedInput 
          v-model="form.name"
          label="Full Name"
          type="text"
         
        />

        <AnimatedInput 
          v-model="form.email"
          label="Email Address"
          type="email"
         
          :error-message="registerError || ''"
          :show-error="!!registerError"
        />

        <AnimatedInput 
          v-model="form.password"
          label="Password"
          type="password"
         
        />
      </div>

      <div class="flex items-start gap-2">
        <input type="checkbox" required id="terms" class="custom-checkbox" />
        <label for="terms" class="text-xs font-medium text-gray-500 leading-relaxed cursor-pointer">
          I agree to the <a href="#" class="text-blue-600 font-bold hover:underline">Terms of Service</a> and <a href="#" class="text-blue-600 font-bold hover:underline">Privacy Policy</a>.
        </label>
      </div>

      <button 
        type="submit" 
        :disabled="registerLoading"
        class="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-sm  tracking-wider shadow-sm hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
      >
        <div v-if="registerLoading" class="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <template v-else>
          <span>Create Account</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </template>
      </button>
    </form>

    <div class="relative py-4">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-100"></div>
      </div>
      <div class="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
        <span class="bg-white px-4 text-gray-300 font-black">Admin Registration</span>
      </div>
    </div>

    <p class="text-center text-sm font-medium text-gray-500">
      Already have an account? <NuxtLink to="/login" class="text-blue-600 font-bold hover:text-blue-700 transition-colors ml-1">Login here</NuxtLink>
    </p>
  </div>
</template>

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
