<template>
  <div class="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
    <!-- Chat Window -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-8 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-8 scale-95"
    >
      <div v-if="isOpen" class="w-[24rem] h-[32rem] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden mb-6">
        <!-- Header -->
        <div class="px-8 py-6 bg-indigo-600 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <h3 class="font-black text-lg">Community Chat</h3>
          </div>
          <button @click="isOpen = false" class="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div ref="messageContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950/50">
          <div v-for="msg in messages" :key="msg._id" :class="['flex flex-col', msg.sender._id === user?._id ? 'items-end' : 'items-start']">
            <div :class="['max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm', msg.sender._id === user?._id ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none']">
              {{ msg.content }}
            </div>
            <span class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{{ msg.sender.name }}</span>
          </div>
        </div>

        <!-- Input -->
        <div class="p-4 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800">
          <div class="flex gap-2">
            <input
              v-model="newMessage"
              @keyup.enter="handleSend"
              placeholder="Type your message..."
              class="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
            />
            <button @click="handleSend" class="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Trigger Button -->
    <button
      @click="toggleChat"
      class="w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:-translate-y-2 active:scale-90 transition-all group overflow-hidden relative"
    >
      <div class="absolute inset-0 bg-white/10 group-hover:scale-150 transition-transform duration-700 rounded-full blur-xl"></div>
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useChat } from '@/composables/useChat'
import { useUser } from '@/composables/modules/auth/user'
const { messages, connect, sendMessage, isConnected } = useChat()
const { user, token } = useUser()
const isLoggedIn = computed(() => !!token.value)
const isOpen = ref(false)
const newMessage = ref('')
const messageContainer = ref<HTMLElement | null>(null)

const toggleChat = () => {
  if (!isLoggedIn.value) {
    navigateTo('/login')
    return
  }
  isOpen.value = !isOpen.value
  if (isOpen.value && !isConnected.value) {
    connect()
  }
}

const handleSend = () => {
  if (newMessage.value.trim()) {
    sendMessage(newMessage.value)
    newMessage.value = ''
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>
