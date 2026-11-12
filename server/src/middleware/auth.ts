/**
 * Authentication Middleware — JWT Verification
 * ─────────────────────────────────────────────
 * Verifies Supabase JWT tokens on protected API routes.
 * Extracts the user from the Authorization header and
 * attaches it to the request object.
 *
 * Design Patterns:
 *  - Middleware Pattern (Express chain of responsibility)
 *  - Fail-Fast (rejects immediately on invalid/missing token)
 *
 * Usage:
 *   router.get('/admin/data', requireAuth, handler);
 */

import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabase';

// Extend Express Request to include the authenticated user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware that requires a valid Supabase JWT.
 * Expects: Authorization: Bearer <jwt>
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  // If Supabase isn't configured, allow in demo mode
  if (!supabase) {
    req.user = { id: 'demo-user', email: 'demo@malcolmlismore.com', role: 'admin' };
    next();
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Missing or invalid Authorization header. Expected: Bearer <token>',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token. Please sign in again.',
      });
      return;
    }

    // Attach user info to request for downstream handlers
    req.user = {
      id: user.id,
      email: user.email || '',
      role: user.role || 'authenticated',
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({
      success: false,
      error: 'Authentication service unavailable.',
    });
  }
}
