'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { Task } from '@/lib/types';

export default function TasksPage() {
  const { hasPermission } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' });
  const canManage = hasPermission('manage_tasks');

  const fetchTasks = useCallback(async () => {
    try { const { data } = await api.get('/tasks'); setTasks(data.data); } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSubmit = async () => {
    try {
      const payload: any = { title: form.title, description: form.description, priority: form.priority };
      if (form.dueDate) payload.dueDate = form.dueDate;
      if (editing) {
        payload.status = form.status;
        await api.patch(`/tasks/${editing.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      setShowForm(false); setEditing(null);
      setForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' });
      fetchTasks();
    } catch (err: any) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${id}`); fetchTasks(); } catch {}
  };

  const priorityColor = (p: string) => {
    const map: Record<string, any> = { LOW: 'secondary', MEDIUM: 'default', HIGH: 'warning', URGENT: 'destructive' };
    return map[p] || 'secondary';
  };

  const statusColor = (s: string) => {
    const map: Record<string, any> = { TODO: 'secondary', IN_PROGRESS: 'default', DONE: 'success', CANCELLED: 'destructive' };
    return map[s] || 'secondary';
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track tasks</p>
        </div>
        {canManage && <Button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' }); }}><Plus className="h-4 w-4 mr-2" /> Add Task</Button>}
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{editing ? 'Edit Task' : 'New Task'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); setEditing(null); }}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
              </select>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              {editing && (
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="TODO">Todo</option><option value="IN_PROGRESS">In Progress</option><option value="DONE">Done</option><option value="CANCELLED">Cancelled</option>
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
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Priority</th>
                <th className="text-left p-4 font-medium">Due Date</th>
                <th className="text-left p-4 font-medium">Created</th>
                {canManage && <th className="text-right p-4 font-medium">Actions</th>}
              </tr></thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{task.title}</td>
                    <td className="p-4"><Badge variant={statusColor(task.status)}>{task.status.replace('_', ' ')}</Badge></td>
                    <td className="p-4"><Badge variant={priorityColor(task.priority)}>{task.priority}</Badge></td>
                    <td className="p-4 text-muted-foreground">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="p-4 text-muted-foreground">{new Date(task.createdAt).toLocaleDateString()}</td>
                    {canManage && (
                      <td className="p-4 text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(task); setShowForm(true); setForm({ title: task.title, description: task.description || '', status: task.status, priority: task.priority, dueDate: task.dueDate ? task.dueDate.split('T')[0] : '' }); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
