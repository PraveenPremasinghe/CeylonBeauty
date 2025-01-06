"use client";
import React from "react";
import { ArrowRightIcon } from '@heroicons/react/outline';
import { motion } from "framer-motion";


const Introduction = () => {
  return (
    <>

      <section className="introduction-bg">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8  py-8 md:flex-row">
        <div className="flex-1">
          <div className="p-5 text-left">
            <div className="font-semibold uppercase leading-tight text-white">
             <div className="text-3xl mb-3 font-modern"> "A million smiles, one island "<sup className="text-3xl mx-2 font-extrabold uppercase tracking-widest">visit</sup> </div>
              <span className="sri-lanka-text  block text-[8vw] font-extrabold uppercase leading-[90%]">
                Sri Lanka
              </span>
              <span className=" block sri-lanka-gradient tracking-widest text-[10vw] font-extrabold uppercase ">
                today
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 text-center  ">
          <p className="text-white text-4xl varela-round-regular bt-3 leading-snug">
            &#x2036;
            Discover Sri Lanka with Jagath
            Explore the breathtaking beauty, rich culture,
            and hidden gems of Sri Lanka with Jagath,
            your expert local guide. From lush tea plantations to
            ancient temples, every tour is crafted to your interests.
            &#x2036;
          </p>

        </div>
        </div>
      </section>
    </>
  );
};

export default Introduction;
