'use client';

import React from 'react';
import { ArrowRight, ShieldAlert, BellRing, Database, GanttChartSquare, Search, Eye, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

// Define a type for the Feature Card props
type FeatureCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

// Reusable Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center flex flex-col items-center">
    <div className="bg-[#f05134] w-14 h-14 rounded-full flex items-center justify-center mb-5">
      <Icon className="text-white" size={28} />
    </div>
    <h3 className="text-xl font-bold text-[#262626] mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// Main Page Component
const BuyerBlocklistPage = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        {/* Section 1: Hero Section */}
        <section className="bg-[#262626] text-white">
          <div className="container mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Transact with Confidence, Mitigate Payment Risk
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-300">
                Access a shared network of payment data to identify high-risk buyers. Get real-time alerts on concerning payment patterns and protect your business from defaults and delays.
              </p>
              <Link href="/request-demo">
              <button className="mt-8 bg-[#f05134] text-white font-bold py-3 px-8 rounded-lg hover:bg-white text-white hover:text-[#f05134] transition-colors flex items-center gap-2 mx-auto lg:mx-0">
                Check a Buyer's Risk Profile <ArrowRight size={20} />
              </button>
              </Link>
            </div>
            
                <div className="lg:w-1/2 flex justify-center items-center">
                <div className="relative w-64 h-64">
                    <div className="absolute inset-0 bg-[#f05134]/20 rounded-full blur-3xl"></div>
                    <ShieldAlert size={180} className="text-white/80 relative" />
                </div>
            </div>
          </div>
        </section>

        {/* Section 2: Key Features */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#262626]">Protect Your Cash Flow Proactively</h2>
              <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                Our Buyer Blocklist is more than just a list; it's a dynamic risk management tool powered by community-driven data and AI.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Database}
                title="Community-Sourced Database"
                description="Leverage a constantly updated database of businesses with poor payment histories, contributed by MSMEs across India."
              />
              <FeatureCard
                icon={BellRing}
                title="Real-Time Risk Alerts"
                description="Receive instant notifications when an existing partner's payment behavior becomes erratic or they are flagged by others in the network."
              />
              <FeatureCard
                icon={GanttChartSquare}
                title="Informed Decision-Making"
                description="Before you offer credit or start a new partnership, vet potential buyers to assess their payment reliability and financial discipline."
              />
            </div>
          </div>
        </section>

        {/* Section 3: How It Works */}
        <section className="bg-[#262626] py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white">Safeguard Your Business in 3 Steps</h2>
            <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
              Easily integrate our risk intelligence into your daily operations.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white relative">
                {/* Dotted line for desktop view */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2">
                    <svg width="100%" height="2">
                        <line x1="0" y1="1" x2="100%" y2="1" stroke="#4A5568" strokeWidth="2" strokeDasharray="8 8"/>
                    </svg>
                </div>
                <div className="relative bg-[#262626] p-6 z-10 flex flex-col items-center">
                    <div className="bg-[#f05134] w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#262626] mb-4">
                        <Search size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">1. Search & Vet</h3>
                    <p className="text-gray-400">Before engaging with a new buyer, search their business profile in our extensive network to view their payment history and risk score.</p>
                </div>
                <div className="relative bg-[#262626] p-6 z-10 flex flex-col items-center">
                    <div className="bg-[#f05134] w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#262626] mb-4">
                        <Eye size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">2. Monitor & Get Alerts</h3>
                    <p className="text-gray-400">Add your existing clients to a personalized watchlist. Our AI will continuously monitor their activity and alert you to any red flags.</p>
                </div>
                <div className="relative bg-[#262626] p-6 z-10 flex flex-col items-center">
                    <div className="bg-[#f05134] w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#262626] mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">3. Act with Confidence</h3>
                    <p className="text-gray-400">Use these powerful insights to negotiate better payment terms, adjust credit limits, or avoid potentially damaging business relationships.</p>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BuyerBlocklistPage;
