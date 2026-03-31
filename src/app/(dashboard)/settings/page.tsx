'use client';

import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Account and system settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-sm mt-0.5">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm mt-0.5">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <div className="mt-0.5">
                <Badge variant="secondary">{user?.role}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-0.5">
                <Badge variant="success">{user?.status || 'ACTIVE'}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user?.permissions.map((perm) => (
                <span
                  key={perm}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                >
                  {perm}
                </span>
              ))}
              {(!user?.permissions || user.permissions.length === 0) && (
                <p className="text-sm text-muted-foreground">No permissions assigned</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <label className="text-muted-foreground">Frontend</label>
                <p className="font-medium">Next.js 14</p>
              </div>
              <div>
                <label className="text-muted-foreground">Backend</label>
                <p className="font-medium">NestJS</p>
              </div>
              <div>
                <label className="text-muted-foreground">Database</label>
                <p className="font-medium">PostgreSQL</p>
              </div>
              <div>
                <label className="text-muted-foreground">ORM</label>
                <p className="font-medium">Prisma</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
