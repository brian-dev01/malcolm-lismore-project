import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { apiMutate } from '../hooks/useApi';
import type { ContactFormData } from '../types';

export default function Contact() {
  const [form, setForm] = useState<ContactFormData>({
    full_name: '',
    email: '',
    phone: '',
    service_type: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await apiMutate('/contact', 'POST', form as unknown as Record<string, unknown>);
      if (!res.success) throw new Error(res.error || 'Submission failed');
      setSuccess(true);
      setForm({ full_name: '', email: '', phone: '', service_type: '', message: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      {/* Header */}
      <section className="bg-brand-900 text-white section-padding text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-brand-300 text-lg max-w-2xl mx-auto">
          Ready to book a session or have a question? Fill out the form below and Malcolm
          will get back to you within 24 hours.
        </p>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-brand-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                {[
                  { icon: Mail, label: 'Email', value: 'info@malcolmlismore.com' },
                  { icon: Phone, label: 'Phone', value: '+44 1234 567890' },
                  { icon: MapPin, label: 'Studio', value: '12 Castle Street, Edinburgh, EH1 2NE' },
                  { icon: Clock, label: 'Hours', value: 'Mon–Fri: 9am–6pm | Sat: 10am–4pm' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-brand-700" />
                    </div>
                    <div>
                      <p className="font-medium text-brand-900">{label}</p>
                      <p className="text-gray-600 text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-8 rounded-xl overflow-hidden border border-brand-100">
                <img
                  src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80"
                  alt="Edinburgh skyline showing Malcolm Lismore Photography studio location"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              {success ? (
                <div className="bg-accent-50 border border-accent-200 rounded-xl p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-accent-500 mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-accent-800 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-accent-700">
                    Thank you for reaching out. Malcolm will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn-primary mt-6"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        required
                        value={form.full_name}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+44 ..."
                      />
                    </div>
                    <div>
                      <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-2">
                        Service Interested In
                      </label>
                      <select
                        id="service_type"
                        name="service_type"
                        value={form.service_type}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select a service...</option>
                        <option value="wedding">Wedding Photography</option>
                        <option value="portrait">Portrait Sessions</option>
                        <option value="event">Event Coverage</option>
                        <option value="commercial">Commercial Photography</option>
                        <option value="landscape">Landscape Prints</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      className="input-field resize-none"
                      placeholder="Tell Malcolm about your project, event, or vision..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      'Sending...'
                    ) : (
                      <>Send Message <Send className="w-4 h-4 ml-2" /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
