<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'
import { useCustomToast } from "@/composables/core/useCustomToast"

const { homeContent, updateHomeContent, loading: fetchLoading } = useHomeContent()
const { showToast } = useCustomToast()

const form = reactive({
  aboutUsTitle: '',
  aboutUsSubTitle: '',
  aboutUsDescription: '',
  aboutUsContextImage: '',
  aboutUsContextText: '',
  objectivesTitle: '',
  objectivesSubTitle: '',
  responsibilitiesTitle: '',
  responsibilitiesSubTitle: '',
  programsTitle: '',
  programsSubTitle: '',
  ctaTitle: '',
  ctaDescription: '',
  websiteHeaderText: '',
  languageGroupFunction: '',
  languageGroupFunctionTitle: '',
  languageGroupMembership: '',
  languageGroupMembershipTitle: '',
  languageGroupLeadership: '',
  languageGroupLeadershipTitle: '',
  languageGroupFees: '',
  languageGroupFeesTitle: '',
  featuresTitle: '',
  featuresSubTitle: '',
  focusAreasPageTitle: '',
  focusAreasPageDescription: '',
  programsPageTitle: '',
  programsPageDescription: '',
  archivesPageTitle: '',
  archivesPageDescription: '',
  boardPageTitle: '',
  boardPageDescription: '',
  organogramPageTitle: '',
  organogramPageDescription: '',
  cellsPageTitle: '',
  cellsPageDescription: '',
  contactPageTitle: '',
  contactPageDescription: '',
  languageGroupsPageTitle: '',
  languageGroupsPageDescription: '',
  carousels: [] as any[],
  primaryNavItems: [] as any[],
  instituteNavItems: [] as any[],
  contactEmail: [] as string[],
  contactPhone: [] as string[],
  contactAddress: '',
  contactOfficeHoursMonFri: '',
  contactOfficeHoursSat: '',
  contactOfficeHoursSun: '',
  contactSocialLinks: [] as any[],
  heroEstablishedText: ''
})

const loading = ref(false)

watch(homeContent, (val) => {
  if (val) {
    form.aboutUsTitle = val.aboutUsTitle || ''
    form.aboutUsSubTitle = val.aboutUsSubTitle || ''
    form.aboutUsDescription = val.aboutUsDescription || ''
    form.aboutUsContextImage = val.aboutUsContextImage || ''
    form.aboutUsContextText = val.aboutUsContextText || ''
    form.objectivesTitle = val.objectivesTitle || ''
    form.objectivesSubTitle = val.objectivesSubTitle || ''
    form.responsibilitiesTitle = val.responsibilitiesTitle || ''
    form.responsibilitiesSubTitle = val.responsibilitiesSubTitle || ''
    form.programsTitle = val.programsTitle || ''
    form.ctaTitle = val.ctaTitle || ''
    form.ctaDescription = val.ctaDescription || ''
    form.websiteHeaderText = val.websiteHeaderText || ''
    form.languageGroupFunction = val.languageGroupFunction || ''
    form.languageGroupFunctionTitle = val.languageGroupFunctionTitle || ''
    form.languageGroupMembership = val.languageGroupMembership || ''
    form.languageGroupMembershipTitle = val.languageGroupMembershipTitle || ''
    form.languageGroupLeadership = val.languageGroupLeadership || ''
    form.languageGroupLeadershipTitle = val.languageGroupLeadershipTitle || ''
    form.languageGroupFees = val.languageGroupFees || ''
    form.languageGroupFeesTitle = val.languageGroupFeesTitle || ''
    form.programsSubTitle = val.programsSubTitle || ''
    form.featuresTitle = val.featuresTitle || ''
    form.featuresSubTitle = val.featuresSubTitle || ''
    form.focusAreasPageTitle = val.focusAreasPageTitle || ''
    form.focusAreasPageDescription = val.focusAreasPageDescription || ''
    form.programsPageTitle = val.programsPageTitle || ''
    form.programsPageDescription = val.programsPageDescription || ''
    form.archivesPageTitle = val.archivesPageTitle || ''
    form.archivesPageDescription = val.archivesPageDescription || ''
    form.boardPageTitle = val.boardPageTitle || ''
    form.boardPageDescription = val.boardPageDescription || ''
    form.organogramPageTitle = val.organogramPageTitle || ''
    form.organogramPageDescription = val.organogramPageDescription || ''
    form.cellsPageTitle = val.cellsPageTitle || ''
    form.cellsPageDescription = val.cellsPageDescription || ''
    form.contactPageTitle = val.contactPageTitle || ''
    form.contactPageDescription = val.contactPageDescription || ''
    form.languageGroupsPageTitle = val.languageGroupsPageTitle || ''
    form.languageGroupsPageDescription = val.languageGroupsPageDescription || ''
    form.carousels = val.carousels ? JSON.parse(JSON.stringify(val.carousels)) : []
    form.primaryNavItems = val.primaryNavItems ? JSON.parse(JSON.stringify(val.primaryNavItems)) : []
    form.instituteNavItems = val.instituteNavItems ? JSON.parse(JSON.stringify(val.instituteNavItems)) : []
    form.contactEmail = val.contactEmail ? (Array.isArray(val.contactEmail) ? [...val.contactEmail] : [val.contactEmail]) : []
    form.contactPhone = val.contactPhone ? (Array.isArray(val.contactPhone) ? [...val.contactPhone] : [val.contactPhone]) : []
    form.contactAddress = val.contactAddress || ''
    form.contactOfficeHoursMonFri = val.contactOfficeHoursMonFri || ''
    form.contactOfficeHoursSat = val.contactOfficeHoursSat || ''
    form.contactOfficeHoursSun = val.contactOfficeHoursSun || ''
    form.contactSocialLinks = val.contactSocialLinks ? JSON.parse(JSON.stringify(val.contactSocialLinks)) : []
    form.heroEstablishedText = val.heroEstablishedText || ''
  }
}, { immediate: true })

