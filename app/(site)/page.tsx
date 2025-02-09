

import { Metadata } from "next";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Testimonial from "@/components/Testimonial";
import TravelCategories from "@/components/TravelCategories";
import React from "react";
import Introduction from "@/components/Introduction/introduction";
import TravelStories from "@/components/TravelStories/travel-stories";
import Link from "next/link";






export const metadata: Metadata = {
  title: " CeylonBeauty | Explore the Best of Sri Lanka with Expert Tours",
  description: " Discover the stunning beauty of Sri Lanka with CeylonBeauty, your trusted tour guide. From breathtaking landscapes to rich cultural experiences, we offer personalized tours tailored to your interests. Join us for an unforgettable journey through Sri Lanka’s most iconic attractions and hidden gems",
  // other metadata
};

export default function Home() {
  // @ts-ignore
  return (

    <main>



      <Hero />
       <Brands />
      <TravelCategories/>
      <Introduction/>
      <About />
<TravelStories/>
      <FAQ />
      <Testimonial />
      <Contact />


    </main>

  );
}
