'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, MobileMenuButton } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('fleet_token')) {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    setMobileMenu(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-fleet-bg bg-grid-pattern bg-[length:32px_32px]">
      <Sidebar mobileOpen={mobileMenu} onMobileClose={() => setMobileMenu(false)} />

      <main className="lg:pl-64 min-h-screen">
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 p-4 border-b border-fleet-border bg-fleet-surface/95 backdrop-blur-xl">
          <MobileMenuButton onClick={() => setMobileMenu(true)} />
          <span className="font-semibold text-white">Fleet AI</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
