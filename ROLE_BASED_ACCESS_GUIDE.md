# 🔐 Role-Based Access Control (RBAC) - Implementation Guide

## 📋 Overview

PureTask now has a complete role-based access control system that automatically:
- ✅ Redirects users to role-specific dashboards after login
- ✅ Shows different navigation menus based on user roles
- ✅ Protects routes from unauthorized access
- ✅ Displays visual role badges
- ✅ Provides easy-to-use route guards

---

## 👥 User Roles

### **1. Admin** 🛡️
- **Dashboard:** `/admin`
- **Permissions:** Full access to everything
- **Badge Color:** Purple
- **Navigation:** Admin Panel, Home

### **2. Cleaner** 🧹
- **Dashboard:** `/cleaner/dashboard`
- **Permissions:** Cleaner-specific features + public pages
- **Badge Color:** Blue
- **Navigation:** My Dashboard, Home

### **3. Client** 👤
- **Dashboard:** `/client/dashboard`
- **Permissions:** Client-specific features + public pages
- **Badge Color:** Green
- **Navigation:** Find a Cleaner, My Bookings, Home

---

## 🔄 Login Flow

### **What Happens When You Login:**

1. **Enter credentials** on `/auth/login`
2. **Backend authenticates** and returns user data with role
3. **Frontend redirects** based on role:
   - **Admin** → `/admin`
   - **Cleaner** → `/cleaner/dashboard`
   - **Client** → `/client/dashboard`

### **Example Code:**
```typescript
// In login page
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const userData = await login(formData);
  
  // Automatic redirect based on role
  if (userData.role === 'admin') {
    router.push('/admin');
  } else if (userData.role === 'cleaner') {
    router.push('/cleaner/dashboard');
  } else if (userData.role === 'client') {
    router.push('/client/dashboard');
  }
};
```

---

## 🛡️ Protecting Routes

### **Method 1: Using RoleGuard Component**

Wrap your page content with `RoleGuard`:

```typescript
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function AdminDashboard() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <div>
        <h1>Admin Dashboard</h1>
        {/* Admin-only content */}
      </div>
    </RoleGuard>
  );
}
```

### **Method 2: Using Specific Guard Components**

```typescript
import { AdminGuard, CleanerGuard, ClientGuard } from '@/components/auth/RoleGuard';

// Admin-only page
export default function AdminPage() {
  return (
    <AdminGuard>
      <div>Admin content</div>
    </AdminGuard>
  );
}

// Cleaner page (admins can also access)
export default function CleanerPage() {
  return (
    <CleanerGuard>
      <div>Cleaner content</div>
    </CleanerGuard>
  );
}

// Client page (admins can also access)
export default function ClientPage() {
  return (
    <ClientGuard>
      <div>Client content</div>
    </ClientGuard>
  );
}
```

### **Method 3: Manual Role Check**

```typescript
import { useAuth } from '@/contexts/AuthContext';

export default function SomePage() {
  const { user } = useAuth();
  
  return (
    <div>
      {user?.role === 'admin' && (
        <button>Admin-only button</button>
      )}
      
      {user?.role === 'cleaner' && (
        <button>Cleaner-only button</button>
      )}
      
      {user?.role === 'client' && (
        <button>Client-only button</button>
      )}
    </div>
  );
}
```

---

## 🎨 Visual Role Indicators

### **RoleBadge Component**

Display a user's role with a colored badge:

```typescript
import { RoleBadge } from '@/components/ui/RoleBadge';

function UserProfile() {
  return (
    <div>
      <h2>John Doe</h2>
      <RoleBadge role="admin" size="md" showIcon={true} />
    </div>
  );
}
```

**Props:**
- `role`: `'admin' | 'cleaner' | 'client'` (required)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `showIcon`: `boolean` (default: `true`)
- `className`: `string` (optional)

**Badge Colors:**
- **Admin:** Purple background, Shield icon
- **Cleaner:** Blue background, Briefcase icon
- **Client:** Green background, User icon

