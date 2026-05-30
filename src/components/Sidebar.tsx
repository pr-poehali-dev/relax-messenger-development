import Icon from '@/components/ui/icon';

type Tab = 'chats' | 'contacts' | 'profile' | 'settings';

interface SidebarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  unreadCount?: number;
}

const TABS = [
  { id: 'chats' as Tab, icon: 'MessageCircle', label: 'Чаты' },
  { id: 'contacts' as Tab, icon: 'Users', label: 'Контакты' },
  { id: 'profile' as Tab, icon: 'User', label: 'Профиль' },
  { id: 'settings' as Tab, icon: 'Settings', label: 'Настройки' },
];

export default function Sidebar({ active, onChange, unreadCount = 0 }: SidebarProps) {
  return (
    <nav className="flex flex-col items-center gap-1 py-4 px-2 border-r border-border bg-card h-full">
      {/* Logo */}
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-6 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' }}>
        <span className="text-white font-bold text-lg">R</span>
      </div>

      {TABS.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)}
          className="relative w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 group"
          style={active === tab.id ? {
            background: 'hsl(var(--relax-purple) / 0.2)',
            color: 'hsl(var(--relax-purple))',
          } : { color: 'hsl(var(--muted-foreground))' }}
          title={tab.label}>
          <Icon name={tab.icon} size={20} />
          {tab.id === 'chats' && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full transition-all duration-200 ${active === tab.id ? 'opacity-100' : 'opacity-0'}`}
            style={{ background: 'hsl(var(--relax-purple))' }} />
        </button>
      ))}

      <div className="flex-1" />

      <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
        title="Выйти">
        <Icon name="LogOut" size={20} />
      </button>
    </nav>
  );
}