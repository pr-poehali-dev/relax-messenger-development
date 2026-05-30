import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ value, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ background: value ? 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' : 'hsl(var(--muted))' }}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${value ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    sounds: true,
    vibration: false,
    readReceipts: true,
    onlineStatus: true,
    darkTheme: true,
    autoDownload: true,
    twoFactor: false,
    biometric: true,
    chatBackup: true,
  });

  const set = (key: keyof typeof settings) => (v: boolean) =>
    setSettings(s => ({ ...s, [key]: v }));

  const sections = [
    {
      title: 'Уведомления',
      icon: 'Bell',
      items: [
        { key: 'notifications', label: 'Push-уведомления', desc: 'Получать уведомления о новых сообщениях' },
        { key: 'sounds', label: 'Звуки', desc: 'Воспроизводить звук при получении сообщений' },
        { key: 'vibration', label: 'Вибрация', desc: 'Вибрировать при уведомлениях' },
      ],
    },
    {
      title: 'Приватность',
      icon: 'Shield',
      items: [
        { key: 'readReceipts', label: 'Уведомления о прочтении', desc: 'Показывать когда вы читаете сообщения' },
        { key: 'onlineStatus', label: 'Статус онлайн', desc: 'Другие могут видеть ваш статус' },
      ],
    },
    {
      title: 'Безопасность',
      icon: 'Lock',
      items: [
        { key: 'twoFactor', label: 'Двухфакторная аутентификация', desc: 'Дополнительная защита аккаунта' },
        { key: 'biometric', label: 'Биометрическая защита', desc: 'Разблокировка по отпечатку / Face ID' },
      ],
    },
    {
      title: 'Данные',
      icon: 'HardDrive',
      items: [
        { key: 'autoDownload', label: 'Автозагрузка медиа', desc: 'Автоматически загружать фото и видео' },
        { key: 'chatBackup', label: 'Резервная копия', desc: 'Сохранять историю чатов' },
      ],
    },
  ];

  const THEMES = [
    { id: 'dark', label: 'Тёмная', colors: ['#1a1b2e', '#7c3aed', '#ec4899'] },
    { id: 'midnight', label: 'Midnight', colors: ['#0f0f1a', '#3b82f6', '#06b6d4'] },
    { id: 'forest', label: 'Forest', colors: ['#0f1a14', '#059669', '#84cc16'] },
    { id: 'sunset', label: 'Sunset', colors: ['#1a0f0f', '#ef4444', '#f97316'] },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-5 pb-3 border-b border-border flex-shrink-0">
        <h1 className="text-xl font-bold">Настройки</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Управляй своим аккаунтом</p>
      </div>

      <div className="flex-1 px-4 py-4 space-y-5">
        {/* Theme Selector */}
        <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'hsl(var(--relax-purple) / 0.2)' }}>
              <Icon name="Palette" size={14} className="text-primary" />
            </div>
            <h2 className="text-sm font-semibold">Тема оформления</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((theme, i) => (
              <button key={theme.id}
                className={`relative p-3 rounded-2xl border-2 transition-all ${i === 0 ? 'border-primary' : 'border-border hover:border-primary/50'}`}
                style={{ background: theme.colors[0] }}>
                <div className="flex gap-1 mb-2">
                  {theme.colors.map(c => (
                    <div key={c} className="w-4 h-4 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-xs text-white font-medium">{theme.label}</span>
                {i === 0 && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'hsl(var(--relax-purple))' }}>
                    <Icon name="Check" size={10} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle sections */}
        {sections.map((section, si) => (
          <div key={section.title} className="animate-fade-in bg-card border border-border rounded-2xl overflow-hidden"
            style={{ animationDelay: `${(si + 1) * 80}ms` }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'hsl(var(--relax-purple) / 0.2)' }}>
                <Icon name={section.icon as 'Bell'} size={14} className="text-primary" />
              </div>
              <h2 className="text-sm font-semibold">{section.title}</h2>
            </div>
            {section.items.map((item, idx) => (
              <div key={item.key}
                className={`flex items-center justify-between px-4 py-3.5 ${idx < section.items.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
                </div>
                <Toggle value={settings[item.key as keyof typeof settings]} onChange={set(item.key as keyof typeof settings)} />
              </div>
            ))}
          </div>
        ))}

        {/* Storage info */}
        <div className="animate-fade-in bg-card border border-border rounded-2xl p-4"
          style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'hsl(var(--relax-purple) / 0.2)' }}>
              <Icon name="Database" size={14} className="text-primary" />
            </div>
            <h2 className="text-sm font-semibold">Хранилище</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Фото и видео', size: '234 МБ', pct: 60 },
              { label: 'Документы', size: '45 МБ', pct: 12 },
              { label: 'Аудио', size: '12 МБ', pct: 3 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.size}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${item.pct}%`, background: 'linear-gradient(90deg, hsl(262,83%,65%), hsl(320,80%,60%))' }} />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 transition-all">
            Очистить кэш (291 МБ)
          </button>
        </div>

        {/* App info */}
        <div className="text-center py-4 text-muted-foreground animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2"
            style={{ background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' }}>
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <p className="font-semibold text-foreground">Relax</p>
          <p className="text-xs mt-0.5">Версия 1.0.0 · Сборка 100</p>
        </div>
      </div>
    </div>
  );
}
