export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  title: string;
  description?: string;
  type: string;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
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

export interface Permission {
  id: string;
  name: string;
  description?: string;
  module: string;
  granted?: boolean;
  source?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export const ROUTE_PERMISSIONS: Record<string, string> = {
  '/dashboard': 'view_dashboard',
  '/users': 'view_users',
  '/leads': 'view_leads',
  '/tasks': 'view_tasks',
  '/reports': 'view_reports',
  '/audit': 'view_audit',
  '/settings': 'manage_settings',
};
