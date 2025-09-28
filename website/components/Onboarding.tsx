// File: apps/website/src/components/Onboarding.tsx

import { UserPlus, Lightbulb, TrendingUp } from 'lucide-react';
import { montserrat } from "@/app/fonts"; // Assuming you might want to use this for consistency

const steps = [
  { icon: <UserPlus className="h-12 w-12 md:h-16 md:w-16" />, title: 'Sign Up and Explore', description: 'Create your free account in minutes and dive into Solviser\'s suite of powerful tools tailored for MSMEs.' },
  { icon: <Lightbulb className="h-12 w-12 md:h-16 md:w-16" />, title: 'Customize to Your Needs', description: 'Choose the solutions that fit your business, from risk assessment to automated accounting and more.' },
  { icon: <TrendingUp className="h-12 w-12 md:h-16 md:w-16" />, title: 'Streamline, Secure, and Scale', description: 'Start optimizing your operations, reducing risks, and confidently growing your business with Solviser.' },
];

export function Onboarding() {
  return (
    // UPDATED: Background changed to pure white
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          {/* UPDATED: Main heading text color to brand dark gray */}
          <h2 className={`${montserrat.className} text-3xl md:text-5xl font-bold text-[#262626]`}>
            Seamless Onboarding in Three Simple Steps
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Getting started with Solviser is quick and hassle-free. Follow these three simple steps to streamline your operations, reduce risks, and grow with confidence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center">
          {steps.map((step, index) => (
            <div key={index}>
              {/* UPDATED: Icon container colors to brand orange */}
              <div className="flex items-center justify-center h-28 w-28 md:h-40 md:w-40 mx-auto mb-6 border-2 border-[#f05134] text-[#f05134] rounded-full bg-[#f05134] text-white shadow-sm">
                {step.icon}
              </div>
              {/* UPDATED: Step title text color to brand dark gray */}
              <h3 className="text-xl md:text-2xl font-bold text-[#262626] mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}