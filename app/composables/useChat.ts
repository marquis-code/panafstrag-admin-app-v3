import { io, Socket } from 'socket.io-client';

export const useChat = () => {
  const config = useRuntimeConfig();
  const { user } = useAuth();
  const socket = ref<Socket | null>(null);
  const messages = ref<any[]>([]);
  const isConnected = ref(false);

  const connect = () => {
    if (socket.value) return;

    socket.value = io(`${config.public.apiBase}/chat`, {
      transports: ['websocket'],
    });

    socket.value.on('connect', () => {
      isConnected.value = true;
      socket.value?.emit('findAllMessages', {}, (data: any[]) => {
        messages.value = data;
      });
    });

    socket.value.on('disconnect', () => {
      isConnected.value = false;
    });

    socket.value.on('newMessage', (message: any) => {
      messages.value.push(message);
    });
  };

  const sendMessage = (content: string) => {
    if (!socket.value || !user.value) return;
    socket.value.emit('sendMessage', {
      sender: user.value._id,
      content,
    });
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
  };

  return {
    messages,
    isConnected,
    connect,
    sendMessage,
    disconnect,
  };
};
