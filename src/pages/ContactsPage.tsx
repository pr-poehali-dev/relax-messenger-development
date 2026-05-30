import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from '@/components/Avatar';
import { MOCK_USERS, type User } from '@/store/useStore';

interface ContactsPageProps {
  onOpenChat?: (userId: string) => void;
}

export default function ContactsPage({ onOpenChat }: ContactsPageProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<User | null>(null);

  const contacts = MOCK_USERS.filter(u => u.id !== 'me');
  const filtered = contacts.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, User[]>>((acc, user) => {
    const letter = user.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(user);
    return acc;
  }, {});

  const STATUS_LABEL: Record<string, string> = { online: 'в сети', offline: 'не в сети', away: 'отошёл' };
  const STATUS_COLOR: Record<string, string> = { online: '#34d399', offline: '#6b7280', away: '#f59e0b' };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Контакты</h1>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
            <Icon name="UserPlus" size={18} />
          </button>
        </div>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Найти контакт..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-muted rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Online banner */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{contacts.filter(u => u.status === 'online').length} онлайн из {contacts.length}</span>
        </div>
      </div>

      {/* Contacts */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(grouped).sort().map(([letter, users]) => (
          <div key={letter}>
            <div className="px-4 py-2 sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
              <span className="text-xs font-bold text-primary">{letter}</span>
            </div>
            {users.map((user, i) => (
              <button key={user.id}
                onClick={() => setSelected(selected?.id === user.id ? null : user)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all animate-fade-in"
                style={{ animationDelay: `${i * 30}ms` }}>
                <Avatar text={user.avatar} size="md" online={user.status === 'online'} />
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-sm">{user.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs" style={{ color: STATUS_COLOR[user.status] }}>●</span>
                    <span className="text-xs text-muted-foreground">{STATUS_LABEL[user.status]}</span>
                    <span className="text-xs text-muted-foreground">· @{user.username}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Contact detail sheet */}
      {selected && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end animate-fade-in" onClick={() => setSelected(null)}>
          <div className="glass border-t border-border rounded-t-3xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5" />
            <div className="flex items-center gap-4 mb-5">
              <Avatar text={selected.avatar} size="lg" online={selected.status === 'online'} />
              <div>
                <h2 className="font-bold text-lg">{selected.name}</h2>
                <p className="text-sm text-muted-foreground">@{selected.username}</p>
                <p className="text-xs mt-0.5" style={{ color: STATUS_COLOR[selected.status] }}>
                  {STATUS_LABEL[selected.status]}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { icon: 'MessageCircle', label: 'Написать', action: () => { onOpenChat?.(selected.id); setSelected(null); } },
                { icon: 'Phone', label: 'Позвонить', action: () => {} },
                { icon: 'Video', label: 'Видео', action: () => {} },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action}
                  className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-muted hover:bg-primary/20 transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' }}>
                    <Icon name={btn.icon as 'Phone'} size={18} className="text-white" />
                  </div>
                  <span className="text-xs font-medium">{btn.label}</span>
                </button>
              ))}
            </div>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all">
                <Icon name="UserMinus" size={18} />
                <span className="text-sm">Удалить контакт</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all">
                <Icon name="Ban" size={18} />
                <span className="text-sm">Заблокировать</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
