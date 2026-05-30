import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from '@/components/Avatar';
import { MOCK_MESSAGES, MOCK_USERS, type Chat, type Message } from '@/store/useStore';

interface ChatPageProps {
  chat: Chat;
  onBack: () => void;
  onCall: (chat: Chat) => void;
}

export default function ChatPage({ chat, onBack, onCall }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES[chat.id] || []);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (text.length > 0) {
      setIsTyping(true);
      const t = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(t);
    }
  }, [text]);

  const send = () => {
    if (!text.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      chatId: chat.id,
      senderId: 'me',
      text: text.trim(),
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setMessages(prev => [...prev, msg]);
    setText('');
    inputRef.current?.focus();

    // Simulate reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: `m${Date.now() + 1}`,
          chatId: chat.id,
          senderId: chat.type === 'group' ? 'u1' : (chat.id === 'c1' ? 'u1' : chat.id === 'c2' ? 'u2' : 'u3'),
          text: getAutoReply(text),
          time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
          read: false,
        }]);
      }, 1500 + Math.random() * 1000);
    }, 800);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const senderOf = (id: string) => MOCK_USERS.find(u => u.id === id);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0 z-10">
        <button onClick={onBack} className="mr-1 w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all md:hidden">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <button onClick={() => setShowInfo(v => !v)} className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar text={chat.avatar} size="sm" online={chat.online} />
          <div className="text-left min-w-0">
            <p className="font-semibold text-sm truncate">{chat.name}</p>
            <p className="text-xs text-muted-foreground">
              {isTyping
                ? <span className="text-emerald-400 animate-pulse">печатает...</span>
                : chat.online ? 'в сети' : chat.type === 'group' ? `${chat.members?.length || 5} участников` : 'был(а) недавно'
              }
            </p>
          </div>
        </button>
        <div className="flex items-center gap-1">
          <button onClick={() => onCall(chat)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
            <Icon name="Phone" size={18} />
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
            <Icon name="Video" size={18} />
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <Icon name="Search" size={18} />
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <Icon name="MoreVertical" size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
        style={{ background: 'radial-gradient(ellipse at top, hsl(262,83%,65%,0.03) 0%, transparent 60%)' }}>
        {messages.map((msg, i) => {
          const isMe = msg.senderId === 'me';
          const sender = senderOf(msg.senderId);
          const prevMsg = messages[i - 1];
          const showAvatar = !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);
          const showName = !isMe && chat.type === 'group' && showAvatar;

          return (
            <div key={msg.id}
              className={`flex items-end gap-2 animate-fade-in ${isMe ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${i * 20}ms` }}>
              {!isMe && (
                <div className="w-8 flex-shrink-0">
                  {showAvatar && <Avatar text={sender?.avatar || '?'} size="sm" />}
                </div>
              )}
              <div className={`max-w-[70%] relative group ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                {showName && (
                  <span className="text-xs font-medium mb-1 px-1"
                    style={{ color: 'hsl(var(--relax-purple))' }}>{sender?.name}</span>
                )}
                <div
                  className={`px-4 py-2.5 text-sm leading-relaxed cursor-pointer transition-all duration-150 ${isMe ? 'bubble-out text-white' : 'bubble-in text-foreground'} ${selectedMsg === msg.id ? 'scale-95' : 'hover:brightness-110'}`}
                  onClick={() => setSelectedMsg(selectedMsg === msg.id ? null : msg.id)}>
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1 mt-0.5 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  {isMe && (
                    <Icon name={msg.read ? 'CheckCheck' : 'Check'} size={12}
                      className={msg.read ? 'text-primary' : 'text-muted-foreground'} />
                  )}
                </div>
                {/* Reaction button on hover */}
                <button
                  className={`absolute ${isMe ? '-left-8' : '-right-8'} bottom-6 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center text-sm`}>
                  😊
                </button>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 animate-fade-in">
            <div className="w-8 flex-shrink-0">
              <Avatar text={chat.type === 'group' ? 'ВР' : chat.avatar} size="sm" />
            </div>
            <div className="bubble-in px-4 py-3 flex items-center gap-1">
              <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
              <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
              <div className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Context menu for selected message */}
      {selectedMsg && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-20 glass neon-border rounded-2xl p-1 flex gap-1 animate-scale-in">
          {['👍', '❤️', '😂', '😮', '😢', '🔥'].map(emoji => (
            <button key={emoji} onClick={() => setSelectedMsg(null)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg hover:bg-primary/20 transition-all hover:scale-125">
              {emoji}
            </button>
          ))}
          <div className="w-px bg-border mx-1" />
          <button onClick={() => setSelectedMsg(null)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <Icon name="Reply" size={16} />
          </button>
          <button onClick={() => setSelectedMsg(null)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <Icon name="Copy" size={16} />
          </button>
          <button onClick={() => setSelectedMsg(null)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
            <Icon name="Trash2" size={16} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-end gap-2">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all flex-shrink-0">
            <Icon name="Paperclip" size={20} />
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Сообщение..."
              rows={1}
              className="w-full bg-muted border border-border rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all resize-none max-h-32 overflow-y-auto"
              style={{ lineHeight: '1.5' }}
            />
          </div>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all flex-shrink-0">
            <Icon name="Smile" size={20} />
          </button>
          <button onClick={send}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
            style={text.trim()
              ? { background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))', boxShadow: '0 4px 15px hsl(262,83%,65%,0.4)' }
              : { background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}>
            {text.trim() ? <Icon name="Send" size={18} /> : <Icon name="Mic" size={18} />}
          </button>
        </div>
      </div>

      {/* Chat Info Drawer */}
      {showInfo && (
        <div className="absolute inset-0 z-30 flex" onClick={() => setShowInfo(false)}>
          <div className="flex-1" />
          <div className="w-72 h-full glass border-l border-border animate-slide-in-right" onClick={e => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold">Информация</h3>
                <button onClick={() => setShowInfo(false)} className="text-muted-foreground hover:text-foreground">
                  <Icon name="X" size={18} />
                </button>
              </div>
              <div className="flex flex-col items-center mb-5">
                <Avatar text={chat.avatar} size="xl" online={chat.online} className="mb-3" />
                <h2 className="font-bold text-lg">{chat.name}</h2>
                <p className="text-sm text-muted-foreground">{chat.online ? 'в сети' : 'был(а) недавно'}</p>
              </div>
              <div className="space-y-1">
                {[
                  { icon: 'Bell', label: 'Уведомления', value: chat.muted ? 'Выключены' : 'Включены' },
                  { icon: 'Image', label: 'Медиафайлы', value: '12 фото' },
                  { icon: 'Link', label: 'Ссылки', value: '4 ссылки' },
                ].map(item => (
                  <button key={item.label} className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-muted transition-all">
                    <div className="flex items-center gap-3">
                      <Icon name={item.icon as 'Bell'} size={18} className="text-muted-foreground" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.value}</span>
                  </button>
                ))}
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all">
                  <Icon name="Trash2" size={18} />
                  <span className="text-sm">Очистить чат</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getAutoReply(text: string): string {
  const replies = [
    'Понял, спасибо! 👍',
    'Окей, договорились!',
    'Хорошо, напишу чуть позже',
    'Да, конечно!',
    'Интересно! Расскажи подробнее',
    'Отлично! Жду 🎉',
    'Хм, надо подумать...',
    'Согласен полностью!',
    '👍',
    'Ок!',
    'Понял тебя',
    'Буду иметь в виду',
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}
