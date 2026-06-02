'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('fleet_token')) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-fleet-bg bg-grid-pattern bg-[length:32px_32px]">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <div className="p-8 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
