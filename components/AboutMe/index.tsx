"use client";
import React, { useEffect, useRef, useState } from "react";
import SectionHeader from "@/components/Common/SectionHeader";
import aboutData from "@/components/About/aboutData";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Globe, Award, ChevronRight } from "lucide-react";




const AboutMe = () => {


  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <>
      <section className="overflow-hidden  mt-10">

        <div className="mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0 ">
          <div className=" ">
              <div className="text-center mb-24">
                <p className=" uppercase tracking-widest text-sm font-medium mb-6 before:content-['—'] before:mr-4 after:content-['—'] after:ml-4">Meet Your Tour Guide</p>
                <h1 className="text-5xl sm:text-7xl font-bold mb-8 tracking-tight text-secondary">Your Expert Guide <br className="hidden sm:block" />to Sri Lanka</h1>
                <p className="text-xl     max-w-2xl mx-auto text-secondary">Embark on a Journey with a Local Expert</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-16   mb-24">
                  <div className="relative aspect-[4/5] bg-secondary rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <img
                      src="/images/user/jaga12.png"
                      alt="Praveen - Sri Lanka Tour Guide"
                      className="w-full h-full object-fill transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                <div  >
                  <div >
                    <h2 className="text-4xl font-bold mb-6 text-secondary">Hi, I'm Jagath Premasinghe 👋</h2>
                    <p className="text-lg leading-relaxed text-secondary   ">
                      With a passion for exploring the beauty and culture of Sri Lanka, I strive to provide an unforgettable experience for all my guests. Whether you're here for the lush landscapes, the rich heritage, or the pristine beaches, I'll guide you through the hidden gems of our island.
                    </p>
                  </div>

                  <div className="space-y-8 mt-8 text-secondary">
                    <div className={`flex items-start gap-6      "animate-fade-up [--delay:400ms]" : ""}`} style={{animationDelay: "400ms"}}>
                      <div className="bg-accent/10 p-4 rounded-2xl">
                        <Award className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Experience</h3>
                        <p className="    leading-relaxed">10+ years guiding tours across Sri Lanka, specializing in cultural heritage and eco-tourism.</p>
                      </div>
                    </div>

                    <div className={`flex items-start gap-6      "animate-fade-up [--delay:600ms]" : ""}`} style={{animationDelay: "600ms"}}>
                      <div className="bg-accent/10 p-4 rounded-2xl">
                        <Globe className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Languages</h3>
                        <p className="    leading-relaxed">Fluent in English, Sinhala, and Tamil. Basic knowledge of French and German.</p>
                      </div>
                    </div>

                    <div className={`flex items-start gap-6      "animate-fade-up [--delay:800ms]" : ""}`} style={{animationDelay: "800ms"}}>
                      <div className="bg-accent/10 p-4 rounded-2xl">
                        <MapPin className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Fun Fact</h3>
                        <p className="    leading-relaxed">My favorite hidden gem is a secluded waterfall in Knuckles Mountain Range, where I've guided over 200 tours.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutMe;
