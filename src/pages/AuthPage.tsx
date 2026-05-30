import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface AuthPageProps {
  onAuth: (user: { name: string; username: string }) => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', username: '', password: '', phone: '' });
  const [step, setStep] = useState<'form' | 'code'>('form');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register' && step === 'form') {
      setLoading(true);
      setTimeout(() => { setLoading(false); setStep('code'); }, 1200);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuth({ name: form.name || 'Алексей Смирнов', username: form.username || 'alexsmirn' });
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="mesh-1 absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[hsl(262,83%,65%,0.12)] blur-[120px]" />
        <div className="mesh-2 absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[hsl(320,80%,60%,0.1)] blur-[100px]" />
        <div className="mesh-3 absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-[hsl(185,85%,55%,0.08)] blur-[80px]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(262 83% 65% / 0.04) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 animate-pulse-ring"
            style={{ background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))' }}>
            <span className="text-3xl font-bold text-white">R</span>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Relax</h1>
          <p className="text-muted-foreground text-sm">Общение без границ</p>
        </div>

        {/* Card */}
        <div className="glass neon-border rounded-3xl p-8">
          {/* Tabs */}
          <div className="flex bg-muted rounded-2xl p-1 mb-8">
            {(['login', 'register'] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setStep('form'); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={mode === m ? {
                  background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))',
                  color: 'white',
                  boxShadow: '0 4px 15px hsl(262,83%,65%,0.3)'
                } : { color: 'hsl(var(--muted-foreground))' }}>
                {m === 'login' ? 'Войти' : 'Регистрация'}
              </button>
            ))}
          </div>

          {step === 'code' ? (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Icon name="MessageSquare" size={24} className="text-primary" />
                </div>
                <h2 className="font-semibold text-lg">Код подтверждения</h2>
                <p className="text-muted-foreground text-sm mt-1">Отправили на {form.phone || '+7 999 ···-··-67'}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text" maxLength={6} placeholder="000000"
                  value={code} onChange={e => setCode(e.target.value)}
                  className="w-full text-center text-3xl font-bold tracking-[0.5em] bg-muted border border-border rounded-2xl px-4 py-4 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <button type="submit"
                  className="w-full py-4 rounded-2xl font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))', boxShadow: '0 8px 25px hsl(262,83%,65%,0.4)' }}>
                  {loading ? <span className="flex items-center justify-center gap-2"><Icon name="Loader2" size={18} className="animate-spin" />Проверяем...</span> : 'Подтвердить'}
                </button>
                <button type="button" onClick={() => setStep('form')} className="w-full text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Изменить номер
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in" key={mode}>
              {mode === 'register' && (
                <div className="animate-fade-in">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Имя</label>
                  <div className="relative">
                    <Icon name="User" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Ваше имя" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-muted border border-border rounded-2xl pl-11 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
              )}
              {mode === 'register' && (
                <div className="animate-fade-in">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Имя пользователя</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                    <input type="text" placeholder="username" value={form.username}
                      onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                      className="w-full bg-muted border border-border rounded-2xl pl-10 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  {mode === 'login' ? 'Телефон или имя пользователя' : 'Номер телефона'}
                </label>
                <div className="relative">
                  <Icon name="Phone" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" placeholder={mode === 'login' ? '+7 или @username' : '+7 999 000-00-00'}
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-muted border border-border rounded-2xl pl-11 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Пароль</label>
                <div className="relative">
                  <Icon name="Lock" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="password" placeholder="••••••••" value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full bg-muted border border-border rounded-2xl pl-11 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              <button type="submit"
                className="w-full py-4 rounded-2xl font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 mt-2"
                style={{ background: 'linear-gradient(135deg, hsl(262,83%,65%), hsl(320,80%,60%))', boxShadow: '0 8px 25px hsl(262,83%,65%,0.4)' }}>
                {loading
                  ? <span className="flex items-center justify-center gap-2"><Icon name="Loader2" size={18} className="animate-spin" />Загрузка...</span>
                  : mode === 'login' ? 'Войти в Relax' : 'Получить код'
                }
              </button>
              {mode === 'login' && (
                <button type="button" className="w-full text-muted-foreground text-sm hover:text-primary transition-colors">
                  Забыли пароль?
                </button>
              )}
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Используя Relax, вы соглашаетесь с{' '}
          <span className="text-primary cursor-pointer hover:underline">условиями использования</span>
        </p>
      </div>
    </div>
  );
}
