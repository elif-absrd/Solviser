'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowRight, Network, UserCheck, SearchCode, Handshake, Building, Link as LinkIcon, Bot } from 'lucide-react';
import Link from 'next/link';
// Define a type for the Pillar Card props
type PillarCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

// Reusable Pillar Card Component
const PillarCard: React.FC<PillarCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-[#262626] p-8 rounded-xl shadow-lg text-center flex flex-col items-center">
    <div className="bg-[#f05134] w-14 h-14 rounded-full flex items-center justify-center mb-5">
      <Icon className="text-white" size={28} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

// Main Page Component
const IndustryNetworkPage = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">
        {/* Section 1: Hero Section */}
        <section className="bg-[#262626] text-white">
          <div className="container mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
                Build Your Network of Trusted Partners
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-300">
                Connect with a curated network of verified MSMEs. Forge valuable relationships, discover new business opportunities, and grow with confidence in a community built on trust.
              </p>
              <Link href="/request-demo">
              <button className="mt-8 bg-[#f05134] text-white font-bold py-3 px-8 rounded-lg hover:bg-white text-white hover:text-[#f05134] transition-colors flex items-center gap-2 mx-auto lg:mx-0">
                Join the Network <ArrowRight size={20} />
              </button>
              </Link>
            </div>
            <div className="lg:w-1/2 flex justify-center items-center">
                <div className="relative w-80 h-80">
                    <div className="absolute inset-0 bg-[#f05134]/20 rounded-full blur-2xl"></div>
                    <img 
                        src="https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcT2SK4JYy9o2-J3m5PJnW9eYADY2-zPH__o7hpppcrhIdhJOjG5TzW4PZMwqD1vF-mf3MRUTg2fnIvJEPXWOvUwiHe2dJIIRD1nC84ETUIFnGVBggE" 
                        alt="Business Networking" 
                        className="relative w-full h-full object-cover rounded-full shadow-2xl"
                    />
                </div>
            </div>
          </div>
        </section>

        {/* Section 2: Core Pillars */}
        <section className="bg-[#262626] py-20 border-t border-white/10">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">A Network Built on Three Pillars</h2>
              <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
                We focus on what matters most for MSMEs: trust, opportunity, and intelligent connections.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PillarCard
                icon={UserCheck}
                title="Verified Members"
                description="Every business in our network undergoes a verification process, ensuring you connect only with credible and reliable partners."
              />
              <PillarCard
                icon={SearchCode}
                title="Targeted Discovery"
                description="Use our smart filters to find exactly what you need—whether it's a new supplier, a client in a specific industry, or a potential collaborator."
              />
              <PillarCard
                icon={Handshake}
                title="Facilitated Trust"
                description="Transact with confidence using our integrated tools like Smart Contracts and the Buyer Blocklist to secure every new relationship."
              />
            </div>
          </div>
        </section>

        {/* Section 3: How It Works */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#262626]">Unlock Growth Opportunities</h2>
                <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                Our AI-driven process helps you find and build valuable business relationships.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center p-6">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building size={32} className="text-[#f05134]"/>
                    </div>
                    <h3 className="font-bold text-lg text-[#262626]">Create Your Profile</h3>
                    <p className="text-gray-500 text-sm">Showcase your business, products, and what you're looking for in a partner.</p>
                </div>
                 <div className="text-center p-6">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bot size={32} className="text-[#f05134]"/>
                    </div>
                    <h3 className="font-bold text-lg text-[#262626]">Get AI Recommendations</h3>
                    <p className="text-gray-500 text-sm">Our algorithm suggests potential partners based on your profile and business needs.</p>
                </div>
                 <div className="text-center p-6">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LinkIcon size={32} className="text-[#f05134]"/>
                    </div>
                    <h3 className="font-bold text-lg text-[#262626]">Connect & Communicate</h3>
                    <p className="text-gray-500 text-sm">Reach out to potential partners through our secure messaging system to discuss opportunities.</p>
                </div>
                 <div className="text-center p-6">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Handshake size={32} className="text-[#f05134]"/>
                    </div>
                    <h3 className="font-bold text-lg text-[#262626]">Collaborate & Grow</h3>
                    <p className="text-gray-500 text-sm">Finalize deals with Smart Contracts and build lasting, trusted business relationships.</p>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IndustryNetworkPage;
