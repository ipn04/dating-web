'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { showNotification } from '@/app/utils/notifications';

let socket: Socket | null = null;

export default function useChat(userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);
  const initializedRef = useRef(false);
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

  useEffect(() => {
    if (!userId || initializedRef.current) return;

    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      socket?.emit('joinRoom', userId);
    });

    socket.on('newMessage', (message) => {
      setMessages((prev) => {
        const exists = prev.some(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
      if (message.senderId !== userId) {
        showNotification('New Message', message.content);
      }
    });

    socket.on('disconnect', () => {
      console.log('[useChat] Socket disconnected');
    });

    initializedRef.current = true;

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      initializedRef.current = false;
    };
  }, [userId]);

  const sendMessage = (receiverId: string, content: string) => {
    if (!socket || !socket.connected) {
      return;
    }
    socket.emit('sendMessage', { senderId: userId, receiverId, content });
  };

  return { messages, sendMessage };
}