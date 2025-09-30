'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowRight, Calculator, DollarSign, Scaling, Clock, Target, BarChart } from 'lucide-react';

// Define a type for the Tool Card props
type ToolCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
};

// Reusable Tool Card Component
const ToolCard: React.FC<ToolCardProps> = ({ icon: Icon, title, description, href }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 flex flex-col h-full">
    <div className="bg-[#f05134] w-14 h-14 rounded-lg flex items-center justify-center mb-5">
      <Icon className="text-white" size={28} />
    </div>
    <h3 className="text-2xl font-bold text-[#262626] mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed mb-6 flex-grow">{description}</p>
    <a href={href} className="bg-[#262626] text-white font-semibold py-2 px-6 rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2 self-start">
      Use Tool <ArrowRight size={18} />
    </a>
  </div>
);

// Main Page Component
const ToolsPage = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Section 1: Hero Section */}
        <section className="bg-[#262626] text-white">
          <div className="container mx-auto px-6 py-24 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Practical Tools for Everyday Business
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
              Streamline your calculations and make data-driven decisions with our suite of free, easy-to-use tools designed specifically for the needs of Indian MSMEs.
            </p>
            <div className="mt-10 flex justify-center gap-4">
                <div className="p-4 bg-white/10 rounded-full"><Calculator size={24} /></div>
                <div className="p-4 bg-white/10 rounded-full"><DollarSign size={24} /></div>
                <div className="p-4 bg-white/10 rounded-full"><Scaling size={24} /></div>
            </div>
          </div>
        </section>

        {/* Section 2: Tools Showcase */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ToolCard
                icon={Calculator}
                title="Measurement Calculator"
                description="Quickly calculate invoice amounts with complex tax options like GST and TCS. Ideal for material suppliers and manufacturers."
                href="/tools/measurement-calculator"
              />
              <ToolCard
                icon={DollarSign}
                title="Sales Price Calculator"
                description="Convert raw material costs into a final selling price, accurately factoring in wastage, operational costs, and profit margins."
                href="/tools/sales-price-calculator"
              />
              <ToolCard
                icon={Scaling}
                title="Wood Calculator"
                description="An essential tool for the timber industry. Calculate the volume (CFT) of wood logs with precision to avoid costly estimation errors."
                href="/tools/wood-calculator"
              />
            </div>
          </div>
        </section>

        {/* Section 3: The Advantage */}
        <section className="bg-[#f05134] py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white">Designed to Empower Your Business</h2>
            <p className="mt-2 text-white/90 max-w-2xl mx-auto">
              Our tools are built to solve real-world problems, helping you save time, increase accuracy, and improve profitability.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                <div className="text-center">
                    <Clock size={32} className="mx-auto mb-4"/>
                    <h3 className="text-xl font-bold">Save Time</h3>
                    <p className="mt-1 text-white/80">Automate complex calculations that would otherwise take hours of manual work.</p>
                </div>
                <div className="text-center">
                    <Target size={32} className="mx-auto mb-4"/>
                    <h3 className="text-xl font-bold">Improve Accuracy</h3>
                    <p className="mt-1 text-white/80">Eliminate human error from your pricing and measurements to protect your margins.</p>
                </div>
                <div className="text-center">
                    <BarChart size={32} className="mx-auto mb-4"/>
                    <h3 className="text-xl font-bold">Make Better Decisions</h3>
                    <p className="mt-1 text-white/80">Get the precise numbers you need to quote prices and manage resources confidently.</p>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ToolsPage;
