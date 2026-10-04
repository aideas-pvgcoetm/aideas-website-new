'use client';

import { useState, useRef, useEffect } from 'react';
import { FaLinkedin, FaInstagram, FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import ParticlePanel from '@/components/ParticleOrbs';

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateMedia = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    updateMedia();
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    const form = e.currentTarget;
    const name = (form.elements.namedItem("Name") as HTMLInputElement)?.value || '';
    const email = (form.elements.namedItem("Email") as HTMLInputElement)?.value || '';
    const message = (form.elements.namedItem("Message") as HTMLTextAreaElement)?.value || '';

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

    const templateParams = {
      from_name: name,
      name: name,
      user_name: name,
      from_email: email,
      email: email,
      user_email: email,
      reply_to: email,
      message: message,
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. We will get back to you soon.',
      });
      form.reset();
    } catch (error) {
      const err = error as { text?: string; message?: string };
      console.error('EmailJS Error:', err?.text || err?.message || error);
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please check your connection or contact us directly at aideas@pvgcoet.ac.in.',
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 7000);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#000000] text-[#E1E0CC] flex flex-col justify-start overflow-x-hidden pt-16 sm:pt-20 pb-10 selection:bg-[#38d1ff]/20 selection:text-white">
      {/* ─── Layer 1: Home-Page Base Background & Navy/Charcoal Vignette ─── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none"
        style={{
          backgroundColor: '#000000',
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(18, 24, 35, 0.5) 0%, rgba(6, 8, 12, 0.98) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ─── Layer 2: Home-Page Ambient Illumination (Subtle Cyan upper-left, Subtle Violet lower-right) ─── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 select-none opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(680px 440px at 15% 20%, rgba(56, 209, 255, 0.07), transparent 65%),
            radial-gradient(680px 440px at 85% 80%, rgba(176, 107, 255, 0.06), transparent 65%)
          `,
        }}
        aria-hidden="true"
      />

      {/* ─── Main Content Container (Wider: 1320–1400px, occupying ~85% of desktop) ─── */}
      <div className="relative z-10 w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 my-auto">
        
        {/* ─── TOP SECTION: Main Heading + Supporting Text (Eyebrow removed for optimal vertical space) ─── */}
        <div className="text-center mb-6 sm:mb-7">
          {/* Heading: Controlled size 56–60px desktop, clamp(42px, 4vw, 60px) */}
          <h1 className="text-[clamp(42px,4vw,60px)] font-extrabold tracking-tight leading-[1.08] mb-2 text-white">
            <span className="text-white">CONTACT </span>
            <span className="bg-gradient-to-r from-[#38d1ff] via-[#4F8CFF] to-[#9b5cff] bg-clip-text text-transparent">
              US
            </span>
          </h1>

          {/* Supporting Text: High Contrast & Readability (#A7B0BE) */}
          <p className="text-sm sm:text-base text-[#A7B0BE] max-w-xl mx-auto leading-relaxed">
            Have a project, event, idea, or collaboration in mind?{' '}
            <span className="text-white/90 font-medium">Let&apos;s connect.</span>
          </p>
        </div>

        {/* ─── TWO-COLUMN MAIN CONTENT: Form on Left (~515-525px), Particle Panel on Right (~515-525px) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch mb-5">
          
          {/* LEFT COLUMN: Contact Form on Grey/Charcoal Surface (#0e1219 / #101010) */}
          <div className="w-full flex justify-center lg:justify-end">
            <div
              className="w-full max-w-[610px] min-h-[460px] lg:min-h-[515px] xl:min-h-[525px] border border-white/[0.08] rounded-2xl p-6 sm:p-8 pt-6 sm:pt-7 pb-6 sm:pb-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between relative"
              style={{
                background:
                  'radial-gradient(circle at 10% 20%, rgba(56, 209, 255, 0.03) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(176, 107, 255, 0.03) 0%, transparent 45%), #0e1219',
              }}
            >
              
              <div>
                {/* Status Notification Alerts */}
                {status.type === 'success' && (
                  <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-sm font-medium flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <FaCheckCircle className="text-emerald-400 text-lg flex-shrink-0" />
                    <span className="leading-snug">{status.message}</span>
                  </div>
                )}

                {status.type === 'error' && (
                  <div className="mb-4 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-sm font-medium flex items-center gap-3 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                    <FaExclamationCircle className="text-rose-400 text-lg flex-shrink-0" />
                    <span className="leading-snug">{status.message}</span>
                  </div>
                )}

                {/* Functional Contact Form */}
                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-1.5 font-mono text-xs uppercase tracking-wider text-[#BFC7D2] font-medium"
                    >
                      Your Name
                    </label>
                    <input
                      id="name"
                      name="Name"
                      type="text"
                      required
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-[#06080d] text-[#E1E0CC] border border-white/10 rounded-xl focus:outline-none focus:border-[#38d1ff] focus:ring-1 focus:ring-[#38d1ff]/40 transition-all placeholder:text-[#697487] text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-1.5 font-mono text-xs uppercase tracking-wider text-[#BFC7D2] font-medium"
                    >
                      Your Email Address
                    </label>
                    <input
                      id="email"
                      name="Email"
                      type="email"
                      required
                      placeholder="you@domain.com"
                      className="w-full px-4 py-3 bg-[#06080d] text-[#E1E0CC] border border-white/10 rounded-xl focus:outline-none focus:border-[#38d1ff] focus:ring-1 focus:ring-[#38d1ff]/40 transition-all placeholder:text-[#697487] text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block mb-1.5 font-mono text-xs uppercase tracking-wider text-[#BFC7D2] font-medium"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="Message"
                      rows={6}
                      required
                      placeholder="Write your message or inquiry here..."
                      className="w-full px-4 py-3 min-h-[155px] sm:min-h-[168px] bg-[#06080d] text-[#E1E0CC] border border-white/10 rounded-xl focus:outline-none focus:border-[#38d1ff] focus:ring-1 focus:ring-[#38d1ff]/40 transition-all placeholder:text-[#697487] text-sm resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-1 w-full py-3.5 px-6 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-[#38d1ff] via-[#4F8CFF] to-[#9b5cff] hover:brightness-110 active:brightness-95 transition-all duration-300 shadow-[0_0_20px_rgba(56,209,255,0.25)] flex items-center justify-center cursor-pointer ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2.5">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Directly...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Unified 2×2 Particle Visual Panel (Desktop Only, Matches Form Height ~515-525px) */}
          {isDesktop && (
            <div className="w-full flex justify-center lg:justify-start">
              <ParticlePanel />
            </div>
          )}

        </div>

        {/* ─── THREE CONTACT INFO SECTIONS (Horizontal on Desktop, Divided by 1px border-white/[0.08]) ─── */}
        <div className="w-full max-w-[1268px] mx-auto mt-2 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] border border-white/[0.08] rounded-2xl bg-[#0e1219] overflow-hidden shadow-sm">
            
            {/* Block 1: LINKEDIN */}
            <a
              href="https://www.linkedin.com/company/aideas-pvg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="group flex items-center justify-center gap-4 px-6 py-4 hover:bg-[#131923] transition-colors"
            >
              <FaLinkedin className="text-[22px] text-[#38d1ff] group-hover:scale-110 transition-transform flex-shrink-0" />
              <div className="text-left">
                <span className="block text-[12px] font-mono uppercase tracking-[0.2em] text-[#8E99A8] font-medium leading-none mb-1">
                  LinkedIn
                </span>
                <span className="text-[15px] font-medium text-[#E1E0CC] group-hover:text-[#38d1ff] transition-colors leading-tight">
                  aiDEAS PVG
                </span>
              </div>
            </a>

            {/* Block 2: INSTAGRAM */}
            <a
              href="https://www.instagram.com/aideas_pvg/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group flex items-center justify-center gap-4 px-6 py-4 hover:bg-[#131923] transition-colors"
            >
              <FaInstagram className="text-[22px] text-[#38d1ff] group-hover:scale-110 transition-transform flex-shrink-0" />
              <div className="text-left">
                <span className="block text-[12px] font-mono uppercase tracking-[0.2em] text-[#8E99A8] font-medium leading-none mb-1">
                  Instagram
                </span>
                <span className="text-[15px] font-medium text-[#E1E0CC] group-hover:text-[#38d1ff] transition-colors leading-tight">
                  @aideas_pvg
                </span>
              </div>
            </a>

            {/* Block 3: LOCATION (Clickable Link to Google Maps) */}
            <a
              href="https://www.google.com/maps/place/PVG'S+College+Of+Engineering,+Technology+And+Management/@18.4899516,73.8498623,935m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bc2c004bc8e1d8f:0x12df641707ea878e!8m2!3d18.4899516!4d73.8524372!16zL20vMGducTZm?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Location · View on Maps"
              className="group flex items-center justify-center gap-4 px-6 py-4 hover:bg-[#131923] transition-colors"
            >
              <FaMapMarkerAlt className="text-[22px] text-[#38d1ff] group-hover:scale-110 transition-transform flex-shrink-0" />
              <div className="text-left">
                <span className="block text-[12px] font-mono uppercase tracking-[0.2em] text-[#8E99A8] font-medium leading-none mb-1">
                  LOCATION &middot; VIEW ON MAPS
                </span>
                <span className="text-[15px] font-medium text-[#E1E0CC] group-hover:text-[#38d1ff] transition-colors leading-tight">
                  PVG&apos;S COETM &middot; <span className="text-[#38d1ff]">Pune</span>
                </span>
              </div>
            </a>

          </div>

          {/* Association Identity subtle tag below */}
          <div className="text-center mt-3">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8E99A8]">
              AI &amp; DATA SCIENCE STUDENT ASSOCIATION
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
