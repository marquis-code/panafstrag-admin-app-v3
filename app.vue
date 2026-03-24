<template>
  <div>
    <UiToast class="z-[9999999]" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>

<script setup lang="ts">
// Global app configuration
useHead({
  title: 'PANAFSTRAG Admin | Content Management System',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
    }
  ]
})

useSeoMeta({
  title: 'PANAFSTRAG Admin — Simple & Clean Management',
  ogTitle: 'PANAFSTRAG Admin Panel',
  description: 'Manage PANAFSTRAG website content, programs, and hubs efficiently.',
  ogDescription: 'Administrative dashboard for PANAFSTRAG content management.',
  ogImage: '/images/og-image.jpg',
  ogUrl: 'https://admin.panafstrag.org',
  twitterTitle: 'PANAFSTRAG Admin Panel',
  twitterDescription: 'Manage PANAFSTRAG website content efficiently.',
  twitterImage: '/images/og-image.jpg',
  twitterCard: 'summary_large_image'
})
</script>
