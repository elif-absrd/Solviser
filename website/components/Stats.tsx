// File: apps/website/src/components/Stats.tsx

import { TrendingUp, Smile, Users } from 'lucide-react'; // Added Users icon for the first card
import { montserrat } from "@/app/fonts";

export function Stats() {
  return (
    // Changed background to white and primary text to the brand's dark gray
    <section className="bg-[#262626] text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center"> {/* Centered the header text */}
          <h2 className={`${montserrat.className} text-4xl md:text-5xl font-bold mb-4`}>
            Automate, Optimize, Grow
          </h2>
          {/* Updated paragraph text color for better readability on white */}
          <p className="text-lg text-white">
            Solviser simplifies <span className="text-[#f05134] font-semibold">risk assessment</span>, <span className="text-[#f05134] font-semibold">legal contracts</span>, and <span className="text-[#f05134] font-semibold">automated accounting</span> so you can focus on growing your business with confidence and trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          
          {/* Stat 1: Trusted by MSMEs */}
          {/* Updated card style for the light theme */}
          <div className="bg-[#f05134] p-8 rounded-lg shadow-md border border-gray-100">
            <Users size={48} className="text-white mb-4"/>
            <h3 className="text-2xl font-bold">Trusted by 12,500+ MSMEs</h3>
            <p className="text-white mt-2">Helping businesses to automate, optimize, and grow.</p>
          </div>

          {/* Stat 2: Risk Assessments */}
          <div className="bg-[#f05134] p-8 rounded-lg shadow-md border border-gray-100">
            <TrendingUp size={48} className="text-white mb-4"/>
            <h3 className="text-2xl font-bold">10M+ Risk Assessments</h3>
            <p className="text-white mt-2">Analyzing millions of data points to secure transactions.</p>
          </div>
          
          {/* Stat 3: Customer Satisfaction */}
          <div className="bg-[#f05134] p-8 rounded-lg shadow-md border border-gray-100">
            <Smile size={48} className="text-white mb-4"/>
            <h3 className="text-2xl font-bold">95% Satisfaction Rate</h3>
            <p className="text-white mt-2">Committed to providing the best service and support.</p>
          </div>
        </div>
      </div>
    </section>
  );
}