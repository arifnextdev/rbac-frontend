'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Shield, X } from 'lucide-react';
import type { Permission, Role } from '@/lib/types';

interface UserRow {
  id: string;
  email: string;
  name: string;
  status: string;
  role: { id: string; name: string };
  createdAt: string;
}

export default function UsersPage() {
  const { user: currentUser, hasPermission } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [permUser, setPermUser] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', roleId: '', status: 'ACTIVE' });

  const canManage = hasPermission('manage_users');

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.data);
    } catch {} finally { setLoading(false); }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const { data } = await api.get('/roles');
      setRoles(data);
    } catch {}
  }, []);

  useEffect(() => { fetchUsers(); fetchRoles(); }, [fetchUsers, fetchRoles]);

  const handleCreate = async () => {
    try {
      await api.post('/users', form);
      setShowCreate(false);
      setForm({ name: '', email: '', password: '', roleId: '', status: 'ACTIVE' });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating user');
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      const payload: any = {};
      if (form.name) payload.name = form.name;
      if (form.email) payload.email = form.email;
      if (form.roleId) payload.roleId = form.roleId;
      if (form.status) payload.status = form.status;
      await api.patch(`/users/${editingUser.id}`, payload);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating user');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const openPermissions = async (userId: string) => {
    setPermUser(userId);
    try {
      const { data } = await api.get(`/permissions/user/${userId}`);
      setPermissions(data);
    } catch { setPermissions([]); }
  };

  const togglePermission = async (perm: Permission) => {
    if (!permUser) return;
    try {
      if (perm.granted) {
        await api.post('/permissions/revoke', { userId: permUser, permissionId: perm.id });
      } else {
        await api.post('/permissions/grant', { userId: permUser, permissionId: perm.id });
      }
      openPermissions(permUser);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating permission');
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success' as const;
      case 'SUSPENDED': return 'warning' as const;
      case 'BANNED': return 'destructive' as const;
      default: return 'secondary' as const;
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">Manage system users and their permissions</p>
        </div>
        {canManage && (
          <Button onClick={() => { setShowCreate(true); setForm({ name: '', email: '', password: '', roleId: roles[0]?.id || '', status: 'ACTIVE' }); }}>
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        )}
      </div>

      {/* Create / Edit Modal */}
      {(showCreate || editingUser) && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{editingUser ? 'Edit User' : 'Create User'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setShowCreate(false); setEditingUser(null); }}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {showCreate && <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />}
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })}>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              {editingUser && (
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="BANNED">Banned</option>
                </select>
              )}
            </div>
            <Button onClick={editingUser ? handleUpdate : handleCreate}>
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Permissions Modal */}
      {permUser && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Manage Permissions</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setPermUser(null)}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {permissions.map((perm) => {
                const actorHasPerm = currentUser?.permissions.includes(perm.name);
                return (
                  <div key={perm.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">{perm.name}</p>
                      <p className="text-xs text-muted-foreground">{perm.module}</p>
                    </div>
                    <button
                      disabled={!actorHasPerm}
                      onClick={() => togglePermission(perm)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${perm.granted ? 'bg-primary' : 'bg-gray-200'} ${!actorHasPerm ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${perm.granted ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                );
              })}
            </div>
            {permissions.some(p => !currentUser?.permissions.includes(p.name)) && (
              <p className="text-xs text-muted-foreground mt-4">Disabled toggles indicate permissions you don&apos;t have (grant ceiling).</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Created</th>
                  {canManage && <th className="text-right p-4 font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">{u.name}</td>
                    <td className="p-4 text-muted-foreground">{u.email}</td>
                    <td className="p-4"><Badge variant="secondary">{u.role.name}</Badge></td>
                    <td className="p-4"><Badge variant={statusColor(u.status)}>{u.status}</Badge></td>
                    <td className="p-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                    {canManage && (
                      <td className="p-4 text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => openPermissions(u.id)} title="Permissions">
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setEditingUser(u); setForm({ name: u.name, email: u.email, password: '', roleId: u.role.id, status: u.status }); }} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)} title="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