const addPrimaryNavItem = () => form.primaryNavItems.push({ label: '', path: '' })
const removePrimaryNavItem = (index: number) => form.primaryNavItems.splice(index, 1)

const addInstituteNavItem = () => form.instituteNavItems.push({ label: '', path: '' })
const removeInstituteNavItem = (index: number) => form.instituteNavItems.splice(index, 1)

const addSocialLink = () => form.contactSocialLinks.push({ platform: '', url: '' })
const removeSocialLink = (index: number) => form.contactSocialLinks.splice(index, 1)

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

const addContactEmail = () => form.contactEmail.push('')
const removeContactEmail = (index: number) => form.contactEmail.splice(index, 1)

const addContactPhone = () => form.contactPhone.push('')
const removeContactPhone = (index: number) => form.contactPhone.splice(index, 1)

const handleSubmit = async () => {
  loading.value = true
  try {
    await updateHomeContent(form)
    // Show success message? (Admin app might have a toast system, but let's stick to basic for now)
      showToast({
          title: "Success",
          message: "Home content updated successfully",
          toastType: "success",
          duration: 3000,
        })
  } catch (error) {
          showToast({
          title: "Error",
          message: "Failed to update home content",
          toastType: "error",
          duration: 3000,
        })
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
          <div class="grid md:grid-cols-2 gap-10">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">About Us Title</label>
              <input v-model="form.aboutUsTitle" type="text" placeholder='About <span class="not-italic text-gray-400">PANAFSTRAG</span>' class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">About Us SubTitle</label>
              <input v-model="form.aboutUsSubTitle" type="text" placeholder="Who We Are" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
          </div>
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">About Us Description</label>
            <textarea v-model="form.aboutUsDescription" rows="6" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
          </div>
          <div class="grid md:grid-cols-2 gap-10 pt-6 border-t border-gray-100">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">About Us Context Image</label>
              <MediaUpload v-model="form.aboutUsContextImage" folder="home" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">About Us Context Text</label>
              <textarea v-model="form.aboutUsContextText" rows="6" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed" placeholder="International Secretariat..."></textarea>
            </div>
          </div>
        </div>
      </section>

      <!-- Titles Configuration Context -->
      <section class="bg-white p-8 md:p-12 border border-gray-100 shadow-sm space-y-8">
        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Site Headings & Titles</h3>
        
        <div class="space-y-8 divide-y divide-gray-100">
          <div class="grid md:grid-cols-2 gap-10 pb-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Objectives Title</label>
              <input v-model="form.objectivesTitle" type="text" placeholder='Institutional <br class="md:hidden" /> <span class="not-italic text-gray-400">Objectives</span>' class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Objectives SubTitle</label>
              <input v-model="form.objectivesSubTitle" type="text" placeholder="Strategic Alignment" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-10 py-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Responsibilities Title</label>
              <input v-model="form.responsibilitiesTitle" type="text" placeholder='Core <br class="md:hidden" /> <span class="not-italic text-gray-400">Responsibilities</span>' class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Responsibilities SubTitle</label>
              <input v-model="form.responsibilitiesSubTitle" type="text" placeholder="Code of Conduct" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-10 py-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Programs Title</label>
              <input v-model="form.programsTitle" type="text" placeholder='Recent <span class="not-italic text-gray-400">Programs</span>' class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Programs SubTitle</label>
              <input v-model="form.programsSubTitle" type="text" placeholder="Latest Updates" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-10 py-8 border-t border-gray-100">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Call-to-Action Title</label>
              <input v-model="form.ctaTitle" type="text" placeholder='Participate in <br class="hidden md:block" /> <span class="not-italic text-[#2E7D32]">the Future</span>' class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
          </div>

          <div class="py-8">
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Call-to-Action Description</label>
            <textarea v-model="form.ctaDescription" rows="3" placeholder="Join a network of leading experts dedicated to..." class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
          </div>

          <div class="grid md:grid-cols-2 gap-10 py-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Features Title</label>
              <input v-model="form.featuresTitle" type="text" placeholder="Strategic Analysis" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Features SubTitle</label>
              <input v-model="form.featuresSubTitle" type="text" placeholder="Intelligence Network" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
          </div>
        </div>
      </section>

      <!-- Page Headings Context -->
      <section class="bg-white p-8 md:p-12 border border-gray-100 shadow-sm space-y-8">
        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Page Main Headings</h3>
        
        <div class="space-y-8 divide-y divide-gray-100">
          <!-- Focus Areas -->
          <div class="grid md:grid-cols-2 gap-10 py-4 first:pt-0">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Focus Areas Page Title</label>
              <input v-model="form.focusAreasPageTitle" type="text" placeholder='Strategic <span class="not-italic text-gray-400">Focus Areas.</span>' class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Focus Areas Page Description</label>
              <textarea v-model="form.focusAreasPageDescription" rows="2" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
            </div>
          </div>

          <!-- Programs -->
          <div class="grid md:grid-cols-2 gap-10 py-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Programs Page Title</label>
              <input v-model="form.programsPageTitle" type="text" placeholder='Our <span class="not-italic text-gray-400">Programs.</span>' class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Programs Page Description</label>
              <textarea v-model="form.programsPageDescription" rows="2" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
            </div>
          </div>

          <!-- Archives -->
          <div class="grid md:grid-cols-2 gap-10 py-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Archives Page Title</label>
              <input v-model="form.archivesPageTitle" type="text" placeholder='Institutional <span class="not-italic text-gray-400">Archives.</span>' class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Archives Page Description</label>
              <textarea v-model="form.archivesPageDescription" rows="2" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
            </div>
          </div>

          <!-- The Board -->
          <div class="grid md:grid-cols-2 gap-10 py-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">The Board Page Title</label>
              <input v-model="form.boardPageTitle" type="text" placeholder='The <span class="not-italic text-gray-400">Board.</span>' class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">The Board Page Description</label>
              <textarea v-model="form.boardPageDescription" rows="2" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
            </div>
          </div>

          <!-- Organogram -->
          <div class="grid md:grid-cols-2 gap-10 py-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Organogram Page Title</label>
              <input v-model="form.organogramPageTitle" type="text" placeholder='The <span class="not-italic text-gray-400">Organogram.</span>' class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Organogram Page Description</label>
              <textarea v-model="form.organogramPageDescription" rows="2" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
            </div>
          </div>

          <!-- Cells -->
          <div class="grid md:grid-cols-2 gap-10 py-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Cells Page Title</label>
              <input v-model="form.cellsPageTitle" type="text" placeholder='Institutional <span class="not-italic text-gray-400">Cells.</span>' class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Cells Page Description</label>
              <textarea v-model="form.cellsPageDescription" rows="2" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
            </div>
          </div>

          <!-- Contact -->
          <div class="grid md:grid-cols-2 gap-10 py-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact Page Title</label>
              <input v-model="form.contactPageTitle" type="text" placeholder='Get in <span class="not-italic text-gray-400">Touch.</span>' class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact Page Description</label>
              <textarea v-model="form.contactPageDescription" rows="2" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
            </div>
          </div>

          <!-- Language Groups -->
          <div class="grid md:grid-cols-2 gap-10 pt-8">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Language Groups Page Title</label>
              <input v-model="form.languageGroupsPageTitle" type="text" placeholder='Language <span class="not-italic text-gray-400">Groups.</span>' class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Language Groups Page Description</label>
              <textarea v-model="form.languageGroupsPageDescription" rows="2" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Details Configuration -->
      <section class="bg-white p-8 md:p-12 border border-gray-100 shadow-sm space-y-8">
        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Contact Details Configuration</h3>
        
        <div class="space-y-8">
          <div class="grid md:grid-cols-2 gap-10">
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400">Contact Emails</label>
                <button @click="addContactEmail" class="text-[8px] font-black uppercase tracking-widest text-[#2E7D32] hover:text-black transition-colors focus:outline-none">+ ADD EMAIL</button>
              </div>
              <div class="space-y-3">
                <div v-for="(email, idx) in form.contactEmail" :key="'email-'+idx" class="flex items-center gap-3">
                  <input v-model="form.contactEmail[idx]" type="email" placeholder="info@panafstrag.org" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
                   <button @click="removeContactEmail(idx)" class="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                 <div v-if="!form.contactEmail.length" class="text-left py-2">
                   <p class="text-[8px] font-black text-gray-300 uppercase tracking-widest">No emails configured.</p>
                </div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400">Contact Phones</label>
                <button @click="addContactPhone" class="text-[8px] font-black uppercase tracking-widest text-[#2E7D32] hover:text-black transition-colors focus:outline-none">+ ADD PHONE</button>
              </div>
              <div class="space-y-3">
                <div v-for="(phone, idx) in form.contactPhone" :key="'phone-'+idx" class="flex items-center gap-3">
                  <input v-model="form.contactPhone[idx]" type="text" placeholder="+233 XXX XXX XXX" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
                  <button @click="removeContactPhone(idx)" class="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                 <div v-if="!form.contactPhone.length" class="text-left py-2">
                   <p class="text-[8px] font-black text-gray-300 uppercase tracking-widest">No phones configured.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Physical Address</label>
            <textarea v-model="form.contactAddress" rows="3" placeholder="PANAFSTRAG Secretariat, Accra, Ghana..." class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
          </div>

          <div class="pt-6 border-t border-gray-100">
            <h4 class="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-6">Office Hours (Disabled)</h4>
            <!-- <div class="grid md:grid-cols-3 gap-8">
              <div>
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Mon - Fri</label>
                <input v-model="form.contactOfficeHoursMonFri" type="text" placeholder="09:00 AM - 05:00 PM" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
              <div>
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Saturday</label>
                <input v-model="form.contactOfficeHoursSat" type="text" placeholder="Closed" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
              <div>
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Sunday</label>
                <input v-model="form.contactOfficeHoursSun" type="text" placeholder="Closed" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
              </div>
            </div> -->
          </div>

          <div class="pt-6 border-t border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <h4 class="text-[9px] font-black uppercase tracking-widest text-gray-400">Social Media Links</h4>
              <button @click="addSocialLink" class="text-[8px] font-black uppercase tracking-widest text-[#2E7D32] hover:text-black transition-colors focus:outline-none">+ ADD LINK</button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(link, idx) in form.contactSocialLinks" :key="idx" class="flex items-end gap-3 p-4 bg-gray-50 rounded-lg group relative">
                <div class="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Platform</label>
                    <input v-model="link.platform" type="text" placeholder="Twitter" class="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-xs" />
                  </div>
                  <div>
                    <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">URL</label>
                    <input v-model="link.url" type="text" placeholder="https://..." class="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-xs" />
                  </div>
                </div>
                <button @click="removeSocialLink(idx)" class="pb-2 text-gray-300 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="!form.contactSocialLinks.length" class="text-center py-6 bg-gray-50/50 rounded-lg border border-dashed border-gray-100">
               <p class="text-[8px] font-black text-gray-300 uppercase tracking-widest">No social links configured.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Global Design Context -->
      <section class="bg-white p-8 md:p-12 border border-gray-100 shadow-sm space-y-8">
        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 border-b border-gray-100 pb-2">Global Design Context</h3>
        <div class="space-y-8">
          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Website Top Header Ticker</label>
            <input v-model="form.websiteHeaderText" type="text" placeholder="Est. 1992 — Panafricana Stratetegic & Policy Research Group" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
          </div>

          <div>
            <label class="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Hero Established Text</label>
            <input v-model="form.heroEstablishedText" type="text" placeholder="ESTABLISHED 1992" class="w-full px-0 py-3 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
          </div>
          
          <div class="pt-6 border-t border-gray-100 space-y-6">
            <h4 class="text-[9px] font-black uppercase tracking-widest text-gray-400">Language Groups Context</h4>
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Function Title</label>
                <input v-model="form.languageGroupFunctionTitle" type="text" placeholder="Function" class="w-full px-0 py-3 mb-4 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Function Description</label>
                <textarea v-model="form.languageGroupFunction" rows="4" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
              </div>
              <div>
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Membership Title</label>
                <input v-model="form.languageGroupMembershipTitle" type="text" placeholder="Membership" class="w-full px-0 py-3 mb-4 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Membership Description</label>
                <textarea v-model="form.languageGroupMembership" rows="4" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
              </div>
              <div>
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Leadership Title</label>
                <input v-model="form.languageGroupLeadershipTitle" type="text" placeholder="Leadership" class="w-full px-0 py-3 mb-4 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Leadership Description</label>
                <textarea v-model="form.languageGroupLeadership" rows="4" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
              </div>
              <div>
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Fees Title</label>
                <input v-model="form.languageGroupFeesTitle" type="text" placeholder="Fees" class="w-full px-0 py-3 mb-4 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-sm" />
                <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Fees Description</label>
                <textarea v-model="form.languageGroupFees" rows="4" class="w-full p-4 bg-gray-50 border-none outline-none focus:ring-1 focus:ring-black transition-all font-medium text-sm leading-relaxed"></textarea>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Navigation Management -->
      <section class="grid md:grid-cols-2 gap-12">
        <!-- Primary Navigation -->
        <div class="space-y-8 bg-white p-8 border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Primary Navigation</h3>
            <button @click="addPrimaryNavItem" class="text-[9px] font-black uppercase tracking-widest text-black hover:text-gray-400 transition-colors">+ ADD ITEM</button>
          </div>
          
          <div class="space-y-4">
            <div v-for="(item, idx) in form.primaryNavItems" :key="idx" class="flex items-end gap-4 p-4 bg-gray-50 rounded-lg group relative">
              <div class="flex-1 space-y-4">
                <div>
                  <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Label</label>
                  <input v-model="item.label" type="text" placeholder="e.g. Programs" class="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-xs" />
                </div>
                <div>
                  <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Path</label>
                  <input v-model="item.path" type="text" placeholder="e.g. /programs" class="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-xs" />
                </div>
              </div>
              <button @click="removePrimaryNavItem(idx)" class="pb-2 text-gray-300 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div v-if="!form.primaryNavItems.length" class="text-center py-8 text-[9px] font-black text-gray-400 uppercase tracking-widest">
              No primary nav items.
            </div>
          </div>
        </div>

        <!-- Institute Navigation -->
        <div class="space-y-8 bg-white p-8 border border-gray-100 shadow-sm">
          <div class="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">The Institute Dropdown</h3>
            <button @click="addInstituteNavItem" class="text-[9px] font-black uppercase tracking-widest text-black hover:text-gray-400 transition-colors">+ ADD ITEM</button>
          </div>

          <div class="space-y-4">
            <div v-for="(item, idx) in form.instituteNavItems" :key="idx" class="flex items-end gap-4 p-4 bg-gray-50 rounded-lg group relative">
              <div class="flex-1 space-y-4">
                <div>
                  <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Label</label>
                  <input v-model="item.label" type="text" placeholder="e.g. Board" class="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-xs" />
                </div>
                <div>
                  <label class="block text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Path</label>
                  <input v-model="item.path" type="text" placeholder="e.g. /board" class="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-black outline-none transition-all font-bold text-xs" />
                </div>
              </div>
              <button @click="removeInstituteNavItem(idx)" class="pb-2 text-gray-300 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div v-if="!form.instituteNavItems.length" class="text-center py-8 text-[9px] font-black text-gray-400 uppercase tracking-widest">
              No institute dropdown items.
            </div>
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
