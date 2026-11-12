import { Link } from 'react-router-dom';
import { ArrowRight, Star, Camera, Award, Clock } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import type { PortfolioImage, Testimonial } from '../types';

// ── Fallback data when Supabase isn't connected ──
const fallbackFeatured: PortfolioImage[] = [
  { id: '1', title: 'Highland Wedding', description: 'Ceremony at Eilean Donan Castle', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', alt_text: 'Wedding couple in the Highlands', featured: true, categories: { id: '1', name: 'Weddings', slug: 'weddings' } },
  { id: '2', title: 'Golden Hour Portrait', description: 'Natural light session at sunset', image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80', alt_text: 'Portrait in golden light', featured: true, categories: { id: '2', name: 'Portraits', slug: 'portraits' } },
  { id: '3', title: 'Isle of Skye', description: 'Dramatic cliffs and moody skies', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', alt_text: 'Scottish mountain landscape', featured: true, categories: { id: '3', name: 'Landscapes', slug: 'landscapes' } },
  { id: '4', title: 'Music Festival', description: 'Edinburgh Fringe live performance', image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', alt_text: 'Concert stage lighting', featured: true, categories: { id: '4', name: 'Events', slug: 'events' } },
  { id: '5', title: 'First Dance', description: 'Intimate moment under fairy lights', image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', alt_text: 'Bride and groom first dance', featured: true, categories: { id: '1', name: 'Weddings', slug: 'weddings' } },
  { id: '6', title: 'Product Showcase', description: 'Artisan whisky brand shoot', image_url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80', alt_text: 'Whisky product photography', featured: true, categories: { id: '5', name: 'Commercial', slug: 'commercial' } },
];

const fallbackTestimonials: Testimonial[] = [
  { id: '1', client_name: 'Fiona & Alistair MacLeod', role: 'Wedding, Loch Lomond', content: 'Malcolm captured our day perfectly. Every time we look through the album, we relive the emotions all over again. His ability to find those candid, in-between moments is truly extraordinary.', rating: 5, featured: true },
  { id: '2', client_name: 'David Henderson', role: 'CEO, Caledonia Spirits', content: 'The product photography Malcolm delivered elevated our entire brand. Sales of our premium line increased 30% after we updated our website and packaging with his images.', rating: 5, featured: true },
  { id: '3', client_name: 'Sarah Campbell', role: 'Event Manager, Edinburgh Festival', content: 'Working with Malcolm for three consecutive festival seasons has been fantastic. He has an incredible eye for the energy and chaos of live events, and always delivers on time.', rating: 5, featured: true },
];

export default function Home() {
  const { data: apiFeatured } = useApi<PortfolioImage[]>('/portfolio/featured');
  const { data: apiTestimonials } = useApi<Testimonial[]>('/testimonials');
  const featured = apiFeatured && apiFeatured.length > 0 ? apiFeatured : fallbackFeatured;
  const testimonials = apiTestimonials && apiTestimonials.length > 0 ? apiTestimonials : fallbackTestimonials;

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80"
            alt="Professional camera capturing a moment in dramatic lighting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/80 via-brand-950/50 to-transparent" />
        </div>
        <div className="relative container-narrow mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-brand-300 font-medium tracking-wider uppercase text-sm mb-4">
              Award-Winning Photographer — Edinburgh, Scotland
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Capturing Moments,{' '}
              <span className="text-brand-300 italic">Creating Memories</span>
            </h1>
            <p className="text-brand-200 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
              From Highland weddings to corporate events, Malcolm Lismore brings
              15 years of experience to every frame.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/portfolio" className="btn-primary">
                View Portfolio <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link to="/contact" className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-brand-900">
                Book a Session
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-brand-700 text-white">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Camera, num: '500+', label: 'Photo Shoots' },
              { icon: Award, num: '15+', label: 'Years Experience' },
              { icon: Star, num: '200+', label: 'Happy Clients' },
              { icon: Clock, num: '24hr', label: 'Turnaround' },
            ].map(({ icon: Icon, num, label }) => (
              <div key={label} className="flex flex-col items-center">
                <Icon className="w-6 h-6 mb-2 text-brand-300" />
                <span className="font-display text-2xl sm:text-3xl font-bold">{num}</span>
                <span className="text-brand-200 text-sm mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Work ── */}
      <section className="section-padding bg-white">
        <div className="container-narrow mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-900 mb-4">
              Featured Work
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A curated selection from across weddings, portraits, landscapes, and events.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(featured || []).slice(0, 6).map((img) => (
              <div key={img.id} className="portfolio-card aspect-[4/3]">
                <img src={img.image_url} alt={img.alt_text} loading="lazy" />
                <div className="overlay">
                  <div>
                    <h3 className="text-white font-display font-semibold text-lg">{img.title}</h3>
                    <p className="text-brand-200 text-sm">{img.categories?.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/portfolio" className="btn-secondary">
              View All Work <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section-padding bg-brand-50">
        <div className="container-narrow mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-brand-900 mb-4">
              What Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(testimonials || []).slice(0, 3).map((t) => (
              <div key={t.id} className="bg-white rounded-xl p-6 shadow-sm border border-brand-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-4 italic">
                  "{t.content}"
                </p>
                <div>
                  <p className="font-semibold text-brand-900">{t.client_name}</p>
                  <p className="text-sm text-brand-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
            alt="Dramatic Scottish landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-950/70" />
        </div>
        <div className="relative text-center container-narrow mx-auto px-4">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Create Something Beautiful?
          </h2>
          <p className="text-brand-200 text-lg mb-8 max-w-xl mx-auto">
            Let's discuss your vision. Every great photograph starts with a conversation.
          </p>
          <Link to="/contact" className="btn-primary !bg-white !text-brand-900 hover:!bg-brand-100">
            Get in Touch <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </>
  );
}
