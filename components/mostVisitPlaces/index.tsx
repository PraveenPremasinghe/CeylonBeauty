"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/Common/SectionHeader";
import React, { useState } from "react";
import { destinations } from "./destinations";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
 ;




const MostVisitPlaces = () => {
  const [selectedRegion, setSelectedRegion] = useState(destinations[0]);

  return (
    <>
      <section className="overflow-hidden pb-20 lg:pb-25 xl:pb-20">
        <SectionHeader
          headerInfo={{
            title: "Most Visited Destinations of 2024",
            subtitle: "Explore Sri Lanka's Top Destinations",
            description:
              "Discover the most popular places in Sri Lanka, celebrated for their natural beauty and cultural significance.",
          }}
        />

        {/* ===== Region Tabs ===== */}
        <div className="mx-auto mt-10 max-w-c-1235 px-4 md:px-8 xl:px-0">
          <div className="mb-6 flex justify-center">
            <Swiper
              slidesPerView="auto" // Allows multiple buttons to show
              spaceBetween={10} // Spacing between buttons
              freeMode={true} // Enables free scroll
              className="w-full"
            >
              {destinations.map((destination, index) => (
                <SwiperSlide key={index} className="!w-auto">
                  {" "}
                  {/* Ensure buttons are not cut */}
                  <button
                    onClick={() => setSelectedRegion(destination)}
                    className={`most-visit-btn min-w-fit rounded-lg px-4 py-2 transition-all duration-300 ${
                      selectedRegion.region === destination.region
                        ? "bg-secondary text-white"
                        : " "
                    }`}
                  >
                    {destination.region}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ===== Swiper for Selected Region ===== */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 2500 }}
            navigation={true}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="rounded-lg"
          >
            {selectedRegion.places.map((place, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="most-visit-card"
                >
                  <Image
                    src={place.image}
                    alt={place.name}
                    width={400}
                    height={300}
                    className="h-64 w-full object-cover"
                  />

                  <div className="most-visit-card-bottom flex items-center justify-between  ">
                    <div>
                      <div className="font-semibold  ">{place.name}</div>
                      <div className="text-sm font-light ">
                        {place.distance}
                      </div>
                    </div>
                    <div className=" font-semibold  ">{place.time}</div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default MostVisitPlaces;
