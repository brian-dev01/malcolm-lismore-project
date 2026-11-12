import { Link } from 'react-router-dom';
import { Camera, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-200">
      <div className="container-narrow mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-6 h-6 text-brand-400" />
              <span className="font-display text-lg font-bold text-white">
                Malcolm Lismore
              </span>
            </div>
            <p className="text-sm text-brand-300 leading-relaxed">
              Award-winning photographer based in Edinburgh, Scotland.
              Specialising in wedding, portrait, and landscape photography.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-brand-400 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-brand-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-brand-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/portfolio', label: 'Portfolio' },
                { to: '/services', label: 'Services' },
                { to: '/about', label: 'About Malcolm' },
                { to: '/contact', label: 'Get in Touch' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-brand-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-3 text-sm">
              {['Wedding Photography', 'Portrait Sessions', 'Event Coverage', 'Commercial Photography', 'Landscape Prints'].map(s => (
                <li key={s}>
                  <Link to="/services" className="text-brand-300 hover:text-white transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-brand-400" />
                <span className="text-brand-300">info@malcolmlismore.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-brand-400" />
                <span className="text-brand-300">+44 1234 567890</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-400" />
                <span className="text-brand-300">12 Castle Street, Edinburgh, EH1 2NE</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-brand-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-brand-500">
          <p>&copy; {new Date().getFullYear()} Malcolm Lismore Photography. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Built by B P K Kulasuriya (E193540) | Unit 10: Web Design & Development
          </p>
        </div>
      </div>
    </footer>
  );
}
