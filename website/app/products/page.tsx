'use client';

import React from 'react';
import {
  FileText,
  ShieldAlert,
  ShoppingCart,
  Network,
  LayoutGrid,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';


// Define a type for the Product Card props for better type safety
type ProductCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

// Array of product data for easy mapping
const productsData = [
  {
    icon: FileText,
    title: 'Smart Contract',
    description: 'Create, sign, and manage legally binding digital contracts with built-in reminders and enforcement mechanisms verified by Aadhar OTP.',
  },
  {
    icon: ShieldAlert,
    title: 'Buyer Blocklist',
    description: 'Stay informed about businesses with poor payment records and get alerts when existing partners show concerning patterns.',
  },
  {
    icon: ShoppingCart,
    title: 'Ecommerce',
    description: 'Create and manage your online store with integrated payment processing and real-time inventory management.',
  },
  {
    icon: Network,
    title: 'Industry Network',
    description: 'Connect with a curated network of verified MSMEs. Build trusted relationships and discover new business opportunities with confidence.',
  },
  {
    icon: LayoutGrid,
    title: 'ERP',
    description: 'An integrated enterprise resource planning system to streamline your business operations and data management.',
  },
  {
    icon: BrainCircuit,
    title: 'AI Risk Engine',
    description: 'Our predictive AI analyzes transaction histories and market data to assign a dynamic risk score to buyers, helping you make informed credit decisions.',
  },
];

// Reusable Product Card Component
const ProductCard: React.FC<ProductCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-[#262626] p-6 rounded-xl shadow-lg flex flex-col gap-4 transform hover:-translate-y-2 transition-transform duration-300">
    <div className="bg-[#f05134] w-12 h-12 rounded-lg flex items-center justify-center">
      <Icon className="text-white" size={24} />
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

// New component to replace the static image
const RiskScoreVisual = () => (
    <div className="bg-white/5 p-8 rounded-xl border border-white/10 aspect-video flex flex-col justify-center items-center text-center">
        <p className="text-sm font-medium text-gray-400 mb-2">Real-Time Buyer Risk Analysis</p>
        <div className="relative w-48 h-48">
            <svg className="transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="12" className="text-gray-700" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="12" className="text-green-500"
                    strokeDasharray="339.292"
                    strokeDashoffset="237.5" // (1 - 30/100) * 339.292 -> 70% full for "Low Risk"
                    pathLength="339.292"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">30</span>
                <span className="text-lg font-semibold text-green-400">Low Risk</span>
            </div>
        </div>
        <div className="mt-4 w-full text-xs text-gray-500">
            <p>Analysis based on 50+ data points</p>
            <p>Last updated: Just now</p>
        </div>
    </div>
);


const ProductsPage = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
          {/* Section 1: Hero Section */}
          <section className="bg-[#262626] text-white">
            <div className="container mx-auto px-6 py-24 text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Solving Critical MSME Challenges
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                Solviser is an AI-powered platform designed specifically for Indian MSMEs to overcome the biggest challenges they face: payment delays, defaults, and trust deficits in B2B transactions.
              </p>
            </div>
          </section>

          {/* Section 2: Our Products */}
          <section className="bg-white py-20">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#262626]">A Complete Toolkit for Your Business</h2>
                <p className="mt-2 text-gray-600">From contracts to commerce, we have you covered.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {productsData.map((product) => (
                  <ProductCard
                    key={product.title}
                    icon={product.icon}
                    title={product.title}
                    description={product.description}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: AI Risk Engine Spotlight */}
          <section className="bg-[#262626] py-20">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 text-center lg:text-left">
                <div className="inline-block bg-[#f05134] p-4 rounded-xl mb-6">
                     <BrainCircuit className="text-white" size={48} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">The Power of a Predictive AI Risk Engine</h2>
                <p className="text-gray-300 mb-6">
                  Move from reactive to proactive risk management. Our AI engine is the core of our platform, providing you with the foresight to protect your cash flow. It continuously learns from thousands of data points to deliver real-time, actionable intelligence.
                </p>
                <ul className="text-left space-y-3 text-gray-400">
                    <li className="flex items-center"><ArrowRight size={16} className="text-[#f05134] mr-3 flex-shrink-0" /> Make data-driven credit decisions.</li>
                    <li className="flex items-center"><ArrowRight size={16} className="text-[#f05134] mr-3 flex-shrink-0" /> Anticipate payment delays before they happen.</li>
                    <li className="flex items-center"><ArrowRight size={16} className="text-[#f05134] mr-3 flex-shrink-0" /> Secure your financial stability with confidence.</li>
                </ul>
              </div>
              <div className="lg:w-1/2">
                <RiskScoreVisual />
              </div>
            </div>
          </section>
          
          {/* Section 4: Call to Action */}
          <section className="bg-[#f05134]">
             <div className="container mx-auto px-6 py-16 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Secure Your Business?</h2>
                <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                    Join Solviser today and transform how you manage B2B transactions with confidence and control.
                </p>
                <button className="bg-[#262626] text-white font-bold py-3 px-8 rounded-lg hover:bg-black transition-colors">
                    Request a Demo
                </button>
             </div>
          </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
