import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import type { PortfolioImage, Category } from '../types';
import { X } from 'lucide-react';

// ── Fallback data when API/Supabase isn't connected ──
const fallbackCategories: Category[] = [
  { id: '1', name: 'Weddings', slug: 'weddings' },
  { id: '2', name: 'Portraits', slug: 'portraits' },
  { id: '3', name: 'Landscapes', slug: 'landscapes' },
  { id: '4', name: 'Events', slug: 'events' },
  { id: '5', name: 'Commercial', slug: 'commercial' },
];

const fallbackImages: PortfolioImage[] = [
  {
    id: '1', title: 'Highland Wedding', description: 'A magical ceremony in the Scottish Highlands',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    alt_text: 'Wedding couple in Scottish Highlands', featured: true, sort_order: 1,
    categories: { id: 'c1', slug: 'weddings', name: 'Weddings' },
  },
  {
    id: '2', title: 'First Dance', description: 'An intimate moment under fairy lights',
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
    alt_text: 'Bride and groom first dance', featured: true, sort_order: 2,
    categories: { id: 'c1', slug: 'weddings', name: 'Weddings' },
  },
  {
    id: '3', title: 'Golden Hour Portrait', description: 'Natural light portrait session at sunset',
    image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
    alt_text: 'Portrait of woman in golden light', featured: true, sort_order: 3,
    categories: { id: 'c2', slug: 'portraits', name: 'Portraits' },
  },
  {
    id: '4', title: 'Studio Headshot', description: 'Professional corporate headshot',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    alt_text: 'Professional headshot portrait', featured: false, sort_order: 4,
    categories: { id: 'c2', slug: 'portraits', name: 'Portraits' },
  },
  {
    id: '5', title: 'Isle of Skye', description: 'Dramatic cliffs and moody skies over the Cuillin ridge',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    alt_text: 'Dramatic mountain landscape in Scotland', featured: true, sort_order: 5,
    categories: { id: 'c3', slug: 'landscapes', name: 'Landscapes' },
  },
  {
    id: '6', title: 'Glencoe Valley', description: 'Morning mist rolling through the valley',
    image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    alt_text: 'Misty valley landscape at dawn', featured: false, sort_order: 6,
    categories: { id: 'c3', slug: 'landscapes', name: 'Landscapes' },
  },
  {
    id: '7', title: 'Edinburgh Loch', description: 'Serene reflections on a still Highland loch',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    alt_text: 'Lake reflection with mountains', featured: false, sort_order: 7,
    categories: { id: 'c3', slug: 'landscapes', name: 'Landscapes' },
  },
  {
    id: '8', title: 'Corporate Gala', description: 'Annual charity gala at the Balmoral Hotel',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    alt_text: 'Corporate event with guests at gala dinner', featured: false, sort_order: 8,
    categories: { id: 'c4', slug: 'events', name: 'Events' },
  },
  {
    id: '9', title: 'Music Festival', description: 'Live performance at Edinburgh Fringe',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    alt_text: 'Concert crowd with stage lights', featured: true, sort_order: 9,
    categories: { id: 'c4', slug: 'events', name: 'Events' },
  },
  {
    id: '10', title: 'Product Showcase', description: 'Artisan whisky brand photography',
    image_url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80',
    alt_text: 'Product photography of whisky bottles', featured: false, sort_order: 10,
    categories: { id: 'c5', slug: 'commercial', name: 'Commercial' },
  },
  {
    id: '11', title: 'Restaurant Interior', description: 'Commercial shoot for a Michelin-starred restaurant',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    alt_text: 'Elegant restaurant interior photography', featured: false, sort_order: 11,
    categories: { id: 'c5', slug: 'commercial', name: 'Commercial' },
  },
  {
    id: '12', title: 'Family Portrait', description: 'Autumn family session in Princes Street Gardens',
    image_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
    alt_text: 'Happy family outdoor portrait', featured: true, sort_order: 12,
    categories: { id: 'c2', slug: 'portraits', name: 'Portraits' },
  },
];

export default function Portfolio() {
  const { data: apiImages, loading } = useApi<PortfolioImage[]>('/portfolio');
  const { data: apiCategories } = useApi<Category[]>('/categories');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightbox, setLightbox] = useState<PortfolioImage | null>(null);

  // Use API data if available, otherwise fall back to sample data
  const images = apiImages && apiImages.length > 0 ? apiImages : fallbackImages;
  const categories = apiCategories && apiCategories.length > 0 ? apiCategories : fallbackCategories;

  const filtered = activeCategory === 'all'
    ? images
    : images.filter(img => img.categories?.slug === activeCategory);

  return (
    <>
      {/* Header */}
      <section className="bg-brand-900 text-white section-padding text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Portfolio</h1>
        <p className="text-brand-300 text-lg max-w-2xl mx-auto">
          Explore Malcolm's work across weddings, portraits, landscapes, events, and commercial photography.
        </p>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-brand-100 sticky top-16 sm:top-20 z-40">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-brand-700 text-white'
                : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-brand-700 text-white'
                  : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-brand-50">
        <div className="container-narrow mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-brand-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(img => (
                <div
                  key={img.id}
                  className="portfolio-card aspect-[4/3]"
                  onClick={() => setLightbox(img)}
                >
                  <img src={img.image_url} alt={img.alt_text} loading="lazy" />
                  <div className="overlay">
                    <div>
                      <h3 className="text-white font-display font-semibold">{img.title}</h3>
                      <p className="text-brand-200 text-sm">{img.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              No images found in this category.
            </p>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-brand-300 transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-5xl max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.image_url}
              alt={lightbox.alt_text}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4">
              <h3 className="text-white font-display text-xl font-semibold">{lightbox.title}</h3>
              <p className="text-brand-300 text-sm mt-1">{lightbox.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
