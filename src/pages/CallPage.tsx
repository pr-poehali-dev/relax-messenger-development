import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import Avatar from '@/components/Avatar';
import { type Chat } from '@/store/useStore';

interface CallPageProps {
  chat: Chat;
  onEnd: () => void;
}

export default function CallPage({ chat, onEnd }: CallPageProps) {
  const [status, setStatus] = useState<'calling' | 'connected'>('calling');
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStatus('connected'), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (status !== 'connected') return;
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between py-16 px-6"
      style={{ background: 'linear-gradient(160deg, hsl(262,83%,15%) 0%, hsl(230,20%,7%) 50%, hsl(320,40%,10%) 100%)' }}>

      {/* Mesh bg */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="mesh-1 absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-[hsl(262,83%,65%,0.08)] blur-[100px]" />
        <div className="mesh-2 absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full bg-[hsl(320,80%,60%,0.08)] blur-[80px]" />
      </div>

      {/* Status bar */}
      <div className="relative z-10 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-2 text-sm text-white/60 mb-1">
          <Icon name="Phone" size={14} />
          <span>{status === 'calling' ? 'Вызов...' : 'Голосовой звонок'}</span>
        </div>
      </div>

      {/* Avatar area */}
      <div className="relative z-10 flex flex-col items-center animate-scale-in">
        {/* Pulse rings */}
        {status === 'calling' && (
          <>
            <div className="absolute w-48 h-48 rounded-full animate-ping opacity-10"
              style={{ background: 'hsl(var(--relax-purple))' }} />
            <div className="absolute w-36 h-36 rounded-full animate-ping opacity-20"
              style={{ background: 'hsl(var(--relax-purple))', animationDelay: '0.3s' }} />
          </>
        )}
        {status === 'connected' && (
          <div className="absolute w-44 h-44 rounded-full animate-pulse opacity-15"
            style={{ background: 'hsl(262,83%,65%)' }} />
        )}

        <div className="relative">
          <Avatar text={chat.avatar} size="xl" className="border-4 border-white/20 shadow-2xl" />
          {status === 'connected' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-background flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mt-6 mb-2">{chat.name}</h1>
        <p className="text-white/60 text-lg">
          {status === 'calling'
            ? <span className="animate-pulse">Вызываем...</span>
            : fmt(duration)
          }
        </p>

        {status === 'connected' && (
          <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 animate-fade-in">
            <div className="flex items-end gap-0.5 h-4">
              {[2, 4, 3, 5, 2, 4, 3].map((h, i) => (
                <div key={i} className="w-0.5 rounded-full bg-emerald-400 animate-pulse"
                  style={{ height: `${h * 3}px`, animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
            <span className="text-white/70 text-xs">Хорошее качество</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative z-10 w-full animate-slide-up">
        <div className="flex justify-center gap-5 mb-8">
          {[
            { icon: muted ? 'MicOff' : 'Mic', label: muted ? 'Включить' : 'Выключить', active: muted, action: () => setMuted(m => !m) },
            { icon: speaker ? 'Volume2' : 'VolumeX', label: 'Динамик', active: speaker, action: () => setSpeaker(s => !s) },
            { icon: 'MessageCircle', label: 'Написать', active: false, action: () => {} },
          ].map(btn => (
            <div key={btn.icon} className="flex flex-col items-center gap-2">
              <button onClick={btn.action}
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                style={btn.active
                  ? { background: 'hsl(var(--relax-purple) / 0.4)', border: '1px solid hsl(var(--relax-purple) / 0.6)' }
                  : { background: 'hsl(255 255% 255% / 0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Icon name={btn.icon as 'Mic'} size={22} className="text-white" />
              </button>
              <span className="text-white/50 text-xs">{btn.label}</span>
            </div>
          ))}
        </div>

        {/* End call */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <button onClick={onEnd}
              className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-90 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 0 40px rgba(239,68,68,0.5)' }}>
              <Icon name="PhoneOff" size={28} className="text-white" />
            </button>
            <span className="text-white/40 text-xs">Завершить</span>
          </div>
        </div>
      </div>
    </div>
  );
}
