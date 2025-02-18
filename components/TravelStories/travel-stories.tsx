"use client"; // Add this line at the top of the file

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { ceylonBeautyDatabase } from "@/lib/firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.css";
import SectionHeader from "@/components/Common/SectionHeader";

const Gallery = () => {
  const [travelStories, setTravelStories] = useState<any[]>([]); // Store travel stories
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [selectedStory, setSelectedStory] = useState<any | null>(null); // Store selected story

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

  const handleCardClick = (story: any) => {
    setSelectedStory(story); // Set the selected story
  };

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
              <figure
                key={story.id}
                className="gallery__item cursor-pointer"
                onClick={() => handleCardClick(story)} // Click to select story
              >
                <Swiper
                  effect={"cards"}
                  grabCursor={true}
                  modules={[EffectCards, Pagination, Navigation]}
                  pagination={{ clickable: true }}
                  navigation={true}
                  className="gallery__swiper"
                >
                  {story.imageUrls?.map((image, index) => (
                    <SwiperSlide key={index} className="gallery__swiper-slide">
                      <img
                        src={image}
                        alt={`${story.travelStoryName} - Slide ${index + 1}`}
                        className="gallery__swiper-img object-cover w-full h-48 rounded-lg"
                        loading="lazy" // Lazy load images
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

        {/* Display selected story images */}
        {selectedStory && (
          <div className="mt-20">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {selectedStory.travelStoryName}
            </h2>
            <div className="flex flex-row flex-wrap gap-2">
              {selectedStory.imageUrls?.map((image, index) => (
                <div key={index} className="w-48 h-48">
                  <img
                    src={image}
                    alt={`${selectedStory.travelStoryName} - Image ${index + 1}`}
                    className="object-cover  rounded-lg w-full h-full "
                    loading="lazy" // Lazy load images
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
