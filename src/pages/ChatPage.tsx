import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from '@/components/Avatar';
import { useStore, PLATFORM_USERS, type Chat, type Message } from '@/store/useStore';

interface ChatPageProps {
  chat: Chat;
  onBack: () => void;
  onCall: (chat: Chat) => void;
}

const AUTO_REPLIES = [
  'Понял, спасибо! 👍', 'Окей, договорились!', 'Хорошо, напишу чуть позже',
  'Да, конечно!', 'Интересно! Расскажи подробнее', 'Отлично! Жду 🎉',
  'Хм, надо подумать...', 'Согласен полностью!', '👍', 'Ок!', 'Понял тебя',
  'Буду иметь в виду', 'Отличная идея!', 'Супер 🔥', 'Без проблем!',
];

export default function ChatPage({ chat, onBack, onCall }: ChatPageProps) {
  const appStore = useStore();
  const [localMessages, setLocalMessages] = useState<Message[]>(
    () => appStore.messages[chat.id] || []
  );
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync with store
  useEffect(() => {
    setLocalMessages(appStore.messages[chat.id] || []);
  }, [appStore.messages, chat.id]);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [localMessages.length]);

  useEffect(() => {
    appStore.markRead(chat.id);
  }, [chat.id]);

  const send = () => {
    if (!text.trim()) return;
    const msg = appStore.sendMessage(chat.id, text.trim());
    setText('');
    inputRef.current?.focus();

    if (chat.type === 'channel') return;

    // Simulate reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const members = chat.members?.filter(id => id !== 'me') || [];
        const senderId = members[Math.floor(Math.random() * members.length)] || 'u1';
        appStore.receiveMessage(chat.id, senderId, AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)]);
      }, 1200 + Math.random() * 1200);
    }, 600);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const senderOf = (id: string) => PLATFORM_USERS.find(u => u.id === id);

  const subTitle = () => {
    if (chat.type === 'channel') return `${chat.subscribersCount?.toLocaleString('ru') || 0} подписчиков`;
    if (chat.type === 'group') return `${chat.members?.length || 0} участников`;
    if (chat.online) return 'в сети';
    return 'был(а) недавно';
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-card/90 backdrop-blur-xl flex-shrink-0 z-10"
        style={{ paddingTop: 'max(10px, env(safe-area-inset-top))' }}>
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex-shrink-0">
          <Icon name="ArrowLeft" size={22} />
        </button>
        <button onClick={() => setShowInfo(v => !v)} className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
          <Avatar text={chat.avatar} size="sm" online={chat.online} />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate leading-tight">{chat.name}</p>
            <p className="text-xs leading-tight" style={{ color: isTyping ? '#34d399' : 'hsl(var(--muted-foreground))' }}>
              {isTyping ? 'печатает...' : subTitle()}
            </p>
          </div>
        </button>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {chat.type !== 'channel' && (
            <button onClick={() => onCall(chat)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
              <Icon name="Phone" size={18} />
            </button>
          )}
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <Icon name="Search" size={18} />
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <Icon name="MoreVertical" size={18} />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5"
        style={{ background: 'radial-gradient(ellipse at top, hsl(262,83%,65%,0.04) 0%, transparent 60%)' }}
        onClick={() => setSelectedMsg(null)}>

        {localMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
              <Avatar text={chat.avatar} size="md" />
            </div>
            <p className="font-medium text-sm">{chat.name}</p>
            <p className="text-xs mt-1">{chat.description || 'Начни переписку!'}</p>
          </div>
        )}

        {localMessages.map((msg, i) => {
          const isMe = msg.senderId === 'me';
          const isChannel = chat.type === 'channel';
          const sender = senderOf(msg.senderId);
          const prevMsg = localMessages[i - 1];
          const nextMsg = localMessages[i + 1];
          const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId;
          const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;
          const showAvatar = !isMe && !isChannel && isLastInGroup;
          const showName = !isMe && !isChannel && chat.type === 'group' && isFirstInGroup;

          return (
            <div key={msg.id}
              className={`flex items-end gap-1.5 ${isMe || isChannel ? 'justify-end' : 'justify-start'} ${isLastInGroup ? 'mb-2' : 'mb-0.5'}`}>
              {!isMe && !isChannel && (
                <div className="w-7 flex-shrink-0 mb-0.5">
                  {showAvatar && <Avatar text={sender?.avatar || '?'} size="sm" />}
                </div>
              )}
              <div className={`max-w-[78%] flex flex-col ${isMe || isChannel ? 'items-end' : 'items-start'}`}>
                {showName && (
                  <span className="text-[11px] font-semibold mb-0.5 px-1" style={{ color: 'hsl(var(--relax-purple))' }}>
                    {sender?.name || msg.senderId}
                  </span>
                )}
                <div
                  className={`relative px-3 py-2 text-sm leading-relaxed cursor-pointer transition-all select-none ${isMe ? 'bubble-out text-white' : isChannel ? 'bg-card border border-border rounded-2xl text-foreground' : 'bubble-in text-foreground'} ${selectedMsg === msg.id ? 'opacity-80 scale-[0.98]' : ''}`}
                  onClick={e => { e.stopPropagation(); setSelectedMsg(selectedMsg === msg.id ? null : msg.id); }}>
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1 mt-0.5 px-0.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  {isMe && (
                    <Icon name={msg.read ? 'CheckCheck' : 'Check'} size={11}
                      className={msg.read ? 'text-primary' : 'text-muted-foreground'} />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-end gap-1.5 mb-2">
            <div className="w-7 flex-shrink-0">
              <Avatar text={chat.avatar} size="sm" />
            </div>
            <div className="bubble-in px-3.5 py-3 flex items-center gap-1">
              <div className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <div className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <div className="typing-dot w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reaction / context popup */}
      {selectedMsg && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-24 z-20 glass neon-border rounded-2xl p-1 flex gap-0.5 animate-scale-in shadow-2xl"
          onClick={e => e.stopPropagation()}>
          {['👍', '❤️', '😂', '😮', '😢', '🔥'].map(emoji => (
            <button key={emoji} onClick={() => setSelectedMsg(null)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base hover:bg-primary/20 transition-all hover:scale-125 active:scale-110">
              {emoji}
            </button>
          ))}
          <div className="w-px bg-border mx-0.5" />
          {[
            { icon: 'Reply', action: () => setSelectedMsg(null) },
            { icon: 'Copy', action: () => { navigator.clipboard?.writeText(localMessages.find(m => m.id === selectedMsg)?.text || ''); setSelectedMsg(null); } },
            { icon: 'Trash2', action: () => setSelectedMsg(null) },
          ].map(btn => (
            <button key={btn.icon} onClick={btn.action}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
              <Icon name={btn.icon as 'Reply'} size={15} />
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      {chat.type !== 'channel' ? (
        <div
          className="px-3 py-2 border-t border-border bg-card/90 backdrop-blur-xl flex-shrink-0"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}>
          <div className="flex items-end gap-2">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all flex-shrink-0 mb-0.5">
              <Icon name="Paperclip" size={19} />
            </button>
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={text}
                onChange={e => { setText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
                onKeyDown={handleKey}
                placeholder="Сообщение..."
                rows={1}
                className="w-full bg-muted border border-border rounded-2xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all resize-none overflow-hidden"
                style={{ lineHeight: '1.4', minHeight: '38px', maxHeight: '120px' }}
              />
            </div>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all flex-shrink-0 mb-0.5">
              <Icon name="Smile" size={19} />
            </button>
            <button
              onClick={send}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0 mb-0.5"
              style={text.trim()
                ? { background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))', boxShadow: '0 3px 12px hsl(262,83%,65%,0.4)' }
                : { background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}>
              {text.trim() ? <Icon name="Send" size={17} /> : <Icon name="Mic" size={17} />}
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 border-t border-border bg-card/90 flex-shrink-0 text-center"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
          <p className="text-xs text-muted-foreground">Это канал — только администраторы могут писать</p>
        </div>
      )}

      {/* Info drawer */}
      {showInfo && (
        <div className="absolute inset-0 z-30 flex" onClick={() => setShowInfo(false)}>
          <div className="flex-1" />
          <div className="w-72 h-full glass border-l border-border animate-slide-in-right overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Информация</h3>
                <button onClick={() => setShowInfo(false)} className="text-muted-foreground hover:text-foreground">
                  <Icon name="X" size={18} />
                </button>
              </div>
              <div className="flex flex-col items-center mb-5">
                <Avatar text={chat.avatar} size="xl" online={chat.online} className="mb-3" />
                <h2 className="font-bold text-lg text-center">{chat.name}</h2>
                <p className="text-sm text-muted-foreground">{subTitle()}</p>
                {chat.description && <p className="text-xs text-muted-foreground/80 mt-2 text-center leading-relaxed">{chat.description}</p>}
              </div>
              <div className="space-y-1">
                {[
                  { icon: 'Bell', label: 'Уведомления', value: chat.muted ? 'Выкл.' : 'Вкл.' },
                  { icon: 'Image', label: 'Медиафайлы', value: '12 фото' },
                  { icon: 'Link', label: 'Ссылки', value: '4 ссылки' },
                ].map(item => (
                  <button key={item.label} className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-muted transition-all">
                    <div className="flex items-center gap-3">
                      <Icon name={item.icon as 'Bell'} size={17} className="text-muted-foreground" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.value}</span>
                  </button>
                ))}
                {chat.type === 'group' && chat.members && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-1 mb-2">Участники</p>
                    {chat.members.map(id => {
                      const u = id === 'me' ? { name: 'Вы', avatar: 'АС', status: 'online' as const } : PLATFORM_USERS.find(p => p.id === id);
                      if (!u) return null;
                      return (
                        <div key={id} className="flex items-center gap-2 px-1 py-2">
                          <Avatar text={u.avatar} size="sm" online={u.status === 'online'} />
                          <span className="text-sm">{u.name}</span>
                          {id === 'me' && <span className="text-xs text-muted-foreground ml-auto">Вы</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all mt-2">
                  <Icon name="Trash2" size={17} />
                  <span className="text-sm">Очистить историю</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
