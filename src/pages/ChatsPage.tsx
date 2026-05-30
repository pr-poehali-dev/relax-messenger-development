import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from '@/components/Avatar';
import { MOCK_CHATS, type Chat } from '@/store/useStore';

interface ChatsPageProps {
  onOpenChat: (chat: Chat) => void;
}

export default function ChatsPage({ onOpenChat }: ChatsPageProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups'>('all');

  const filtered = MOCK_CHATS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'unread') return matchSearch && c.unread > 0;
    if (filter === 'groups') return matchSearch && c.type === 'group';
    return matchSearch;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Сообщения</h1>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
            <Icon name="SquarePen" size={18} />
          </button>
        </div>
        {/* Search */}
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Поиск чатов..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-muted rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon name="X" size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>
        {/* Filters */}
        <div className="flex gap-2 mt-3">
          {[{ id: 'all', label: 'Все' }, { id: 'unread', label: 'Непрочитанные' }, { id: 'groups', label: 'Группы' }].map(f => (
            <button key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
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
        {/* Pinned */}
        {filter === 'all' && filtered.some(c => c.pinned) && (
          <div>
            <div className="px-4 py-2 flex items-center gap-2">
              <Icon name="Pin" size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Закреплённые</span>
            </div>
            {filtered.filter(c => c.pinned).map((chat, i) => (
              <ChatRow key={chat.id} chat={chat} onClick={() => onOpenChat(chat)} delay={i * 30} />
            ))}
            <div className="mx-4 border-b border-border my-1" />
          </div>
        )}

        {/* All chats */}
        {filtered.filter(c => filter !== 'all' || !c.pinned).map((chat, i) => (
          <ChatRow key={chat.id} chat={chat} onClick={() => onOpenChat(chat)} delay={i * 30} />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <Icon name="MessageCircle" size={40} className="mb-3 opacity-30" />
            <p className="text-sm">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatRow({ chat, onClick, delay }: { chat: Chat; onClick: () => void; delay: number }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all duration-150 animate-fade-in group"
      style={{ animationDelay: `${delay}ms` }}>
      <Avatar text={chat.avatar} size="md" online={chat.online} />
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm truncate">{chat.name}</span>
            {chat.muted && <Icon name="BellOff" size={12} className="text-muted-foreground flex-shrink-0" />}
          </div>
          <span className={`text-xs flex-shrink-0 ${chat.unread > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
            {chat.lastTime}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground truncate pr-2">{chat.lastMessage}</p>
          {chat.unread > 0 && (
            <span className="flex-shrink-0 min-w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1"
              style={chat.muted
                ? { background: 'hsl(var(--muted-foreground))' }
                : { background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' }}>
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