---

## 📱 Role-Specific Navigation

The header automatically shows different navigation items based on the logged-in user's role.

### **Admin Navigation:**
- Home
- Admin Panel
- Profile (with purple badge)

### **Cleaner Navigation:**
- Home
- My Dashboard
- Profile (with blue badge)

### **Client Navigation:**
- Home
- Find a Cleaner
- My Bookings
- I'm a Cleaner (to become a cleaner)
- Profile (with green badge)

### **Not Logged In:**
- Home
- Find a Cleaner
- I'm a Cleaner
- Sign In / Sign Up buttons

---

## 🔒 Route Protection Configuration

Routes are protected using the `roleRouting.ts` configuration:

```typescript
// Protected route patterns
export const PROTECTED_ROUTES: Array<[RegExp, UserRole[]]> = [
  // Admin routes - only admins
  [/^\/admin/, ['admin']],
  
  // Cleaner routes - cleaners and admins
  [/^\/cleaner/, ['cleaner', 'admin']],
  
  // Client routes - clients and admins
  [/^\/client/, ['client', 'admin']],
  
  // Search is public
  [/^\/search/, ['admin', 'cleaner', 'client']],
];
```

**How it works:**
1. User tries to access a route (e.g., `/admin`)
2. System checks if route matches a protected pattern
3. System verifies user has required role
4. If authorized → show page
5. If not authorized → redirect to user's dashboard

---

## 🛠️ Implementation Files

### **Created Files:**

1. **`src/lib/roleRouting.ts`**
   - Role-based routing logic
   - Dashboard routes configuration
   - Access control functions

2. **`src/components/auth/RoleGuard.tsx`**
   - Route protection component
   - Loading and error states
   - Specific role guards (AdminGuard, CleanerGuard, ClientGuard)

3. **`src/components/ui/RoleBadge.tsx`**
   - Visual role indicator
   - Color-coded badges
   - Icon support

### **Modified Files:**

1. **`src/app/auth/login/page.tsx`**
   - Role-based redirect after login

2. **`src/contexts/AuthContext.tsx`**
   - Return user data from login/register

3. **`src/components/layout/Header.tsx`**
   - Role-specific navigation
   - Role badge in user profile
   - Conditional navigation items

---

## 📝 Usage Examples

### **Example 1: Protect Admin Page**

```typescript
// app/admin/page.tsx
import { AdminGuard } from '@/components/auth/RoleGuard';

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {/* Admin-only content */}
      </div>
    </AdminGuard>
  );
}
```

### **Example 2: Show Content Based on Role**

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { RoleBadge } from '@/components/ui/RoleBadge';

export default function ProfilePage() {
  const { user } = useAuth();
  
  return (
    <div>
      <div className="flex items-center gap-3">
        <h1>Welcome, {user?.full_name}</h1>
        {user && <RoleBadge role={user.role} />}
      </div>
      
      {/* Admin-only section */}
      {user?.role === 'admin' && (
        <div className="mt-4 p-4 bg-purple-50 rounded">
          <h2>Admin Controls</h2>
          <button>Manage Users</button>
          <button>View Analytics</button>
        </div>
      )}
      
      {/* Cleaner-only section */}
      {user?.role === 'cleaner' && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h2>Cleaner Dashboard</h2>
          <button>View Bookings</button>
          <button>AI Settings</button>
        </div>
      )}
      
      {/* Client-only section */}
      {user?.role === 'client' && (
        <div className="mt-4 p-4 bg-green-50 rounded">
          <h2>Client Dashboard</h2>
          <button>Book a Cleaner</button>
          <button>View History</button>
        </div>
      )}
    </div>
  );
}
```

### **Example 3: Conditional Rendering in Components**

```typescript
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const { user } = useAuth();
  
  return (
    <aside className="w-64 bg-white border-r">
      <nav>
        {/* Always visible */}
        <a href="/">Home</a>
        
        {/* Admin-only */}
        {user?.role === 'admin' && (
          <>
            <a href="/admin/users">Manage Users</a>
            <a href="/admin/analytics">Analytics</a>
            <a href="/admin/settings">Settings</a>
          </>
        )}
        
        {/* Cleaner-only */}
        {user?.role === 'cleaner' && (
          <>
            <a href="/cleaner/dashboard">Dashboard</a>
            <a href="/cleaner/bookings">Bookings</a>
            <a href="/cleaner/ai-settings">AI Settings</a>
          </>
        )}
        
        {/* Client-only */}
        {user?.role === 'client' && (
          <>
            <a href="/client/dashboard">Dashboard</a>
            <a href="/search">Find Cleaners</a>
            <a href="/client/bookings">My Bookings</a>
          </>
        )}
      </nav>
    </aside>
  );
}
```

---

## 🧪 Testing

### **Test User Accounts:**

```typescript
// Admin
Email: testadmin@test.com
Password: TestPass123!
Expected: Redirects to /admin

