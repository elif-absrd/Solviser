"use client";

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { montserrat } from "@/app/fonts";
import { ShieldCheck, BarChart3, Scale, FileText, Target, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  // --- Data for the Values Section ---
  const values = [
    { 
      id: 1, 
      icon: <ShieldCheck className="w-8 h-8 text-white" />, 
      title: "Reduce Fraud", 
      description: "Identify potential fraudulent buyers before entering into business deals." 
    },
    { 
      id: 2, 
      icon: <BarChart3 className="w-8 h-8 text-white" />, 
      title: "Better Evaluation", 
      description: "Make informed decisions about suppliers and buyers with risk profiles." 
    },
    { 
      id: 3, 
      icon: <Scale className="w-8 h-8 text-white" />, 
      title: "Safer B2B Payments", 
      description: "Ensure timely payments with digital contracts and payment tracking." 
    },
    { 
      id: 4, 
      icon: <FileText className="w-8 h-8 text-white" />, 
      title: "Peace of Mind", 
      description: "Legally binding digital contracts protect your interests." 
    },
  ];

  // --- Data for the Why Trust Solviser AI Table ---
  const comparisonData = [
    { feature: "Accuracy", solviser: "Advanced machine learning models", traditional: "Prone to human error" },
    { feature: "Speed", solviser: "Instant data processing", traditional: "Time-consuming analysis" },
    { feature: "Scalability", solviser: "Handles vast amounts of data", traditional: "Limited capacity" },
    { feature: "Security", solviser: "End-to-end encryption", traditional: "Vulnerable to breaches" },
  ];

  return (
    <>
      <div className="relative z-50">
        <Header />
      </div>
      
      <main className="-mt-20 md:-mt-24">
        {/* Section 1: Hero Banner */}
        <section className="bg-[#231f20] text-white pt-36 pb-20 md:pt-48 md:pb-28">
          <div className="container mx-auto px-4 text-center">
            <h1 className={`${montserrat.className} text-4xl md:text-6xl font-extrabold [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]`}>
              About Solviser
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
              We are dedicated to empowering MSMEs by creating a safer, more transparent, and efficient B2B ecosystem.
            </p>
          </div>
        </section>

        {/* Section 2: Our Values */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className={`${montserrat.className} text-3xl md:text-5xl font-bold text-[#231f20]`}>Values for MSMEs</h2>
              <p className="text-gray-600 text-lg md:text-xl mt-4">See how Solviser transforms your business operations.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.id} className="group bg-slate-50 rounded-xl p-8 transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
                  <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[#e84e35] shadow-lg">
                    {value.icon}
                  </div>
                  <h3 className={`${montserrat.className} text-xl font-bold text-[#231f20]`}>{value.title}</h3>
                  <p className="text-gray-600 mt-3 text-base">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Our Mission & Vision */}
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Mission Card */}
                    <div className="bg-[#e84e35] p-8 md:p-12 rounded-xl text-white">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className={`${montserrat.className} text-4xl font-bold`}>Our Mission</h2>
                            <div className="bg-white p-3 rounded-full shadow-sm">
                                <Target className="w-8 h-8 text-[#e84e35]" />
                            </div>
                        </div>
                        <h3 className={`${montserrat.className} text-xl font-semibold mb-4`}>
                          To empower MSMEs with innovative, data-driven tools that enhance business security, financial stability, and operational efficiency—enabling them to scale with confidence.
                        </h3>
                         <p className="text-white/80 mb-4">
                          Build a transparent, secure, and efficient B2B ecosystem where MSMEs thrive without payment worries and integrate into a structured business network.
                        </p>
                        <p className="text-white/90 font-semibold border-l-2 border-white/50 pl-4">
                          Delivering a 100% transaction-driven system where authenticity is guaranteed, bias is eliminated, and the scope for manipulation is reduced to zero.
                        </p>
                    </div>

                    {/* Vision Card */}
                    <div className="bg-[#e84e35] p-8 md:p-12 rounded-xl text-white">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className={`${montserrat.className} text-4xl font-bold`}>Our Vision</h2>
                             <div className="bg-white p-3 rounded-full shadow-sm">
                                <Eye className="w-8 h-8 text-[#e84e35]" />
                            </div>
                        </div>
                        <h3 className={`${montserrat.className} text-xl font-semibold mb-4`}>
                          To become India’s most trusted platform for financial intelligence — enabling a future where every business decision is powered by data, trust, and transparency, and where no MSME suffers due to payment defaults or fraud.
                        </h3>
                        <p className="text-white/80 mb-4">
                            To become the go-to platform for MSMEs, bridging the gap between businesses, financial institutions, and suppliers while fostering a secure and transparent ecosystem.
                        </p>
                        <p className="text-white/90 font-semibold border-l-2 border-white/50 pl-4">
                          A platform built on 100% transaction-based insights — free from subjective ratings or recommendations — ensuring zero bias and absolute accuracy.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 4: Why Trust SOLVISER AI? */}
        <section className="py-16 md:py-24 bg-[#231f20] text-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h2 className={`${montserrat.className} text-4xl font-bold`}>Why Trust Solviser AI?</h2>
                    <p className="mt-4 text-lg text-slate-300">Our data-driven approach provides a clear advantage over traditional methods.</p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 text-lg font-semibold border-b border-white/20">Feature</th>
                                    <th className="p-4 text-lg font-semibold border-b border-white/20 text-[#e84e35]">Solviser AI</th>
                                    <th className="p-4 text-lg font-semibold border-b border-white/20">Traditional Solutions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="p-4 border-t border-white/20 font-semibold">{item.feature}</td>
                                        <td className="p-4 border-t border-white/20 text-slate-300 font-bold">{item.solviser}</td>
                                        <td className="p-4 border-t border-white/20 text-slate-300">{item.traditional}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
