'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowRight, LayoutGrid, DollarSign, Package, Users, TrendingUp, Cpu, Layers, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

// Define a type for the Module Card props
type ModuleCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

// Reusable Module Card Component
const ModuleCard: React.FC<ModuleCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-start text-left h-full">
    <div className="bg-[#f05134] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      <Icon className="text-white" size={24} />
    </div>
    <h3 className="text-lg font-bold text-[#262626] mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

// Main Page Component
const ErpPage = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Section 1: Hero Section */}
        <section className="bg-[#262626] text-white">
          <div className="container mx-auto px-6 py-24 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              The Operating System for Your Business
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
              Unify every aspect of your operations with Solviser ERP. From finance and inventory to sales and HR, get a single source of truth to make smarter, faster decisions.
            </p>
            <Link href="/request-demo">
            <button className="mt-8 bg-[#f05134] text-white font-bold py-3 px-8 rounded-lg hover:bg-white text-white hover:text-[#f05134] transition-colors flex items-center gap-2 mx-auto">
              Schedule a Personalized Demo <ArrowRight size={20} />
            </button>
            </Link>
          </div>
        </section>

        {/* Section 2: Why an Integrated ERP? */}
        <section className="bg-white py-20">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                    <img 
                        src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop" 
                        alt="Integrated Business Operations" 
                        className="rounded-xl shadow-2xl w-full h-auto object-cover"
                    />
                </div>
                <div className="lg:w-1/2">
                    <h2 className="text-3xl font-bold text-[#262626] mb-6">Break Down Data Silos, Boost Efficiency</h2>
                    <p className="text-gray-600 mb-4">
                        Disconnected systems create confusion, manual work, and costly errors. Our integrated ERP connects every department, ensuring seamless data flow and real-time visibility across your entire organization.
                    </p>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-center"><ShieldCheck size={20} className="text-[#f05134] mr-3 flex-shrink-0" /> <strong>Single Source of Truth:</strong> Eliminate discrepancies with unified data.</li>
                        <li className="flex items-center"><Zap size={20} className="text-[#f05134] mr-3 flex-shrink-0" /> <strong>Automate Manual Tasks:</strong> Reduce repetitive work and free up your team for growth-focused activities.</li>
                        <li className="flex items-center"><TrendingUp size={20} className="text-[#f05134] mr-3 flex-shrink-0" /> <strong>Real-Time Insights:</strong> Access up-to-the-minute reports to make informed decisions on the fly.</li>
                    </ul>
                </div>
            </div>
        </section>

        {/* Section 3: Core Modules */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#262626]">A Comprehensive Suite of Modules</h2>
              <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                Tailor the ERP to your exact needs with our powerful, interconnected modules.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ModuleCard
                icon={DollarSign}
                title="Financial Management"
                description="Automate accounting, manage cash flow, and generate financial reports with ease. GST-compliant and built for India."
              />
              <ModuleCard
                icon={Package}
                title="Inventory & Supply Chain"
                description="Track stock levels in real-time, manage purchase orders, and optimize your supply chain from procurement to delivery."
              />
              <ModuleCard
                icon={TrendingUp}
                title="Sales & CRM"
                description="Manage your sales pipeline, track customer interactions, and convert leads faster with an integrated CRM system."
              />
              <ModuleCard
                icon={Users}
                title="Human Resources"
                description="Streamline HR processes, from payroll and attendance to employee data management, all in one secure place."
              />
            </div>
          </div>
        </section>

        {/* Section 4: The Solviser Advantage */}
        <section className="bg-[#262626] py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white">Built for the Ambitious MSME</h2>
            <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
              We go beyond a traditional ERP by integrating AI and our entire ecosystem of tools.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                <div className="bg-white/5 p-8 rounded-xl">
                    <Cpu size={32} className="mx-auto mb-4 text-[#f05134]" />
                    <h3 className="text-xl font-bold">AI-Powered Insights</h3>
                    <p className="text-gray-400 mt-2">Get predictive forecasts for sales and inventory, helping you optimize stock and cash flow.</p>
                </div>
                <div className="bg-white/5 p-8 rounded-xl">
                    <Layers size={32} className="mx-auto mb-4 text-[#f05134]" />
                    <h3 className="text-xl font-bold">Seamless Integration</h3>
                    <p className="text-gray-400 mt-2">Connects natively with Solviser Smart Contracts, Ecommerce, and Buyer Blocklist for unparalleled synergy.</p>
                </div>
                <div className="bg-white/5 p-8 rounded-xl">
                    <ShieldCheck size={32} className="mx-auto mb-4 text-[#f05134]" />
                    <h3 className="text-xl font-bold">Affordable & Scalable</h3>
                    <p className="text-gray-400 mt-2">Get enterprise-grade power at an MSME-friendly price. Our cloud-based solution grows with your business.</p>
                </div>
            </div>
          </div>
        </section>

        {/* Section 5: Implementation Process */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-[#262626]">Simple Setup, Powerful Results</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Our dedicated team ensures a smooth transition to a more efficient way of working.
            </p>
            <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4">
                    <h3 className="text-lg font-bold text-[#f05134]">Step 1: Consultation</h3>
                    <p className="text-gray-600 mt-1">We analyze your workflow to configure the ERP for your specific needs.</p>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-bold text-[#f05134]">Step 2: Data Migration</h3>
                    <p className="text-gray-600 mt-1">Our team assists in securely importing your existing data into the new system.</p>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-bold text-[#f05134]">Step 3: Training & Go-Live</h3>
                    <p className="text-gray-600 mt-1">We train your team and provide ongoing support to ensure you maximize the ERP's potential.</p>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ErpPage;
