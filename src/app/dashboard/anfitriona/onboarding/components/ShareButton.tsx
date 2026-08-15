import { Zap } from 'lucide-react';

export function ShareBtn({
  label,
  color,
  href,
  onClick,
}: {
  label: string;
  color: string;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${color}`}>
        <Zap className="w-5 h-5" />
      </span>
      <span className="text-[11px] text-ink-soft">{label}</span>
    </>
  );
  const cls = 'flex flex-col items-center gap-1.5';
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
