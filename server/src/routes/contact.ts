/**
 * Contact & Booking Routes
 * ────────────────────────
 * POST /api/contact   — Submit contact form
 * POST /api/bookings  — Submit booking request
 * GET  /api/bookings  — List bookings (admin)
 *
 * Gracefully degrades without Supabase: validates input, logs to console,
 * and returns success so the form UX works in demo mode.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../supabase';

const router = Router();

// ── Validation Schemas ──
const contactSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  email: z.string().email('Invalid email address').max(254),
  phone: z.string().max(20).optional(),
  service_type: z.string().max(100).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

const bookingSchema = z.object({
  client_name: z.string().min(2).max(200),
  client_email: z.string().email().max(254),
  service_id: z.string().uuid().optional(),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  event_time: z.string().optional(),
  location: z.string().max(300).optional(),
  notes: z.string().max(2000).optional(),
});

// POST contact form submission
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    // If Supabase is connected, store in database
    if (supabase) {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert(parsed.data)
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Thank you for your message! Malcolm will get back to you within 24 hours.',
        data,
      });
    }

    // Demo mode: validate passed, log and return success
    console.log('📬 Contact form submission (demo mode):', parsed.data);
    res.status(201).json({
      success: true,
      message: 'Thank you for your message! Malcolm will get back to you within 24 hours.',
      data: { id: `demo-${Date.now()}`, ...parsed.data, created_at: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST booking request
router.post('/bookings', async (req: Request, res: Response) => {
  try {
    const parsed = bookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .insert(parsed.data)
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        message: 'Booking request submitted! Malcolm will confirm within 48 hours.',
        data,
      });
    }

    console.log('📅 Booking submission (demo mode):', parsed.data);
    res.status(201).json({
      success: true,
      message: 'Booking request submitted! Malcolm will confirm within 48 hours.',
      data: { id: `demo-${Date.now()}`, ...parsed.data, created_at: new Date().toISOString() },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all bookings (for admin/dashboard)
router.get('/bookings', async (_req: Request, res: Response) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select(`*, services (title)`)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return res.json({ success: true, data });
    }

    res.json({ success: true, data: [] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
