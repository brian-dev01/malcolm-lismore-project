// ── Domain Types ──

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order?: number;
}

export interface PortfolioImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  alt_text: string;
  category_id?: string;
  featured: boolean;
  width?: number;
  height?: number;
  sort_order?: number;
  created_at?: string;
  categories?: Category;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price_from: number;
  features: string[];
  sort_order: number;
  active: boolean;
}

export interface Testimonial {
  id: string;
  client_name: string;
  role: string;
  content: string;
  rating: number;
  avatar_url?: string;
  featured: boolean;
}

export interface ContactFormData {
  full_name: string;
  email: string;
  phone?: string;
  service_type?: string;
  message: string;
}

export interface BookingFormData {
  client_name: string;
  client_email: string;
  service_id?: string;
  event_date: string;
  event_time?: string;
  location?: string;
  notes?: string;
}

export interface AuditCriterion {
  id: string;
  learning_outcome: string;
  criterion_code: string;
  criterion_title: string;
  description?: string;
  status: 'not_fixed' | 'in_progress' | 'fixed' | 'passed';
  priority: number;
  assessor_notes?: string;
  fix_notes?: string;
  blocker: boolean;
  updated_at: string;
}

export interface AuditSummary {
  total: number;
  passed: number;
  fixed: number;
  inProgress: number;
  notFixed: number;
  blockers: number;
  completionRate: number;
  byLO: Record<string, {
    total: number;
    passed: number;
    fixed: number;
    notFixed: number;
    inProgress: number;
  }>;
  verdict: string;
}

export interface AuditFixLog {
  id: string;
  criterion_id: string;
  action: string;
  before_state: string;
  after_state: string;
  created_at: string;
  audit_criteria?: {
    criterion_code: string;
    criterion_title: string;
    learning_outcome: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
