'use client';

import { useAuth } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTE_PERMISSIONS } from '@/lib/types';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, hasPermission } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const requiredPermission = ROUTE_PERMISSIONS[pathname];
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/403');
    }
  }, [isLoading, isAuthenticated, pathname, hasPermission, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const requiredPermission = ROUTE_PERMISSIONS[pathname];
  if (requiredPermission && !hasPermission(requiredPermission)) return null;

  return <>{children}</>;
}
