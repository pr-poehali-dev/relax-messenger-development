import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from '@/components/Avatar';
import { store, PLATFORM_USERS, type Chat } from '@/store/useStore';

type CreateType = 'private' | 'group' | 'channel';

interface CreateChatDialogProps {
  onClose: () => void;
  onCreated: (chat: Chat) => void;
}

export default function CreateChatDialog({ onClose, onCreated }: CreateChatDialogProps) {
  const [step, setStep] = useState<'type' | 'search' | 'setup'>('type');
  const [type, setType] = useState<CreateType>('private');
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const results = search.length >= 1
    ? PLATFORM_USERS.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        (u.phone || '').includes(search)
      )
    : PLATFORM_USERS.slice(0, 8);

  const toggleUser = (id: string) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (type === 'private') {
      if (!selectedUsers[0]) return;
      const user = PLATFORM_USERS.find(u => u.id === selectedUsers[0]);
      if (!user) return;
      store.addContact(user.id);
      const existing = store.chats.find(c => c.type === 'private' && c.name === user.name);
      if (existing) { onCreated(existing); return; }
      const chat = store.createChat('private', {
        name: user.name,
        avatar: user.avatar,
        members: ['me', user.id],
      });
      onCreated(chat);
    } else if (type === 'group') {
      if (!name.trim() || selectedUsers.length < 1) return;
      const emoji = name.match(/\p{Emoji}/u)?.[0] || '👥';
      const chat = store.createChat('group', {
        name: name.trim(),
        avatar: emoji,
        members: ['me', ...selectedUsers],
        description: description.trim(),
      });
      onCreated(chat);
    } else {
      if (!name.trim()) return;
      const emoji = name.match(/\p{Emoji}/u)?.[0] || '📢';
      const chat = store.createChat('channel', {
        name: name.trim(),
        avatar: emoji,
        members: ['me'],
        description: description.trim(),
      });
      onCreated(chat);
    }
  };

  const TYPES = [
    { id: 'private' as CreateType, icon: 'MessageCircle', label: 'Личное сообщение', desc: 'Написать конкретному человеку', color: '#7c3aed' },
    { id: 'group' as CreateType, icon: 'Users', label: 'Группа', desc: 'Чат с несколькими участниками', color: '#0891b2' },
    { id: 'channel' as CreateType, icon: 'Radio', label: 'Канал', desc: 'Публикации для подписчиков', color: '#059669' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 mt-auto w-full max-w-lg mx-auto animate-slide-up"
        style={{ maxHeight: '90dvh' }}>
        <div className="glass border border-border rounded-t-3xl flex flex-col overflow-hidden"
          style={{ maxHeight: '90dvh', paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>

          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
            {step !== 'type' ? (
              <button onClick={() => setStep(step === 'setup' && type !== 'private' ? 'search' : 'type')}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted transition-all">
                <Icon name="ArrowLeft" size={20} />
              </button>
            ) : <div className="w-9" />}
            <h2 className="font-bold text-base">
              {step === 'type' ? 'Новый чат' : step === 'search' ? (type === 'private' ? 'Найти пользователя' : 'Добавить участников') : (type === 'group' ? 'Настроить группу' : 'Настроить канал')}
            </h2>
            <button onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted transition-all">
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">

            {/* Step 1: Choose type */}
            {step === 'type' && (
              <div className="p-4 space-y-2 animate-fade-in">
                {TYPES.map(t => (
                  <button key={t.id} onClick={() => { setType(t.id); setStep('search'); }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all text-left">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${t.color}22` }}>
                      <Icon name={t.icon as 'Users'} size={22} style={{ color: t.color }} />
                    </div>
                    <div>
                      <p className="font-semibold">{t.label}</p>
                      <p className="text-sm text-muted-foreground">{t.desc}</p>
                    </div>
                    <Icon name="ChevronRight" size={18} className="text-muted-foreground ml-auto flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Search users */}
            {step === 'search' && (
              <div className="animate-fade-in flex flex-col h-full">
                <div className="px-4 py-3 flex-shrink-0">
                  <div className="relative">
                    <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      autoFocus
                      placeholder="Имя, @username или номер телефона"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full bg-muted rounded-2xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  {type !== 'private' && selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedUsers.map(uid => {
                        const u = PLATFORM_USERS.find(x => x.id === uid);
                        if (!u) return null;
                        return (
                          <div key={uid} className="flex items-center gap-1.5 bg-primary/20 rounded-full px-2.5 py-1 text-xs font-medium text-primary">
                            <span>{u.name.split(' ')[0]}</span>
                            <button onClick={() => toggleUser(uid)}><Icon name="X" size={12} /></button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto pb-4">
                  {results.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                      <Icon name="UserX" size={36} className="mb-2 opacity-30" />
                      <p className="text-sm">Пользователь не найден</p>
                      <p className="text-xs mt-1">Попробуйте другое имя или @username</p>
                    </div>
                  )}
                  {results.map(user => {
                    const isSelected = selectedUsers.includes(user.id);
                    return (
                      <button key={user.id}
                        onClick={() => {
                          if (type === 'private') {
                            setSelectedUsers([user.id]);
                            handleCreatePrivate(user.id);
                          } else {
                            toggleUser(user.id);
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-all">
                        <div className="relative flex-shrink-0">
                          <Avatar text={user.avatar} size="md" online={user.status === 'online'} />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}
                            {user.phone && <span className="ml-2 opacity-60">{user.phone}</span>}
                          </p>
                        </div>
                        {type !== 'private' && (
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}>
                            {isSelected && <Icon name="Check" size={12} className="text-white" />}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {type !== 'private' && selectedUsers.length > 0 && (
                  <div className="px-4 pb-4 flex-shrink-0 border-t border-border pt-3">
                    <button onClick={() => setStep('setup')}
                      className="w-full py-3.5 rounded-2xl font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' }}>
                      Далее — {selectedUsers.length} уч.
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Setup group/channel */}
            {step === 'setup' && (
              <div className="p-4 space-y-4 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-3xl cursor-pointer hover:bg-primary/10 transition-all border border-border">
                    {name.match(/\p{Emoji}/u)?.[0] || (type === 'group' ? '👥' : '📢')}
                  </div>
                  <div className="flex-1">
                    <input
                      autoFocus
                      placeholder={type === 'group' ? 'Название группы' : 'Название канала'}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-muted border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-base font-medium"
                    />
                  </div>
                </div>
                <div>
                  <textarea
                    placeholder="Описание (необязательно)"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-muted border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                  />
                </div>
                {type === 'group' && (
                  <div className="bg-card border border-border rounded-2xl p-3">
                    <p className="text-xs text-muted-foreground mb-2">Участники ({selectedUsers.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map(uid => {
                        const u = PLATFORM_USERS.find(x => x.id === uid);
                        if (!u) return null;
                        return (
                          <div key={uid} className="flex items-center gap-1.5 bg-muted rounded-full px-2.5 py-1 text-xs">
                            <Avatar text={u.avatar} size="sm" />
                            <span>{u.name.split(' ')[0]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <button
                  onClick={handleCreate}
                  disabled={!name.trim()}
                  className="w-full py-3.5 rounded-2xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' }}>
                  {type === 'group' ? 'Создать группу' : 'Создать канал'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function handleCreatePrivate(userId: string) {
    const user = PLATFORM_USERS.find(u => u.id === userId);
    if (!user) return;
    store.addContact(user.id);
    const existing = store.chats.find(c => c.type === 'private' && c.name === user.name);
    if (existing) { onCreated(existing); return; }
    const chat = store.createChat('private', {
      name: user.name,
      avatar: user.avatar,
      members: ['me', user.id],
    });
    onCreated(chat);
  }
}
