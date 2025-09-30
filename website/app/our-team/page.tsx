"use client";

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { montserrat } from "@/app/fonts";
import { Twitter, Linkedin, Mail } from "lucide-react";


// --- TYPE DEFINITIONS for team members ---
interface TeamMember {
  id: number;
  name: string;
  designation: string;
  description: string;
  imageUrl: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    mail?: string;
  }
}

interface Partner {
  id: number;
  logoUrl: string;
  alt: string;
}

// --- Data for the Team Section ---
const teamMembers: TeamMember[] = [
    { id: 1, name: "B. N. Mishra", designation: "Co-Founder & CEO", description: "24 Years in Finance, Technology & Operation", imageUrl: "/team1.png", socials: { linkedin: "https://linkedin.com/in/badrinarayan-mishra-40617b190" } },
    { id: 2, name: "Nagji B Rabari", designation: "Co-Founder", description: "20+ Years Experience in Business Administration", imageUrl: "/team2.png", socials: { linkedin: "https://linkedin.com/in/nagji-b-rabari-a33981299" } },
    { id: 3, name: "Ramji B Rabari", designation: "Co-Founder", description: "15+ Years Experience in Supply Chain & Lead Management", imageUrl: "/team3.png", socials: { linkedin: "https://linkedin.com/in/ramji-badhabhai-rabari-180182343" } },
];

const operationsTeamMembers: TeamMember[] = [
    { id: 1, name: "Pritesh Patel", designation: "Vice President (Operation)", description: "12+ years in operations management, leading day-to-day operations and ensuring seamless service delivery to MSMEs.", imageUrl: "/pritesh_patel.jpeg", socials: { linkedin: "#" } },
    { id: 2, name: "Ketan Patel", designation: "Vice President (Marketing)", description: "MSME onboarding and ensuring optimal platform utilization.", imageUrl: "/ketan_patel.jpeg", socials: { linkedin: "#" } }
];

const advisoryTeamMembers: TeamMember[] = [
    { id: 1, name: "Mr. Hemchandra Yadav", designation: "Director of Shivam Seatrans Pvt Ltd, Go-to-Market, Mentor & Industry Liaison", description: "Vice President, Kandla Timber Association, Advising Solviser on MSME onboarding, market partnerships, and ground-level execution.", imageUrl: "/hemchand-yadav.png", socials: { linkedin: "https://linkedin.com/in/hemchandra-yadav-ba7313126" } },
    { id: 2, name: "Mr. Abhimanyu Rathi", designation: "Advisor – Legal, Fundraising", description: "Founder & CEO, Renewcred. Provides key support in structuring investor documents, pitch development, and legal compliance.", imageUrl: "/Abhimanyu.jpeg", socials: { linkedin: "https://linkedin.com/in/abhimanyurathi" } },
    { id: 3, name: "Ms. Vitasta Tiwari", designation: "Strategic Adviser", description: "NITI Aayog, (GoI) Public Policy APAC. Expert in startup growth strategies, policy insights, and long-term vision.", imageUrl: "/vtiwari.png", socials: { linkedin: "https://linkedin.com/in/vitastatiwari" } },
];

const technologyPartners: Partner[] = [
    { id: 1, logoUrl: "/partners/acic-bmu.png", alt: "ACIC BMU Foundation" },
    { id: 2, logoUrl: "/partners/aic-jklu.png", alt: "AIC JKLU" },
    { id: 3, logoUrl: "/partners/aic-rru.png", alt: "AIC RRU Incubation Foundation" },
    { id: 4, logoUrl: "/partners/aic-vgu.png", alt: "AIC VGU" },
    { id: 5, logoUrl: "/partners/aic-rntu.png", alt: "AIC RNTU" },
    { id: 6, logoUrl: "/partners/civf.png", alt: "CIVF" },
    { id: 7, logoUrl: "/partners/derbi.png", alt: "DERBI Foundation" },
    { id: 8, logoUrl: "/partners/iit-delhi.png", alt: "AIC IIT Delhi" },
];

