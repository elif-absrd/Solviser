"use client";

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { montserrat } from "@/app/fonts";
import { PlusCircle, ShieldCheck, FileText, BarChart, ChevronDown, Scale, HandCoins, Building2, UserCog } from "lucide-react";
import Link from 'next/link';

// --- Data for the services lists ---
const legalData = {
  title: "Legal Assistance: Protecting Your Business",
  categories: [
    { name: "Core Legal & Compliance Services", icon: ShieldCheck, items: ["AI-Powered Legal Compliance – Automated compliance tracking & reminders", "Tamper-Proof Digital Contracts – Aadhaar-based e-sign & blockchain enabled", "Dispute Resolution Support – Mediation, arbitration & legal advisory", "Business Licensing & Registration – GST, MCA, Import-Export Code, Shops & Establishment Act"] },
    { name: "Extended Legal Services (By Experts)", icon: UserCog, items: ["Corporate Lawyer Support – Drafting agreements, contracts, MOUs, NDAs", "Litigation Support – Court case filing, case tracking, lawyer connect", "Intellectual Property Protection – Trademark, Copyright & Patent filing", "Labour & Employment Laws – HR policies, labour contract compliance, POSH Act"] },
    { name: "CA (Chartered Accountant) Services", icon: FileText, items: ["Accounting & Auditing – Company audits, financial statements", "Direct & Indirect Taxation – Income Tax, GST return filing, TDS management", "Financial Advisory – Budgeting, valuation & fundraising support", "Due Diligence Reports – For M&A, investor readiness"] },
    { name: "CS (Company Secretary) Services", icon: Building2, items: ["Company Incorporation – Pvt Ltd, LLP, OPC setup", "ROC Filing & MCA Compliance – Annual returns, board meetings, resolutions", "Corporate Governance Advisory – Ensuring regulatory compliance", "Secretarial Audit – For listed & large companies"] }
  ]
};

const financialData = {
  title: "Financial Assistance: Managing Your Business Finances",
  categories: [
    { name: "Core Financial Services", icon: HandCoins, items: ["Cash Flow Optimization – Smart receivables & payables management", "Automated Accounting Solutions – AI-powered bookkeeping & ERP integration", "Credit Risk Assessment – AI-driven buyer/supplier risk scoring", "Loan & Funding Assistance – Term loans, working capital, invoice financing, bill discounting"] },
    { name: "Advanced Financial Management", icon: BarChart, items: ["Budgeting & Forecasting – Real-time business forecasting tools", "Expense Management – Automated tracking & approvals", "Payroll Management – Salary, PF, ESI, TDS automation", "Asset & Inventory Financing – Machinery loans, inventory credit"] },
    { name: "Taxation & Compliance", icon: Scale, items: ["GST Compliance – Registration, return filing, reconciliation", "Income Tax & TDS Management – Filing, deduction tracking, advisory", "Financial Audits & Assurance – Statutory, internal & management audits", "Corporate Tax Planning – Tax saving structures for businesses"] },
    { name: "Fundraising & Investments", icon: FileText, items: ["Investor Readiness Reports – Due diligence, pitch deck financials, valuation", "Equity & Debt Advisory – Fundraising support (VC/PE, Angel, Banks, NBFCs)", "Government Schemes Assistance – Mudra, SIDBI, CGTMSE, MSME Samadhan, StartUp India funding", "Alternative Finance – Crowdfunding, P-P lending, trade finance"] }
  ]
};

const processSteps = [
    { icon: <FileText className="w-10 h-10 text-[#f05134]" />, title: "Assess & Analyze", description: "Our AI evaluates your business needs and potential risks, providing a clear compliance and financial health overview." },
    { icon: <ShieldCheck className="w-10 h-10 text-[#f05134]" />, title: "Secure & Execute", description: "Generate legally sound, tamper-proof contracts and access financial tools to secure your transactions and cash flow." },
    { icon: <BarChart className="w-10 h-10 text-[#f05134]" />, title: "Monitor & Grow", description: "Gain ongoing support and data-driven insights to manage risks, maintain compliance, and scale your business with confidence." }
];

