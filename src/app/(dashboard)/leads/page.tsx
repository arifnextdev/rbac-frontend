'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { Lead } from '@/lib/types';

export default function LeadsPage() {
  const { hasPermission } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'NEW', notes: '' });
  const canManage = hasPermission('manage_leads');

  const fetchLeads = useCallback(async () => {
    try { const { data } = await api.get('/leads'); setLeads(data.data); } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleSubmit = async () => {
    try {
      if (editing) {
        await api.patch(`/leads/${editing.id}`, form);
      } else {
        await api.post('/leads', form);
      }
      setShowForm(false); setEditing(null);
      setForm({ name: '', email: '', phone: '', company: '', status: 'NEW', notes: '' });
      fetchLeads();
    } catch (err: any) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    try { await api.delete(`/leads/${id}`); fetchLeads(); } catch {}
  };

  const statusColor = (s: string) => {
    const map: Record<string, any> = { NEW: 'default', CONTACTED: 'secondary', QUALIFIED: 'success', WON: 'success', LOST: 'destructive' };
    return map[s] || 'secondary';
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground mt-1">Track and manage your sales leads</p>
        </div>
        {canManage && <Button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', email: '', phone: '', company: '', status: 'NEW', notes: '' }); }}><Plus className="h-4 w-4 mr-2" /> Add Lead</Button>}
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{editing ? 'Edit Lead' : 'New Lead'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditing(null); }}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              {editing && (
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="NEW">New</option><option value="CONTACTED">Contacted</option><option value="QUALIFIED">Qualified</option><option value="WON">Won</option><option value="LOST">Lost</option>
                </select>
              )}
            </div>
            <Button onClick={handleSubmit}>{editing ? 'Update' : 'Create'}</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/50">
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Company</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Created</th>
                {canManage && <th className="text-right p-4 font-medium">Actions</th>}
              </tr></thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{lead.name}</td>
                    <td className="p-4 text-muted-foreground">{lead.email || '-'}</td>
                    <td className="p-4 text-muted-foreground">{lead.company || '-'}</td>
                    <td className="p-4"><Badge variant={statusColor(lead.status)}>{lead.status}</Badge></td>
                    <td className="p-4 text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    {canManage && (
                      <td className="p-4 text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(lead); setShowForm(true); setForm({ name: lead.name, email: lead.email || '', phone: lead.phone || '', company: lead.company || '', status: lead.status, notes: lead.notes || '' }); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(lead.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
