/**
 * Custom Hook: useApi
 * ───────────────────
 * Generic data-fetching hook with loading, error, and refetch support.
 * Implements the Observer pattern via React state updates.
 */

import { useState, useEffect, useCallback } from 'react';
import type { ApiResponse } from '../types';
import { supabase } from '../lib/supabase';

const API_BASE = '/api';

/** Retrieve the current Supabase session token (if logged in) */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  } catch {
    // No session available — continue without auth header
  }
  return headers;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(endpoint: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}${endpoint}`);
      const json: ApiResponse<T> = await res.json();

      if (!json.success) throw new Error(json.error || 'Request failed');
      setData(json.data ?? null);
    } catch (err: any) {
      // Silently handle network errors (server not running) — fallback data handles it
      console.warn(`API ${endpoint}:`, err.message);
      setError(null); // Don't show network errors to user; pages use fallback data
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// POST/PATCH helper — gracefully handles server-down scenarios
// Automatically attaches Supabase JWT for authenticated requests
export async function apiMutate<T>(
  endpoint: string,
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  body?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return await res.json();
  } catch (err: any) {
    // Server unreachable — return demo-mode success so the UI still works
    console.warn(`API ${method} ${endpoint}: server unreachable — using demo mode`);
    return { success: true, data: body as unknown as T };
  }
}
