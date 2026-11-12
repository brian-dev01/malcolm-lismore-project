import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Camera, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Build nav links — show Dashboard only when logged in
  const navLinks = user
    ? [...publicLinks, { to: '/dashboard', label: 'Dashboard' }]
    : publicLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-100">
      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Camera className="w-7 h-7 text-brand-700 group-hover:text-brand-500 transition-colors" />
            <div>
              <span className="font-display text-xl font-bold text-brand-900">
                Malcolm Lismore
              </span>
              <span className="hidden sm:block text-xs text-brand-500 -mt-1">
                Photography
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'text-brand-700 bg-brand-100'
                    : 'text-gray-600 hover:text-brand-700 hover:bg-brand-50'
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Auth button */}
            {user ? (
              <div className="flex items-center gap-3 ml-3 pl-3 border-l border-brand-100">
                <span className="text-xs text-gray-500 hidden lg:inline">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 ml-3 px-4 py-2 rounded-md text-sm font-medium bg-brand-700 text-white hover:bg-brand-800 transition-colors"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-brand-700"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-brand-100 py-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  location.pathname === to
                    ? 'text-brand-700 bg-brand-100'
                    : 'text-gray-600 hover:text-brand-700 hover:bg-brand-50'
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Mobile auth */}
            <div className="pt-3 mt-3 border-t border-brand-100">
              {user ? (
                <>
                  <p className="px-4 py-1 text-xs text-gray-400">{user.email}</p>
                  <button
                    onClick={() => { handleSignOut(); setIsOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-md text-base font-medium text-brand-700 bg-brand-100"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
