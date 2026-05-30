import Icon from '@/components/ui/icon';

type Tab = 'chats' | 'contacts' | 'profile' | 'settings';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  unreadCount?: number;
  onLogout?: () => void;
}

const TABS = [
  { id: 'chats' as Tab, icon: 'MessageCircle', label: 'Чаты' },
  { id: 'contacts' as Tab, icon: 'Users', label: 'Контакты' },
  { id: 'profile' as Tab, icon: 'User', label: 'Профиль' },
  { id: 'settings' as Tab, icon: 'Settings', label: 'Настройки' },
];

export default function BottomNav({ active, onChange, unreadCount = 0, onLogout }: BottomNavProps) {
  return (
    <nav
      className="flex items-stretch border-t border-border bg-card/95 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 relative transition-all duration-200"
          style={active === tab.id
            ? { color: 'hsl(var(--relax-purple))' }
            : { color: 'hsl(var(--muted-foreground))' }}>
          <div className="relative">
            <Icon name={tab.icon} size={22} />
            {tab.id === 'chats' && unreadCount > 0 && (
              <span
                className="absolute -top-1.5 -right-2 min-w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center px-1"
                style={{ background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">{tab.label}</span>
          {active === tab.id && (
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(262,83%,65%), hsl(320,80%,60%))' }} />
          )}
        </button>
      ))}
    </nav>
  );
}
