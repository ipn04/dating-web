import { MessageCircle, X, Send } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLazyGetMessagesQuery, useSendMessageMutation } from '@/app/reducer/app/AppApi';
import useChat from '@/app/hooks/useChat';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { IRootState } from '@/app/config/store';

interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  profile?: string;
  matchId?: string;
  createdAt?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  matchId: string;
  createdAt: string;
  isRead: boolean;
  isDelivered: boolean;
}

interface MessageModalProps {
  showMessagesModal: boolean;
  setShowMessagesModal: (value: boolean) => void;
  matches: User[];
  currentUserId: string;
  selectedMatch: User | null;
}

export default function MessageModal({
  showMessagesModal,
  setShowMessagesModal,
  matches,
  currentUserId,
  selectedMatch,
}: MessageModalProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages: liveMessages, sendMessage: sendLiveMessage } = useChat(currentUserId);

  const [getMessages, { isLoading: loadingMessages }] = useLazyGetMessagesQuery();
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();

  const allMessages = useSelector((state: IRootState) => state.App.messages);

  const lastMessages = useMemo(() => {
    const result: Record<string, string> = {};

    matches.forEach(match => {
      if (!match.matchId) {
        result[match.id] = 'No messages yet';
        return;
      }

      const reduxMsgs = allMessages[match.matchId] || [];
      const liveMsgsForMatch = liveMessages.filter(msg => msg.matchId === match.matchId);

      const allMsgsForMatch = [...reduxMsgs];
      liveMsgsForMatch.forEach(liveMsg => {
        if (!allMsgsForMatch.some(m => m.id === liveMsg.id)) {
          allMsgsForMatch.push(liveMsg);
        }
      });

      if (allMsgsForMatch.length > 0) {
        const sorted = [...allMsgsForMatch].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        result[match.id] = sorted[0].content;
      } else {
        result[match.id] = 'No messages yet';
      }
    });

    return result;
  }, [matches, allMessages, liveMessages]);

  useEffect(() => {
    if (!selectedMatch) return;

    const timeout = setTimeout(() => {
      setSelectedUser(selectedMatch);
    }, 0);

    return () => clearTimeout(timeout);
  }, [selectedMatch]);

  useEffect(() => {
    if (showMessagesModal && matches.length > 0) {
      matches.forEach(match => {
        if (match.matchId) {
          getMessages(match.matchId);
        }
      });
    }
  }, [showMessagesModal, matches, getMessages]);

  useEffect(() => {
    if (!selectedUser) return;

    const loadMessages = async () => {
      try {
        let fetchedMessages: Message[] = [];
        if (selectedUser.matchId) {
          const result = await getMessages(selectedUser.matchId).unwrap();
          fetchedMessages = result || [];
        }

        const liveMsgsForMatch = liveMessages.filter(
          msg => msg.matchId === selectedUser.matchId,
        );

        const allMsgs = [...fetchedMessages, ...liveMsgsForMatch];
        const uniqueMsgs = Array.from(
          new Map(allMsgs.map(msg => [msg.id, msg])).values(),
        );

        uniqueMsgs.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

        setMessages(uniqueMsgs);
      } catch (error) {
        console.error('Failed to load messages:', error);
        setMessages([]);
      }
    };

    loadMessages();
  }, [selectedUser, liveMessages, getMessages]);

  useEffect(() => {
    if (!selectedUser) return;

    const filtered = liveMessages.filter(
      msg =>
        msg.senderId !== currentUserId &&
      msg.matchId === selectedUser.matchId,
    );

    setMessages(prev => {
      const ids = new Set(prev.map(m => m.id));
      const newMsgs = filtered.filter(m => m.id && !ids.has(m.id));
      if (newMsgs.length === 0) return prev;
      return [...prev, ...newMsgs];
    });
  }, [liveMessages, selectedUser, currentUserId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedUser) return;

    sendLiveMessage(selectedUser.id, messageInput.trim());
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // const messagesContainerRef = useRef<HTMLDivElement>(null);
  // const [visibleMessages, setVisibleMessages] = useState(2);

  // const handleScroll = () => {
  //   if (!messagesContainerRef.current) return;
  //   const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;

  //   if (scrollTop + clientHeight >= scrollHeight - 10) {
  //     // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  //     setVisibleMessages(prev => prev + 2);
  //   }
  // };

  // useEffect(() => {
  //   const container = messagesContainerRef.current;
  //   if (!container) return;

  //   container.addEventListener('scroll', handleScroll);
  //   return () => {
  //     container.removeEventListener('scroll', handleScroll);
  //   };
  // }, [messages]);

  return (
    <>
      {showMessagesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl shadow-2xl w-full max-w-5xl h-[600px] flex flex-col">
            <div className="flex rounded-t-2xl items-center justify-between p-6 border-b border-white/20 shadow-[0_4px_10px_-2px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 primary-light" />
                <h2 className="text-2xl font-bold primary-light">Messages</h2>
              </div>
              <button
                onClick={() => setShowMessagesModal(false)}
                className="primary-light hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="w-1/3 overflow-y-auto bg-white/10 rounded-bl-2xl no-scrollbar shadow-[2px_-2px_10px_-2px_rgba(0,0,0,0.1)]">
                {matches.length === 0 ? (
                  <div className="p-6 text-center text-primary">
                    No matches yet. Start swiping!
                  </div>
                ) : (
                  matches.map((matches) => (
                    <div
                      key={matches.id}
                      onClick={() => setSelectedUser(matches)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-400 ${
                        selectedUser?.id === matches.id ? 'bg-gray-400' : ''
                      }`}
                    >
                      <div className="h-12 flex items-center gap-3">
                        <div className="w-12 h-12 relative rounded-full overflow-hidden">
                          <Image
                            src={matches.profile || '/default-avatar.png'}
                            alt={matches.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold primary-light truncate">
                            {matches.name}
                          </h3>
                          <p className="text-sm primary-light truncate">
                            {lastMessages[matches.id] || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex-1 flex flex-col bg-white/5 rounded-br-2xl">
                {selectedUser ? (
                  <>
                    <div className="p-4">
                      <div className="flex h-12 items-center gap-3">
                        <div className="flex h-12 items-center gap-3">
                          <div className="w-12 h-12 relative rounded-full overflow-hidden">
                            <Image
                              src={selectedUser.profile || '/default-avatar.png'}
                              alt={selectedUser.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold prinary-light">{selectedUser.name}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                      {loadingMessages ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="text-primary">Loading messages...</div>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                          <div className="text-center">
                            <p className="text-lg mb-2 primary-light">No messages yet</p>
                            <p className="text-sm primary-light">Send a message to start the conversation!</p>
                          </div>
                        </div>
                      ) : (
                        messages.map((message) => {
                          const isOwnMessage = message.senderId === currentUserId;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                  isOwnMessage
                                    ? 'bg-highlight-background text-primary'
                                    : 'bg-gray-100 text-primary'
                                }`}
                              >
                                <p className="break-words">{message.content}</p>
                                <div className='flex items-center'>
                                  <p className={`text-xs mt-1 ${
                                    isOwnMessage ? 'text-primary' : 'text-primary'
                                  }`}>
                                    {formatTime(message.createdAt)}
                                  </p>
                                  {isOwnMessage && (
                                    <span className="ml-2 text-[10px] text-gray-400">
                                      {message.isDelivered ? 'Delivered' : 'Delivered'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t border-white/20 bg-white/10 rounded-br-2xl">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          className="flex-1 bg-gray-200 text-primary rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                          disabled={sendingMessage}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim() || sendingMessage}
                          className="bg-gray-200 text-primary rounded-full p-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-white/70">
                      <MessageCircle className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                      <p className="text-lg text-primary">Select a chat to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}