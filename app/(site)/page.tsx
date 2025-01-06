import { Metadata } from "next";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import Feature from "@/components/Features";
import About from "@/components/About";
import FeaturesTab from "@/components/FeaturesTab";
import FunFact from "@/components/FunFact";
import Integration from "@/components/Integration";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Blog from "@/components/Blog";
import Testimonial from "@/components/Testimonial";
import TravelCategories from "@/components/TravelCategories";
import React from "react";

import Introduction from "@/components/Introduction/introduction";
import TravelStories from "@/components/TravelStories/travel-stories";


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
      {/*<CTA />*/}
<TravelStories/>
      <FAQ />
      <Testimonial />
      {/*<Pricing />*/}
      <Contact />
      {/*<Blog />*/}

    </main>

  );
}
