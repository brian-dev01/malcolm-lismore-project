-- ============================================================
-- Malcolm Lismore Photographer — Supabase Schema
-- Student: B P K Kulasuriya (E193540)
-- Unit 10: Web Design and Development
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────
-- 1. PORTFOLIO CATEGORIES
-- ──────────────────────────────────────────────
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL UNIQUE,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 2. PORTFOLIO IMAGES
-- ──────────────────────────────────────────────
CREATE TABLE portfolio_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  image_url   TEXT NOT NULL,
  alt_text    VARCHAR(300) NOT NULL,       -- SEO: descriptive alt tags
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  featured    BOOLEAN DEFAULT FALSE,
  width       INT,
  height      INT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portfolio_category ON portfolio_images(category_id);
CREATE INDEX idx_portfolio_featured ON portfolio_images(featured) WHERE featured = TRUE;

-- ──────────────────────────────────────────────
-- 3. SERVICES
-- ──────────────────────────────────────────────
CREATE TABLE services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  icon        VARCHAR(50),                 -- Lucide icon name
  price_from  DECIMAL(10,2),
  features    JSONB DEFAULT '[]'::JSONB,   -- ["Feature 1", "Feature 2"]
  sort_order  INT DEFAULT 0,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 4. TESTIMONIALS
-- ──────────────────────────────────────────────
CREATE TABLE testimonials (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(150) NOT NULL,
  role        VARCHAR(100),                -- e.g., "Bride", "Business Owner"
  content     TEXT NOT NULL,
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  avatar_url  TEXT,
  featured    BOOLEAN DEFAULT FALSE,
  approved    BOOLEAN DEFAULT FALSE,       -- Admin approval before display
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 5. CONTACT SUBMISSIONS
-- ──────────────────────────────────────────────
CREATE TABLE contact_submissions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name     VARCHAR(200) NOT NULL,
  email         VARCHAR(254) NOT NULL,
  phone         VARCHAR(20),
  service_type  VARCHAR(100),
  message       TEXT NOT NULL,
  status        VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_status ON contact_submissions(status);

-- ──────────────────────────────────────────────
-- 6. BOOKINGS
-- ──────────────────────────────────────────────
CREATE TABLE bookings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name   VARCHAR(200) NOT NULL,
  client_email  VARCHAR(254) NOT NULL,
  service_id    UUID REFERENCES services(id) ON DELETE SET NULL,
  event_date    DATE NOT NULL,
  event_time    TIME,
  location      VARCHAR(300),
  notes         TEXT,
  status        VARCHAR(20) DEFAULT 'pending'
                CHECK (status IN ('pending','confirmed','completed','cancelled')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_date ON bookings(event_date);

-- ──────────────────────────────────────────────
-- 7. SITE SETTINGS (key-value store)
-- ──────────────────────────────────────────────
CREATE TABLE site_settings (
  key         VARCHAR(100) PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 8. AUDIT CRITERIA (Assignment Dashboard)
-- ──────────────────────────────────────────────
CREATE TABLE audit_criteria (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  learning_outcome VARCHAR(10) NOT NULL,    -- LO1, LO2, LO3, LO4
  criterion_code  VARCHAR(10) NOT NULL,     -- P1, P2, M1, D1, etc.
  criterion_title VARCHAR(300) NOT NULL,
  description     TEXT,
  status          VARCHAR(20) DEFAULT 'not_fixed'
                  CHECK (status IN ('not_fixed','in_progress','fixed','passed')),
  priority        INT DEFAULT 0,           -- 1=highest
  assessor_notes  TEXT,
  fix_notes       TEXT,
  blocker         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_lo ON audit_criteria(learning_outcome);
CREATE INDEX idx_audit_status ON audit_criteria(status);

-- ──────────────────────────────────────────────
-- 9. AUDIT FIX LOG
-- ──────────────────────────────────────────────
CREATE TABLE audit_fix_log (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  criterion_id  UUID REFERENCES audit_criteria(id) ON DELETE CASCADE,
  action        TEXT NOT NULL,
  before_state  VARCHAR(20),
  after_state   VARCHAR(20),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW-LEVEL SECURITY (enable for production)
-- ============================================================
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public read for portfolio, services, testimonials, categories
CREATE POLICY "Public read categories"     ON categories         FOR SELECT USING (true);
CREATE POLICY "Public read portfolio"      ON portfolio_images   FOR SELECT USING (true);
CREATE POLICY "Public read services"       ON services           FOR SELECT USING (active = true);
CREATE POLICY "Public read testimonials"   ON testimonials       FOR SELECT USING (approved = true);
CREATE POLICY "Public read site_settings"  ON site_settings      FOR SELECT USING (true);

-- Public insert for contact form
CREATE POLICY "Public insert contact"      ON contact_submissions FOR INSERT WITH CHECK (true);

-- Public insert for bookings
CREATE POLICY "Public insert bookings"     ON bookings           FOR INSERT WITH CHECK (true);


-- ============================================================
-- SEED DATA
-- ============================================================

-- Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Weddings',    'weddings',    'Beautiful wedding photography capturing your special day', 1),
  ('Portraits',   'portraits',   'Professional portrait photography for individuals and families', 2),
  ('Landscapes',  'landscapes',  'Stunning landscape photography from across Scotland', 3),
  ('Events',      'events',      'Corporate and private event photography', 4),
  ('Commercial',  'commercial',  'Professional commercial and product photography', 5);

-- Portfolio images (using Unsplash placeholders)
INSERT INTO portfolio_images (title, description, image_url, alt_text, category_id, featured) VALUES
  ('Highland Wedding',    'A romantic wedding ceremony in the Scottish Highlands',
   'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'Bride and groom at Highland wedding ceremony',
   (SELECT id FROM categories WHERE slug='weddings'), TRUE),
  ('Sunset Vows',         'Golden hour ceremony by the loch',
   'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800', 'Wedding couple exchanging vows at sunset by Scottish loch',
   (SELECT id FROM categories WHERE slug='weddings'), FALSE),
  ('First Dance',         'The magical first dance moment',
   'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800', 'Couple sharing first dance at wedding reception',
   (SELECT id FROM categories WHERE slug='weddings'), FALSE),
  ('Corporate Headshot',  'Professional studio portrait for business profiles',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', 'Professional corporate headshot portrait in studio',
   (SELECT id FROM categories WHERE slug='portraits'), TRUE),
  ('Family Portrait',     'Natural family portrait in autumn setting',
   'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800', 'Family of four posing for portrait in autumn park',
   (SELECT id FROM categories WHERE slug='portraits'), FALSE),
  ('Glen Coe',            'Dramatic light over Glen Coe valley',
   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 'Dramatic misty landscape of Glen Coe Scotland',
   (SELECT id FROM categories WHERE slug='landscapes'), TRUE),
  ('Isle of Skye',        'The iconic Old Man of Storr at dawn',
   'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800', 'Old Man of Storr rock formation Isle of Skye at dawn',
   (SELECT id FROM categories WHERE slug='landscapes'), FALSE),
  ('Edinburgh Castle',    'Edinburgh Castle lit up at night during the festival',
   'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', 'Edinburgh Castle illuminated at night during festival',
   (SELECT id FROM categories WHERE slug='landscapes'), FALSE),
  ('Charity Gala',        'Coverage of annual charity gala dinner',
   'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'Guests at charity gala dinner event',
   (SELECT id FROM categories WHERE slug='events'), TRUE),
  ('Product Launch',      'Tech product launch event photography',
   'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800', 'Speaker presenting at tech product launch event',
   (SELECT id FROM categories WHERE slug='events'), FALSE),
  ('Whisky Bottles',      'Product photography for artisan whisky distillery',
   'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800', 'Artisan whisky bottles product photography on dark background',
   (SELECT id FROM categories WHERE slug='commercial'), TRUE),
  ('Restaurant Interior', 'Interior photography for restaurant rebrand',
   'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'Modern restaurant interior with warm lighting',
   (SELECT id FROM categories WHERE slug='commercial'), FALSE);

-- Services
INSERT INTO services (title, description, icon, price_from, features, sort_order) VALUES
  ('Wedding Photography', 'Full-day wedding photography coverage with a pre-wedding consultation, capturing every moment from preparation to the last dance.',
   'Heart', 1200.00, '["Pre-wedding consultation","Full day coverage (up to 12 hours)","300+ edited photographs","Online gallery","USB with high-resolution files","Second photographer available"]'::JSONB, 1),
  ('Portrait Sessions', 'Professional portrait photography for individuals, couples, and families in studio or on location.',
   'User', 150.00, '["1-hour session","20+ edited photographs","Online gallery","Print-ready files","Studio or outdoor location","Outfit change included"]'::JSONB, 2),
  ('Event Coverage', 'Professional photography for corporate events, conferences, parties, and special occasions.',
   'Calendar', 400.00, '["Up to 4 hours coverage","100+ edited photographs","Online gallery","Quick turnaround (48 hours)","Corporate branding options"]'::JSONB, 3),
  ('Commercial Photography', 'High-quality product, food, and architectural photography for businesses and brands.',
   'Building', 300.00, '["Half-day shoot","Product/food/interior","Post-production editing","Commercial usage rights","Quick turnaround"]'::JSONB, 4),
  ('Landscape Prints', 'Fine art landscape prints from Malcolm''s Scottish landscape collection, printed on museum-quality paper.',
   'Mountain', 45.00, '["Museum-quality paper","Multiple sizes available","Signed by artist","Free UK shipping","Gift wrapping available"]'::JSONB, 5);

-- Testimonials
INSERT INTO testimonials (client_name, role, content, rating, featured, approved) VALUES
  ('Sarah & James Mitchell', 'Wedding Clients',
   'Malcolm captured our wedding day perfectly. Every emotion, every detail — the photos tell the story of our day better than we could have imagined. We still get compliments on our wedding album two years later!', 5, TRUE, TRUE),
  ('Dr. Emily Robertson', 'Corporate Client',
   'We hired Malcolm for our company headshots and the results were outstanding. He made everyone feel comfortable in front of the camera, and the final images were exactly what we needed for our new website.', 5, TRUE, TRUE),
  ('The Henderson Family', 'Family Portrait Clients',
   'Our family portrait session with Malcolm was such a joy. He was patient with the kids and captured genuine moments of us together. The photos are now proudly displayed in our living room.', 5, FALSE, TRUE),
  ('David MacLeod', 'Event Organiser',
   'Malcolm has covered our annual charity gala for three years running. His photos are always professional, delivered on time, and perfect for our promotional materials. Highly recommended!', 4, TRUE, TRUE),
  ('Highland Spirits Distillery', 'Commercial Client',
   'The product photography Malcolm did for our whisky range was exceptional. He understood our brand aesthetic immediately and the images have significantly elevated our marketing materials.', 5, FALSE, TRUE);

-- Site Settings
INSERT INTO site_settings (key, value) VALUES
  ('site_title', '"Malcolm Lismore Photography"'),
  ('tagline', '"Capturing Moments, Creating Memories"'),
  ('email', '"info@malcolmlismore.com"'),
  ('phone', '"+44 1234 567890"'),
  ('address', '"12 Castle Street, Edinburgh, EH1 2NE, Scotland"'),
  ('social_links', '{"instagram":"https://instagram.com/malcolmlismore","facebook":"https://facebook.com/malcolmlismore","twitter":"https://twitter.com/malcolmlismore"}'),
  ('about_text', '"Malcolm Lismore is an award-winning photographer based in Edinburgh, Scotland. With over 15 years of experience, Malcolm specialises in wedding, portrait, and landscape photography. His work has been featured in Scottish Wedding Magazine, The Scotsman, and National Geographic Traveller."'),
  ('seo_keywords', '["photographer Edinburgh","wedding photographer Scotland","portrait photography Edinburgh","landscape photography Scotland","Malcolm Lismore"]');

-- Audit Criteria (from the assignment feedback)
INSERT INTO audit_criteria (learning_outcome, criterion_code, criterion_title, status, priority, blocker, assessor_notes) VALUES
  ('LO1', 'P1', 'DNS purpose, types, and domain name organisation', 'passed', 5, FALSE, 'Sections 1.1.10–1.1.13 adequate'),
  ('LO1', 'P1', 'Communication protocols, server hardware, OS, web servers', 'passed', 5, FALSE, 'Sections 1.1.2–1.1.5 adequate'),
  ('LO1', 'P1', 'Impact of web development technologies and frameworks', 'passed', 5, FALSE, 'Section 1.1.15 adequate'),
  ('LO1', 'M2', 'SEO evidence-based support for photographer website', 'not_fixed', 2, FALSE, 'Generic SEO only — no photographer-specific strategy, no citations to data'),
  ('LO1', 'D1', 'Justify tools and techniques chosen for custom website', 'not_fixed', 2, FALSE, 'React/TS/Tailwind used but never justified vs alternatives'),
  ('LO2', 'P2', 'Front-end/back-end capabilities, presentation/application layers', 'passed', 5, FALSE, 'Sections 2.1–2.5 adequate'),
  ('LO2', 'P3', 'Differences between online creation tools and custom sites', 'passed', 5, FALSE, 'Sections 2.6–2.7 adequate'),
  ('LO2', 'M3', 'Analyse range of tools and techniques for custom websites', 'not_fixed', 2, FALSE, 'No comparative analysis of React vs WordPress vs Wix'),
  ('LO3', 'P5', 'Design document with wireframes and client/user requirements', 'not_fixed', 1, TRUE, 'No formal requirements, no sitemap, wireframes not annotated'),
  ('LO3', 'P5', 'Data Flow Diagram and technical diagrams', 'not_fixed', 1, TRUE, 'No DFD, no sitemap diagram, code screenshots without explanation'),
  ('LO3', 'P6', 'Justify implementation decisions against design document', 'not_fixed', 1, TRUE, 'No justification section anywhere'),
  ('LO3', 'M4', 'Evaluate design and development process', 'not_fixed', 1, TRUE, 'No evaluation of technical challenges or design decisions'),
  ('LO4', 'P7', 'Create test plan with key performance areas', 'not_fixed', 1, TRUE, 'No structured test plan table, images only'),
  ('LO4', 'M5', 'Analyse QA process during design and development', 'not_fixed', 1, TRUE, 'Only one generic paragraph about QA'),
  ('LO4', 'D3', 'Evaluate test plan results with recommendations', 'not_fixed', 1, TRUE, 'Too thin — no data, no bug log, no before/after evidence');
