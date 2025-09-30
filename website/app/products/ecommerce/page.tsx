'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowRight, ShoppingCart, Store, CreditCard, Package, BarChart, Wrench, Rocket, Box } from 'lucide-react';
import Link from 'next/link';

// Define a type for the Benefit Item props
type BenefitItemProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

// Reusable Benefit Item Component
const BenefitItem: React.FC<BenefitItemProps> = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="bg-[#f05134] w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon className="text-white" size={20} />
    </div>
    <div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-gray-400 mt-1">{description}</p>
    </div>
  </div>
);

// Main Page Component
const EcommercePage = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        {/* Section 1: Hero Section */}
        <section className="bg-[#262626] text-white relative overflow-hidden">
          <div className="container mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-12 z-10 relative">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Launch Your Online Store, Effortlessly
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-300">
                Build a professional ecommerce website with our all-in-one platform. Manage orders, inventory, and payments from a single dashboard designed for MSMEs.
              </p>
              <Link href="/request-demo">
              <button className="mt-8 bg-[#f05134] text-white font-bold py-3 px-8 rounded-lg hover:bg-white text-white hover:text-[#f05134] transition-colors flex items-center gap-2 mx-auto lg:mx-0">
                Start Building Your Store <ArrowRight size={20} />
              </button>
              </Link>
            </div>
            <div className="lg:w-1/2 flex justify-center items-center">
                <div className="relative w-64 h-64">
                    <div className="absolute inset-0 bg-[#f05134]/20 rounded-full blur-2xl"></div>
                    <ShoppingCart size={160} className="text-white/80 relative" />
                </div>
            </div>
          </div>
        </section>

        {/* Section 2: Benefits & Features */}
        <section className="bg-[#262626] py-20 border-t border-white/10">
          <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <img 
                        src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop" 
                        alt="Online Store Dashboard" 
                        className="rounded-lg shadow-2xl w-full h-[480px] object-cover"
                    />
                </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-8">Everything You Need to Sell Online</h2>
              <div className="space-y-8">
                <BenefitItem
                  icon={Store}
                  title="Easy Store Builder"
                  description="Create a beautiful, mobile-friendly online store in minutes with our drag-and-drop interface. No coding skills required."
                />
                <BenefitItem
                  icon={CreditCard}
                  title="Integrated Payments"
                  description="Accept payments securely through all major methods, including credit/debit cards, UPI, and net banking, with our pre-integrated gateway."
                />
                <BenefitItem
                  icon={Package}
                  title="Unified Inventory & Order Management"
                  description="Sync your online and offline inventory automatically. Manage all orders from a single, powerful dashboard to streamline fulfillment."
                />
                 <BenefitItem
                  icon={BarChart}
                  title="Sales Analytics"
                  description="Gain valuable insights into your sales performance, customer behavior, and top-selling products with easy-to-understand reports."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: How It Works */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-[#262626]">Go from Idea to First Sale in 3 Steps</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              We've simplified the journey to launching your digital storefront.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-8 rounded-xl border">
                    <div className="bg-[#f05134] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                        <Wrench size={32} className="text-white"/>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[#262626]">1. Build Your Store</h3>
                    <p className="text-gray-600">Choose a template, add your products, and customize the design to match your brand identity.</p>
                </div>
                <div className="bg-gray-50 p-8 rounded-xl border">
                    <div className="bg-[#f05134] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                        <Rocket size={32} className="text-white"/>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[#262626]">2. Launch & Promote</h3>
                    <p className="text-gray-600">Go live with a single click. Use our built-in tools to share your store on social media and start attracting customers.</p>
                </div>
                <div className="bg-gray-50 p-8 rounded-xl border">
                    <div className="bg-[#f05134] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                        <Box size={32} className="text-white"/>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[#262626]">3. Manage & Grow</h3>
                    <p className="text-gray-600">Process orders, manage inventory, and track your growth—all from your centralized Solviser dashboard.</p>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EcommercePage;
