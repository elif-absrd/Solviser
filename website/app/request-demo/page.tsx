// File: app/request-demo/page.tsx
'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { montserrat } from '@/app/fonts';
import { Check, ArrowRight } from 'lucide-react';

// Data for product checkboxes
const products = [
  "AI Risk Engine",
  "Smart Contract",
  "Buyer Blocklist",
  "Ecommerce",
  "Industry Network",
  "ERP"
];

export default function RequestDemoPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    workEmail: '',
    phoneNumber: '',
    companySize: '',
    interestedProducts: [] as string[],
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return { ...prev, interestedProducts: [...prev.interestedProducts, value] };
      } else {
        return { ...prev, interestedProducts: prev.interestedProducts.filter(product => product !== value) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Demo Request Submitted:", formData);
    // Here you would typically send the data to your backend API
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-[#231f20] text-white pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className={`${montserrat.className} text-4xl md:text-5xl font-bold`}>
                Request a Personalized Demo
              </h1>
              <p className="mt-4 text-lg text-slate-300">
                See firsthand how Solviser can protect your business and streamline your operations.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column: Information */}
              <div className="lg:pt-8">
                <h2 className={`${montserrat.className} text-3xl font-bold text-[#231f20]`}>What to Expect</h2>
                <p className="mt-4 text-gray-600">
                  Our team will walk you through a live demonstration tailored to your business needs. We'll show you how to leverage our forward-thinking tools to support your growth and mitigate risks.
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center gap-3">
                    <Check size={20} className="text-[#e84e35]" />
                    <span className="text-gray-700">A deep dive into your products of interest.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={20} className="text-[#e84e35]" />
                    <span className="text-gray-700">Answers to your specific questions.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={20} className="text-[#e84e35]" />
                    <span className="text-gray-700">No commitment, just valuable insights.</span>
                  </li>
                </ul>
              </div>

              {/* Right Column: Form */}
              <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                {submitted ? (
                  <div className="text-center py-16">
                    <h3 className={`${montserrat.className} text-2xl font-bold text-[#231f20]`}>Thank You!</h3>
                    <p className="mt-2 text-gray-600">Your demo request has been received. Our team will contact you shortly to schedule a time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" id="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e84e35]" />
                      </div>
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input type="text" id="companyName" value={formData.companyName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e84e35]" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="workEmail" className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                      <input type="email" id="workEmail" value={formData.workEmail} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e84e35]" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e84e35]" />
                      </div>
                       <div>
                        <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                        <select id="companySize" value={formData.companySize} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e84e35]">
                          <option value="" disabled>Select an option</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="200+">200+ employees</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">I'm interested in...</label>
                      <div className="grid grid-cols-2 gap-4">
                        {products.map((product) => (
                          <label key={product} htmlFor={product} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input type="checkbox" id={product} value={product} checked={formData.interestedProducts.includes(product)} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-300 text-[#e84e35] focus:ring-[#e84e35]" />
                            {product}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Additional Message (Optional)</label>
                      <textarea id="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e84e35]"></textarea>
                    </div>
                    <div>
                      <button type="submit" className="group w-full bg-[#e84e35] hover:bg-white text-white hover:text-[#e84e35] font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 border-2 border-transparent hover:border-[#e84e35]">
                        <span>Request My Demo</span>
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}