// --- Reusable Accordion Component ---
const AccordionItem = ({ category, isOpen, onClick }: any) => {
    const Icon = category.icon;
    return (
        <div className="border-b border-white/10">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center p-6 text-left"
            >
                <div className="flex items-center gap-4">
                    <Icon className="w-6 h-6 text-[#f05134] flex-shrink-0" />
                    <span className="font-semibold text-lg text-white">{category.name}</span>
                </div>
                <ChevronDown className={`transition-transform text-white ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <ul className="pl-16 pr-6 pb-6 space-y-3">
                    {category.items.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 text-slate-300">
                           <span className="text-[#f05134] mt-1">-</span> <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default function ServicesPage() {
    const [openLegal, setOpenLegal] = useState<number | null>(0);
    const [openFinancial, setOpenFinancial] = useState<number | null>(0);

  return (
    <>
      <Header />
      <main>
        {/* Section 1: Hero */}
        <section className="bg-[#262626] text-white pt-20 pb-12 md:pt-28">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className={`${montserrat.className} text-4xl md:text-5xl font-bold`}>
                        Legal and Financial Assistance Services
                    </h1>
                    <p className="mt-4 text-lg text-slate-300">
                        Stay compliant, minimize risks, and ensure financial stability with Solviser's expert-backed solutions.
                    </p>
                </div>
            </div>
        </section>

        {/* Section 2: Legal Services Accordion */}
        <section className="bg-[#262626] text-white pt-12 pb-20">
            <div className="container mx-auto px-4 max-w-5xl">
                <h2 className={`${montserrat.className} text-3xl font-bold mb-6 text-center`}>{legalData.title}</h2>
                <div className="bg-white/5 rounded-lg border border-white/10">
                    {legalData.categories.map((category, index) => (
                        <AccordionItem 
                            key={index} 
                            category={category} 
                            isOpen={openLegal === index} 
                            onClick={() => setOpenLegal(openLegal === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>

        {/* Section 3: Financial Services Accordion */}
        <section className="bg-white py-20">
            <div className="container mx-auto px-4 max-w-5xl">
                <h2 className={`${montserrat.className} text-3xl font-bold mb-6 text-center text-[#262626]`}>{financialData.title}</h2>
                <div className="bg-slate-50 rounded-lg border border-slate-200">
                    {financialData.categories.map((category, index) => (
                         <div className="border-b border-slate-200 last:border-b-0">
                            <button
                                onClick={() => setOpenFinancial(openFinancial === index ? null : index)}
                                className="w-full flex justify-between items-center p-6 text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <category.icon className="w-6 h-6 text-[#f05134] flex-shrink-0" />
                                    <span className="font-semibold text-lg text-[#262626]">{category.name}</span>
                                </div>
                                <ChevronDown className={`transition-transform text-[#262626] ${openFinancial === index ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openFinancial === index ? 'max-h-screen' : 'max-h-0'}`}>
                                <ul className="pl-16 pr-6 pb-6 space-y-3">
                                    {category.items.map((item: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3 text-slate-600">
                                           <span className="text-[#f05134] mt-1">-</span> <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Section 4: How It Works */}
        <section className="py-16 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className={`${montserrat.className} text-4xl font-bold text-[#262626]`}>
                        A Simple Process to Secure Your Business
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        We've streamlined the path to financial and legal security.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {processSteps.map((step, index) => (
                        <div key={index} className="bg-white p-8 rounded-xl text-center border">
                            <div className="flex justify-center mb-4">{step.icon}</div>
                            <h3 className={`${montserrat.className} text-2xl font-bold text-[#262626] mb-2`}>
                                Step {index + 1}: {step.title}
                            </h3>
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Section 5: Call to Action (CTA) */}
        <section className="bg-[#f05134]">
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className={`${montserrat.className} text-3xl md:text-4xl font-bold text-white`}>
                    Ready to Transform Your Business?
                </h2>
                <p className="text-lg text-white/90 mt-4 mb-8 max-w-2xl mx-auto">
                    Access AI-powered legal tools, optimize your finances, and secure your future. Get started with Solviser today.
                </p>
               <Link
                href="/signup"
                className="bg-white hover:bg-[#f05134] text-[#f05134] hover:text-white font-bold py-4 px-8 rounded-md text-lg transition-colors duration-300 inline-block border-2 border-transparent hover:border-white"
                >
                Get Started for Free
                </Link>
            </div>
        </section>
      </main>
      <Footer />
    </>
  );
}