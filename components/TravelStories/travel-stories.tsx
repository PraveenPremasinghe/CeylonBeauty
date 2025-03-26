"use client"; // Add this line at the top of the file

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { ceylonBeautyDatabase } from "@/lib/firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.css";
import SectionHeader from "@/components/Common/SectionHeader";
import { Dialog, Transition } from "@headlessui/react"; // Import Dialog and Transition
import { Fragment } from "react"; // Import Fragment for Transition

const Gallery = () => {
  const [travelStories, setTravelStories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageFullScreen, setIsImageFullScreen] = useState<boolean>(false); // State for full-screen image

  // Fetch the travel stories (wrapped with useCallback to prevent unnecessary re-renders)
  const fetchTravelStories = useCallback(async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(
        collection(ceylonBeautyDatabase, "travelStories")
      );
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
  }, []);

  useEffect(() => {
    fetchTravelStories();
  }, [fetchTravelStories]); // Only runs once on mount

  const handleCardClick = (story: any) => {
    setSelectedStory(story);
    setIsModalOpen(true);
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsImageFullScreen(true); // Open full-screen overlay
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const closeFullScreenImage = () => {
    setIsImageFullScreen(false);
    setSelectedImage(null);
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

        {/* Modal for displaying selected story images */}
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeModal}>
            {/* Overlay */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-75" />
            </Transition.Child>

            {/* Modal Content */}
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-semibold text-gray-800 mb-4"
                    >
                      {selectedStory?.travelStoryName}
                    </Dialog.Title>
                    <div className="flex flex-row  flex-wrap gap-2">
                      {selectedStory?.imageUrls?.map((image, index) => (
                        <div
                          key={index}
                          className="w-48 h-48 cursor-pointer"
                          onClick={() => handleImageClick(image)}
                        >
                          <img
                            src={image}
                            alt={`${selectedStory.travelStoryName} - Image ${index + 1}`}
                            className="object-cover rounded-lg w-full h-full"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-right">
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Full-Screen Image Overlay */}
        <Transition appear show={isImageFullScreen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeFullScreenImage}>
            {/* Overlay */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-90" />
            </Transition.Child>

            {/* Full-Screen Image Content */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative">
                  <img
                    src={selectedImage || "/path/to/placeholder-image.jpg"}
                    alt="Full-Screen"
                    className="max-w-full max-h-screen rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none"
                    onClick={closeFullScreenImage}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </section>
  );
};

export default Gallery;
