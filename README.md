# Dynamic RBAC System

A full-stack **Permission-Based Access Control** system with NestJS backend and Next.js frontend.

## Project Overview

| Component          | URL / Repository                             |
| ------------------ | -------------------------------------------- |
| **Live Dashboard** | https://task.vsecommerce.cloud/dashboard     |
| **Frontend Repo**  | https://github.com/arifnextdev/rbac-frontend |
| **Backend Repo**   | https://github.com/arifnextdev/rbac-backend  |

## Tech Stack

| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Frontend | Next.js 14 (App Router), TailwindCSS, Radix  |
| Backend  | NestJS, Passport JWT, class-validator        |
| Database | PostgreSQL + Prisma ORM                      |
| Auth     | JWT access tokens + httpOnly refresh cookies |

## Features

- **Dynamic RBAC** — permissions are atomic; roles are just labels grouping permissions
- **Grant Ceiling** — users can only assign permissions they themselves have
- **JWT Auth** — 15-min access token (in memory) + 7-day refresh token (httpOnly cookie)
- **Audit Logging** — append-only log of all significant actions
- **Middleware Route Protection** — Next.js middleware checks auth cookie
- **Dynamic Sidebar** — only shows links the user has permission to access
- **Soft Delete** — entities use `deletedAt` timestamp, never hard-deleted

## RBAC Architecture

### Permission-Based vs Role-Based

Traditional RBAC assigns permissions to roles, then assigns roles to users. This system uses **permission-based access control** where:

1. **Permissions are atomic** — Each permission represents a single action (e.g., `view_users`, `manage_leads`)
2. **Roles are labels** — Roles group permissions for convenience but don't directly grant access
3. **Dynamic assignment** — Administrators can grant/revoke individual permissions per user

### Grant Ceiling Enforcement

Users can only grant permissions they themselves possess. This security feature prevents privilege escalation.

```
Admin (has: view_users, manage_users)
  └── Can grant: view_users, manage_users to Manager
      └── Manager (has: view_users, manage_users)
          └── Can grant: view_users, manage_users to Agent
```

### Permission Modules

| Module    | View             | Manage            |
| --------- | ---------------- | ----------------- |
| Users     | `view_users`     | `manage_users`    |
| Leads     | `view_leads`     | `manage_leads`    |
| Tasks     | `view_tasks`     | `manage_tasks`    |
| Reports   | `view_reports`   | `manage_reports`  |
| Audit     | `view_audit`     | —                 |
| Settings  | —                | `manage_settings` |
| Dashboard | `view_dashboard` | —                 |

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL running on `localhost:5432`
- Database `rback_db` created

### 1. Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
```

Backend runs on **http://localhost:3001**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

### Demo Accounts

| Role     | Email                | Password     |
| -------- | -------------------- | ------------ |
| Admin    | admin@example.com    | Admin@123    |
| Manager  | manager@example.com  | Manager@123  |
| Agent    | agent@example.com    | Agent@123    |
| Customer | customer@example.com | Customer@123 |

## Project Structure

```
backend/
├── prisma/            # Schema & seed
├── src/
│   ├── auth/          # JWT auth, login, refresh, logout
│   ├── users/         # User CRUD + permission assignment
│   ├── permissions/   # Grant/revoke with ceiling enforcement
│   ├── roles/         # Role listing
│   ├── leads/         # Lead CRUD
│   ├── tasks/         # Task CRUD
│   ├── reports/       # Report CRUD
│   ├── audit/         # Audit log viewing
│   ├── prisma/        # Prisma module/service
│   └── common/        # Guards, decorators

frontend/
├── src/
│   ├── app/
│   │   ├── (dashboard)/  # Protected pages (layout with sidebar)
│   │   ├── login/        # Login page
│   │   └── 403/          # Forbidden page
│   ├── components/       # Sidebar, route guard, UI components
│   └── lib/              # API client, auth context, types
```

## API Endpoints

| Method                | Endpoint                  | Permission          |
| --------------------- | ------------------------- | ------------------- |
| POST                  | /api/auth/login           | Public              |
| POST                  | /api/auth/refresh         | Public              |
| POST                  | /api/auth/logout          | Authenticated       |
| GET                   | /api/auth/me              | Authenticated       |
| GET                   | /api/users                | view_users          |
| POST                  | /api/users                | manage_users        |
| PATCH                 | /api/users/:id            | manage_users        |
| DELETE                | /api/users/:id            | manage_users        |
| GET                   | /api/permissions          | manage_permissions  |
| GET                   | /api/permissions/user/:id | manage_permissions  |
| POST                  | /api/permissions/grant    | manage_permissions  |
| POST                  | /api/permissions/revoke   | manage_permissions  |
| GET                   | /api/roles                | manage_roles        |
| GET/POST/PATCH/DELETE | /api/leads                | view/manage_leads   |
| GET/POST/PATCH/DELETE | /api/tasks                | view/manage_tasks   |
| GET/POST/PATCH/DELETE | /api/reports              | view/manage_reports |
| GET                   | /api/audit                | view_audit          |

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/rback_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"

# Server
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Deployment

### Backend Deployment

1. Set up PostgreSQL database
2. Run migrations: `npx prisma migrate deploy`
3. Seed database: `npx prisma db seed`
4. Start production server: `npm run start:prod`

### Frontend Deployment

1. Build for production: `npm run build`
2. Start production server: `npm start`

Or deploy to Vercel:

```bash
vercel --prod
```

## Security Considerations

- **JWT tokens**: Access tokens expire in 15 minutes, refresh tokens in 7 days
- **Password hashing**: All passwords hashed with bcrypt
- **SQL injection**: Protected by Prisma ORM parameterized queries
- **XSS protection**: HttpOnly cookies prevent JavaScript access to tokens
- **Rate limiting**: API endpoints protected by NestJS throttler

## License

MIT License - feel free to use this project for your own applications.
