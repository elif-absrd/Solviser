

// File: apps/website/src/components/OurTeam.tsx
"use client";
import { JSX, useState } from "react";
import { montserrat } from "@/app/fonts";
import { Twitter, Linkedin, Mail } from "lucide-react";

interface TeamMember {
  id: number;
  icon: JSX.Element;
  title: string;
  designation: string;
  description: string;
  bgImg?: string | JSX.Element;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    icon: (<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shield-virus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M269.4 2.9C265.2 1 260.7 0 256 0s-9.2 1-13.4 2.9L54.3 82.8c-22 9.3-38.4 31-38.3 57.2c.5 99.2 41.3 280.7 213.6 363.2c16.7 8 36.1 8 52.8 0C454.7 420.7 495.5 239.2 496 140c.1-26.2-16.3-47.9-38.3-57.2L269.4 2.9zM256 112c8.8 0 16 7.2 16 16c0 33 39.9 49.5 63.2 26.2c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6C334.5 200.1 351 240 384 240c8.8 0 16 7.2 16 16s-7.2 16-16 16c-33 0-49.5 39.9-26.2 63.2c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0C311.9 334.5 272 351 272 384c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-33-39.9-49.5-63.2-26.2c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6C177.5 311.9 161 272 128 272c-8.8 0-16-7.2-16-16s7.2-16 16-16c33 0 49.5-39.9 26.2-63.2c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0C200.1 177.5 240 161 240 128c0-8.8 7.2-16 16-16zM232 256a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm72 32a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z"></path></svg>),
    title: "B. N. Mishra",
    designation: "Co-Founder & CEO",
    description: "24 Years in Finance, Technology & Operation",
    bgImg: "/team1.png",
  },
  {
    id: 2,
    icon: (<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shield-virus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M269.4 2.9C265.2 1 260.7 0 256 0s-9.2 1-13.4 2.9L54.3 82.8c-22 9.3-38.4 31-38.3 57.2c.5 99.2 41.3 280.7 213.6 363.2c16.7 8 36.1 8 52.8 0C454.7 420.7 495.5 239.2 496 140c.1-26.2-16.3-47.9-38.3-57.2L269.4 2.9zM256 112c8.8 0 16 7.2 16 16c0 33 39.9 49.5 63.2 26.2c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6C334.5 200.1 351 240 384 240c8.8 0 16 7.2 16 16s-7.2 16-16 16c-33 0-49.5 39.9-26.2 63.2c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0C311.9 334.5 272 351 272 384c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-33-39.9-49.5-63.2-26.2c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6C177.5 311.9 161 272 128 272c-8.8 0-16-7.2-16-16s7.2-16 16-16c33 0 49.5-39.9 26.2-63.2c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0C200.1 177.5 240 161 240 128c0-8.8 7.2-16 16-16zM232 256a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm72 32a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z"></path></svg>),
    title: "Nagji B Rabari",
    designation: "Co-Founder",
    description: "20+ Years Experience in Business Administration",
    bgImg: "/team2.png",
  },
  {
    id: 3,
    icon: (<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shield-virus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M269.4 2.9C265.2 1 260.7 0 256 0s-9.2 1-13.4 2.9L54.3 82.8c-22 9.3-38.4 31-38.3 57.2c.5 99.2 41.3 280.7 213.6 363.2c16.7 8 36.1 8 52.8 0C454.7 420.7 495.5 239.2 496 140c.1-26.2-16.3-47.9-38.3-57.2L269.4 2.9zM256 112c8.8 0 16 7.2 16 16c0 33 39.9 49.5 63.2 26.2c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6C334.5 200.1 351 240 384 240c8.8 0 16 7.2 16 16s-7.2 16-16 16c-33 0-49.5 39.9-26.2 63.2c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0C311.9 334.5 272 351 272 384c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-33-39.9-49.5-63.2-26.2c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6C177.5 311.9 161 272 128 272c-8.8 0-16-7.2-16-16s7.2-16 16-16c33 0 49.5-39.9 26.2-63.2c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0C200.1 177.5 240 161 240 128c0-8.8 7.2-16 16-16zM232 256a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm72 32a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z"></path></svg>),
    title: "Ramji B Rabari",
    designation: "Co-Founder",
    description: "15+ Years Experience in Supply Chain & Lead Management",
    bgImg: "/team3.png",
  },
];

export function OurTeam() {
  const [startIndex, setStartIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const panelsPerView = 4;

  const handleNext = () => {
    if (activeIndex < teamMembers.length - 1) {
      setActiveIndex(activeIndex + 1);
      if (activeIndex + 1 >= startIndex + panelsPerView) {
        setStartIndex(startIndex + 1);
      }
    } else {
      setActiveIndex(0);
      setStartIndex(0);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      if (activeIndex - 1 < startIndex) {
        setStartIndex(startIndex - 1);
      }
    } else {
      setActiveIndex(teamMembers.length - 1);
      setStartIndex(Math.max(teamMembers.length - panelsPerView, 0));
    }
  };

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className={`${montserrat.className} sec-head text-gray-900 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight`}
          >
            Our Team
          </h2>
          <p className="text-gray-600 text-xl mt-4">
            Meet the experts behind Solviser
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 items-stretch">
          {teamMembers
            .slice(startIndex, startIndex + panelsPerView)
            .map((member) => (
              <div className="bg-white rounded-xl shadow-md text-center flex flex-col" key={member.id}>
                <div className="memberimg -mt-12">
                  {typeof member.bgImg === "string" ? (
                    <img src={member.bgImg} alt={member.title} className="w-[18rem] h-[18rem] mx-auto object-contain"/>
                  ) : (
                    member.bgImg
                  )}
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-gray-900">{member.title}</h3>
                  <p className="text-lg text-gray-600">{member.designation}</p>
                  <p className="text-base text-gray-500 mt-2 max-w-xs mx-auto">{member.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 justify-items-center bg-gray-200 p-3 mt-5">
                  <a href="#" className="p-2 text-white rounded-full bg-[#ff5733] hover:bg-[#262626] hover:text-white transition">
                    <Linkedin className="w-7 h-7" />
                  </a>
                  <a href="#" className="p-2 text-white rounded-full bg-[#ff5733] hover:bg-[#262626] hover:text-white transition">
                    <Twitter className="w-7 h-7" />
                  </a>
                  <a href="#" className="p-2 text-white rounded-full bg-[#ff5733] hover:bg-[#262626] hover:text-white transition">
                    <Mail className="w-7 h-7" />
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
