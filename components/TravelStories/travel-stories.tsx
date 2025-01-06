"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionHeader from "@/components/Common/SectionHeader";
import aboutData from "@/components/About/aboutData";
import { motion } from "framer-motion";
import Image from "next/image";
import { EffectCards, Pagination } from "swiper";
import { travelStories } from "./travelStorieData";



const TravelStories = () => {
  return (
    <>
      <section className="mt-20 overflow-hidden pb-20 lg:pb-25 xl:pb-30">
        <SectionHeader
          headerInfo={{
            title: "Gallery",
            subtitle: "Our Travel Stories",
            description:
              "Explore the top destinations in Sri Lanka, known for their natural beauty and cultural significance.",
          }}
        />

        <div className="mx-auto mt-10 max-w-c-1235 px-4 md:px-8 xl:px-0">
          <div className="gallery grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {travelStories.map((story) => (
              <figure key={story.id} className="gallery__item">
                <Swiper
                  effect={"cards"}
                  grabCursor={true}
                  modules={[EffectCards, Pagination]}
                  pagination={{ clickable: true }}
                  className="gallery__swiper"
                >
                  {story.imageList.map((image, index) => (
                    <SwiperSlide
                      key={`${story.id}-image-${index}`}
                      className="gallery__swiper-slide"
                    >
                      <img
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className="gallery__swiper-img"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="mt-2">
                  <p className="text-md font-semibold text-gray-800">
                    {story.TravelStorieName}
                  </p>
                  <p className="text-sm text-gray-500">

                    {story.date}
                  </p>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TravelStories;
