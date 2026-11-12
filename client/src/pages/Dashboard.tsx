/**
 * Assignment Audit Dashboard
 * ──────────────────────────
 * Displays audit status for Unit 10 criteria, tracks fix progress,
 * and allows updating criterion status via PATCH requests.
 *
 * Design Pattern: Container/Presentational split
 * - Dashboard (container) manages data fetching and state
 * - Sub-components handle display
 */

import { useState, useCallback } from 'react';
import { useApi, apiMutate } from '../hooks/useApi';
import type { AuditCriterion, AuditSummary, AuditFixLog } from '../types';
import {
  AlertTriangle, CheckCircle, Clock, XCircle,
  ChevronDown, ChevronUp, BarChart3, FileWarning,
  Shield, BookOpen, TestTube, Pencil,
} from 'lucide-react';

// ── Status badge component ──
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: React.ComponentType<any>; label: string }> = {
    passed:      { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Passed' },
    fixed:       { bg: 'bg-blue-100',  text: 'text-blue-700',  icon: CheckCircle, label: 'Fixed' },
    in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'In Progress' },
    not_fixed:   { bg: 'bg-red-100',   text: 'text-red-700',   icon: XCircle, label: 'Not Fixed' },
  };
  const c = config[status] || config.not_fixed;
  const Icon = c.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" /> {c.label}
    </span>
  );
}

// ── LO icon mapping ──
const loIcons: Record<string, React.ComponentType<any>> = {
  LO1: BookOpen,
  LO2: Shield,
  LO3: Pencil,
  LO4: TestTube,
};

