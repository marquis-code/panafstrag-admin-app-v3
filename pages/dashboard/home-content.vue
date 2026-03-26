<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
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
  form.carousels.push({ title: '', description: '', imgUrl: '' })
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
    showToast({
      title: "Success",
      message: "Home page content updated successfully",
      toastType: "success",
      duration: 3000,
    })
  } catch (error) {
    showToast({
      title: "Error",
      message: "Failed to update home page content",
      toastType: "error",
      duration: 3000,
    })
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Home Content | Admin' })
definePageMeta({
  layout: 'dashboard', middleware: 'auth' })
</script>

<template>
  <div class="space-y-8 pb-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Home Page Content</h1>
        <p class="text-gray-500 mt-2 text-sm font-medium">
          Manage the text, images, and links displayed on the website's home page.
        </p>
      </div>
      <button 
        @click="handleSubmit" 
        :disabled="loading" 
        class="px-8 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all  flex items-center gap-2"
      >
        <div v-if="loading" class="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        <span>{{ loading ? 'Saving...' : 'Save Changes' }}</span>
      </button>
    </div>

    <!-- State Handling -->
    <div v-if="fetchLoading" class="py-32 flex justify-center">
      <LoadingState />
    </div>

    <div v-else class="space-y-12">
      <!-- About Us Section -->
      <section class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 class="text-sm font-bold text-gray-700">About Us Section</h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <AnimatedInput v-model="form.aboutUsTitle" label="Title" />
            <AnimatedInput v-model="form.aboutUsSubTitle" label="Subtitle" />
          </div>
          <AnimatedInput v-model="form.aboutUsDescription" label="Main Description" type="textarea" :rows="4" />
          
          <div class="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
            <div class="space-y-4">
              <label class="block text-xs font-bold text-gray-500">Section Image</label>
              <MediaUpload v-model="form.aboutUsContextImage" folder="home" />
            </div>
            <AnimatedInput v-model="form.aboutUsContextText" label="Supporting Text" type="textarea" :rows="4" />
          </div>
        </div>
      </section>

      <!-- Section Titles -->
      <section class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 class="text-sm font-bold text-gray-700">Page Section Titles</h3>
        </div>
        
        <div class="p-6 space-y-10">
          <div class="grid md:grid-cols-2 gap-6">
            <AnimatedInput v-model="form.objectivesTitle" label="Objectives Title" />
            <AnimatedInput v-model="form.objectivesSubTitle" label="Objectives Subtitle" />
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <AnimatedInput v-model="form.responsibilitiesTitle" label="Responsibilities Title" />
            <AnimatedInput v-model="form.responsibilitiesSubTitle" label="Responsibilities Subtitle" />
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <AnimatedInput v-model="form.programsTitle" label="Programs Title" />
            <AnimatedInput v-model="form.programsSubTitle" label="Programs Subtitle" />
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <AnimatedInput v-model="form.featuresTitle" label="Features Title" />
            <AnimatedInput v-model="form.featuresSubTitle" label="Features Subtitle" />
          </div>

          <div class="space-y-6 pt-6 border-t border-gray-100">
            <AnimatedInput v-model="form.ctaTitle" label="Call to Action Title" />
            <AnimatedInput v-model="form.ctaDescription" label="Call to Action Description" type="textarea" :rows="3" />
          </div>
        </div>
      </section>

      <!-- Page Headers and Descriptions -->
      <section class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 class="text-sm font-bold text-gray-700">Page Headers & Descriptions</h3>
        </div>
        
        <div class="p-6 space-y-6 divide-y divide-gray-100">
          <div class="grid md:grid-cols-2 gap-6 pb-6">
            <AnimatedInput v-model="form.focusAreasPageTitle" label="Focus Areas Title" />
            <AnimatedInput v-model="form.focusAreasPageDescription" label="Focus Areas Description" type="textarea" :rows="2" />
          </div>

          <div class="grid md:grid-cols-2 gap-6 py-6">
            <AnimatedInput v-model="form.programsPageTitle" label="Programs Title" />
            <AnimatedInput v-model="form.programsPageDescription" label="Programs Description" type="textarea" :rows="2" />
          </div>

          <div class="grid md:grid-cols-2 gap-6 py-6">
            <AnimatedInput v-model="form.archivesPageTitle" label="Archives Title" />
            <AnimatedInput v-model="form.archivesPageDescription" label="Archives Description" type="textarea" :rows="2" />
          </div>

          <div class="grid md:grid-cols-2 gap-6 py-6">
            <AnimatedInput v-model="form.boardPageTitle" label="Board Members Title" />
            <AnimatedInput v-model="form.boardPageDescription" label="Board Members Description" type="textarea" :rows="2" />
          </div>

          <div class="grid md:grid-cols-2 gap-6 py-6">
            <AnimatedInput v-model="form.organogramPageTitle" label="Organogram Title" />
            <AnimatedInput v-model="form.organogramPageDescription" label="Organogram Description" type="textarea" :rows="2" />
          </div>

          <div class="grid md:grid-cols-2 gap-6 py-6">
            <AnimatedInput v-model="form.cellsPageTitle" label="Research Cells Title" />
            <AnimatedInput v-model="form.cellsPageDescription" label="Research Cells Description" type="textarea" :rows="2" />
          </div>

          <div class="grid md:grid-cols-2 gap-6 py-6">
            <AnimatedInput v-model="form.contactPageTitle" label="Contact Page Title" />
            <AnimatedInput v-model="form.contactPageDescription" label="Contact Page Description" type="textarea" :rows="2" />
          </div>

          <div class="grid md:grid-cols-2 gap-6 pt-6">
            <AnimatedInput v-model="form.languageGroupsPageTitle" label="Language Groups Title" />
            <AnimatedInput v-model="form.languageGroupsPageDescription" label="Language Groups Description" type="textarea" :rows="2" />
          </div>
        </div>
      </section>

      <!-- Contact Information -->
      <section class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 class="text-sm font-bold text-gray-700">Contact Information</h3>
        </div>
        
        <div class="p-6 space-y-10">
          <div class="grid md:grid-cols-2 gap-10">
            <!-- Emails -->
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                <label class="text-xs font-bold text-gray-500">Email Addresses</label>
                <button @click="addContactEmail" class="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Email
                </button>
              </div>
              <div class="space-y-3">
                <div v-for="(email, idx) in form.contactEmail" :key="'email-'+idx" class="flex items-center gap-2">
                  <div class="flex-1">
                    <AnimatedInput v-model="form.contactEmail[idx]" :label="`Email ${idx + 1}`" />
                  </div>
                  <button @click="removeContactEmail(idx)" class="mt-6 p-2 text-gray-300 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Phones -->
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-gray-100 pb-2">
                <label class="text-xs font-bold text-gray-500">Phone Numbers</label>
                <button @click="addContactPhone" class="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Phone
                </button>
              </div>
              <div class="space-y-3">
                <div v-for="(phone, idx) in form.contactPhone" :key="'phone-'+idx" class="flex items-center gap-2">
                  <div class="flex-1">
                    <AnimatedInput v-model="form.contactPhone[idx]" :label="`Phone ${idx + 1}`" />
                  </div>
                  <button @click="removeContactPhone(idx)" class="mt-6 p-2 text-gray-300 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <AnimatedInput v-model="form.contactAddress" label="International Secretariat Address" type="textarea" :rows="3" />

          <!-- Social Links -->
          <div class="pt-6 border-t border-gray-100 space-y-6">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-gray-500 uppercase">Social Media Links</h4>
              <button @click="addSocialLink" class="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-all border border-gray-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Social Link
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="(link, idx) in form.contactSocialLinks" :key="idx" class="p-4 bg-gray-50 rounded-lg border border-gray-200 group relative">
                <button @click="removeSocialLink(idx)" class="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div class="space-y-3">
                  <AnimatedInput v-model="link.platform" label="Platform" />
                  <AnimatedInput v-model="link.url" label="Link" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Website General Content -->
      <section class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 class="text-sm font-bold text-gray-700">Website General Content</h3>
        </div>
        <div class="p-6 space-y-8">
          <div class="grid md:grid-cols-2 gap-6">
            <AnimatedInput v-model="form.websiteHeaderText" label="Header Top Text" />
            <AnimatedInput v-model="form.heroEstablishedText" label="Established Text" />
          </div>
          
          <div class="pt-6 border-t border-gray-100 space-y-6">
            <h4 class="text-xs font-bold text-gray-500 uppercase">Language Groups Text</h4>
            <div class="grid md:grid-cols-2 gap-8">
              <div class="space-y-4">
                <AnimatedInput v-model="form.languageGroupFunctionTitle" label="Function Title" />
                <AnimatedInput v-model="form.languageGroupFunction" label="Function Description" type="textarea" :rows="3" />
              </div>
              <div class="space-y-4">
                <AnimatedInput v-model="form.languageGroupMembershipTitle" label="Membership Title" />
                <AnimatedInput v-model="form.languageGroupMembership" label="Membership Description" type="textarea" :rows="3" />
              </div>
              <div class="space-y-4">
                <AnimatedInput v-model="form.languageGroupLeadershipTitle" label="Leadership Title" />
                <AnimatedInput v-model="form.languageGroupLeadership" label="Leadership Description" type="textarea" :rows="3" />
              </div>
              <div class="space-y-4">
                <AnimatedInput v-model="form.languageGroupFeesTitle" label="Fees Title" />
                <AnimatedInput v-model="form.languageGroupFees" label="Fees Description" type="textarea" :rows="3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Navigation Links -->
      <section class="grid md:grid-cols-2 gap-8">
        <!-- Main Navigation -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-700">Main Navigation</h3>
            <button @click="addPrimaryNavItem" class="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Link
            </button>
          </div>
          
          <div class="p-6 space-y-4 flex-1">
            <div v-for="(item, idx) in form.primaryNavItems" :key="idx" class="p-4 bg-gray-50 rounded-lg border border-gray-200 group relative">
              <button @click="removePrimaryNavItem(idx)" class="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div class="grid grid-cols-2 gap-4">
                <AnimatedInput v-model="item.label" label="Label" />
                <AnimatedInput v-model="item.path" label="Path" />
              </div>
            </div>
          </div>
        </div>

        <!-- Institute Sub-links -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-sm font-bold text-gray-700">Institute Sub-links</h3>
            <button @click="addInstituteNavItem" class="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Sub-link
            </button>
          </div>

          <div class="p-6 space-y-4 flex-1">
            <div v-for="(item, idx) in form.instituteNavItems" :key="idx" class="p-4 bg-gray-50 rounded-lg border border-gray-200 group relative">
              <button @click="removeInstituteNavItem(idx)" class="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div class="grid grid-cols-2 gap-4">
                <AnimatedInput v-model="item.label" label="Label" />
                <AnimatedInput v-model="item.path" label="Path" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Home Page Slides -->
      <section class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-sm font-bold text-gray-700">Home Page Slides</h3>
          <button @click="addCarouselItem" class="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Slide
          </button>
        </div>

        <div class="p-6 space-y-6">
          <div v-if="!form.carousels.length" class="py-12 bg-gray-50 border-2 border-dashed border-gray-100 rounded-lg text-center">
            <p class="text-sm font-medium text-gray-400">No slides added yet.</p>
          </div>

          <div class="space-y-6">
            <div v-for="(slide, index) in form.carousels" :key="index" class="bg-gray-50 border border-gray-200 rounded-lg p-6 relative">
              <button @click="removeCarouselItem(index)" class="absolute top-4 right-4 p-1.5 bg-white text-gray-300 hover:text-red-500 transition-colors rounded-full border border-gray-100 ">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-4">
                  <div class="text-sm font-bold text-gray-300">#{{ index + 1 }}</div>
                  <AnimatedInput v-model="slide.title" label="Slide Title" />
                  <AnimatedInput v-model="slide.description" label="Slide Description" type="textarea" :rows="3" />
                </div>
                <div class="space-y-4">
                  <label class="block text-xs font-bold text-gray-500">Slide Image</label>
                  <MediaUpload v-model="slide.imgUrl" folder="hero" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
