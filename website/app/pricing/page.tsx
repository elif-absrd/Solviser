"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowRight, CheckCircle2, ChevronDown, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { montserrat } from "@/app/fonts";

// Define the type for the Plan data fetched from the API
interface Plan {
  id: string;
  name: string;
  priceInr: number;
  isFree: boolean;
  razorpayPlanId: string | null;
<<<<<<< HEAD
  features: {
    list: string[];
    bestFor: string;
  } | null;
=======
  features: string | null; // Changed from object to string (JSON)
>>>>>>> master
}

// Define the type for the Pricing Card props
type PlanProps = {
  plan: Plan;
  isSelected?: boolean;
  onSelect: (name: string) => void;
  onPurchase: (planId: string) => void;
  onFreePlan: () => void; // New handler for the free plan
  isLoading: boolean;
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
};

// Reusable Pricing Plan Card Component
const PricingCard: React.FC<PlanProps> = ({ plan, isSelected = false, onSelect, onPurchase, onFreePlan, isLoading, authStatus }) => {
    const isFreePlan = plan.isFree;
    const buttonText = isFreePlan ? 'Sign Up for Free' : 'Get Started';

<<<<<<< HEAD
=======
    // Parse features JSON string if it exists
    const parsedFeatures = plan.features ? JSON.parse(plan.features) : null;

>>>>>>> master
    const handleClick = () => {
        if (isFreePlan) {
            onFreePlan();
        } else {
            onPurchase(plan.id);
        }
    };

    return (
      <div 
        onClick={() => onSelect(plan.name)}
        className={`rounded-xl border p-8 flex flex-col h-full transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${isSelected ? 'bg-white text-[#262626] border-gray-200 scale-105 shadow-2xl' : 'bg-white/5 text-white border-white/10'}`}
      >
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <div className="mt-6">
          <span className="text-4xl font-extrabold">
            {isFreePlan ? '₹0' : `₹${new Intl.NumberFormat('en-IN').format(plan.priceInr / 100)}`}
          </span>
          <span className={`ml-2 ${isSelected ? 'text-gray-500' : 'text-gray-400'}`}>/ Year</span>
        </div>
        <ul className="mt-8 space-y-4 flex-grow">
<<<<<<< HEAD
          {plan.features?.list.map((feature, index) => (
=======
          {parsedFeatures?.list.map((feature: string, index: number) => (
>>>>>>> master
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 size={20} className={`mt-1 flex-shrink-0 ${isSelected ? 'text-[#f05134]' : 'text-[#f05134]'}`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className={`mt-8 pt-4 border-t ${isSelected ? 'border-gray-200' : 'border-white/10'}`}>
<<<<<<< HEAD
            <p className={`text-xs font-semibold ${isSelected ? 'text-gray-700' : 'text-gray-300'}`}>👉 {plan.features?.bestFor}</p>
=======
            <p className={`text-xs font-semibold ${isSelected ? 'text-gray-700' : 'text-gray-300'}`}>👉 {parsedFeatures?.bestFor}</p>
>>>>>>> master
        </div>
        <button 
          onClick={handleClick} 
          disabled={isLoading || (!isFreePlan && !plan.razorpayPlanId) || authStatus === 'loading'}
          className={`mt-6 w-full text-center font-semibold py-3 px-6 rounded-lg transition-colors duration-300 border-2 disabled:opacity-50 disabled:cursor-not-allowed ${isSelected ? 'bg-[#f05134] text-white border-transparent hover:bg-white hover:text-[#f05134] hover:border-[#f05134]' : 'bg-white text-[#262626] border-white hover:bg-[#262626] hover:text-white hover:border-[#262626]'}`}
        >
          {isLoading && isSelected ? 'Processing...' : (authStatus === 'loading' ? 'Verifying...' : buttonText)}
        </button>
      </div>
    );
};

// Main Page Component
const PricingPage = () => {
    const router = useRouter();
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [selectedPlan, setSelectedPlan] = useState<string>('Business Pro');
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [user, setUser] = useState<{name: string, email: string} | null>(null);
    const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const plansResponse = await api.get('/subscriptions/plans');
                setPlans(plansResponse.data);
                try {
                    const userResponse = await api.get('/auth/me', { _isPublic: true });
                    setUser(userResponse.data);
                    setAuthStatus('authenticated');
                } catch (userError: any) {
                    if (userError.response?.status === 401) { setAuthStatus('unauthenticated'); } 
                    else { throw userError; }
                }
            } catch (err) {
                setError("Could not load pricing plans.");
                setAuthStatus('unauthenticated');
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const handleFreePlanAction = () => {
        const appUrl = process.env.NEXT_PUBLIC_WEBAPP_URL || '';
        if (authStatus === 'authenticated') {
            router.push(`${appUrl}/dashboard`);
        } else {
            router.push('/signup');
        }
    };

    const handlePurchase = async (planId: string) => {
        if (authStatus !== 'authenticated') {
            router.push('/signin?redirect=/pricing');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/subscriptions/create', { planId });
            
            const options = {
                key: data.keyId,
                subscription_id: data.subscriptionId,
                name: "Solviser Subscription",
                description: "Yearly Plan",
                handler: function (response: any) {
                    alert("Payment successful! Your plan will be activated shortly.");
                    const appUrl = process.env.NEXT_PUBLIC_WEBAPP_URL || '';
                    router.push(`${appUrl}/dashboard`);
                },
                prefill: { name: user?.name, email: user?.email },
                theme: { color: "#f05134" }
            };
            
            const rzpay = new (window as any).Razorpay(options);
            rzpay.open();
        } catch (err: any) {
            setError(err.response?.data?.error || "Could not initiate payment.");
        } finally {
            setIsLoading(false);
        }
    };

    const faqs = [
        { q: "Is there a free trial available?", a: "We may offer a free trial for our Business plan from time to time. Please check the plan details for current offers." },
        { q: "Can I change my plan later?", a: "Absolutely. You can upgrade your plan at any time from your account dashboard. Changes will be prorated." },
        { q: "What kind of support is included?", a: "All paid plans come with email and chat support. Our Enterprise plan includes a dedicated account manager and priority support." },
        { q: "Are these prices monthly or annual?", a: "All listed prices are for an annual subscription, providing you with the best value for a full year of service." }
    ];

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#262626]">
                <RotateCcw className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

  return (
    <div className="font-sans flex flex-col min-h-screen bg-[#262626]">
      <Header />
      <main className="flex-grow">
        <section className="bg-[#262626] text-white">
          <div className="container mx-auto px-6 py-24 text-center">
            <h1 className={`${montserrat.className} text-4xl md:text-5xl font-extrabold leading-tight`}>
              Solviser Pricing Plans
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
              Choose a plan that scales with your business. All plans are billed annually with no hidden fees.
            </p>
          </div>
        </section>

        <section className="bg-[#262626] py-20">
          <div className="container mx-auto px-6">
            {error && <p className="text-center text-red-400 mb-4">{error}</p>}
            {/* --- THE FIX IS HERE: Updated grid classes for 5 items --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-8 max-w-[1600px] mx-auto items-start justify-center">
              {plans.map(plan => (
                  <PricingCard 
                    key={plan.name} 
                    plan={plan}
                    isSelected={selectedPlan === plan.name}
                    onSelect={setSelectedPlan}
                    onPurchase={handlePurchase}
                    onFreePlan={handleFreePlanAction}
                    isLoading={isLoading}
                    authStatus={authStatus}
                  />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white/5 py-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className={`${montserrat.className} text-3xl font-bold text-white`}>Frequently Asked Questions</h2>
                    <p className="mt-2 text-gray-400">Have questions? We have answers.</p>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-white/10 rounded-lg bg-white/5">
                            <button 
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full flex justify-between items-center p-6 text-left"
                            >
                                <span className="font-semibold text-lg text-white">{faq.q}</span>
                                <ChevronDown className={`transition-transform text-white ${openFaq === index ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-64' : 'max-h-0'}`}>
                                <p className="p-6 pt-0 text-gray-400">{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="bg-[#262626] py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className={`${montserrat.className} text-3xl font-bold text-white`}>Need a Custom Solution?</h2>
            <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
              We can tailor a plan with specific features, integrations, and support to meet the unique demands of your enterprise.
            </p>
            <Link href="/request-demo" className="group mt-8 bg-[#f05134] hover:bg-white text-white hover:text-[#f05134] font-bold py-3 px-8 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto lg:mx-0 border-2 border-transparent hover:border-[#f05134]">
                <span>Contact Sales</span>
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;