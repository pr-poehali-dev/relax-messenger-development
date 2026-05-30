import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from '@/components/Avatar';
import { MOCK_USERS } from '@/store/useStore';

export default function ProfilePage() {
  const me = MOCK_USERS[0];
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: me.name, username: me.username, bio: me.bio || '', phone: me.phone || '' });

  const STATS = [
    { label: 'Чатов', value: '12' },
    { label: 'Сообщений', value: '1.4K' },
    { label: 'Контактов', value: '6' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header gradient */}
      <div className="relative h-40 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, hsl(262,83%,40%), hsl(320,80%,35%))' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-12"
          style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--background)))' }} />
      </div>

      {/* Avatar */}
      <div className="px-5 -mt-14 relative z-10">
        <div className="flex items-end justify-between mb-4">
          <div className="relative">
            <Avatar text={me.avatar} size="xl" online />
            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' }}>
              <Icon name="Camera" size={14} />
            </button>
          </div>
          <button
            onClick={() => setEditing(v => !v)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all border border-border hover:bg-muted"
            style={editing ? {
              background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))',
              color: 'white',
              border: 'none'
            } : {}}>
            {editing ? 'Сохранить' : 'Изменить'}
          </button>
        </div>

        {editing ? (
          <div className="space-y-3 animate-fade-in mb-5">
            {[
              { label: 'Имя', key: 'name', icon: 'User', placeholder: 'Ваше имя' },
              { label: 'Username', key: 'username', icon: 'AtSign', placeholder: 'username' },
              { label: 'О себе', key: 'bio', icon: 'FileText', placeholder: 'Расскажите о себе...' },
              { label: 'Телефон', key: 'phone', icon: 'Phone', placeholder: '+7 999 000-00-00' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs text-muted-foreground font-medium mb-1 block">{field.label}</label>
                <div className="relative">
                  <Icon name={field.icon as 'User'} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-5 animate-fade-in">
            <h1 className="text-2xl font-bold">{form.name}</h1>
            <p className="text-primary text-sm">@{form.username}</p>
            {form.bio && <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{form.bio}</p>}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {STATS.map(stat => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-3 text-center">
              <p className="text-xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="space-y-1 mb-5">
          <h3 className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-1 mb-2">Контактная информация</h3>
          {[
            { icon: 'Phone', label: 'Телефон', value: form.phone || '+7 999 123-45-67' },
            { icon: 'AtSign', label: 'Username', value: `@${form.username}` },
            { icon: 'Calendar', label: 'В Relax с', value: 'мая 2024' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 px-3 py-3 rounded-xl bg-card border border-border">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'hsl(var(--relax-purple) / 0.15)' }}>
                <Icon name={item.icon as 'Phone'} size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div className="space-y-1 mb-8">
          <h3 className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-1 mb-2">Аккаунт</h3>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:bg-muted transition-all">
            <Icon name="Shield" size={18} className="text-muted-foreground" />
            <span className="text-sm">Конфиденциальность</span>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground ml-auto" />
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:bg-muted transition-all">
            <Icon name="Lock" size={18} className="text-muted-foreground" />
            <span className="text-sm">Сменить пароль</span>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground ml-auto" />
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all border border-border">
            <Icon name="Trash2" size={18} />
            <span className="text-sm">Удалить аккаунт</span>
          </button>
        </div>
      </div>
    </div>
  );
}
