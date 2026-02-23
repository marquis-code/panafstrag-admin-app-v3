<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'

const { homeContent, updateHomeContent, loading: fetchLoading } = useHomeContent()

const form = reactive({
  aboutUsTitle: '',
  aboutUsDescription: '',
  carousels: [] as any[]
})

const loading = ref(false)

watch(homeContent, (val) => {
  if (val) {
    form.aboutUsTitle = val.aboutUsTitle || ''
    form.aboutUsDescription = val.aboutUsDescription || ''
    form.carousels = val.carousels ? JSON.parse(JSON.stringify(val.carousels)) : []
  }
}, { immediate: true })

const addCarouselItem = () => {
  form.carousels.push({
    title: '',
    description: '',
    imgUrl: ''
  })
}

const removeCarouselItem = (index: number) => {
  form.carousels.splice(index, 1)
}

const handleSubmit = async () => {
  loading.value = true
  try {
    await updateHomeContent(form)
    // Show success message? (Admin app might have a toast system, but let's stick to basic for now)
    alert('Home content updated successfully')
  } catch (error) {
    alert('Failed to update home content')
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Home Content Management | PANAFSTRAG',
})

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="space-y-12 pb-20">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Content Sector</p>
        <h1 class="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none text-black">
          Home <span class="not-italic text-gray-400 leading-none">Management.</span>
        </h1>
      </div>
      <button @click="handleSubmit" :disabled="loading" class="px-10 py-5 bg-black text-white font-black text-[10px] tracking-[0.3em] uppercase hover:bg-gray-800 active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-50">
        {{ loading ? 'SAVING...' : 'SAVE CHANGES' }}
      </button>
    </div>

    <div v-if="fetchLoading" class="py-24 flex justify-center">
      <LoadingState />
    </div>

    <div v-else class="space-y-12">
      <!-- About Us Section -->
      <section class="bg-white p-8 md:p-12 border border-gray-100 shadow-sm space-y-8">
        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">About Us Section</h3>
        <div class="space-y-6">
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">About Us Title</label>
            <input v-model="form.aboutUsTitle" type="text" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
          </div>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">About Us Description</label>
            <textarea v-model="form.aboutUsDescription" rows="6" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
          </div>
        </div>
      </section>

      <!-- Hero Carousel Section -->
      <section class="space-y-8">
        <div class="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Hero Carousel Slides</h3>
          <button @click="addCarouselItem" class="text-[9px] font-black uppercase tracking-widest text-black hover:text-gray-400 transition-colors">+ ADD SLIDE</button>
        </div>

        <div v-if="!form.carousels.length" class="py-20 bg-gray-50 border-2 border-dashed border-gray-100 rounded-xl text-center">
           <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">No slides configured. Add one to start.</p>
        </div>

        <div class="grid grid-cols-1 gap-8">
          <div v-for="(slide, index) in form.carousels" :key="index" class="bg-white border border-gray-100 shadow-sm p-8 group relative overflow-hidden">
            <button @click="removeCarouselItem(index)" class="absolute top-4 right-4 p-2 text-gray-300 hover:text-black transition-all z-20">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <div class="grid md:grid-cols-2 gap-10">
              <div class="space-y-6">
                <div>
                  <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Slide Title</label>
                  <input v-model="slide.title" type="text" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
                </div>
                <div>
                  <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Slide Description</label>
                  <textarea v-model="slide.description" rows="3" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
                </div>
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Slide Image</label>
                <MediaUpload v-model="slide.imgUrl" folder="hero" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
