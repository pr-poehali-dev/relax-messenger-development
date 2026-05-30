import { useState } from 'react';
import AuthPage from './AuthPage';
import ChatsPage from './ChatsPage';
import ChatPage from './ChatPage';
import ContactsPage from './ContactsPage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import CallPage from './CallPage';
import Sidebar from '@/components/Sidebar';
import { MOCK_CHATS, type Chat } from '@/store/useStore';

type Tab = 'chats' | 'contacts' | 'profile' | 'settings';

export default function Index() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>('chats');
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [callChat, setCallChat] = useState<Chat | null>(null);

  const totalUnread = MOCK_CHATS.reduce((s, c) => s + c.unread, 0);

  if (!authed) {
    return <AuthPage onAuth={() => setAuthed(true)} />;
  }

  if (callChat) {
    return <CallPage chat={callChat} onEnd={() => setCallChat(null)} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        active={tab}
        onChange={t => { setTab(t); if (t !== 'chats') setActiveChat(null); }}
        unreadCount={totalUnread}
      />

      {/* Left panel */}
      <div className={`w-80 flex-shrink-0 border-r border-border flex flex-col h-full bg-card relative overflow-hidden ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        {tab === 'chats' && <ChatsPage onOpenChat={c => setActiveChat(c)} />}
        {tab === 'contacts' && (
          <ContactsPage onOpenChat={uid => {
            const idx = parseInt(uid.replace('u', ''));
            const found = MOCK_CHATS[idx - 1];
            if (found) { setActiveChat(found); setTab('chats'); }
          }} />
        )}
        {tab === 'profile' && <ProfilePage />}
        {tab === 'settings' && <SettingsPage />}
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {activeChat ? (
          <ChatPage
            key={activeChat.id}
            chat={activeChat}
            onBack={() => setActiveChat(null)}
            onCall={c => setCallChat(c)}
          />
        ) : (
          <EmptyState onSelectChat={setActiveChat} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ onSelectChat }: { onSelectChat: (c: Chat) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="mesh-1 absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[hsl(262,83%,65%,0.05)] blur-[100px]" />
        <div className="mesh-2 absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[hsl(320,80%,60%,0.05)] blur-[80px]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(262 83% 65% / 0.03) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative z-10 text-center animate-scale-in px-8">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'linear-gradient(135deg, hsl(262,83%,65%,0.2), hsl(320,80%,60%,0.2))',
            border: '1px solid hsl(262,83%,65%,0.2)'
          }}>
          <span className="text-4xl font-bold gradient-text">R</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Добро пожаловать в Relax</h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-xs leading-relaxed">
          Выбери чат слева, чтобы начать переписку. Твои сообщения защищены end-to-end шифрованием.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {MOCK_CHATS.slice(0, 3).map(c => (
            <button key={c.id} onClick={() => onSelectChat(c)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-card border border-border hover:border-primary/50 hover:bg-primary/10 transition-all">
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
