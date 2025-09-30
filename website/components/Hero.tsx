// File: apps/website/src/components/Hero.tsx

import { Play } from 'lucide-react';
import { montserrat } from "@/app/fonts";
import Link from 'next/link';

export function Hero() {
  return (
    <section
      className="relative bg-cover bg-center h-screen text-white flex items-center bg-no-repeat lg:bg-right overflow-hidden"
      style={{ backgroundImage: "url('/banner.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative z-10 container mx-auto px-6 text-center lg:text-left">
        <div className="max-w-3xl mx-auto lg:mx-0">
          
          <p className="text-lg md:text-xl font-semibold text-[#f05134] mb-2">
            Your Gateway to Risk-Free Business Growth
          </p>
          
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 ${montserrat.className}`}>
            Empowering Indian MSMEs with AI-Driven Risk Assessment Tools
          </h1>
          
          <p className="text-lg md:text-xl mb-8">
            Secure your business with advanced analytics and trusted buyer insights.
          </p>
          
          {/* --- UPDATED: Button is now a link --- */}
          <Link href="/signup">
            <button className="group bg-[#f05134] hover:bg-white text-white hover:text-[#f05134] font-bold py-3 px-6 rounded-md text-lg transition-colors duration-300 flex items-center space-x-2 mx-auto lg:mx-0 border-2 border-transparent hover:border-[#f05134]">
              <Play size={20} className="fill-white group-hover:fill-[#f05134] transition-colors duration-300" />
              <span>Get Started</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}