"use client"; // Ensures it's a client component

import React, { useState, useEffect } from "react";
import { ceylonBeautyStorage, ceylonBeautyDatabase } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadTravelStory = () => {
  const [travelStoryName, setTravelStoryName] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [allTravelStories, setAllTravelStories] = useState<any[]>([]);

  // Fetch all travel stories from Firestore
  const fetchTravelStories = async () => {
    try {
      const querySnapshot = await getDocs(collection(ceylonBeautyDatabase, "travelStories"));
      const stories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        imageUrls: doc.data().imageUrls || [],
      }));
      setAllTravelStories(stories);
    } catch (error) {
      console.error("Error fetching travel stories:", error);
      toast.error("Error fetching stories. Please try again.");
    }
  };

  useEffect(() => {
    fetchTravelStories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!travelStoryName || !travelDate || imageFiles.length === 0) {
      toast.error("Please fill all fields and upload at least one image.");
      return;
    }

    setLoading(true);
    setUploadProgress({});

    try {
      const uploadedImageUrls: string[] = [];
      const uploadPromises = imageFiles.map((file) => {
        return new Promise<void>(async (resolve, reject) => {
          const fileName = `${Date.now()}-${file.name}`;
          const storageRef = ref(ceylonBeautyStorage, `travelStories/${travelStoryName}/${fileName}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress((prev) => ({
                ...prev,
                [fileName]: progress,
              }));
            },
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              uploadedImageUrls.push(downloadURL);
              resolve();
            }
          );
        });
      });

      // Wait for ALL uploads to finish
      await Promise.all(uploadPromises);

      // Save to Firestore
      await addDoc(collection(ceylonBeautyDatabase, "travelStories"), {
        travelStoryName,
        travelDate,
        imageUrls: uploadedImageUrls,
        createdAt: new Date(),
      });

      toast.success("Travel Story uploaded successfully!");
      setTravelStoryName("");
      setTravelDate("");
      setImageFiles([]);
      await fetchTravelStories();
    } catch (error) {
      console.error("Error uploading travel story:", error);
      toast.error("Error uploading travel story. Please try again.");
    } finally {
      setLoading(false); // Disables button until everything is done
    }
  };

  // 🗑️ DELETE FUNCTION
  const handleDeleteStory = async (storyId: string, imageUrls: string[]) => {
    try {
      // Delete images from Firebase Storage
      const deleteImagePromises = imageUrls.map(async (url) => {
        const imageRef = ref(ceylonBeautyStorage, url);
        try {
          await deleteObject(imageRef);
        } catch (error) {
          console.warn("Error deleting image:", error);
        }
      });

      await Promise.all(deleteImagePromises);

      // Delete the story from Firestore
      await deleteDoc(doc(ceylonBeautyDatabase, "travelStories", storyId));

      toast.success("Travel Story deleted successfully!");
      setAllTravelStories((prevStories) => prevStories.filter((story) => story.id !== storyId));
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Error deleting story. Please try again.");
    }
  };

  return (
    <section className="mx-auto mt-10 max-w-3xl px-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Upload a New Travel Story
      </h2>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="travelStoryName"
            className="text-sm font-semibold text-gray-600"
          >
            Travel Story Name
          </label>
          <input
            type="text"
            id="travelStoryName"
            value={travelStoryName}
            onChange={(e) => setTravelStoryName(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3"
            placeholder="Enter the name of the travel story"
            required
          />
        </div>

        <div>
          <label
            htmlFor="travelDate"
            className="text-sm font-semibold text-gray-600"
          >
            Travel Date
          </label>
          <input
            type="date"
            id="travelDate"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3"
            required
          />
        </div>

        <div>
          <label
            htmlFor="imageFiles"
            className="text-sm font-semibold text-gray-600"
          >
            Upload Images
          </label>
          <input
            type="file"
            id="imageFiles"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full rounded-md border border-gray-300 p-3"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`rounded-lg px-6 py-3 text-white ${
              loading
                ? "cursor-not-allowed bg-blue-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload Story"
            )}
          </button>
        </div>
      </form>

      {/* Display Uploaded Stories with Delete Option */}
      <div className="mt-12">
        <h3 className="mb-4 text-xl font-bold text-gray-800">
          All Travel Stories
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {allTravelStories.map((story) => (
            <div key={story.id} className="relative rounded-lg shadow-md">
              {story.imageUrls.length > 0 ? (
                <img
                  src={story.imageUrls[0]}
                  alt={story.travelStoryName}
                  className="h-48 w-full rounded-t-lg object-cover"
                />
              ) : (
                <div className="flex h-48 w-full items-center justify-center rounded-t-lg bg-gray-200">
                  <p className="text-gray-600">No Image</p>
                </div>
              )}
              <div className="p-4">
                <h4 className="text-lg font-semibold">
                  {story.travelStoryName}
                </h4>
                <p className="text-sm text-gray-600">{story.travelDate}</p>
                <button
                  onClick={() => handleDeleteStory(story.id, story.imageUrls)}
                  className="absolute right-2 top-2 rounded-md bg-red-500 px-3 py-1 text-sm text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </section>
  );
};

export default UploadTravelStory;
