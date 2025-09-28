'use client';

import React from 'react';
import { ArrowRight, FileText, Fingerprint, Clock, LayoutDashboard, Pencil, PenSquare, FolderKanban } from 'lucide-react';
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
const SmartContractPage = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        {/* Section 1: Hero Section */}
        <section className="bg-[#262626] text-white">
          <div className="container mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Streamline Your Agreements with Smart Contracts
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-300">
                Digitize your entire contract lifecycle. Create, sign, and manage legally binding digital agreements with Aadhar eSign, automated reminders, and built-in enforcement to secure your B2B transactions.
              </p>
              <Link href="/request-demo">
              <button className="mt-8 bg-[#f05134] text-white font-bold py-3 px-8 rounded-lg hover:bg-white text-white hover:text-[#f05134] transition-colors flex items-center gap-2 mx-auto lg:mx-0">
                Create a Contract Now <ArrowRight size={20} />
              </button>
              </Link>
            </div>
                <div className="lg:w-1/2 flex justify-center items-center">
                <div className="relative w-64 h-64">
                    <div className="absolute inset-0 bg-[#f05134]/20 rounded-full blur-3xl"></div>
                    <FileText size={180} className="text-white/80 relative" />
                </div>
            </div>
          </div>
        </section>

        {/* Section 2: Key Features */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#262626]">Features Designed for Trust and Efficiency</h2>
              <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                Our platform is equipped with powerful tools to eliminate payment delays, reduce disputes, and build a foundation of trust with your business partners.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Fingerprint}
                title="Aadhar eSign Verification"
                description="Ensure legal validity and robust security with Aadhar OTP-based eSignatures. Every contract is tamper-proof and legally binding under the IT Act, 2000."
              />
              <FeatureCard
                icon={Clock}
                title="Automated Reminders & Tracking"
                description="Never miss a payment deadline. Our system automatically sends payment reminders and tracks the status of each contract, ensuring timely collections."
              />
              <FeatureCard
                icon={LayoutDashboard}
                title="Centralized Dashboard"
                description="Manage all your agreements from a single, intuitive dashboard. Get a clear overview of active contracts, upcoming payments, and contract history."
              />
            </div>
          </div>
        </section>

        {/* Section 3: How It Works */}
        <section className="bg-[#262626] py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white">Secure Your Transactions in 3 Simple Steps</h2>
            <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
              Our streamlined process makes contract management effortless and secure.
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
                        <Pencil size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">1. Create & Customize</h3>
                    <p className="text-gray-400">Draft your contract using our templates or upload your own. Define terms, payment schedules, and conditions.</p>
                </div>
                <div className="relative bg-[#262626] p-6 z-10 flex flex-col items-center">
                    <div className="bg-[#f05134] w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#262626] mb-4">
                        <PenSquare size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">2. Sign with Aadhar OTP</h3>
                    <p className="text-gray-400">Invite parties to sign the document digitally using a secure, Aadhar-verified OTP process.</p>
                </div>
                <div className="relative bg-[#262626] p-6 z-10 flex flex-col items-center">
                    <div className="bg-[#f05134] w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#262626] mb-4">
                        <FolderKanban size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">3. Manage & Enforce</h3>
                    <p className="text-gray-400">Track contract status, receive automated alerts, and manage all your agreements efficiently from one place.</p>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SmartContractPage;
