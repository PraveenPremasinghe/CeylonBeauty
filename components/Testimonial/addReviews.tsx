"use client";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState, useRef, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { Calendar, CalendarIcon, Loader2, Star, X, ImagePlus, User } from "lucide-react";
import { format } from "date-fns";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ceylonBeautyDatabase, ceylonBeautyStorage } from "@/lib/firebase";

interface Review {
  id: string;
  name: string;
  tourDate: string;
  rating: number;
  feedback: string;
  images: string[];
  createdAt: string;
}

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewAdded?: (review: Review) => void;
}

interface FormData {
  name: string;
  tourDate: Date | undefined;
  rating: number;
  feedback: string;
  images: File[];
}

const initialFormData: FormData = {
  name: "",
  tourDate: undefined,
  rating: 0,
  feedback: "",
  images: [],
};

const FeedbackModal = ({ isOpen, onClose,onReviewAdded }: FeedbackFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, tourDate: date }));
  };

  // Handle rating change
  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  // Trigger file input click
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0 || !formData.feedback.trim()) {
      alert("Please provide a rating and feedback.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images to Firebase Storage and get their URLs
      const imageUrls = await Promise.all(
        formData.images.map(async (file) => {
          const storageRef = ref(ceylonBeautyStorage, `client-reviews/${file.name}`);
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        })
      );

      // Create the review data
      const reviewData = {
        name: formData.name,
        tourDate: formData.tourDate || new Date(),
        rating: formData.rating,
        feedback: formData.feedback,
        images: imageUrls,
        createdAt: new Date(),
      };

      // Save feedback data to Firestore and get the document reference
      const docRef = await addDoc(collection(ceylonBeautyDatabase, "clientReviews"), reviewData);

      // Create the complete review object
      const newReview = {
        id: docRef.id,
        name: formData.name,
        tourDate: format(formData.tourDate || new Date(), "MMMM dd, yyyy h:mm a"),
        rating: formData.rating,
        feedback: formData.feedback,
        images: imageUrls,
        createdAt: format(new Date(), "MMMM dd, yyyy h:mm a"),
      };

      // Call the callback to update the parent component
      if (onReviewAdded) {
        onReviewAdded(newReview);
      }

      setSubmittedName(formData.name);
      setIsSubmitted(true);
      setFormData(initialFormData);

      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setSubmittedName("");
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred while submitting feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {!isSubmitted && ( // Only show the title when not submitted
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 text-center">
                      Add Feedback
                    </Dialog.Title>
                  )}


                  {isSubmitted ? (
                    <div className="text-center py-6">
                      {/* Animated Checkmark */}
                      <div className="flex justify-center">
                        <svg
                          className="w-16 h-16 text-green-500 animate-checkmark"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>

                      {/* Thank You Message */}
                      <h2 className="text-2xl font-semibold text-gray-900 mt-4">
                        Thank you, <span className="text-blue-600">{formData.name || "Guest"}</span>!
                      </h2>
                      <p className="text-lg text-gray-600 mt-2">
                        We appreciate your amazing feedback.
                      </p>

                      {/* Subtext */}
                      <p className="text-sm text-gray-500 mt-4">
                        Your review helps us improve and serve you better.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                      {/* Name */}
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Your Name
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-gray-400">
                            <User size={16} />
                          </div>
                          <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      {/* Tour Date */}
                      <div className="space-y-2">
                        <label htmlFor="tourDate" className="text-sm font-medium">
                          Tour Date
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-gray-400">
                            <CalendarIcon size={16} />
                          </div>
                          <input
                            type="date"
                            id="tourDate"
                            name="tourDate"
                            value={formData.tourDate ? format(formData.tourDate, "yyyy-MM-dd") : ""}
                            onChange={(e) => handleDateChange(new Date(e.target.value))}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Feedback */}
                      <div className="space-y-2">
                        <label htmlFor="feedback" className="text-sm font-medium">
                          Share your experience
                        </label>
                        <textarea
                          id="feedback"
                          name="feedback"
                          value={formData.feedback}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                          placeholder="Tell us about your tour experience..."
                        />
                      </div>

                      {/* Photo Upload */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Upload Photos <span className="text-xs text-gray-400">(optional)</span>
                        </label>
                        <div
                          className={`border-2 border-dashed rounded-md p-6 text-center ${
                            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={handleClick}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                          />
                          <ImagePlus size={36} className="mx-auto text-gray-400" />
                          <p className="text-gray-600">
                            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or GIF (max 5MB each)</p>
                        </div>

                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            {formData.images.map((file, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index}`}
                                  className="w-full h-24 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={16} className="text-red-500" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="space-y-2">
                        <label htmlFor="rating" className="text-sm font-medium">
                          How would you rate?
                        </label>
                        <div className="flex justify-center py-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className={`mx-1 focus:outline-none ${
                                star <= (hoverValue || formData.rating) ? "text-yellow-400" : "text-gray-300"
                              }`}
                              onMouseEnter={() => setHoverValue(star)}
                              onMouseLeave={() => setHoverValue(null)}
                              onClick={() => handleRatingChange(star)}
                              aria-label={`Rate ${star} out of 5 stars`}
                            >
                              <Star size={32} fill="currentColor" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Feedback"
                        )}
                      </Button>
                    </form>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default FeedbackModal;
