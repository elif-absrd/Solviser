// File: apps/api/src/types/express.d.ts

// This file extends the Express Request interface to include our custom 'user' property.

declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
      organizationId: string;
      isOwner: boolean;
        isSuperAdmin: boolean;
      name: string;
      email: string;
      permissions: string[];
      [key: string]: any;
    };
  }
}

// THE FIX: This empty export statement makes the file a module.
export {};