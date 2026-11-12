import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import type { Service } from '../types';
import { Heart, User, Calendar, Building, Mountain, Check, ArrowRight, Camera } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  Heart, User, Calendar, Building, Mountain,
};

// ── Fallback services when Supabase isn't connected ──
const fallbackServices: Service[] = [
  {
    id: '1', title: 'Wedding Photography', icon: 'Heart',
    description: 'Your wedding day captured in timeless photographs. From the nervous preparations to the last dance, Malcolm documents every precious moment with a blend of candid storytelling and elegant posed shots.',
    price_from: 1200, sort_order: 1, active: true,
    features: ['Full-day coverage (up to 12 hours)', 'Second photographer included', '500+ edited digital images', 'Online gallery with download access'],
  },
  {
    id: '2', title: 'Portrait Sessions', icon: 'User',
    description: 'Whether it\'s a professional headshot, family portrait, or creative concept shoot, Malcolm creates portraits that reveal character and tell your story in a single frame.',
    price_from: 150, sort_order: 2, active: true,
    features: ['1-hour studio or outdoor session', '20 retouched images', 'Wardrobe guidance included', 'Print-ready high-res files'],
  },
  {
    id: '3', title: 'Event Coverage', icon: 'Calendar',
    description: 'Corporate events, galas, product launches, and festivals captured with energy and precision. Professional coverage that highlights the atmosphere and key moments of your event.',
    price_from: 500, sort_order: 3, active: true,
    features: ['Up to 6 hours coverage', '200+ edited images', 'Same-week turnaround available', 'Social media-ready crops'],
  },
  {
    id: '4', title: 'Commercial & Brand', icon: 'Building',
    description: 'Elevate your brand with professional product photography, interior shots, and marketing imagery that stands out. From whisky labels to restaurant interiors.',
    price_from: 400, sort_order: 4, active: true,
    features: ['Half-day or full-day bookings', 'Art direction & styling', 'Licensing for commercial use', 'Colour-matched to brand guidelines'],
  },
  {
    id: '5', title: 'Landscape & Fine Art', icon: 'Mountain',
    description: 'Scotland\'s dramatic landscapes captured as gallery-quality prints. Available for purchase as limited-edition fine art prints, perfect for homes and offices.',
    price_from: 75, sort_order: 5, active: true,
    features: ['Signed limited-edition prints', 'Multiple sizes & framing options', 'Canvas, acrylic, or giclée paper', 'Commissions for specific locations'],
  },
];

export default function Services() {
  const { data: apiServices, loading } = useApi<Service[]>('/services');
  const services = apiServices && apiServices.length > 0 ? apiServices : fallbackServices;

  return (
    <>
      {/* Header */}
      <section className="bg-brand-900 text-white section-padding text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Services</h1>
        <p className="text-brand-300 text-lg max-w-2xl mx-auto">
          Professional photography services tailored to your needs.
          From intimate portraits to grand celebrations.
        </p>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-narrow mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-96 bg-brand-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(services || []).map(service => {
                const Icon = iconMap[service.icon] || Camera;
                return (
                  <div
                    key={service.id}
                    className="bg-brand-50 rounded-xl p-8 border border-brand-100
                               hover:shadow-lg hover:border-brand-200 transition-all duration-300
                               flex flex-col"
                  >
                    <div className="w-12 h-12 rounded-lg bg-brand-700 text-white flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-brand-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {(service.features || []).slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price & CTA */}
                    <div className="border-t border-brand-200 pt-4 mt-auto flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-500">From</span>
                        <span className="text-2xl font-bold text-brand-800 ml-1">
                          £{service.price_from?.toFixed(0)}
                        </span>
                      </div>
                      <Link
                        to="/contact"
                        className="text-brand-700 font-medium text-sm hover:text-brand-500 transition-colors flex items-center gap-1"
                      >
                        Enquire <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-brand-700 text-white py-16">
        <div className="container-narrow mx-auto px-4 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">
            Not Sure Which Package Is Right?
          </h2>
          <p className="text-brand-200 mb-8 max-w-xl mx-auto">
            Every project is unique. Get in touch for a custom quote tailored to your specific requirements.
          </p>
          <Link to="/contact" className="btn-primary !bg-white !text-brand-900 hover:!bg-brand-100">
            Request a Custom Quote
          </Link>
        </div>
      </section>
    </>
  );
}
