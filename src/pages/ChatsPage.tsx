import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from '@/components/Avatar';
import CreateChatDialog from '@/components/CreateChatDialog';
import { useStore, type Chat } from '@/store/useStore';

interface ChatsPageProps {
  onOpenChat: (chat: Chat) => void;
}

export default function ChatsPage({ onOpenChat }: ChatsPageProps) {
  const store = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups' | 'channels'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [swipedId, setSwipedId] = useState<string | null>(null);

  const filtered = store.chats.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'unread') return matchSearch && c.unread > 0;
    if (filter === 'groups') return matchSearch && c.type === 'group';
    if (filter === 'channels') return matchSearch && c.type === 'channel';
    return matchSearch;
  });

  const pinned = filtered.filter(c => c.pinned);
  const unpinned = filtered.filter(c => !c.pinned);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">Сообщения</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' }}>
            <Icon name="SquarePen" size={17} />
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Поиск..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-muted rounded-xl pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon name="X" size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="flex gap-2 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
          {[
            { id: 'all', label: 'Все' },
            { id: 'unread', label: 'Непрочитанные' },
            { id: 'groups', label: 'Группы' },
            { id: 'channels', label: 'Каналы' },
          ].map(f => (
            <button key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
              style={filter === f.id ? {
                background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))',
                color: 'white'
              } : { background: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filter === 'all' && pinned.length > 0 && (
          <div>
            <div className="px-4 py-2 flex items-center gap-1.5">
              <Icon name="Pin" size={11} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Закреплённые</span>
            </div>
            {pinned.map((chat, i) => (
              <ChatRow key={chat.id}
                chat={chat}
                onClick={() => { setSwipedId(null); onOpenChat(chat); }}
                onSwipe={() => setSwipedId(swipedId === chat.id ? null : chat.id)}
                swiped={swipedId === chat.id}
                onPin={() => store.togglePin(chat.id)}
                onMute={() => store.toggleMute(chat.id)}
                onDelete={() => store.deleteChat(chat.id)}
                delay={i * 30} />
            ))}
            <div className="mx-4 h-px bg-border my-0.5" />
          </div>
        )}

        {unpinned.map((chat, i) => (
          <ChatRow key={chat.id}
            chat={chat}
            onClick={() => { setSwipedId(null); onOpenChat(chat); }}
            onSwipe={() => setSwipedId(swipedId === chat.id ? null : chat.id)}
            swiped={swipedId === chat.id}
            onPin={() => store.togglePin(chat.id)}
            onMute={() => store.toggleMute(chat.id)}
            onDelete={() => store.deleteChat(chat.id)}
            delay={i * 25} />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Icon name="MessageCircle" size={40} className="mb-3 opacity-20" />
            <p className="text-sm font-medium">Нет чатов</p>
            <p className="text-xs mt-1">Нажмите ✏️ чтобы начать общение</p>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateChatDialog
          onClose={() => setShowCreate(false)}
          onCreated={chat => { setShowCreate(false); onOpenChat(chat); }}
        />
      )}
    </div>
  );
}

interface ChatRowProps {
  chat: Chat;
  onClick: () => void;
  onSwipe: () => void;
  swiped: boolean;
  onPin: () => void;
  onMute: () => void;
  onDelete: () => void;
  delay: number;
}

function ChatRow({ chat, onClick, onSwipe, swiped, onPin, onMute, onDelete, delay }: ChatRowProps) {
  const TYPE_ICON = chat.type === 'channel' ? '📡' : chat.type === 'group' ? null : null;

  return (
    <div className="relative overflow-hidden animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      {/* Swipe actions (visible when swiped) */}
      <div className={`absolute right-0 top-0 bottom-0 flex items-center gap-1 pr-2 transition-all duration-200 ${swiped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={onPin}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'hsl(262,83%,65%,0.2)' }}>
          <Icon name={chat.pinned ? 'PinOff' : 'Pin'} size={16} className="text-primary" />
        </button>
        <button onClick={onMute}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'hsl(185,85%,55%,0.15)' }}>
          <Icon name={chat.muted ? 'Bell' : 'BellOff'} size={16} className="text-cyan-400" />
        </button>
        <button onClick={onDelete}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'hsl(0,72%,55%,0.15)' }}>
          <Icon name="Trash2" size={16} className="text-destructive" />
        </button>
      </div>

      <div
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 active:bg-muted/80 hover:bg-muted/40 ${swiped ? 'translate-x-[-108px]' : 'translate-x-0'}`}
        onClick={onClick}
        onContextMenu={e => { e.preventDefault(); onSwipe(); }}>
        <div className="relative flex-shrink-0">
          <Avatar text={chat.avatar} size="md" online={chat.online} />
          {chat.type === 'channel' && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[8px]">
              📡
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-semibold text-sm truncate">{chat.name}</span>
              {chat.muted && <Icon name="BellOff" size={11} className="text-muted-foreground flex-shrink-0" />}
              {chat.pinned && <Icon name="Pin" size={11} className="text-muted-foreground flex-shrink-0" />}
            </div>
            <span className={`text-xs flex-shrink-0 ml-2 ${chat.unread > 0 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
              {chat.lastTime}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground truncate pr-2 leading-snug">{chat.lastMessage}</p>
            {chat.unread > 0 && (
              <span className="flex-shrink-0 min-w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1"
                style={chat.muted
                  ? { background: 'hsl(var(--muted-foreground))' }
                  : { background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' }}>
                {chat.unread > 99 ? '99+' : chat.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
