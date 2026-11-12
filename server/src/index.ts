/**
 * Malcolm Lismore Photography — Express Server
 * ──────────────────────────────────────────────
 * Entry point: sets up middleware and mounts route modules.
 *
 * Design Patterns:
 *  - Repository Pattern via Supabase client abstraction
 *  - Modular Router pattern (separation of concerns)
 *  - Input validation with Zod (fail-fast)
 *  - Helmet for security headers
 *  - Rate limiting on mutation endpoints
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import portfolioRoutes from './routes/portfolio';
import contactRoutes from './routes/contact';
import servicesRoutes from './routes/services';
import auditRoutes from './routes/audit';
import openApiDocument from './openapi.json';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  '/api-docs',
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
      },
    },
  }),
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, { customSiteTitle: 'Malcolm Lismore API Docs' })
);

// ── Global Middleware ──
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.get('/api-docs.json', (_req, res) => {
  res.json(openApiDocument);
});

// Rate limiting for form submissions (anti-spam)
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                     // 10 submissions per window
  message: { success: false, error: 'Too many submissions. Please try again later.' },
});
app.use('/api/contact', formLimiter);
app.use('/api/bookings', formLimiter);

// ── Routes ──
app.use('/api', portfolioRoutes);
app.use('/api', contactRoutes);
app.use('/api', servicesRoutes);
app.use('/api', auditRoutes);

// ── Health Check ──
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    service: 'Malcolm Lismore Photography API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ──
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// ── Global Error Handler ──
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║   Malcolm Lismore Photography API                ║
  ║   Running on http://localhost:${PORT}              ║
  ║   Student: B P K Kulasuriya (E193540)            ║
  ╚══════════════════════════════════════════════════╝
  `);
});

export default app;
