interface AvatarProps {
  text: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  className?: string;
}

const GRADIENTS = [
  'linear-gradient(135deg, hsl(262,83%,55%), hsl(320,80%,50%))',
  'linear-gradient(135deg, hsl(185,85%,40%), hsl(220,80%,55%))',
  'linear-gradient(135deg, hsl(320,70%,50%), hsl(15,85%,55%))',
  'linear-gradient(135deg, hsl(150,60%,40%), hsl(185,80%,45%))',
  'linear-gradient(135deg, hsl(45,80%,50%), hsl(15,85%,55%))',
  'linear-gradient(135deg, hsl(200,80%,45%), hsl(262,70%,55%))',
];

function getGradient(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash += text.charCodeAt(i);
  return GRADIENTS[hash % GRADIENTS.length];
}

const SIZES = { sm: 'w-9 h-9 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-lg', xl: 'w-24 h-24 text-2xl' };
const DOT_SIZES = { sm: 'w-2.5 h-2.5 right-0 bottom-0', md: 'w-3 h-3 right-0 bottom-0', lg: 'w-4 h-4 right-0.5 bottom-0.5', xl: 'w-5 h-5 right-1 bottom-1' };

export default function Avatar({ text, size = 'md', online, className = '' }: AvatarProps) {
  const isEmoji = /\p{Emoji}/u.test(text) && text.length <= 2;

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div
        className={`${SIZES[size]} rounded-2xl flex items-center justify-center font-semibold text-white`}
        style={{ background: isEmoji ? 'hsl(var(--relax-surface2))' : getGradient(text) }}>
        {text}
      </div>
      {online !== undefined && (
        <div className={`absolute ${DOT_SIZES[size]} rounded-full border-2 border-background ${online ? 'bg-emerald-400' : 'bg-muted-foreground'}`} />
      )}
    </div>
  );
}
