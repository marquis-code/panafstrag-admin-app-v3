<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
    <div class="w-full max-w-md">
      <div class="mb-12 flex justify-center">
        <Logo />
      </div>
      <slot />
      <div class="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
        © {{ new Date().getFullYear() }} PANAFSTRAG STRATEGIC HUB.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Minimal layout for login/register
</script>
