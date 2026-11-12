/**
 * Portfolio Routes
 * ────────────────
 * GET /api/portfolio          — All images (optional ?category=slug filter)
 * GET /api/portfolio/featured — Featured images only
 * GET /api/portfolio/:id      — Single image by ID
 * GET /api/categories         — All categories
 *
 * Returns empty arrays in demo mode (no Supabase).
 * Client uses fallback data when API returns empty.
 */

import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';

const router = Router();

// GET all portfolio images, optionally filtered by category slug
router.get('/portfolio', async (req: Request, res: Response) => {
  try {
    if (!supabase) return res.json({ success: true, data: [] });

    const { category } = req.query;

    let query = supabase
      .from('portfolio_images')
      .select(`*, categories (id, name, slug)`)
      .order('created_at', { ascending: false });

    if (category && typeof category === 'string') {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();

      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET featured portfolio images
router.get('/portfolio/featured', async (_req: Request, res: Response) => {
  try {
    if (!supabase) return res.json({ success: true, data: [] });

    const { data, error } = await supabase
      .from('portfolio_images')
      .select(`*, categories (id, name, slug)`)
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single portfolio image
router.get('/portfolio/:id', async (req: Request, res: Response) => {
  try {
    if (!supabase) return res.status(404).json({ success: false, error: 'Image not found (demo mode)' });

    const { data, error } = await supabase
      .from('portfolio_images')
      .select(`*, categories (id, name, slug)`)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(404).json({ success: false, error: 'Image not found' });
  }
});

// GET all categories
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    if (!supabase) return res.json({ success: true, data: [] });

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
