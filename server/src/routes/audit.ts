/**
 * Audit Dashboard Routes
 * ──────────────────────
 * GET    /api/audit/criteria       — All criteria with status
 * GET    /api/audit/summary        — Aggregated summary stats
 * PATCH  /api/audit/criteria/:id   — Update criterion status/notes
 * GET    /api/audit/log            — Fix log history
 *
 * Returns empty arrays in demo mode (no Supabase).
 * Client uses fallback data when API returns empty.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET all audit criteria
router.get('/audit/criteria', async (req: Request, res: Response) => {
  try {
    if (!supabase) return res.json({ success: true, data: [] });

    const { lo } = req.query;

    let query = supabase
      .from('audit_criteria')
      .select('*')
      .order('priority', { ascending: true })
      .order('learning_outcome')
      .order('criterion_code');

    if (lo && typeof lo === 'string') {
      query = query.eq('learning_outcome', lo.toUpperCase());
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET audit summary — aggregated stats
router.get('/audit/summary', async (_req: Request, res: Response) => {
  try {
    if (!supabase) return res.json({ success: true, data: { total: 0 } });

    const { data, error } = await supabase
      .from('audit_criteria')
      .select('*');

    if (error) throw error;

    const criteria = data || [];
    const total = criteria.length;
    const passed = criteria.filter((c: any) => c.status === 'passed').length;
    const fixed = criteria.filter((c: any) => c.status === 'fixed').length;
    const inProgress = criteria.filter((c: any) => c.status === 'in_progress').length;
    const notFixed = criteria.filter((c: any) => c.status === 'not_fixed').length;
    const blockers = criteria.filter((c: any) => c.blocker && c.status !== 'passed' && c.status !== 'fixed').length;

    const byLO: Record<string, any> = {};
    criteria.forEach((c: any) => {
      if (!byLO[c.learning_outcome]) {
        byLO[c.learning_outcome] = { total: 0, passed: 0, fixed: 0, notFixed: 0, inProgress: 0 };
      }
      byLO[c.learning_outcome].total++;
      byLO[c.learning_outcome][c.status === 'not_fixed' ? 'notFixed' : c.status]++;
    });

    const completionRate = total > 0 ? Math.round(((passed + fixed) / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        total, passed, fixed, inProgress, notFixed, blockers, completionRate, byLO,
        verdict: blockers > 0
          ? 'At Risk — Critical blockers remain'
          : notFixed > 0
          ? 'In Progress — Non-critical items pending'
          : 'Ready for Resubmission',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH update criterion status/notes
const updateSchema = z.object({
  status: z.enum(['not_fixed', 'in_progress', 'fixed', 'passed']).optional(),
  fix_notes: z.string().max(5000).optional(),
});

router.patch('/audit/criteria/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    if (!supabase) {
      // Demo mode: return mock success
      return res.json({
        success: true,
        data: { id: req.params.id, ...parsed.data, updated_at: new Date().toISOString() },
      });
    }

    const updates: any = { ...parsed.data, updated_at: new Date().toISOString() };

    const { data: prev } = await supabase
      .from('audit_criteria')
      .select('status')
      .eq('id', req.params.id)
      .single();

    const { data, error } = await supabase
      .from('audit_criteria')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (parsed.data.status && prev && prev.status !== parsed.data.status) {
      await supabase.from('audit_fix_log').insert({
        criterion_id: req.params.id,
        action: `Status changed: ${prev.status} → ${parsed.data.status}`,
        before_state: prev.status,
        after_state: parsed.data.status,
      });
    }

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET fix log
router.get('/audit/log', async (_req: Request, res: Response) => {
  try {
    if (!supabase) return res.json({ success: true, data: [] });

    const { data, error } = await supabase
      .from('audit_fix_log')
      .select(`*, audit_criteria (criterion_code, criterion_title, learning_outcome)`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
