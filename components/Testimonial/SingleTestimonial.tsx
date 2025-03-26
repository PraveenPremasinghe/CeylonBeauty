"use client";
import { Card, CardFooter, CardHeader } from "@nextui-org/react";
import { Calendar, Star } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useState } from "react"; // Add this import

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  feedback: string;
  tourDate: string;
  images: string[];
  createdAt: string;
  designation?: string;
}

const SingleTestimonial = ({ review }: { review: Testimonial }) => {
  const { name, rating, feedback, tourDate, images, createdAt } = review;
  const [isExpanded, setIsExpanded] = useState(false);

  // Set your desired character limit for preview
  const previewLength = 150;
  const showReadMore = feedback.length > previewLength;
  const displayText = isExpanded
    ? feedback
    : feedback.slice(0, previewLength) + (showReadMore ? "..." : "");

  return (
    <div>
      <Card className="overflow-hidden transition-all duration-300 review-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
              <span className="font-medium">{name || "Anonymous Guest"}</span>
              <div className="text-muted-foreground flex items-center gap-1 text-xs">

                <span> {format(new Date(tourDate), "MMMM dd, yyyy")}</span>
              </div>
            </div>

            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <div className="px-4 pb-3">
          <p className="whitespace-pre-line text-sm text-gray-600">
            {displayText}
            {showReadMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </p>

          {images && images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {images.slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-md size-16"
                >
                  <img
                    src={image}
                    alt={`Review photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {index === 2 && images.length > 3 && (
                    <div className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                      +{images.length - 3} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <CardFooter className="text-muted-foreground pt-0 text-xs px-4 pb-3">
          <span>Posted {formatDistanceToNow(new Date(createdAt))} ago</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SingleTestimonial;
