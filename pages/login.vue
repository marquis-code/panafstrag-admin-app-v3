<template>
  <div class="space-y-8 py-4">
    <div class="space-y-2 text-center lg:text-left">
      <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ t('Welcome Back') }}</h2>
      <p class="text-gray-500 font-medium text-sm leading-relaxed max-w-sm">
        {{ t('Please enter your email and password to access the admin panel.') }}
      </p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div class="space-y-4">
        <AnimatedInput 
          v-model="form.email"
          label="Email Address"
          type="email"
         
          :error-message="authError || ''"
          :show-error="!!authError"
        />

        <AnimatedInput 
          v-model="form.password"
          label="Password"
          type="password"
         
        />
      </div>

      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox"  class="custom-checkbox"/>
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">{{ t('Remember me') }}</span>
        </label>
        
        <NuxtLink to="/forgot-password" class="text-xs font-bold text-blue-600 uppercase tracking-wider hover:text-blue-700 transition-colors">
          {{ t('Forgot password?') }}
        </NuxtLink>
      </div>

      <button 
        type="submit" 
        :disabled="authLoading"
        class="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-sm  tracking-wider shadow-sm hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <div v-if="authLoading" class="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <template v-else>
          <span>{{ t('Login') }}</span>
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
        <span class="bg-white px-4 text-gray-300 font-black">Authorized Access Only</span>
      </div>
    </div>

    <p class="text-center text-sm font-medium text-gray-500">
      Don't have an account? <NuxtLink to="/register" class="text-blue-600 font-bold hover:text-blue-700 transition-colors ml-1">Register here</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
import { reactive } from 'vue'
import { useLogin } from '@/composables/modules/auth/useLogin'

const { login, error: authError, loading: authLoading } = useLogin()
const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  try {
    const res = await login(form)
    if (res?.accessToken || res?._id) navigateTo('/dashboard')
  } catch (err: any) {
    // Error is handled by the composable
  }
}

useHead({
  title: 'Login | PANAFSTRAG',
})

definePageMeta({
  layout: 'auth'
})
</script>
