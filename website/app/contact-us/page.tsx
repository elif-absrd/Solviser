"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { montserrat } from "@/app/fonts";
import { MapPin, Phone, Mail, Globe, Clock, LinkedinIcon, FacebookIcon, InstagramIcon } from "lucide-react";
import Link from 'next/link';
export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <>
      <Header />
      {/* UPDATED: Main background to white */}
      <main className="bg-white">

        {/* Section 1: Hero Section */}
        {/* UPDATED: Background to brand dark gray and accents to brand orange */}
        <section className="relative bg-[#262626] text-white overflow-hidden">
          <div className="absolute top-0 -left-1/4 w-96 h-96 bg-[#f05134] rounded-full opacity-20 filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-[#f05134] rounded-full opacity-20 filter blur-3xl animate-blob animation-delay-4000"></div>

          <div className="relative z-10 container mx-auto px-4 py-28 md:py-36 text-center">
            <h1 className={`${montserrat.className} text-4xl md:text-6xl font-bold [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]`}>
              Get in Touch With Us
            </h1>
            <p className={`mt-4 text-lg text-gray-300 max-w-3xl mx-auto [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]`}>
              We'd love to hear from you. Whether you're a customer, partner, or just curious about Solviser — we're here to help.
            </p>
          </div>
        </section>

        {/* Section 2: Form and Details */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Left Side: Contact Form */}
              <div className="lg:col-span-3 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h2 className={`${montserrat.className} text-2xl font-bold text-[#262626] mb-6`}>Contact Form</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05134]" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email address" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05134]" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05134]" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select name="subject" id="subject" value={formData.subject} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05134]">
                      <option value="" disabled>Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Support">Support</option>
                      <option value="Partnerships">Partnerships</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                    <textarea name="message" id="message" rows={5} value={formData.message} onChange={handleInputChange} placeholder="Type your message here..." required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05134]"></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-[#f05134] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 border-2 border-transparent hover:bg-white hover:text-[#f05134] hover:border-[#f05134]"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Side: Company Details */}
              <div className="lg:col-span-2 bg-slate-50 p-8 rounded-xl">
                <h2 className={`${montserrat.className} text-2xl font-bold text-[#262626] mb-6`}>Company Contact Details</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-[#f05134] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-[#262626]">Office Address</h3>
                      <p className="text-gray-600">Office No. 29, Shri Krishna Complex, Nani Chirai, Gandhidhamn, Gujarat, India – 370201</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-[#f05134] mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#262626]">Phone</h3>
                      <p className="text-gray-600">+91-9904884455</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-[#f05134] mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#262626]">Email</h3>
                      <p className="text-gray-600">support@solviser.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Globe className="w-6 h-6 text-[#f05134] mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#262626]">Website</h3>
                      <p className="text-gray-600">www.solviser.com</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-start gap-4">
                      <Clock className="w-6 h-6 text-[#f05134] mt-1" />
                      <div>
                        <h3 className="font-semibold text-[#262626]">Support Hours</h3>
                        <p className="text-gray-600">Live Support: 10:00 AM to 7:00 PM (IST)</p>
                        <p className="text-sm text-gray-500 mt-1">Email queries are responded to within 24 hours.</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-[#262626] mb-3">Follow Us on Social Media</h3>
                    <div className="flex gap-4">
                      <Link href="https://www.linkedin.com/company/105701635/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-brand-orange"><LinkedinIcon /></Link>
                      <Link href="https://www.facebook.com/profile.php?id=61567543661718" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-brand-orange"><FacebookIcon /></Link>
                      <Link href="https://www.instagram.com/solviser_pvtltd/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-brand-orange"><InstagramIcon /></Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Our Location */}
        <section className="pb-20 md:pb-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <h2 className={`${montserrat.className} text-4xl font-bold text-[#262626]`}>
                Our Location
              </h2>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-100 h-96 md:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.2396970456857!2d70.23230387509734!3d23.197933679051236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3950bd2c1e02b20d%3A0xd37c60aaa8ccdca4!2sChirai%20Nani%2C%20Gujarat%20370140!5e0!3m2!1sen!2sin!4v1755860842311!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>

        {/* Section 4: Call to Action (CTA) */}
        {/* UPDATED: High-impact CTA with brand colors */}
        <section className="bg-[#f05134] py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className={`${montserrat.className} text-3xl md:text-4xl font-bold text-white`}>
              Take Control of Your Business Deals Today
            </h2>
            <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
              Join 1,000+ MSMEs already using Solviser to set smarter and safer business deals.
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <button
                className="bg-white text-[#f05134] font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:bg-[#f05134] hover:text-white hover:border-white"
              >
                Get Started for Free
              </button>
              <button
                className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-[#f05134] transition-all duration-300 transform hover:scale-105"
              >
                Talk to Our Experts
              </button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}