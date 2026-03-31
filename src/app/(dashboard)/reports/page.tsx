'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, X } from 'lucide-react';
import type { Report } from '@/lib/types';

export default function ReportsPage() {
  const { hasPermission } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'general' });
  const canManage = hasPermission('manage_reports');

  const fetchReports = useCallback(async () => {
    try { const { data } = await api.get('/reports'); setReports(data.data); } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleSubmit = async () => {
    try {
      await api.post('/reports', form);
      setShowForm(false);
      setForm({ title: '', description: '', type: 'general' });
      fetchReports();
    } catch (err: any) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this report?')) return;
    try { await api.delete(`/reports/${id}`); fetchReports(); } catch {}
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">View and manage reports</p>
        </div>
        {canManage && <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-2" /> New Report</Button>}
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>New Report</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="general">General</option><option value="sales">Sales</option><option value="activity">Activity</option><option value="performance">Performance</option>
              </select>
            </div>
            <Button onClick={handleSubmit}>Create</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base">{report.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{report.description || 'No description'}</p>
              </div>
              {canManage && (
                <Button variant="ghost" size="icon" onClick={() => handleDelete(report.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{report.type}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
