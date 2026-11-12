import { Link } from 'react-router-dom';
import { Award, Camera, MapPin, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <>
      {/* Header */}
      <section className="bg-brand-900 text-white section-padding text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">About Malcolm</h1>
        <p className="text-brand-300 text-lg max-w-2xl mx-auto">
          Passionate about light, composition, and the stories behind every frame.
        </p>
      </section>

      {/* Bio Section */}
      <section className="section-padding bg-white">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80"
                alt="Malcolm Lismore with his camera in the Scottish Highlands"
                className="rounded-xl shadow-lg w-full aspect-[4/5] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-brand-700 text-white px-6 py-3 rounded-lg shadow-lg">
                <span className="font-display text-xl font-bold">15+</span>
                <span className="text-brand-200 text-sm ml-2">Years Experience</span>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="font-display text-3xl font-bold text-brand-900 mb-6">
                The Story Behind the Lens
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Malcolm Lismore discovered his passion for photography at the age of sixteen,
                  when his father handed him an old Nikon FM2 on a family holiday to the Isle of Skye.
                  That first roll of film — capturing the dramatic light of the Cuillin ridge at
                  sunrise — set the course for a career spanning over fifteen years.
                </p>
                <p>
                  After studying Photography at Edinburgh College of Art, Malcolm spent his early
                  career as a photojournalist before transitioning to professional portrait and
                  wedding photography. His editorial background gives his work a distinctive
                  documentary quality — authentic, unposed, and rich with emotion.
                </p>
                <p>
                  Based in Edinburgh's Old Town, Malcolm's studio is a short walk from the castle.
                  He regularly travels across Scotland and the UK for assignments, and his landscape
                  work has taken him from the Outer Hebrides to the Highlands of Perthshire.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                {[
                  { icon: Camera, label: 'Canon R5 & R6' },
                  { icon: MapPin, label: 'Edinburgh, Scotland' },
                  { icon: Award, label: 'SWPP Award Winner' },
                  { icon: Camera, label: 'Published in NatGeo' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-700" />
                    </div>
                    <span className="text-sm font-medium text-brand-800">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding bg-brand-50">
        <div className="container-narrow mx-auto text-center max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-brand-900 mb-6">
            Philosophy
          </h2>
          <blockquote className="text-xl text-gray-700 italic font-display leading-relaxed mb-8">
            "A great photograph doesn't just capture a moment — it captures a feeling.
            My goal is to create images that transport you back to the emotion of that
            exact second, every time you look at them."
          </blockquote>
          <p className="text-brand-600 font-semibold">— Malcolm Lismore</p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-700 text-white text-center">
        <div className="container-narrow mx-auto">
          <h2 className="font-display text-3xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-brand-200 mb-8 max-w-xl mx-auto">
            I'd love to hear about your project. Whether it's a wedding, a corporate event,
            or a family portrait — let's make something beautiful.
          </p>
          <Link to="/contact" className="btn-primary !bg-white !text-brand-900 hover:!bg-brand-100">
            Get in Touch <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </>
  );
}
