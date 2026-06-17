import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { sendChatMessage, fetchChatMessages } from '../../api/chatService.js';
import { io } from 'socket.io-client';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://splitmate-backend-ewyn.onrender.com/api';

const socket = io(API_URL.replace('/api', ''), {
  transports: ['websocket']
});

const ChatBox = ({ roomId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    socket.emit('joinRoom', roomId);
    return () => socket.emit('leaveRoom', roomId);
  }, [roomId]);

  useEffect(() => {
    const loadMessages = async () => {
      const response = await fetchChatMessages(roomId);
      setMessages(response.data.data.messages);
    };
    loadMessages();
  }, [roomId]);

  useEffect(() => {
    socket.on('newMessage', (payload) => {
      if (payload.roomId === roomId) setMessages((prev) => [...prev, payload]);
    });
    return () => socket.off('newMessage');
  }, [roomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendChatMessage(roomId, { content: message });
    setMessage('');
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">Chat room</h2>
        <div className="mt-6 flex h-[28rem] flex-col gap-4 overflow-y-auto pr-2">
          {messages.map((msg) => (
            <motion.div key={msg._id} layout className="rounded-3xl bg-slate-950/70 p-4 text-sm text-slate-200">
              <div className="mb-2 flex items-center gap-3">
                <span className="font-semibold text-white">{msg.sender.name}</span>
                <span className="text-xs text-slate-500">{new Date(msg.createdAt).toLocaleTimeString()}</span>
              </div>
              <p>{msg.content}</p>
            </motion.div>
          ))}
          <div ref={scrollRef} />
        </div>
      </div>
      <div className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">Send a message</h2>
        <form onSubmit={handleSend} className="mt-6 flex gap-3">
          <input value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1 rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none" placeholder="Type a message" />
          <button type="submit" className="rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"><Send size={18} /></button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
