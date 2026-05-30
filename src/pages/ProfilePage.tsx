import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from '@/components/Avatar';
import { useStore } from '@/store/useStore';

interface ProfilePageProps {
  onLogout?: () => void;
}

export default function ProfilePage({ onLogout }: ProfilePageProps) {
  const appStore = useStore();
  const me = appStore.me;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: me.name, username: me.username, bio: me.bio || '', phone: me.phone || '' });

  const save = () => {
    appStore.updateMe({ name: form.name, username: form.username, bio: form.bio, phone: form.phone });
    setEditing(false);
  };

  const STATS = [
    { label: 'Чатов', value: String(appStore.chats.length) },
    { label: 'Сообщений', value: String(Object.values(appStore.messages).reduce((s, arr) => s + arr.filter(m => m.senderId === 'me').length, 0)) },
    { label: 'Контактов', value: String(appStore.contacts.length) },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header gradient */}
      <div className="relative h-36 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, hsl(262,83%,35%), hsl(320,80%,28%))' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--background)))' }} />
        {/* Safe area top padding */}
        <div style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      </div>

      <div className="px-4 -mt-12 relative z-10">
        {/* Avatar row */}
        <div className="flex items-end justify-between mb-4">
          <div className="relative">
            <Avatar text={me.avatar} size="xl" online />
            <button
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' }}>
              <Icon name="Camera" size={13} />
            </button>
          </div>
          <button
            onClick={() => editing ? save() : setEditing(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
            style={editing ? {
              background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))',
              color: 'white',
              boxShadow: '0 4px 12px hsl(262,83%,65%,0.35)'
            } : { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}>
            {editing ? 'Сохранить' : 'Изменить'}
          </button>
        </div>

        {editing ? (
          <div className="space-y-3 animate-fade-in mb-5">
            {[
              { label: 'Имя', key: 'name', icon: 'User', placeholder: 'Ваше имя', type: 'text' },
              { label: 'Username', key: 'username', icon: 'AtSign', placeholder: 'username', type: 'text' },
              { label: 'О себе', key: 'bio', icon: 'FileText', placeholder: 'Расскажите о себе...', type: 'text' },
              { label: 'Телефон', key: 'phone', icon: 'Phone', placeholder: '+7 999 000-00-00', type: 'tel' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">{field.label}</label>
                <div className="relative">
                  <Icon name={field.icon as 'User'} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    type={field.type}
                    className="w-full bg-muted border border-border rounded-2xl pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            ))}
            <button onClick={() => setEditing(false)} className="w-full py-2.5 rounded-2xl text-sm text-muted-foreground border border-border hover:bg-muted transition-all">
              Отмена
            </button>
          </div>
        ) : (
          <div className="mb-5 animate-fade-in">
            <h1 className="text-2xl font-bold leading-tight">{me.name}</h1>
            <p className="text-sm font-medium mt-0.5" style={{ color: 'hsl(var(--relax-purple))' }}>@{me.username}</p>
            {me.bio && <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{me.bio}</p>}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {STATS.map(stat => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-3 text-center">
              <p className="text-xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="space-y-2 mb-5">
          <h3 className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-1 mb-2">Контактная информация</h3>
          {[
            { icon: 'Phone', label: 'Телефон', value: me.phone || 'Не указан' },
            { icon: 'AtSign', label: 'Username', value: `@${me.username}` },
            { icon: 'Calendar', label: 'В Relax с', value: 'мая 2024' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-card border border-border">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'hsl(var(--relax-purple) / 0.15)' }}>
                <Icon name={item.icon as 'Phone'} size={15} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-2 mb-8">
          <h3 className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-1 mb-2">Аккаунт</h3>
          {[
            { icon: 'Shield', label: 'Конфиденциальность', chevron: true },
            { icon: 'Lock', label: 'Сменить пароль', chevron: true },
            { icon: 'Smartphone', label: 'Связанные устройства', chevron: true },
          ].map(item => (
            <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-card border border-border hover:bg-muted transition-all">
              <Icon name={item.icon as 'Shield'} size={18} className="text-muted-foreground" />
              <span className="text-sm flex-1 text-left">{item.label}</span>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          ))}
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-destructive/10 text-destructive transition-all border border-destructive/20">
              <Icon name="LogOut" size={18} />
              <span className="text-sm">Выйти из аккаунта</span>
            </button>
          )}
          <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-destructive/10 text-destructive transition-all border border-destructive/20">
            <Icon name="Trash2" size={18} />
            <span className="text-sm">Удалить аккаунт</span>
          </button>
        </div>
      </div>
    </div>
  );
}
