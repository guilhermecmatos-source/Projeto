'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, changePositive, icon: Icon, iconColor = 'text-fleet-accent' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-xl p-5 hover:border-fleet-accent/30 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-fleet-muted">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={cn('text-xs mt-2', changePositive ? 'text-fleet-success' : 'text-fleet-danger')}>
              {change}
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg bg-fleet-surface', iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
