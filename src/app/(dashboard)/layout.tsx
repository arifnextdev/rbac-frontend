'use client';

import { Sidebar } from '@/components/sidebar';
import { RouteGuard } from '@/components/route-guard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </RouteGuard>
  );
}