// --- Reusable Team Member Card Component ---
const TeamMemberCard = ({ member }: { member: TeamMember }) => (
  <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl group">
    <div className="relative w-full h-80">
      <img 
        src={member.imageUrl} 
        alt={`Photo of ${member.name}`} 
        className="absolute top-0 left-0 w-full h-full object-contain transition-all duration-300 group-hover:grayscale-0"
      />
    </div>
    <div className="p-6 text-center">
      <h3 className={`${montserrat.className} text-2xl font-bold text-[#262626]`}>{member.name}</h3>
      <p className="text-md text-[#f05134] font-semibold mt-1">{member.designation}</p>
      <p className="text-sm text-gray-500 mt-3 h-12">{member.description}</p>
      {member.socials && (
        <div className="flex justify-center items-center gap-4 border-t border-gray-200 pt-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {member.socials.linkedin && <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn`} className="text-gray-400 hover:text-[#f05134] transition-colors"><Linkedin className="w-6 h-6" /></a>}
          {member.socials.twitter && <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Twitter`} className="text-gray-400 hover:text-[#f05134] transition-colors"><Twitter className="w-6 h-6" /></a>}
          {member.socials.mail && <a href={`mailto:${member.socials.mail}`} aria-label={`Email ${member.name}`} className="text-gray-400 hover:text-[#f05134] transition-colors"><Mail className="w-6 h-6" /></a>}
        </div>
      )}
    </div>
  </div>
);


export default function OurTeamPage() {
  return (
    <>
      <div className="relative z-50">
        <Header />
      </div>
      
      <main className="-mt-20 md:-mt-24">
        {/* Section 1: Our Team Header */}
        <section className="bg-[#262626] text-white pt-36 pb-20 md:pt-48 md:pb-28">
          <div className="container mx-auto px-4 text-center">
            <h1 className={`${montserrat.className} text-4xl md:text-6xl font-bold`}>Our Team</h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-slate-300">
              Solviser is built by a passionate team of strategists, developers, designers, analysts, and industry experts. Together, we're building a trustworthy platform to empower MSMEs.
            </p>
          </div>
        </section>

        {/* Section 2: Founders */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className={`${montserrat.className} text-3xl md:text-5xl font-bold text-[#262626]`}>Founders</h2>
              <p className="text-gray-600 text-lg md:text-xl mt-4">Meet the experts behind Solviser.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Operations & Advisory Teams */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            {/* Operations Team */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className={`${montserrat.className} text-3xl md:text-5xl font-bold text-[#262626]`}>Operations Team</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-24">
              {operationsTeamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>

            {/* Advisory Team */}
            {/* <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className={`${montserrat.className} text-3xl md:text-5xl font-bold text-[#262626]`}>Advisory Team</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {advisoryTeamMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div> */}
          </div>
        </section>

       {/* Section 4: Our Technology Partners */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className={`${montserrat.className} text-3xl md:text-5xl font-bold text-[#262626]`}>Our Technology Partners</h2>
              <p className="text-gray-600 text-lg md:text-xl mt-4">
                Solviser’s growth and success is greatly attributed to these esteemed organizations. We are grateful for their support.
              </p>
            </div>
            
            {/* --- NEW: Infinite Scrolling Marquee --- */}
            <div className="relative w-full overflow-hidden">
              <div className="flex animate-marquee hover:pause">
                {/* Render the list of partners twice for a seamless loop */}
                {technologyPartners.concat(technologyPartners).map((partner, index) => (
                  <div key={`${partner.id}-${index}`} className="flex-shrink-0 w-1/2 md:w-1/4 p-6 flex justify-center items-center h-40">
                    <div className="relative w-full h-24">
                      <img 
                        src={partner.logoUrl} 
                        alt={partner.alt} 
                        className="absolute top-0 left-0 w-full h-full object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

