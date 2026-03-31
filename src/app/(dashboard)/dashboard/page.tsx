'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { Users, Target, CheckSquare, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, leads: 0, tasks: 0, reports: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const promises = [];
        if (user?.permissions.includes('view_users')) promises.push(api.get('/users?limit=1').then(r => r.data.total));
        else promises.push(Promise.resolve(0));
        if (user?.permissions.includes('view_leads')) promises.push(api.get('/leads?limit=1').then(r => r.data.total));
        else promises.push(Promise.resolve(0));
        if (user?.permissions.includes('view_tasks')) promises.push(api.get('/tasks?limit=1').then(r => r.data.total));
        else promises.push(Promise.resolve(0));
        if (user?.permissions.includes('view_reports')) promises.push(api.get('/reports?limit=1').then(r => r.data.total));
        else promises.push(Promise.resolve(0));

        const [users, leads, tasks, reports] = await Promise.all(promises);
        setStats({ users, leads, tasks, reports });
      } catch {}
    };
    fetchStats();
  }, [user]);

  const cards = [
    { title: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', permission: 'view_users' },
    { title: 'Total Leads', value: stats.leads, icon: Target, color: 'text-green-600', bg: 'bg-green-50', permission: 'view_leads' },
    { title: 'Total Tasks', value: stats.tasks, icon: CheckSquare, color: 'text-orange-600', bg: 'bg-orange-50', permission: 'view_tasks' },
    { title: 'Total Reports', value: stats.reports, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50', permission: 'view_reports' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.filter(c => user?.permissions.includes(c.permission)).map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user?.permissions.map((perm) => (
              <span key={perm} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {perm}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
