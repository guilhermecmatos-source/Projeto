import { cn } from '@/lib/utils';

const variants: Record<string, string> = {
  default: 'bg-fleet-border text-zinc-300',
  success: 'bg-fleet-success/20 text-fleet-success',
  warning: 'bg-fleet-warning/20 text-fleet-warning',
  danger: 'bg-fleet-danger/20 text-fleet-danger',
  info: 'bg-fleet-cyan/20 text-fleet-cyan',
  ia: 'bg-purple-500/20 text-purple-400',
};

export function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: keyof typeof variants; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
