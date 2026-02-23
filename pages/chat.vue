<script setup lang="ts">
import { useChat } from '@/composables/useChat'
import { useUser } from '@/composables/modules/auth/user'

const config = useRuntimeConfig()
const { socket, messages, connect, sendMessage, isConnected, isTyping, setTyping, fetchHistory } = useChat()
const { user } = useUser()

const selectedGroupId = ref<string | null>(null)
const newMessage = ref('')
const messageContainer = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const typingTimeout = ref<any>(null)

// Group messages by conversationId
const conversations = computed(() => {
  const groups: Record<string, any> = {};
  
  messages.value.forEach((msg: any) => {
    const participantKey = msg.conversationId || 'legacy-session';
    
    // Extract identity from non-admin messages
    let p_email = '';
    let p_name = '';

    if (!msg.isAdmin) {
      p_email = msg.guestEmail || '';
      p_name = msg.guestName || '';
      const sender = typeof msg.sender === 'object' ? msg.sender : null;
      if (!p_email && sender?.email) p_email = sender.email;
      if (!p_name && sender?.name) p_name = sender.name;
    }

    if (!groups[participantKey]) {
      groups[participantKey] = {
        id: participantKey,
        participantEmail: p_email,
        name: p_name || p_email || `Session ${participantKey.slice(-6)}`,
        lastMessage: msg,
        messages: [],
        unread: 0,
      };
    }

    // Update identity if found
    if (p_name && groups[participantKey].name.startsWith('Session')) {
      groups[participantKey].name = p_name;
    }
    if (p_email && !groups[participantKey].participantEmail) {
      groups[participantKey].participantEmail = p_email;
    }

    groups[participantKey].messages.push(msg);
    groups[participantKey].messages.sort((a: any, b: any) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    if (new Date(msg.createdAt) > new Date(groups[participantKey].lastMessage.createdAt)) {
      groups[participantKey].lastMessage = msg;
    }
  });

  return Object.values(groups).sort((a: any, b: any) => 
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );
});

const activeConversation = computed(() => 
  conversations.value.find(c => c.id === selectedGroupId.value)
)

onMounted(() => { connect() })

// Join the conversation room when selected
watch(() => selectedGroupId.value, (newId) => {
  if (newId && socket.value?.connected) {
    socket.value.emit('joinRoom', { roomId: newId })
  }
})

// Detect own (admin) messages — use explicit isAdmin flag
const isOwnMessage = (msg: any) => {
  return msg.isAdmin === true;
}

const handleTyping = () => {
  if (!isConnected.value || !selectedGroupId.value) return
  const name = (user.value as any)?.name || 'Admin'
  setTyping(true, name, false, selectedGroupId.value || undefined)
  if (typingTimeout.value) clearTimeout(typingTimeout.value)
  typingTimeout.value = setTimeout(() => {
    setTyping(false, name, false, selectedGroupId.value || undefined)
  }, 3000)
}

const handleSend = () => {
  if (newMessage.value.trim() && selectedGroupId.value) {
    sendMessage(newMessage.value, 'text', undefined, selectedGroupId.value)
    newMessage.value = ''
    scrollToBottom()
  }
}

const triggerFileInput = () => { fileInput.value?.click() }

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !selectedGroupId.value) return
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'admin_chat')
  try {
    const response: any = await $fetch(`${config.public.apiBase}/media/upload`, { method: 'POST', body: formData })
    if (response?.secure_url) {
      sendMessage('Image', 'image', response.secure_url, selectedGroupId.value)
      scrollToBottom()
    }
  } catch (error) { console.error('Upload failed', error) }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  })
}

watch(selectedGroupId, () => { scrollToBottom() })
watch(messages, () => { if (selectedGroupId.value) scrollToBottom() }, { deep: true })

