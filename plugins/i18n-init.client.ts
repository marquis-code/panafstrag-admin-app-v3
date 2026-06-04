import { defineNuxtPlugin } from '#app'
import { useI18n } from '@/composables/useI18n'

export default defineNuxtPlugin((nuxtApp) => {
  const { initLocale } = useI18n()
  
  // We call this immediately on app start to fetch geolocation in the background
  // We DO NOT await it, so it doesn't block the initial loader or page rendering
  initLocale().catch(console.error)
})
