/**
 * Login / Signup Page
 * ───────────────────
 * Dual-mode authentication form using Supabase Auth.
 * Toggles between Sign In and Sign Up with shared form state.
 *
 * Design Patterns:
 *  - Controlled Form (React state manages inputs)
 *  - State Machine (mode toggles between 'login' | 'signup')
 *  - Post-Redirect (navigates to /dashboard on success)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, LogIn, UserPlus, Camera, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Client-side validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }

      const { error: err } = await signUp(email, password);
      if (err) {
        setError(err);
      } else {
        setSignupSuccess(true);
      }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err);
      } else {
        navigate('/dashboard');
      }
    }

    setLoading(false);
  };

  if (signupSuccess) {
    return (
      <>
        <section className="bg-brand-900 text-white section-padding text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Check Your Email</h1>
        </section>
        <section className="section-padding bg-white">
          <div className="max-w-md mx-auto text-center">
            <Mail className="w-16 h-16 text-brand-600 mx-auto mb-4" />
            <p className="text-gray-700 mb-6">
              We've sent a confirmation link to <strong>{email}</strong>.
              Please check your inbox and click the link to activate your account.
            </p>
            <button
              onClick={() => { setSignupSuccess(false); setMode('login'); }}
              className="btn-primary"
            >
              Back to Sign In
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-brand-900 text-white section-padding text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          {mode === 'login' ? 'Admin Sign In' : 'Create Account'}
        </h1>
        <p className="text-brand-300 text-lg max-w-2xl mx-auto">
          {mode === 'login'
            ? 'Sign in to access the assignment audit dashboard and admin tools.'
            : 'Create an account to manage the Malcolm Lismore Photography website.'}
        </p>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-3">
              <Camera className="w-8 h-8 text-brand-700" />
            </div>
            <h2 className="font-display text-2xl font-bold text-brand-900">
              Malcolm Lismore Photography
            </h2>
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-8">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                mode === 'login'
                  ? 'bg-white text-brand-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-colors ${
                mode === 'signup'
                  ? 'bg-white text-brand-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field pl-11"
                  placeholder="admin@malcolmlismore.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="input-field pl-11 pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="input-field pl-11"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Processing...'
              ) : mode === 'login' ? (
                <>Sign In <LogIn className="w-4 h-4 ml-2" /></>
              ) : (
                <>Create Account <UserPlus className="w-4 h-4 ml-2" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button onClick={() => { setMode('signup'); setError(null); }} className="text-brand-600 hover:text-brand-700 font-medium">
                  Sign up
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(null); }} className="text-brand-600 hover:text-brand-700 font-medium">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </section>
    </>
  );
}