const deleteConversations = async () => {
  if (!confirm('Clear ALL chat history? This cannot be undone.')) return
  try {
    await $fetch(`${config.public.apiBase}/chat/messages`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${useCookie('auth_token').value}` }
    })
    messages.value = []
    selectedGroupId.value = null
  } catch (error) { console.error('Failed to clear conversations', error) }
}

const exitChat = () => { navigateTo('/') }

const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

useHead({ title: 'Support Chat | Admin' })
definePageMeta({ middleware: 'auth', fullWidth: true, hideSidebar: true, hideHeader: true })
</script>

<template>
  <div class="h-screen flex bg-gray-100 overflow-hidden">
    <!-- ========== SIDEBAR ========== -->
    <div :class="['flex flex-col bg-white border-r border-gray-200 transition-all',
      selectedGroupId ? 'hidden md:flex md:w-[340px]' : 'w-full md:w-[340px]']">
      <!-- Sidebar Header -->
      <div class="h-16 px-4 flex items-center justify-between bg-[#f0f2f5] border-b border-gray-200">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 bg-[#075e54] text-white rounded-full flex items-center justify-center font-bold text-sm">
            A
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Support Chat</p>
            <div class="flex items-center gap-1">
              <div :class="['w-1.5 h-1.5 rounded-full', isConnected ? 'bg-green-500' : 'bg-red-400']"></div>
              <span class="text-[10px] text-gray-500">{{ isConnected ? 'Connected' : 'Disconnected' }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button @click="fetchHistory" class="p-2 hover:bg-gray-200 rounded-full transition-colors" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
          <button @click="deleteConversations" class="p-2 hover:bg-gray-200 rounded-full transition-colors" title="Clear All">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
          <button @click="exitChat" class="p-2 hover:bg-gray-200 rounded-full transition-colors" title="Back to Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="px-3 py-2 bg-[#f0f2f5]">
        <div class="flex items-center bg-white rounded-lg px-3 py-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span class="text-xs text-gray-400">{{ conversations.length }} active conversation{{ conversations.length !== 1 ? 's' : '' }}</span>
        </div>
      </div>

      <!-- Conversation List -->
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="conversations.length === 0" class="p-8 text-center">
          <p class="text-sm text-gray-400">No conversations yet</p>
        </div>
        <button 
          v-for="conv in conversations" 
          :key="conv.id"
          @click="selectedGroupId = conv.id"
          :class="['w-full px-3 py-3 flex items-center gap-3 transition-all text-left hover:bg-[#f0f2f5] border-b border-gray-50',
            selectedGroupId === conv.id ? 'bg-[#f0f2f5]' : '']"
        >
          <!-- Avatar -->
          <div class="w-12 h-12 rounded-full bg-[#dfe5e7] flex items-center justify-center shrink-0 relative">
            <span class="text-lg font-semibold text-[#54656f]">{{ (conv.name || 'G').charAt(0).toUpperCase() }}</span>
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline mb-0.5">
              <p class="text-[15px] font-normal text-gray-900 truncate">{{ conv.name }}</p>
              <span class="text-[11px] text-gray-500 shrink-0 ml-2">{{ formatTime(conv.lastMessage.createdAt) }}</span>
            </div>
            <div class="flex items-center gap-1">
              <p v-if="conv.participantEmail" class="text-[12px] text-gray-500 truncate">{{ conv.participantEmail }}</p>
              <p v-else class="text-[12px] text-gray-400 italic truncate">No email provided</p>
            </div>
            <p class="text-[12px] text-gray-500 truncate mt-0.5">
              <span v-if="conv.lastMessage.isAdmin" class="text-gray-400">You: </span>
              {{ conv.lastMessage.type === 'image' ? '📷 Photo' : conv.lastMessage.content }}
            </p>
          </div>
        </button>
      </div>
    </div>

    <!-- ========== MAIN CHAT AREA ========== -->
    <div :class="['flex-1 flex flex-col relative', !selectedGroupId ? 'hidden md:flex' : '']">
      
      <template v-if="selectedGroupId && activeConversation">
        <!-- Chat Header -->
        <div class="h-16 px-4 md:px-6 flex items-center justify-between bg-[#f0f2f5] border-b border-gray-200 z-10">
          <div class="flex items-center gap-3">
            <!-- Back button (mobile only) -->
            <button @click="selectedGroupId = null" class="p-1 md:hidden hover:bg-gray-200 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div class="w-10 h-10 rounded-full bg-[#dfe5e7] flex items-center justify-center">
              <span class="text-base font-semibold text-[#54656f]">{{ (activeConversation.name || 'G').charAt(0).toUpperCase() }}</span>
            </div>
            <div>
              <h3 class="text-base font-medium text-gray-900 leading-tight">{{ activeConversation.name }}</h3>
              <p class="text-xs text-gray-500 leading-tight">
                <template v-if="isTyping && isTyping.isGuest">typing...</template>
                <template v-else-if="activeConversation.participantEmail">{{ activeConversation.participantEmail }}</template>
                <template v-else>Online</template>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <!-- User info card toggle could go here -->
            <div class="px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-[11px] text-gray-500">
              {{ activeConversation.messages.length }} messages
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div ref="messageContainer" class="flex-1 overflow-y-auto px-4 md:px-16 py-6 space-y-1 custom-scrollbar bg-[#e5ddd5] relative">
          <!-- WhatsApp Background Pattern -->
          <div class="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8d974919620ba25.jpg')] bg-repeat"></div>

          <!-- Date separator (optional) -->
          <div class="flex justify-center mb-4 relative z-10">
            <span class="px-3 py-1 bg-white/80 rounded-lg text-[11px] text-gray-500 shadow-sm">Today</span>
          </div>

          <div 
            v-for="(msg, index) in activeConversation.messages" 
            :key="msg._id || index" 
            :class="['flex relative z-10 mb-1', isOwnMessage(msg) ? 'justify-end' : 'justify-start']"
          >
            <div :class="['max-w-[65%] px-3 py-2 rounded-lg shadow-sm relative',
              isOwnMessage(msg) 
                ? 'bg-[#d9fdd3] rounded-tr-none' 
                : 'bg-white rounded-tl-none']"
            >
              <!-- Tails -->
              <div v-if="isOwnMessage(msg)" class="absolute top-0 -right-2 w-0 h-0 border-t-[8px] border-t-[#d9fdd3] border-r-[8px] border-r-transparent"></div>
              <div v-else class="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent"></div>

              <!-- Sender label for user messages -->
              <p v-if="!isOwnMessage(msg)" class="text-[12px] font-semibold text-[#075e54] mb-0.5">
                {{ msg.guestName || 'User' }}
              </p>

              <!-- Image -->
              <div v-if="msg.type === 'image'" class="mb-1 rounded-md overflow-hidden">
                <img :src="msg.imageUrl" alt="Shared image" class="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity" />
              </div>

              <!-- Content -->
              <p class="text-[14px] text-gray-800 leading-snug">{{ msg.content }}</p>

              <!-- Time + checkmark -->
              <div class="flex items-center justify-end gap-1 mt-1">
                <span class="text-[11px] text-gray-500">{{ formatTime(msg.createdAt) }}</span>
                <svg v-if="isOwnMessage(msg)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#53bdeb]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="px-4 py-3 bg-[#f0f2f5] flex items-center gap-2 z-10">
          <button @click="triggerFileInput" class="p-2 text-[#54656f] hover:text-gray-800 rounded-full hover:bg-gray-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
          </button>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleImageUpload" />
          <div class="flex-1">
            <input 
              v-model="newMessage"
              @keypress="handleTyping"
              @keyup.enter="handleSend"
              placeholder="Type a message"
              class="w-full px-4 py-2.5 bg-white rounded-lg text-sm text-gray-800 outline-none border border-gray-200 focus:border-[#075e54] transition-colors"
            />
          </div>
          <button 
            @click="handleSend" 
            :disabled="!newMessage.trim()"
            class="p-2.5 bg-[#075e54] text-white rounded-full hover:bg-[#054c44] disabled:opacity-30 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </template>

      <!-- Empty State -->
      <div v-else class="flex-1 items-center justify-center bg-[#f0f2f5] hidden md:flex">
        <div class="text-center max-w-md">
          <div class="w-20 h-20 bg-[#dfe5e7] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#54656f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 class="text-2xl font-light text-gray-700 mb-2">PANAFSTRAG Support Chat</h2>
          <p class="text-sm text-gray-500">Select a conversation from the sidebar to start responding to users.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
</style>
