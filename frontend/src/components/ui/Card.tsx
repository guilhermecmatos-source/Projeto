'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  glow?: boolean;
}

export function Card({ children, className, title, subtitle, action, glow }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('glass rounded-xl p-6', glow && 'glow-accent', className)}
    >
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-fleet-muted mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </motion.div>
  );
}
