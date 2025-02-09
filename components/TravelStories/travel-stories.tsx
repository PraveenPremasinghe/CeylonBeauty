"use client"; // Add this line at the top of the file

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { ceylonBeautyDatabase } from "@/lib/firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination } from "swiper";
import "swiper/swiper-bundle.css";
import SectionHeader from "@/components/Common/SectionHeader"; // Import Swiper styles

const Gallery = () => {
  const [travelStories, setTravelStories] = useState<any[]>([]); // Store travel stories
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch the travel stories from Firestore
  const fetchTravelStories = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(ceylonBeautyDatabase, "travelStories"));
      const fetchedStories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTravelStories(fetchedStories);
    } catch (error) {
      console.error("Error fetching travel stories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravelStories(); // Fetch data on component mount
  }, []);

  return (
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
        {loading ? (
          <p className="text-center text-gray-500">Loading travel stories...</p>
        ) : travelStories.length === 0 ? (
          <p className="text-center text-gray-500">No travel stories to display.</p>
        ) : (
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
                  {/* Handle single or multiple images */}
                  {story.imageUrls?.map((image, index) => (
                    <SwiperSlide key={index} className="gallery__swiper-slide">
                      <img
                        src={image}
                        alt={`${story.travelStoryName} - Slide ${index + 1}`}
                        className="gallery__swiper-img object-cover w-full h-48 rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="mt-2">
                  <p className="text-md font-semibold text-gray-800">
                    {story.travelStoryName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date:{" "}
                    {story.travelDate
                      ? new Date(story.travelDate).toLocaleDateString()
                      : "Unknown Date"}
                  </p>
                </div>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
