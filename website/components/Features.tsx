// File: apps/website/src/components/Features.tsx
"use client";
import { useState } from "react";
import type { ElementType } from "react"; // Import type for component props
import { montserrat } from "@/app/fonts";
import { 
  BrainCircuit, ShieldCheck, FileSignature, Network, GaugeCircle, UserCheck,
  Database, ShoppingCart, Calculator, Tags, AreaChart
} from "lucide-react";

// 1. Defined a type for a single feature object
interface Feature {
  id: number;
  icon: ElementType;
  title: string;
  description: string;
}

// 2. Defined the types for the AccordionItem's props
interface AccordionItemProps {
  feature: Feature;
  isOpen: boolean;
  onToggle: () => void;
}

const features: Feature[] = [ // Typed the features array
  { id: 1, icon: BrainCircuit, title: "AI Risk Engine", description: "Advanced algorithms analyze payment behavior, history, and network patterns to generate accurate risk scores for potential business partners." },
  { id: 2, icon: ShieldCheck, title: "Blocklist & Watchlist", description: "Stay informed about businesses with poor payment records and get alerts when existing partners show concerning patterns." },
  { id: 3, icon: FileSignature, title: "Digital Contracts", description: "Create, sign, and manage legally binding digital contracts with built-in reminders and enforcement mechanisms verified by aadhar OTP." },
  { id: 4, icon: Network, title: "Network Intelligence", description: "Gain insights into business relationships and transaction patterns across your industry network." },
  { id: 5, icon: GaugeCircle, title: "MSME Credit Score", description: "Comprehensive scoring system specifically designed for MSMEs, helping you make informed business decisions." },
  { id: 6, icon: UserCheck, title: "Buyer Reputation Insights", description: "Detailed reports on buyer behavior, payment history, and reliability to evaluate potential business partners." },
  { id: 7, icon: Database, title: "ERP Solution", description: "Integrated enterprise resource planning system to streamline your business operations and data management." },
  { id: 8, icon: ShoppingCart, title: "Ecommerce Page", description: "Create and manage your online store with integrated payment processing and inventory management." },
  { id: 9, icon: Calculator, title: "Wood Calculator", description: "Specialized calculator for wood industry professionals to estimate quantities, costs, and material requirements." },
  { id: 10, icon: Calculator, title: "Cost Calculators", description: "Comprehensive cost calculation tools for various industries to estimate project costs and material expenses." },
  { id: 11, icon: Tags, title: "Price Management System", description: "Dynamic pricing system to manage product prices, discounts, and promotions across multiple channels." },
  { id: 12, icon: AreaChart, title: "Market Trend Analysis", description: "Analyze evolving market trends, competitor strategies, and pricing behavior to stay ahead in your industry." },
];

const AccordionItem = ({ feature, isOpen, onToggle }: AccordionItemProps) => { // Typed the component's props
  return (
    <div className={`border-2 rounded-lg transition-all duration-300 bg-white shadow-sm hover:shadow-md ${
      isOpen ? 'border-[#f05134]' : 'border-gray-200'
    }`}>
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          <feature.icon className="w-6 h-6 flex-shrink-0 text-[#f05134]" />
          <span className="font-semibold text-base md:text-lg text-[#262626]">
            {feature.title}
          </span>
        </div>
        <span className={`text-3xl font-light transition-transform duration-300 ${
          isOpen ? 'transform rotate-45 text-[#f05134]' : 'text-gray-500'
        }`}>
          +
        </span>
      </button>
      <div
        className={`px-5 text-gray-600 overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        {feature.description}
      </div>
    </div>
  );
};

export function Features() {
  const [openId, setOpenId] = useState<number | null>(features[0].id);

  const toggleAccordion = (id: number) => { // 3. Typed the 'id' parameter
    setOpenId(openId === id ? null : id);
  };

  const col1 = features.slice(0, 6);
  const col2 = features.slice(6, 12);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className={`${montserrat.className} text-[#262626] text-center text-3xl md:text-5xl font-bold leading-tight`}>
          Key Features
        </h2>
        <p className="text-center text-gray-600 text-lg md:text-xl mt-4 max-w-2xl mx-auto">
          Comprehensive tools to secure and streamline your business transactions
        </p>
        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {col1.map((feature) => (
              <AccordionItem
                key={feature.id}
                feature={feature}
                isOpen={openId === feature.id}
                onToggle={() => toggleAccordion(feature.id)}
              />
            ))}
          </div>
          <div className="space-y-4">
            {col2.map((feature) => (
              <AccordionItem
                key={feature.id}
                feature={feature}
                isOpen={openId === feature.id}
                onToggle={() => toggleAccordion(feature.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}