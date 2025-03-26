"use client";
import SectionHeader from "../Common/SectionHeader";
import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import SingleTestimonial from "./SingleTestimonial";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import FeedbackForm from "@/components/Testimonial/addReviews";
import { collection, getDocs } from "firebase/firestore";
import { ceylonBeautyDatabase } from "@/lib/firebase";
import { format } from "date-fns";

interface Review {
  id: string;
  name: string;
  tourDate: string;
  rating: number;
  feedback: string;
  images: string[];
  createdAt: string;
}

const Testimonial = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(ceylonBeautyDatabase, "clientReviews"));
        const reviewsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Anonymous",
            tourDate: data.tourDate?.toDate() || new Date(),
            rating: data.rating || 0,
            feedback: data.feedback || "",
            images: data.images || [],
            createdAt: data.createdAt?.toDate() || new Date(),

          };
        }) as Review[];
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div>Loading reviews...</div>
      </div>
    );
  }
  if (reviews.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>No reviews yet. Be the first to leave one!</div>
      </div>
    );
  }

  return (
    <>
      <section>
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          <div className="animate_top mx-auto text-center">
            <SectionHeader
              headerInfo={{
                title: `What Our Clients Say`,
                subtitle: `Experiences Shared by Our Guests`,
                description: `Hear what our travelers have to say about their unforgettable experiences with us! `,
              }}
            />
            <div className="mx-4 mt-2 flex items-center justify-center">
              <Button
                onClick={openModal}
                className="rounded-full bg-blue-600 px-5.5 py-2 text-regular text-white"
              >
                Add Review
              </Button>
            </div>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top mx-auto mt-15 max-w-c-1235 px-4 md:px-8 xl:mt-20 xl:px-0"
          >
            <div className="swiper testimonial-01 mb-20 pb-22.5">
              <Swiper
                spaceBetween={30}
                slidesPerView={3}
                autoplay={{ delay: 50000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                modules={[Autoplay, Pagination]}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 3 },
                }}
              >
                {reviews.map((review) => (
                  <SwiperSlide key={review.id}>
                    <SingleTestimonial review={review} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>
          <FeedbackForm isOpen={isModalOpen} onClose={closeModal} />
        </div>
      </section>
    </>
  );
};

export default Testimonial;
