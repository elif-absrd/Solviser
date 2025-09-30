// File: apps/website/src/components/HowItWorks.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { montserrat } from "@/app/fonts";
import { UserCheck, DatabaseZap, SearchCheck, FileText } from "lucide-react";

// The data for each step in the process
const steps = [
  {
    id: 1,
    icon: UserCheck,
    title: "Onboarding",
    description: "Verify your business account seamlessly using your GST/PAN.",
    image: "/onboarding.png",
  },
  {
    id: 2,
    icon: DatabaseZap,
    title: "Data Sync",
    description: "Connect your business data or instantly search for partners.",
    image: "/datasync.png",
  },
  {
    id: 3,
    icon: SearchCheck,
    title: "Analysis & Alerts",
    description: "Our AI assesses payment history and sets intelligent risk alerts.",
    image: "/analysis.png",
  },
  {
    id: 4,
    icon: FileText,
    title: "Alerts & Reports",
    description: "Get real-time insights and actionable reports on your dashboard.",
    image: "/reports.png",
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(steps[0]);

  return (
    // UPDATED: Background changed to your brand's dark gray
    <section className="bg-[#262626] py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          {/* UPDATED: Heading text changed to white */}
          <h2 className={`${montserrat.className} text-4xl md:text-5xl font-bold text-white`}>
            How It Works
          </h2>
          {/* UPDATED: Paragraph text changed to a light gray for readability */}
          <p className="text-lg text-gray-300 mt-4">
            A simple, powerful, and automated process to safeguard your business.
          </p>
        </div>

        {/* Main interactive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-16">
          
          {/* Left Column: Image Display */}
          {/* UPDATED: Image card background to a subtle dark gray */}
          <div className="w-full h-96 relative rounded-xl overflow-hidden bg-gray-900/50">
            <Image
              key={activeStep.id}
              src={activeStep.image}
              alt={activeStep.title}
              fill
              className="object-cover animate-fade-in"
            />
          </div>

          {/* Right Column: Clickable Steps/Tabs */}
          <div className="flex flex-col space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                onClick={() => setActiveStep(step)}
                // UPDATED: Tab styles for dark theme
                className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform ${
                  activeStep.id === step.id
                    ? 'bg-white/10 border-l-4 border-[#f05134]' // Active state
                    : 'bg-transparent hover:bg-white/5' // Inactive state
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full transition-colors duration-300 ${
                    // Active icon is orange (as requested), inactive is a darker gray
                    activeStep.id === step.id ? 'bg-[#f05134] text-white' : 'bg-gray-700 text-gray-300'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    {/* UPDATED: Step title text to white */}
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    {/* UPDATED: Step description text to a light gray */}
                    <p className="text-gray-400 mt-1">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}