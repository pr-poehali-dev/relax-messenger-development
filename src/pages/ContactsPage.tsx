import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from '@/components/Avatar';
import { useStore, PLATFORM_USERS, type User, type Chat } from '@/store/useStore';

interface ContactsPageProps {
  onOpenChat?: (chat: Chat) => void;
}

export default function ContactsPage({ onOpenChat }: ContactsPageProps) {
  const store = useStore();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<User | null>(null);
  const [tab, setTab] = useState<'my' | 'search'>('my');

  const contacts = store.getContacts();

  const searchResults = search.length >= 1
    ? PLATFORM_USERS.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        (u.phone || '').includes(search)
      )
    : [];

  const filteredContacts = contacts.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filteredContacts.reduce<Record<string, User[]>>((acc, user) => {
    const letter = user.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(user);
    return acc;
  }, {});

  const STATUS_COLOR: Record<string, string> = { online: '#34d399', offline: '#6b7280', away: '#f59e0b' };
  const STATUS_LABEL: Record<string, string> = { online: 'в сети', offline: 'не в сети', away: 'отошёл' };

  const openUserChat = (user: User) => {
    store.addContact(user.id);
    const existing = store.chats.find(c => c.type === 'private' && c.name === user.name);
    if (existing) { onOpenChat?.(existing); setSelected(null); return; }
    const chat = store.createChat('private', {
      name: user.name,
      avatar: user.avatar,
      members: ['me', user.id],
    });
    onOpenChat?.(chat);
    setSelected(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">Контакты</h1>
          <div className="flex items-center gap-1 bg-muted rounded-xl p-0.5">
            <button onClick={() => setTab('my')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={tab === 'my' ? { background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' } : { color: 'hsl(var(--muted-foreground))' }}>
              Мои
            </button>
            <button onClick={() => setTab('search')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={tab === 'search' ? { background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' } : { color: 'hsl(var(--muted-foreground))' }}>
              Найти
            </button>
          </div>
        </div>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder={tab === 'my' ? 'Поиск контактов...' : 'Имя, @username или номер'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-muted rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'search' && (
          <div>
            {search.length < 1 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon name="Search" size={28} className="text-primary" />
                </div>
                <p className="font-medium">Найдите людей</p>
                <p className="text-sm mt-1">Введите имя, @username или номер телефона</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Icon name="UserX" size={36} className="mb-3 opacity-30" />
                <p className="text-sm">Никого не найдено</p>
              </div>
            ) : (
              searchResults.map((user, i) => {
                const isContact = store.contacts.includes(user.id);
                return (
                  <button key={user.id}
                    onClick={() => setSelected(user)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all animate-fade-in"
                    style={{ animationDelay: `${i * 30}ms` }}>
                    <Avatar text={user.avatar} size="md" online={user.status === 'online'} />
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">@{user.username}
                        {user.phone && <span className="ml-2 opacity-50">{user.phone}</span>}
                      </p>
                      {user.bio && <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{user.bio}</p>}
                    </div>
                    {isContact
                      ? <span className="text-xs text-primary font-medium flex-shrink-0">Контакт</span>
                      : <button
                          onClick={e => { e.stopPropagation(); store.addContact(user.id); }}
                          className="text-xs text-white px-2.5 py-1 rounded-lg flex-shrink-0 transition-all hover:opacity-90"
                          style={{ background: 'hsl(var(--relax-purple))' }}>
                          + Добавить
                        </button>
                    }
                  </button>
                );
              })
            )}
          </div>
        )}

        {tab === 'my' && (
          <div>
            {contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon name="UserPlus" size={28} className="text-primary" />
                </div>
                <p className="font-medium">Нет контактов</p>
                <p className="text-sm mt-1">Перейди во вкладку «Найти», чтобы добавить людей</p>
              </div>
            ) : (
              Object.entries(grouped).sort().map(([letter, users]) => (
                <div key={letter}>
                  <div className="px-4 py-1.5 sticky top-0 z-10 bg-background/90 backdrop-blur-sm">
                    <span className="text-xs font-bold text-primary">{letter}</span>
                  </div>
                  {users.map((user, i) => (
                    <button key={user.id}
                      onClick={() => setSelected(user)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all animate-fade-in"
                      style={{ animationDelay: `${i * 25}ms` }}>
                      <Avatar text={user.avatar} size="md" online={user.status === 'online'} />
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-sm">{user.name}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px]" style={{ color: STATUS_COLOR[user.status] }}>●</span>
                          <span className="text-xs text-muted-foreground">{STATUS_LABEL[user.status]}</span>
                          <span className="text-xs text-muted-foreground">· @{user.username}</span>
                        </div>
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selected && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative glass border-t border-border rounded-t-3xl p-5 animate-slide-up"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
            onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5" />
            <div className="flex items-center gap-4 mb-5">
              <Avatar text={selected.avatar} size="lg" online={selected.status === 'online'} />
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg truncate">{selected.name}</h2>
                <p className="text-sm text-muted-foreground">@{selected.username}</p>
                {selected.bio && <p className="text-xs text-muted-foreground/70 mt-1 truncate">{selected.bio}</p>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { icon: 'MessageCircle', label: 'Написать', action: () => openUserChat(selected) },
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
            {store.contacts.includes(selected.id) ? (
              <button onClick={() => { store.removeContact(selected.id); setSelected(null); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all">
                <Icon name="UserMinus" size={18} />
                <span className="text-sm">Удалить из контактов</span>
              </button>
            ) : (
              <button onClick={() => { store.addContact(selected.id); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 text-primary transition-all">
                <Icon name="UserPlus" size={18} />
                <span className="text-sm">Добавить в контакты</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
