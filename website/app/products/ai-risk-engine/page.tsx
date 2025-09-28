'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowRight, BrainCircuit, ShieldCheck, TrendingUp, AlertTriangle, Database, Bot, CheckCircle } from 'lucide-react';
import Link from 'next/link';

// Define a type for the Feature Item props
type FeatureItemProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

// Reusable Feature Item Component
const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="bg-[#f05134] w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon className="text-white" size={24} />
    </div>
    <div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-gray-400 mt-1">{description}</p>
    </div>
  </div>
);

// Main Page Component
const AiRiskEnginePage = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        {/* Section 1: Hero Section */}
        <section className="bg-[#262626] text-white relative overflow-hidden">
          <div className="container mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-12 z-10 relative">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Make Smarter Decisions with Predictive Intelligence
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-300">
                Our AI Risk Engine analyzes thousands of data points to provide a dynamic risk score for every buyer, empowering you to anticipate payment issues and protect your cash flow before problems arise.
              </p>
              <Link href="/request-demo">
              <button className="mt-8 bg-[#f05134] text-white font-bold py-3 px-8 rounded-lg hover:bg-white text-white hover:text-[#f05134] transition-colors flex items-center gap-2 mx-auto lg:mx-0">
                See the Engine in Action <ArrowRight size={20} />
              </button>
              </Link>
            </div>
            <div className="lg:w-1/2 flex justify-center items-center">
                <div className="relative w-64 h-64">
                    <div className="absolute inset-0 bg-[#f05134]/20 rounded-full blur-3xl"></div>
                    <BrainCircuit size={180} className="text-white/80 relative" />
                </div>
            </div>
          </div>
        </section>

        {/* Section 2: The Problem of Uncertainty */}
        <section className="bg-white py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-[#262626]">Stop Guessing, Start Knowing</h2>
                    <p className="mt-2 text-gray-600 max-w-3xl mx-auto">
                        The traditional methods of assessing buyer creditworthiness are broken. They expose your business to unnecessary risk, stress, and financial loss. It's time for a smarter approach.
                    </p>
                </div>
                <div className="relative max-w-5xl mx-auto">
                    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                        <div className="w-px h-full bg-gray-300"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                        {/* The Old Way */}
                        <div className="text-center md:text-right pr-6">
                            <div className="inline-flex items-center gap-3 mb-4">
                                <h3 className="text-2xl font-bold text-gray-500">The Old Way: Uncertainty</h3>
                                <AlertTriangle className="text-gray-400" size={28} />
                            </div>
                            <ul className="space-y-4 text-gray-500">
                                <li>Decisions based on gut-feel & outdated references</li>
                                <li>Weeks lost on manual, inefficient background checks</li>
                                <li>Static credit reports that miss real-time red flags</li>
                                <li>Reactive crisis management after a payment defaults</li>
                            </ul>
                        </div>

                        {/* The Solviser Way */}
                        <div className="text-center md:text-left pl-6">
                            <div className="inline-flex items-center gap-3 mb-4">
                                <ShieldCheck className="text-[#f05134]" size={28} />
                                <h3 className="text-2xl font-bold text-[#262626]">The Solviser Way: Clarity</h3>
                            </div>
                            <ul className="space-y-4 text-gray-800">
                                <li><strong>Data-driven confidence</strong> with AI-powered risk scores</li>
                                <li><strong>Instant risk assessment</strong> automated for you in seconds</li>
                                <li><strong>Dynamic profiles</strong> that reflect current payment behavior</li>
                                <li><strong>Proactive alerts</strong> to prevent problems before they happen</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 3: How Our AI Works */}
        <section className="bg-[#262626] py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white">The Intelligence Behind the Score</h2>
            <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
              Our proprietary AI model processes vast amounts of data to deliver a simple, actionable risk score.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                <div className="text-center p-6">
                    <Database size={40} className="mx-auto mb-4 text-[#f05134]"/>
                    <h3 className="text-xl font-bold">1. Data Aggregation</h3>
                    <p className="text-gray-400 mt-2">We analyze public financial records, historical transaction data from our network, and industry-specific payment trends.</p>
                </div>
                <div className="text-center p-6">
                    <Bot size={40} className="mx-auto mb-4 text-[#f05134]"/>
                    <h3 className="text-xl font-bold">2. AI Analysis</h3>
                    <p className="text-gray-400 mt-2">Our machine learning algorithms identify patterns and correlations that predict future payment behavior with high accuracy.</p>
                </div>
                <div className="text-center p-6">
                    <TrendingUp size={40} className="mx-auto mb-4 text-[#f05134]"/>
                    <h3 className="text-xl font-bold">3. Dynamic Risk Score</h3>
                    <p className="text-gray-400 mt-2">The output is a clear, constantly updated score from 0-100, giving you an instant understanding of a buyer's reliability.</p>
                </div>
            </div>
          </div>
        </section>

        {/* Section 4: Core Features */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-[#262626] mb-8">Actionable Intelligence at Your Fingertips</h2>
              <div className="space-y-8">
                <FeatureItem
                  icon={TrendingUp}
                  title="Predictive Default Scoring"
                  description="Go beyond past performance. Our AI predicts the likelihood of future payment delays or defaults, giving you a crucial advantage."
                />
                <FeatureItem
                  icon={AlertTriangle}
                  title="Proactive Anomaly Alerts"
                  description="Get notified instantly if a trusted buyer's behavior changes, such as delayed payments elsewhere in our network."
                />
                <FeatureItem
                  icon={CheckCircle}
                  title="Seamless Integration"
                  description="The risk score is integrated directly into our Smart Contract and ERP modules, informing your decisions at every step."
                />
              </div>
            </div>
            <div className="lg:w-1/2">
                <div className="bg-[#262626] p-8 rounded-xl shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                        alt="Data Analytics Dashboard" 
                        className="rounded-lg w-full h-auto object-cover opacity-80"
                    />
                </div>
            </div>
          </div>
        </section>

        {/* Section 5: Trust and Security */}
        <section className="bg-[#f05134] py-16">
         <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Your Data, Secured</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                We are committed to the highest standards of data privacy and security. Your proprietary information is always encrypted and is never shared without your consent. Our AI operates on anonymized, aggregated data to protect all members of the network.
            </p>
         </div>
      </section>
      </main>
      <Footer />
    </div>
  );
};

export default AiRiskEnginePage;
