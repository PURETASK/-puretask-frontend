/**
 * Role-Based Routing Configuration
 * 
 * This file defines where each user role should be redirected
 * and which routes are accessible to each role.
 */

export type UserRole = 'admin' | 'cleaner' | 'client';

/**
 * Default dashboard routes for each role
 */
export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  admin: '/admin',
  cleaner: '/cleaner/dashboard',
  client: '/client/dashboard',
};

/**
 * Home routes for each role (after login)
 */
export const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  admin: '/admin',
  cleaner: '/cleaner/dashboard',
  client: '/client/dashboard',
};

/**
 * Route patterns that require specific roles
 * Format: [route pattern, allowed roles]
 */
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

/**
 * Get the appropriate dashboard route for a user's role
 */
export function getDashboardRoute(role: UserRole): string {
  return ROLE_DASHBOARDS[role] || '/';
}

/**
 * Check if a user has access to a specific route
 */
export function canAccessRoute(pathname: string, userRole: UserRole): boolean {
  // Public routes (no auth required)
  const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email', '/search'];
  
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return true;
  }
  
  // Check protected routes
  for (const [pattern, allowedRoles] of PROTECTED_ROUTES) {
    if (pattern.test(pathname)) {
      return allowedRoles.includes(userRole);
    }
  }
  
  // Default: allow access (or you can default to deny)
  return true;
}

/**
 * Get redirect path if user doesn't have access
 */
export function getRedirectPath(pathname: string, userRole: UserRole | null): string | null {
  // Not logged in - redirect to login
  if (!userRole) {
    return '/auth/login';
  }
  
  // User doesn't have access to this route
  if (!canAccessRoute(pathname, userRole)) {
    return getDashboardRoute(userRole);
  }
  
  return null;
}

/**
 * Get appropriate route after successful login
 */
export function getPostLoginRoute(userRole: UserRole, intendedDestination?: string): string {
  // If user was trying to access a specific page and has permission, go there
  if (intendedDestination && intendedDestination !== '/auth/login') {
    if (canAccessRoute(intendedDestination, userRole)) {
      return intendedDestination;
    }
  }
  
  // Otherwise, go to role-specific dashboard
  return getDashboardRoute(userRole);
}

/**
 * Check if current route is appropriate for user's role
 * If not, return the correct route to redirect to
 */
export function shouldRedirect(currentPath: string, userRole: UserRole | null): string | null {
  // On login page but already logged in - redirect to dashboard
  if (currentPath === '/auth/login' && userRole) {
    return getDashboardRoute(userRole);
  }
  
  // Check access
  return getRedirectPath(currentPath, userRole);
}

