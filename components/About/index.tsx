"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/Common/SectionHeader";
import React from "react";
import aboutData from "./aboutData";



const About = () => {
  return (
    <>
      {/* ===== About Section ===== */}
      <section className="overflow-hidden pb-20 lg:pb-25 xl:pb-30 ">
        <SectionHeader
          headerInfo={{
            title: "Recommended",
            subtitle: "Sri Lanka's Most Popular Places",
            description: "Explore the top destinations in Sri Lanka, known for their natural beauty and cultural significance.",
          }}
        />
        <div className="mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0 mt-10">
          {aboutData.map((item) => (
            <div
              key={item.id}
              className={`flex flex-wrap sm:flex-nowrap lg:flex-nowrap items-center gap-8 lg:gap-32.5 mb-10 ${
                item.isImageLeft ? "" : "flex-row-reverse"
              }`}
            >
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    x: item.isImageLeft ? -20 : 20,
                  },
                  visible: {
                    opacity: 1,
                    x: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="animate_left relative mx-auto w-full sm:w-3/4 md:w-1/2 aspect-[588/526.5]"
              >
                <Image
                  src={item.aboutImage}
                  alt={item.aboutTitle}
                  className="dark:hidden object-cover  rounded-lg"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </motion.div>
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    x: item.isImageLeft ? 20 : -20,
                  },
                  visible: {
                    opacity: 1,
                    x: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="animate_right md:w-1/2"
              >
                <span className="font-medium uppercase text-black dark:text-white">
                  <span className="mb-4 mr-4 inline-flex rounded-full bg-meta px-4.5 py-1 text-metatitle uppercase text-white ">
                    {item.aboutSubtitle}
                  </span>{" "}

                </span>
                <h2 className="relative mb-6 text-3xl font-bold text-black dark:text-white xl:text-hero">
                  {item.aboutTitle}
                </h2>
                <p>{item.aboutDescription}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;
