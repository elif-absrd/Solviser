# Quick Development Setup Guide

## Current Issues and Solutions

### Issue 1: Database Connection
The API requires PostgreSQL but it's not set up. 

**Temporary Solution**: Create a development mode that bypasses authentication.

### Issue 2: Frontend Authentication
The webapp/website are trying to access protected routes without authentication.

**Temporary Solution**: Modify the middleware to allow unauthenticated access in development.

## Quick Fixes for Development

### 1. Bypass Authentication Middleware (Development Only)

Modify `api/src/middleware/auth.middleware.ts` to skip authentication in development:

```typescript
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  // Development mode - bypass authentication
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    req.user = {
      userId: 'dev-user-id',
      organizationId: 'dev-org-id',
      isOwner: true,
      name: 'Development User',
      email: 'dev@example.com',
      isSuperAdmin: true,
      permissions: ['dashboard.view', 'contract.create', 'contract.view.all'],
      tokenVersion: 1
    };
    return next();
  }
  
  // ... rest of the authentication logic
}
```

### 2. Add Environment Variable

Add to `api/.env`:
```
BYPASS_AUTH=true
```

### 3. Create Mock API Responses

Create mock data for dashboard stats and user info.