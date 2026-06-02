<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
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

// UI State
const searchBatch = ref('')

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

const exitChat = () => { navigateTo('/dashboard') }

const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

useHead({ title: 'Support Chat | Admin' })
definePageMeta({
  layout: 'dashboard', middleware: 'auth', fullWidth: true, hideSidebar: true, hideHeader: true })
</script>
<template>
  <div class="h-screen flex bg-gray-50 overflow-hidden font-sans selection:bg-blue-100">
    <!-- Sidebar -->
    <div :class="['flex flex-col bg-white border-r border-gray-200 transition-all duration-300  z-30',
      selectedGroupId ? 'hidden md:flex md:w-80 lg:w-96' : 'w-full md:w-80 lg:w-96']">
      
      <!-- Sidebar Header -->
      <div class="h-20 px-6 flex items-center justify-between border-b border-gray-100 bg-white">
        <div>
          <h2 class="text-xl font-extrabold text-gray-900 tracking-tight">{{ t('Active Chats') }}</h2>
        </div>
        <div class="flex items-center gap-1.5">
          <button @click="fetchHistory" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button @click="deleteConversations" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Clear All">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button @click="exitChat" class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors " title="Exit">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="px-6 py-4 bg-white border-b border-gray-50">
        <div class="relative">
          <input 
            v-model="searchBatch"
            type="text" 
            
            class="w-full bg-gray-50 border border-gray-100 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-gray-300"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-y-auto bg-white">
        <div v-if="conversations.length === 0" class="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4 opacity-40">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-xs font-bold uppercase tracking-widest">{{ t('No active chats') }}</p>
        </div>
        
        <button 
          v-for="conv in (conversations as any[])" 
          :key="conv.id"
          @click="selectedGroupId = conv.id"
          :class="['w-full px-6 py-4 flex items-center gap-4 transition-all border-b border-gray-50 relative group',
            selectedGroupId === conv.id ? 'bg-blue-50/50 -inner border-l-4 border-l-blue-600' : 'hover:bg-gray-50']"
        >
          <!-- Avatar -->
          <div class="relative shrink-0">
            <div class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-500">
              {{ (conv.name || 'G').charAt(0).toUpperCase() }}
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center mb-0.5">
              <p class="text-sm font-bold text-gray-900 truncate">{{ conv.name }}</p>
              <span class="text-[10px] text-gray-400">{{ formatTime(conv.lastMessage.createdAt) }}</span>
            </div>
            <p v-if="conv.participantEmail" class="text-[11px] text-gray-400 truncate">{{ conv.participantEmail }}</p>
            <p v-else class="text-[11px] text-gray-400 italic truncate">{{ t('Unknown User') }}</p>
            <div class="flex items-center gap-1.5 mt-1">
              <span v-if="conv.lastMessage.isAdmin" class="text-[10px] font-bold text-blue-600">{{ t('YOU:') }}</span>
              <p class="text-xs text-gray-500 truncate">
                {{ conv.lastMessage.type === 'image' ? 'Sent an image' : conv.lastMessage.content }}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Chat Area -->
    <div :class="['flex-1 flex flex-col bg-gray-50', !selectedGroupId ? 'hidden md:flex' : '']">
      
      <template v-if="selectedGroupId && activeConversation">
        <!-- Chat Header -->
        <div class="h-20 px-6 lg:px-10 flex items-center justify-between bg-white border-b border-gray-200 z-20 ">
          <div class="flex items-center gap-4">
            <button @click="selectedGroupId = null" class="p-2 -ml-2 md:hidden text-gray-400 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              {{ (activeConversation.name || 'G').charAt(0).toUpperCase() }}
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 leading-tight">{{ activeConversation.name }}</h3>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider" :class="isTyping && isTyping.isGuest ? 'text-emerald-500' : 'text-gray-400'">
                  {{ isTyping && isTyping.isGuest ? 'Typing...' : 'Online' }}
                </span>
                <span v-if="activeConversation.participantEmail" class="text-[10px] text-gray-300">|</span>
                <span v-if="activeConversation.participantEmail" class="text-[10px] text-gray-400">
                  {{ activeConversation.participantEmail }}
                </span>
              </div>
            </div>
          </div>
          <div class="hidden sm:block">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              {{ activeConversation.messages.length }} Messages
            </span>
          </div>
        </div>

        <!-- Messages -->
        <div ref="messageContainer" class="flex-1 overflow-y-auto px-6 lg:px-20 py-8 space-y-6 custom-scrollbar">
          <div class="flex justify-center mb-8">
            <span class="px-4 py-1.5 bg-gray-200/50 text-[10px] font-bold text-gray-500 uppercase tracking-wider rounded-full">
              {{ t('Message History') }}
            </span>
          </div>

          <div 
            v-for="(msg, index) in (activeConversation.messages as any[])" 
            :key="msg._id || index" 
            :class="['flex mb-2', isOwnMessage(msg) ? 'justify-end' : 'justify-start']"
          >
            <div :class="['max-w-[80%] md:max-w-[70%] space-y-1', isOwnMessage(msg) ? 'items-end' : 'items-start']">
              <p v-if="!isOwnMessage(msg) && (index === 0 || (index > 0 && (activeConversation.messages as any[])[index-1].isAdmin))" class="text-[10px] font-bold text-gray-400 uppercase tracking-wide px-1">
                {{ msg.guestName || 'Guest' }}
              </p>

              <div :class="['px-4 py-3 rounded-lg  relative',
                isOwnMessage(msg) 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100']"
              >
                <!-- Image -->
                <div v-if="msg.type === 'image'" class="mb-2 rounded-lg overflow-hidden border border-black/5">
                  <img :src="msg.imageUrl" alt="Image" class="max-w-full h-auto" />
                </div>

                <p class="text-sm font-medium leading-relaxed">{{ msg.content }}</p>

                <div class="flex items-center justify-end gap-2 mt-2 opacity-60">
                  <span class="text-[9px] font-bold uppercase">{{ formatTime(msg.createdAt) }}</span>
                  <div v-if="isOwnMessage(msg)" class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-6 lg:px-20 bg-white border-t border-gray-100">
          <div class="flex items-end gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100 focus-within:border-blue-200 transition-colors ">
            <button 
              @click="triggerFileInput" 
              class="p-3 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
              title="Attach Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleImageUpload" />
            
            <textarea 
              v-model="newMessage"
              @keypress="handleTyping"
              @keyup.enter.exact.prevent="handleSend"
              rows="1"
             
              class="flex-1 bg-transparent px-2 py-3 text-sm font-bold text-gray-900 outline-none border-none placeholder:text-gray-300 resize-none max-h-40"
              @input="(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = (target.scrollHeight > 160 ? 160 : target.scrollHeight) + 'px';
              }"
            ></textarea>

            <button 
              @click="handleSend" 
              :disabled="!newMessage.trim()"
              class="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-30 transition-all  active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div v-else class="flex-1 items-center justify-center bg-gray-50 hidden md:flex p-10">
        <div class="text-center max-w-sm space-y-6">
          <div class="w-24 h-24 bg-white rounded-2xl border border-gray-100 flex items-center justify-center mx-auto ">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-extrabold text-gray-900 tracking-tight">Select a Chat</h2>
            <p class="text-sm font-medium text-gray-400 mt-2">
              Choose a conversation from the list to start chatting.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
ate>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
</style>
