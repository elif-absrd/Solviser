// File: apps/website/src/components/CTA.tsx
import Link from 'next/link';
import { montserrat } from "@/app/fonts"; // Added for font consistency

export function CTA() {
  return (
    // UPDATED: Background changed to your brand's dark gray
    <section className="bg-[#262626] text-white">
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className={`${montserrat.className} text-3xl md:text-4xl font-bold mb-4`}>
          Ready to Empower Your Business?
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Join hundreds of other businesses who are securing their future with our AI-driven risk assessment tools. Get started today.
        </p>
        <Link
          href="/signup"
          className="bg-[#f05134] hover:bg-white text-white hover:text-[#f05134] font-bold py-4 px-8 rounded-md text-lg transition-colors duration-300 inline-block border-2 border-transparent hover:border-[#f05134]"
        >
          Sign Up for Free
        </Link>
      </div>
    </section>
  );
}