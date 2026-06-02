'use client';

import { AreaChart as RechartsArea, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

export function AreaChart({ data, dataKeys }: { data: DataPoint[]; dataKeys: { key: string; color: string; name: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsArea data={data}>
        <defs>
          {dataKeys.map((dk) => (
            <linearGradient key={dk.key} id={`gradient-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={dk.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={dk.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} />
        <Tooltip
          contentStyle={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 8 }}
          formatter={(value: number) => [`R$ ${(value / 1e6).toFixed(2)}M`, '']}
        />
        <Legend />
        {dataKeys.map((dk) => (
          <Area key={dk.key} type="monotone" dataKey={dk.key} name={dk.name} stroke={dk.color} fill={`url(#gradient-${dk.key})`} strokeWidth={2} />
        ))}
      </RechartsArea>
    </ResponsiveContainer>
  );
}