// Cleaner
Email: testcleaner1@test.com
Password: TestPass123!
Expected: Redirects to /cleaner/dashboard

// Client
Email: testclient1@test.com
Password: TestPass123!
Expected: Redirects to /client/dashboard
```

### **Testing Checklist:**

- [ ] Admin can access `/admin`
- [ ] Cleaner can access `/cleaner/*`
- [ ] Client can access `/client/*`
- [ ] Admin can access cleaner and client routes
- [ ] Cleaner CANNOT access `/admin`
- [ ] Client CANNOT access `/admin` or `/cleaner/*`
- [ ] Header shows correct navigation for each role
- [ ] Role badges display correctly
- [ ] Login redirects to correct dashboard
- [ ] Unauthorized access redirects to login or user's dashboard

---

## 🎯 Best Practices

### **1. Always Protect Admin Routes**
```typescript
// ✅ Good
<AdminGuard>
  <AdminDashboard />
</AdminGuard>

// ❌ Bad - No protection
<AdminDashboard />
```

### **2. Allow Admins to Access Everything**
Admins should be able to view cleaner and client pages for support purposes.

### **3. Use Specific Guards When Possible**
```typescript
// ✅ Good - Clear and concise
<AdminGuard>...</AdminGuard>

// ✅ Also good - More flexible
<RoleGuard allowedRoles={['admin', 'cleaner']}>...</RoleGuard>
```

### **4. Show Visual Feedback**
Always show the user's role in the header/profile so they know what account they're using.

### **5. Handle Loading States**
The `RoleGuard` component handles loading states automatically. Don't duplicate loading logic.

---

## 🚀 Quick Start

### **1. Protect a New Admin Page:**

```typescript
import { AdminGuard } from '@/components/auth/RoleGuard';

export default function NewAdminPage() {
  return (
    <AdminGuard>
      <h1>Your admin content here</h1>
    </AdminGuard>
  );
}
```

### **2. Add Role-Specific UI:**

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  
  return (
    <div>
      {user?.role === 'admin' && <AdminButton />}
      {user?.role === 'cleaner' && <CleanerButton />}
      {user?.role === 'client' && <ClientButton />}
    </div>
  );
}
```

### **3. Display User Role:**

```typescript
import { RoleBadge } from '@/components/ui/RoleBadge';

function UserInfo({ user }) {
  return (
    <div>
      <p>{user.name}</p>
      <RoleBadge role={user.role} />
    </div>
  );
}
```

---

## ✅ Summary

You now have a complete role-based access control system with:

✅ **Automatic role-based redirects** after login  
✅ **Route protection** with RoleGuard components  
✅ **Visual role indicators** with RoleBadge  
✅ **Role-specific navigation** in header  
✅ **Access control utilities** in roleRouting.ts  
✅ **Type-safe** with TypeScript  
✅ **Easy to use** with simple components  
✅ **Admin can access everything** by default  

**Status:** ✅ Production Ready!

---

**Last Updated:** January 11, 2026  
**Version:** 1.0.0

