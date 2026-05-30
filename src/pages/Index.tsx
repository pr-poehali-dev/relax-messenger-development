import { useState } from 'react';
import AuthPage from './AuthPage';
import ChatsPage from './ChatsPage';
import ChatPage from './ChatPage';
import ContactsPage from './ContactsPage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import CallPage from './CallPage';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { useStore, type Chat } from '@/store/useStore';

type Tab = 'chats' | 'contacts' | 'profile' | 'settings';

export default function Index() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem('relax_authed'));
  const [tab, setTab] = useState<Tab>('chats');
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [callChat, setCallChat] = useState<Chat | null>(null);
  const appStore = useStore();

  const totalUnread = appStore.chats.reduce((s, c) => s + c.unread, 0);
  const isMobile = window.innerWidth < 768;

  const handleAuth = () => {
    localStorage.setItem('relax_authed', '1');
    setAuthed(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('relax_authed');
    setAuthed(false);
    setActiveChat(null);
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    // On mobile, going to a tab closes the active chat
    if (isMobile) setActiveChat(null);
  };

  if (!authed) return <AuthPage onAuth={handleAuth} />;
  if (callChat) return <CallPage chat={callChat} onEnd={() => setCallChat(null)} />;

  // On mobile: show chat fullscreen if open, else show tab content
  const showChatFullscreen = isMobile && activeChat;

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-background">

      {/* Desktop sidebar (hidden on mobile) */}
      <div className="hidden md:flex">
        <Sidebar
          active={tab}
          onChange={t => { setTab(t); if (t !== 'chats') setActiveChat(null); }}
          unreadCount={totalUnread}
        />
      </div>

      {/* Left panel: list view */}
      <div className={`
        flex flex-col h-full bg-card relative overflow-hidden
        ${showChatFullscreen ? 'hidden' : 'flex'}
        md:flex md:w-80 md:flex-shrink-0 md:border-r md:border-border
        w-full
      `}>
        {tab === 'chats' && (
          <ChatsPage onOpenChat={c => { setActiveChat(c); appStore.markRead(c.id); }} />
        )}
        {tab === 'contacts' && (
          <ContactsPage onOpenChat={c => { setActiveChat(c); setTab('chats'); }} />
        )}
        {tab === 'profile' && <ProfilePage onLogout={handleLogout} />}
        {tab === 'settings' && <SettingsPage />}

        {/* Mobile bottom nav */}
        <div className="md:hidden flex-shrink-0">
          <BottomNav
            active={tab}
            onChange={handleTabChange}
            unreadCount={totalUnread}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Right panel: chat */}
      <div className={`
        flex-1 flex flex-col h-full relative overflow-hidden
        ${showChatFullscreen ? 'flex w-full' : 'hidden md:flex'}
      `}>
        {activeChat ? (
          <ChatPage
            key={activeChat.id}
            chat={activeChat}
            onBack={() => setActiveChat(null)}
            onCall={c => setCallChat(c)}
          />
        ) : (
          <DesktopEmptyState onSelectChat={c => setActiveChat(c)} chats={appStore.chats.slice(0, 4)} />
        )}
      </div>

    </div>
  );
}

function DesktopEmptyState({ onSelectChat, chats }: { onSelectChat: (c: Chat) => void; chats: Chat[] }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="mesh-1 absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-5 blur-[100px]"
          style={{ background: 'hsl(var(--relax-purple))' }} />
        <div className="mesh-2 absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-5 blur-[80px]"
          style={{ background: 'hsl(var(--relax-pink))' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(262 83% 65% / 0.03) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>
      <div className="relative z-10 text-center animate-scale-in px-8 max-w-sm">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
          style={{
            background: 'linear-gradient(135deg, hsl(262,83%,65%,0.15), hsl(320,80%,60%,0.15))',
            border: '1px solid hsl(262,83%,65%,0.25)'
          }}>
          <span className="text-4xl font-bold gradient-text">R</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Добро пожаловать</h2>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          Выбери чат слева или начни новый. Все сообщения надёжно защищены.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {chats.map(c => (
            <button key={c.id} onClick={() => onSelectChat(c)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-card border border-border hover:border-primary/50 hover:bg-primary/10 transition-all">
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
