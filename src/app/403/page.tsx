'use client';

import { ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md px-4">
        <ShieldOff className="h-16 w-16 text-destructive mx-auto" />
        <h1 className="text-4xl font-bold">403</h1>
        <h2 className="text-xl font-semibold text-muted-foreground">Access Denied</h2>
        <p className="text-muted-foreground">
          You do not have the required permissions to access this page.
          Contact your administrator if you believe this is an error.
        </p>
        <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
      </div>
    </div>
  );
}
