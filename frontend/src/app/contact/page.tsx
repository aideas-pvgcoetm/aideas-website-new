'use client';

import { useState, useRef } from 'react';
import { FaLinkedin, FaInstagram, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    const form = e.currentTarget;
    const name = (form.elements.namedItem("Name") as HTMLInputElement)?.value || '';
    const email = (form.elements.namedItem("Email") as HTMLInputElement)?.value || '';
    const message = (form.elements.namedItem("Message") as HTMLTextAreaElement)?.value || '';

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_enquiry';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_s7wg2wc';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '7kPIrVieTXbxkwLkj';

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
    <main className="min-h-screen bg-[#020612] text-white px-6 py-16 relative overflow-hidden">
      {/* Background Subtle Nebulae */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 mb-4 tracking-tight drop-shadow-md">
          Contact Us
        </h1>
        <p className="text-gray-300 font-mono text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed">
          Have a question, suggestion, or want to collaborate? Reach out to us through the form below or connect via our social channels.
        </p>

        {/* Status Notification Alerts */}
        {status.type === 'success' && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-sm font-medium flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.25)] animate-fadeIn">
            <FaCheckCircle className="text-emerald-400 text-lg flex-shrink-0" />
            <span>{status.message}</span>
          </div>
        )}

        {status.type === 'error' && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm font-medium flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(244,63,94,0.25)] animate-fadeIn">
            <FaExclamationCircle className="text-rose-400 text-lg flex-shrink-0" />
            <span>{status.message}</span>
          </div>
        )}

        {/* Contact Form Card */}
        <div className="bg-[#050c1f]/90 border border-cyan-500/30 rounded-2xl p-6 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 text-left">
            <div>
              <label htmlFor="name" className="block mb-2 font-mono text-xs uppercase tracking-wider text-cyan-300 font-semibold">
                Your Name
              </label>
              <input
                id="name"
                name="Name"
                type="text"
                required
                placeholder="Enter your name"
                className="w-full px-4 py-3 bg-[#030816] text-white border border-cyan-500/25 rounded-xl 
                focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-gray-600 text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 font-mono text-xs uppercase tracking-wider text-cyan-300 font-semibold">
                Your Email Address
              </label>
              <input
                id="email"
                name="Email"
                type="email"
                required
                placeholder="you@domain.com"
                className="w-full px-4 py-3 bg-[#030816] text-white border border-cyan-500/25 rounded-xl 
                focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-gray-600 text-sm"
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 font-mono text-xs uppercase tracking-wider text-cyan-300 font-semibold">
                Your Message
              </label>
              <textarea
                id="message"
                name="Message"
                rows={5}
                required
                placeholder="Write your message or inquiry here..."
                className="w-full px-4 py-3 bg-[#030816] text-white border border-cyan-500/25 rounded-xl 
                focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-gray-600 text-sm resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 w-full sm:w-auto mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_28px_rgba(0,240,255,0.5)] cursor-pointer ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Sending Directly...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-10 text-2xl text-gray-400">
          {[
            { href: "https://www.linkedin.com/company/aideas-pvg", icon: <FaLinkedin />, label: "LinkedIn" },
            { href: "https://www.instagram.com/aideas_pvg/?hl=en", icon: <FaInstagram />, label: "Instagram" },
          ].map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="hover:text-cyan-300 hover:scale-110 transition-all duration-200"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
