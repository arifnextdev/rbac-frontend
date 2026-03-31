'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AuditLog {
  id: string;
  userId?: string;
  user?: { id: string; name: string; email: string };
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = useCallback(async () => {
    try {
      const { data } = await api.get(`/audit?page=${page}&limit=20`);
      setLogs(data.data);
      setTotalPages(data.totalPages);
    } catch {} finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const actionColor = (action: string) => {
    if (action.includes('CREATE')) return 'success' as const;
    if (action.includes('DELETE')) return 'destructive' as const;
    if (action.includes('UPDATE') || action.includes('GRANT') || action.includes('REVOKE')) return 'warning' as const;
    if (action.includes('LOGIN') || action.includes('LOGOUT')) return 'default' as const;
    return 'secondary' as const;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground mt-1">System activity log (read-only)</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Timestamp</th>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Action</th>
                  <th className="text-left p-4 font-medium">Entity</th>
                  <th className="text-left p-4 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">{log.user?.name || log.userId || 'System'}</td>
                    <td className="p-4">
                      <Badge variant={actionColor(log.action)}>{log.action}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{log.entity}</td>
                    <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '-'}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No audit logs found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-md border disabled:opacity-50 hover:bg-muted"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm rounded-md border disabled:opacity-50 hover:bg-muted"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
