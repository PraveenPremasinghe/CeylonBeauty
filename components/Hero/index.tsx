"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { Autoplay, Pagination } from "swiper";
import { heroSectionData } from "./heroSectionData";
import Link from "next/link";
import { WeatherCard } from "@/components/WeatherCard";

const Hero = () => {
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Ensure that querySelector returns an HTMLElement and handle null values safely
      const heroElement = document.querySelector(".hero-section") as HTMLElement | null;
      const heroHeight = heroElement?.offsetHeight || 0; // If null, heroHeight defaults to 0
      const scrollY = window.scrollY;

      // Update the state based on whether the scroll position is greater than the hero height
      setIsScrolledPastHero(scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>


      <section className="hero-section relative h-[100vh] overflow-hidden bg-cover bg-center ">
        <div className="fixed top-15 right-4 z-999">
          <WeatherCard isScrolledPastHero={isScrolledPastHero} />
        </div>
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              y: -20,
            },

            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="animate_top"
        >
          <div className="swiper">
            <Swiper
              spaceBetween={50}
              slidesPerView={1}
              autoplay={{
                delay: 12000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              modules={[Autoplay, Pagination]}
              breakpoints={{
                // when window width is >= 640px
                0: {
                  slidesPerView: 1,
                },
                // when window width is >= 768px
                768: {
                  slidesPerView: 1,
                },
              }}
            >
              {heroSectionData.map((data) => (
                <SwiperSlide key={data?.id}>
                  <div className="relative">
                    <img
                      src={data.image}
                      alt="Picture of the author"
                      className="h-screen w-screen	 object-cover"
                    />
                    <div className="absolute  bottom-20 ml-5 flex max-w-2xl flex-col  items-start">
                      <div className="mx-4 rounded-md py-1 text-left text-base text-white lg:text-xl ">
                        {data.subTitle}
                      </div>
                      <div className="mx-4 rounded-md py-2 text-left text-5xl font-bold text-white lg:text-8xl">
                        {data.title}
                      </div>
                      <div className="mx-4 rounded-md py-3 text-left text-lg text-white lg:text-2xl">
                        {data.content}
                      </div>
                      {data.isButton ? (
                        <Link
                          href="#"
                          className="mx-4 flex items-center justify-center rounded-full bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho"
                        >
                          {data.btnContent}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
