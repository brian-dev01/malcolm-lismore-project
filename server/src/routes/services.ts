/**
 * Services & Testimonials Routes
 * ───────────────────────────────
 * GET /api/services      — All active services
 * GET /api/services/:id  — Single service
 * GET /api/testimonials  — Approved testimonials
 * GET /api/settings      — Site settings
 *
 * Returns empty arrays in demo mode (no Supabase).
 */

import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';

const router = Router();

// GET all active services
router.get('/services', async (_req: Request, res: Response) => {
  try {
    if (!supabase) return res.json({ success: true, data: [] });

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('sort_order');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single service
router.get('/services/:id', async (req: Request, res: Response) => {
  try {
    if (!supabase) return res.status(404).json({ success: false, error: 'Service not found (demo mode)' });

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(404).json({ success: false, error: 'Service not found' });
  }
});

// GET approved testimonials
router.get('/testimonials', async (_req: Request, res: Response) => {
  try {
    if (!supabase) return res.json({ success: true, data: [] });

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET site settings
router.get('/settings', async (_req: Request, res: Response) => {
  try {
    if (!supabase) return res.json({ success: true, data: {} });

    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error) throw error;

    const settings = (data || []).reduce((acc: Record<string, any>, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    res.json({ success: true, data: settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
