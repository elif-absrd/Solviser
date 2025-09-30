// File: apps/website/src/components/Safeguard.tsx

import { Database, ClipboardCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <Database size={32} />,
    title: 'Comprehensive Buyer Database',
    description: 'Access a shared blacklist of high-risk buyers reported by businesses worldwide.',
  },
  {
    icon: <ClipboardCheck size={32} />,
    title: 'Verified & Fair Process',
    description: 'All reports go through an admin verification process to ensure accuracy and prevent misuse.',
  },
  {
    icon: <ShieldCheck size={32} />,
    title: 'Real-Time Alerts',
    description: 'Receive instant notifications if a flagged buyer attempts to do business with you.',
  },
];

export function Safeguard() {
  return (
    // UPDATED: Background set to your brand's dark gray color
    <section className="bg-[#262626] text-white py-20 md:py-28">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left Column: Text Content */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            A powerful tool to safeguard your business from fraudulent buyers.
          </h2>
          <p className="mt-6 text-lg text-gray-400">
            Highlight the core functionalities of the AI-Based Risk Assessment system.
          </p>
          {/* UPDATED: Button color aligned with your brand's orange */}
          <Link
            href="/request-demo"
            className="mt-10 inline-block bg-[#f05134] hover:bg-white text-white hover:text-[#f05134] font-semibold px-8 py-3 rounded-md transition-colors duration-300 border-2 border-transparent hover:border-[#f05134]"
          >
            Try AI Risk Assessment Now
          </Link>
        </div>

        {/* Right Column: Staggered Features List */}
        <div>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex items-start space-x-6 ${index > 0 ? 'mt-12' : 'mt-8 md:mt-0'}`}
            >
              {/* UPDATED: Icon text color aligned with your brand's orange */}
              <div className="flex-shrink-0 flex items-center justify-center h-20 w-20 bg-white rounded-full text-[#f05134]">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}