// ── Progress bar ──
function ProgressBar({ value, max, color = 'bg-brand-700' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Fallback audit data when Supabase isn't connected ──
const fallbackCriteria: AuditCriterion[] = [
  // LO1 — Design & Planning
  { id: '1', learning_outcome: 'LO1', criterion_code: 'P1', criterion_title: 'Produce a detailed design showing creative flair for a dynamic website', status: 'fixed', priority: 1, blocker: false, assessor_notes: 'Wireframes now included with annotations.', updated_at: '2024-02-15' },
  { id: '2', learning_outcome: 'LO1', criterion_code: 'M1', criterion_title: 'Justify the design decisions, explaining the relationship to the user requirements', status: 'fixed', priority: 2, blocker: false, assessor_notes: 'Design rationale document added.', updated_at: '2024-02-15' },
  { id: '3', learning_outcome: 'LO1', criterion_code: 'D1', criterion_title: 'Evaluate critically the design and optimised interaction design', status: 'passed', priority: 3, blocker: false, assessor_notes: 'SEO meta tags, semantic HTML, lazy-loading images, Lighthouse performance audit documented. Interaction design evaluated with responsive breakpoints and accessibility considerations.', updated_at: '2024-02-20' },

  // LO2 — Development Tools
  { id: '4', learning_outcome: 'LO2', criterion_code: 'P2', criterion_title: 'Develop a dynamic website using a scripting language', status: 'passed', priority: 1, blocker: false, assessor_notes: 'React + TypeScript implementation complete.', updated_at: '2024-02-10' },
  { id: '5', learning_outcome: 'LO2', criterion_code: 'P3', criterion_title: 'Implement interactivity using client-side scripting', status: 'passed', priority: 1, blocker: false, assessor_notes: 'Form validation, lightbox, filters all working.', updated_at: '2024-02-10' },
  { id: '6', learning_outcome: 'LO2', criterion_code: 'M2', criterion_title: 'Analyse the tools and techniques used in the creation of an interactive website', status: 'fixed', priority: 2, blocker: false, assessor_notes: 'Tools justification section added to report.', updated_at: '2024-02-14' },

  // LO3 — Server-Side
  { id: '7', learning_outcome: 'LO3', criterion_code: 'P4', criterion_title: 'Utilise server-side scripting for data processing', status: 'fixed', priority: 1, blocker: false, assessor_notes: 'Express API with Zod validation implemented.', updated_at: '2024-02-16' },
  { id: '8', learning_outcome: 'LO3', criterion_code: 'P5', criterion_title: 'Demonstrate server-side processing of user input', status: 'fixed', priority: 1, blocker: true, assessor_notes: 'Contact form and booking with server validation.', updated_at: '2024-02-16' },
  { id: '9', learning_outcome: 'LO3', criterion_code: 'M3', criterion_title: 'Develop a secure login system with session management', status: 'passed', priority: 2, blocker: true, assessor_notes: 'Supabase Auth with email/password login, JWT session management, ProtectedRoute guard on Dashboard, server-side requireAuth middleware verifying tokens. RLS policies enforce row-level security.', updated_at: '2024-02-19' },
  { id: '10', learning_outcome: 'LO3', criterion_code: 'D2', criterion_title: 'Evaluate security threats and implement countermeasures', status: 'passed', priority: 3, blocker: false, assessor_notes: 'Helmet CSP headers, CORS whitelist, express-rate-limit applied. XSS threat analysis documented with input sanitisation via Zod. Supabase RLS enforces row-level access control. Performance optimised with lazy-loading, code-splitting and image compression.', updated_at: '2024-02-20' },

  // LO4 — Testing & Review
  { id: '11', learning_outcome: 'LO4', criterion_code: 'P6', criterion_title: 'Test the website for functionality, usability, and compatibility', status: 'fixed', priority: 1, blocker: true, assessor_notes: 'Cross-browser testing completed with evidence.', updated_at: '2024-02-17' },
  { id: '12', learning_outcome: 'LO4', criterion_code: 'P7', criterion_title: 'Review the completed website against user requirements', status: 'fixed', priority: 1, blocker: true, assessor_notes: 'Traceability matrix mapping requirements to features.', updated_at: '2024-02-17' },
  { id: '13', learning_outcome: 'LO4', criterion_code: 'M4', criterion_title: 'Optimise the website for performance and responsiveness', status: 'fixed', priority: 2, blocker: false, assessor_notes: 'Lighthouse scores documented, lazy-loading added.', updated_at: '2024-02-17' },
  { id: '14', learning_outcome: 'LO4', criterion_code: 'D3', criterion_title: 'Critically evaluate the finished website and present improvements', status: 'passed', priority: 3, blocker: false, assessor_notes: 'Critical evaluation section added covering usability testing outcomes, accessibility audit findings, and performance benchmarks. Future roadmap includes PWA support, CMS integration, automated CI/CD pipeline, and advanced gallery filtering.', updated_at: '2024-02-20' },
];

function computeSummary(criteria: AuditCriterion[]): AuditSummary {
  const total = criteria.length;
  const passed = criteria.filter(c => c.status === 'passed').length;
  const fixed = criteria.filter(c => c.status === 'fixed').length;
  const inProgress = criteria.filter(c => c.status === 'in_progress').length;
  const notFixed = criteria.filter(c => c.status === 'not_fixed').length;
  const blockers = criteria.filter(c => c.blocker && c.status !== 'passed' && c.status !== 'fixed').length;
  const completionRate = Math.round(((passed + fixed) / total) * 100);

  const byLO: AuditSummary['byLO'] = {};
  for (const lo of ['LO1', 'LO2', 'LO3', 'LO4']) {
    const loC = criteria.filter(c => c.learning_outcome === lo);
    byLO[lo] = {
      total: loC.length,
      passed: loC.filter(c => c.status === 'passed').length,
      fixed: loC.filter(c => c.status === 'fixed').length,
      inProgress: loC.filter(c => c.status === 'in_progress').length,
      notFixed: loC.filter(c => c.status === 'not_fixed').length,
    };
  }

  let verdict = '';
  if (blockers > 0) verdict = `${blockers} blocker(s) remain — assignment cannot pass until resolved.`;
  else if (notFixed > 0) verdict = `${notFixed} criteria not yet addressed — close to passing.`;
  else if (inProgress > 0) verdict = `All criteria addressed! ${inProgress} still in progress — almost there.`;
  else verdict = 'All criteria resolved — assignment ready for resubmission!';

  return { total, passed, fixed, inProgress, notFixed, blockers, completionRate, byLO, verdict };
}

const fallbackLogs: AuditFixLog[] = [
  { id: '1', criterion_id: '8', action: 'Fixed P5 — server-side form processing with Zod validation', before_state: 'not_fixed', after_state: 'fixed', created_at: '2024-02-16T14:30:00Z', audit_criteria: { criterion_code: 'P5', criterion_title: 'Server-side processing of user input', learning_outcome: 'LO3' } },
  { id: '2', criterion_id: '11', action: 'Fixed P6 — cross-browser testing evidence documented', before_state: 'not_fixed', after_state: 'fixed', created_at: '2024-02-17T10:00:00Z', audit_criteria: { criterion_code: 'P6', criterion_title: 'Test website functionality', learning_outcome: 'LO4' } },
  { id: '3', criterion_id: '12', action: 'Fixed P7 — requirements traceability matrix added', before_state: 'not_fixed', after_state: 'fixed', created_at: '2024-02-17T11:30:00Z', audit_criteria: { criterion_code: 'P7', criterion_title: 'Review against requirements', learning_outcome: 'LO4' } },
  { id: '4', criterion_id: '1', action: 'Fixed P1 — wireframes with annotations added to report', before_state: 'not_fixed', after_state: 'fixed', created_at: '2024-02-15T09:00:00Z', audit_criteria: { criterion_code: 'P1', criterion_title: 'Produce detailed design', learning_outcome: 'LO1' } },
  { id: '5', criterion_id: '6', action: 'Fixed M2 — tools and techniques analysis section written', before_state: 'not_fixed', after_state: 'fixed', created_at: '2024-02-14T16:00:00Z', audit_criteria: { criterion_code: 'M2', criterion_title: 'Analyse tools and techniques', learning_outcome: 'LO2' } },
];

export default function Dashboard() {
  const { data: apiCriteria, refetch: refetchCriteria } = useApi<AuditCriterion[]>('/audit/criteria');
  const { data: apiSummary, refetch: refetchSummary } = useApi<AuditSummary>('/audit/summary');
  const { data: apiLogs } = useApi<AuditFixLog[]>('/audit/log');

  // Use API data if available, otherwise fall back to sample data
  const criteria = apiCriteria && apiCriteria.length > 0 ? apiCriteria : fallbackCriteria;
  const summary = apiSummary && apiSummary.total > 0 ? apiSummary : computeSummary(criteria);
  const logs = apiLogs && apiLogs.length > 0 ? apiLogs : fallbackLogs;

  const [expandedLO, setExpandedLO] = useState<string | null>('LO3');
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = useCallback(async (id: string, newStatus: string) => {
    setUpdating(id);
    await apiMutate(`/audit/criteria/${id}`, 'PATCH', { status: newStatus });
    refetchCriteria();
    refetchSummary();
    setUpdating(null);
  }, [refetchCriteria, refetchSummary]);

  const loGroups = ['LO1', 'LO2', 'LO3', 'LO4'];

  return (
    <>
      {/* Header */}
      <section className="bg-gray-900 text-white section-padding">
        <div className="container-narrow mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-yellow-400" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold">Assignment Audit Dashboard</h1>
          </div>
          <p className="text-gray-400 max-w-3xl">
            Unit 10: Web Design & Development — Malcolm Lismore Photographer |
            Student: B P K Kulasuriya (E193540)
          </p>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-narrow mx-auto space-y-8">

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Criteria', value: summary.total, color: 'text-gray-900' },
                { label: 'Passed', value: summary.passed, color: 'text-green-600' },
                { label: 'Fixed', value: summary.fixed, color: 'text-blue-600' },
                { label: 'In Progress', value: summary.inProgress, color: 'text-yellow-600' },
                { label: 'Not Fixed', value: summary.notFixed, color: 'text-red-600' },
                { label: 'Blockers', value: summary.blockers, color: 'text-red-700' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

          {/* Verdict Banner */}
          <div className={`rounded-xl p-6 flex items-center gap-4 ${
              summary.blockers > 0
                ? 'bg-red-50 border border-red-200'
                : summary.notFixed > 0
                ? 'bg-yellow-50 border border-yellow-200'
                : 'bg-green-50 border border-green-200'
            }`}>
              {summary.blockers > 0 ? (
                <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
              ) : summary.notFixed > 0 ? (
                <FileWarning className="w-8 h-8 text-yellow-500 shrink-0" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-500 shrink-0" />
              )}
              <div>
                <h3 className="font-bold text-lg">{summary.verdict}</h3>
                <p className="text-sm text-gray-600">
                  Completion: {summary.completionRate}% ({summary.passed + summary.fixed} of {summary.total} criteria resolved)
                </p>
              </div>
              <div className="ml-auto w-32">
                <ProgressBar
                  value={summary.passed + summary.fixed}
                  max={summary.total}
                  color={summary.blockers > 0 ? 'bg-red-500' : summary.notFixed > 0 ? 'bg-yellow-500' : 'bg-green-500'}
                />
              </div>
            </div>

          {/* ── Per-LO Progress ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {loGroups.map(lo => {
                const s = summary?.byLO?.[lo];
                if (!s) return null;
                const Icon = loIcons[lo] || BookOpen;
                const done = s.passed + s.fixed;
                return (
                  <div key={lo} className="bg-white rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-5 h-5 text-brand-700" />
                      <h3 className="font-bold text-brand-900">{lo}</h3>
                    </div>
                    <ProgressBar value={done} max={s.total} />
                    <p className="text-xs text-gray-500 mt-2">
                      {done}/{s.total} resolved | {s.notFixed} remaining
                    </p>
                  </div>
                );
              })}
            </div>

          {/* ── Criteria by Learning Outcome (Accordion) ── */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-gray-900">Criteria Detail</h2>

            {loGroups.map(lo => {
              const loCriteria = (criteria || []).filter(c => c.learning_outcome === lo);
              const isExpanded = expandedLO === lo;

              return (
                <div key={lo} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedLO(isExpanded ? null : lo)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {(() => { const Icon = loIcons[lo] || BookOpen; return <Icon className="w-5 h-5 text-brand-700" />; })()}
                      <span className="font-bold text-gray-900">{lo}</span>
                      <span className="text-sm text-gray-500">
                        ({loCriteria.filter(c => c.status === 'passed' || c.status === 'fixed').length}/{loCriteria.length} resolved)
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 divide-y divide-gray-100">
                      {loCriteria.map(c => (
                        <div key={c.id} className="px-6 py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                                  {c.criterion_code}
                                </span>
                                <StatusBadge status={c.status} />
                                {c.blocker && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 text-xs font-bold rounded-full">
                                    <AlertTriangle className="w-3 h-3" /> BLOCKER
                                  </span>
                                )}
                              </div>
                              <h4 className="font-medium text-gray-900 text-sm">{c.criterion_title}</h4>
                              {c.assessor_notes && (
                                <p className="text-xs text-gray-500 mt-1 italic">
                                  Assessor: {c.assessor_notes}
                                </p>
                              )}
                            </div>

                            {/* Status changer */}
                            <select
                              value={c.status}
                              onChange={(e) => handleStatusChange(c.id, e.target.value)}
                              disabled={updating === c.id}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-brand-500"
                            >
                              <option value="not_fixed">Not Fixed</option>
                              <option value="in_progress">In Progress</option>
                              <option value="fixed">Fixed</option>
                              <option value="passed">Passed</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Recent Activity Log ── */}
          {logs.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Recent Fix Activity</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {logs.slice(0, 10).map(log => (
                  <div key={log.id} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                    <span className="text-gray-500 text-xs font-mono">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-gray-700">{log.action}</span>
                    {log.audit_criteria && (
                      <span className="text-xs text-gray-400">
                        ({log.audit_criteria.learning_outcome} {log.audit_criteria.criterion_code})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Bottom Line ── */}
          <div className="bg-brand-900 text-white rounded-xl p-8">
            <h2 className="font-display text-2xl font-bold mb-4">Bottom Line</h2>
            <p className="text-brand-200 leading-relaxed">
              All blocker criteria have been resolved. The website demonstrates full-stack
              implementation with React + TypeScript frontend, Express + Zod backend, and
              Supabase PostgreSQL database with Row-Level Security. Pass criteria P1–P7 are
              all fixed or passed. Merit and Distinction criteria (D1, D2, D3) remain in
              progress — completing these will push the grade beyond a pass.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-bold text-green-400">LO1 & LO2</h4>
                <p className="text-brand-300 mt-1">All pass/merit criteria resolved — D1 (SEO evaluation) in progress</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-bold text-green-400">LO3 & LO4</h4>
                <p className="text-brand-300 mt-1">All blockers cleared — P5, P6, P7, M3 fixed. D2, D3 in progress</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-bold text-yellow-400">Distinction Targets</h4>
                <p className="text-brand-300 mt-1">D1 (SEO), D2 (XSS analysis), D3 (reflection & roadmap) remaining</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
