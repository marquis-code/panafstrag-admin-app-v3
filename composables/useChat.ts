import { io, Socket } from 'socket.io-client';
import { useUser } from '@/composables/modules/auth/user';

const socket = ref<Socket | null>(null);
const messages = ref<any[]>([]);
const isConnected = ref(false);
const isTyping = ref<{ name: string; isGuest: boolean } | null>(null);

export const useChat = () => {
  const config = useRuntimeConfig();
  const { user } = useUser();

  const fetchHistory = () => {
    if (!socket.value) return;
    console.log('[Chat] AdminApp: 📥 Manually Fetching all messages...');
    socket.value.emit('findAllMessages', { isAdmin: true }, (data: any[]) => {
      console.log(`[Chat] AdminApp: ✅ Synchronized ${data?.length || 0} messages from history`);
      messages.value = data || [];
    });
  };

  const connect = () => {
    if (socket.value) {
      if (socket.value.connected) {
        console.log('[Chat] AdminApp: Already connected. Triggering history sync...');
        fetchHistory();
      }
      return;
    }

    console.log('[Chat] AdminApp: 🔌 Initiating connection to', config.public.apiBase);
    socket.value = io(config.public.apiBase, {
      transports: ['websocket'],
    });

    socket.value.on('connect', () => {
      console.log('[Chat] AdminApp: 🟢 Socket connected successfully! ID:', socket.value?.id);
      isConnected.value = true;
      
      console.log('[Chat] AdminApp: 🏠 Joining admin-room...');
      socket.value?.emit('joinRoom', { roomId: 'admin-room' });

      fetchHistory();
    });

    socket.value.on('connect_error', (error) => {
      console.error('[Chat] AdminApp: 🔴 Socket connection error:', error);
      isConnected.value = false;
    });

    socket.value.on('disconnect', (reason) => {
      console.log(`[Chat] AdminApp: 🟠 Socket disconnected. Reason: ${reason}`);
      isConnected.value = false;
    });

    socket.value.on('newMessage', (message: any) => {
      console.log('[Chat] AdminApp: 📥 Received newMessage:', message._id, message.content?.substring(0, 30));
      // Deduplicate: prevent double messages when admin is in both admin-room and conversationId room
      const exists = messages.value.some((m: any) => m._id === message._id);
      if (!exists) {
        messages.value = [...messages.value, message];
      }
    });

    socket.value.on('userTyping', (data: { name: string; isGuest: boolean }) => {
      isTyping.value = data;
    });

    socket.value.on('userStoppedTyping', () => {
      isTyping.value = null;
    });
  };

  const setTyping = (isCurrentlyTyping: boolean, name: string, isGuest: boolean, roomId?: string) => {
    if (!socket.value) return;
    const event = isCurrentlyTyping ? 'typing' : 'stopTyping';
    socket.value.emit(event, { name, isGuest, roomId });
  };

  const sendMessage = (content: string, type: 'text' | 'image' = 'text', imageUrl?: string, conversationId?: string) => {
    console.log('[Chat] AdminApp: sendMessage called. socket:', !!socket.value, 'user:', !!(user.value), 'conversationId:', conversationId);
    
    if (!socket.value) {
      console.error('[Chat] AdminApp: ❌ Cannot send — socket not connected');
      return;
    }
    
    const payload = {
      sender: (user.value as any)?._id,
      content,
      type,
      imageUrl,
      conversationId,
      isAdmin: true,
    };
    
    console.log('[Chat] AdminApp: 📤 Emitting sendMessage:', JSON.stringify(payload));
    socket.value.emit('sendMessage', payload);
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
  };

  return {
    socket,
    messages,
    isConnected,
    isTyping,
    setTyping,
    connect,
    sendMessage,
    disconnect,
    fetchHistory,
  };
};
