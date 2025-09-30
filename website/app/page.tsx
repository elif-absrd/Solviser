// File: apps/website/src/app/page.tsx
import '../styles/Home.css';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Stats } from '@/components/Stats';
import { HowItWorks } from '@/components/HowItWorks';
import { Onboarding } from '@/components/Onboarding';
import { Safeguard } from '@/components/Safeguard';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Safeguard /> {/* 2. Add it to the page layout */}
        <Features />
        <HowItWorks />
        <Onboarding />
        <CTA />
      </main>
      <Footer />
    </>
  );
}