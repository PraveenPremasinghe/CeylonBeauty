"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionHeader from "@/components/Common/SectionHeader";
import { EffectCards, Pagination } from "swiper";
import { getDocs, collection } from "firebase/firestore"; // Firestore
import { ceylonBeautyDatabase } from "lib/firebase.js"; // Firebase config
import { Timestamp } from "firebase/firestore"; // For converting timestamp

interface TravelStory {
  id: string;
  travelStorieImages: string; // Single image as string
  travelStorieName: string;
  travelDate: Timestamp;
}

const TravelStories: React.FC = () => {
  const [travelStories, setTravelStories] = useState<TravelStory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch travel stories from Firestore
  useEffect(() => {
    const fetchTravelStories = async () => {
      try {
        const travelStoriesCollection = collection(ceylonBeautyDatabase, "travelStories");
        const snapshot = await getDocs(travelStoriesCollection);

        const fetchedStories: TravelStory[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TravelStory[];

        setTravelStories(fetchedStories);
      } catch (error) {
        console.error("Error fetching travel stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTravelStories();
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
                  <SwiperSlide className="gallery__swiper-slide">
                    <img
                      src={story.travelStorieImages}
                      alt={story.travelStorieName}
                      className="gallery__swiper-img"
                    />
                  </SwiperSlide>
                </Swiper>
                <div className="mt-2">
                  <p className="text-md font-semibold text-gray-800">
                    {story.travelStorieName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date:{" "}
                    {story.travelDate
                      ? new Date(story.travelDate.toDate()).toLocaleDateString()
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

export default TravelStories;
