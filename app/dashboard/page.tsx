"use client"; // Ensures it's a client component

import React, { useState, useEffect } from "react";
import { ceylonBeautyStorage, ceylonBeautyDatabase } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
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
    setUploadProgress({}); // Reset progress bar

    try {
      const uploadedImageUrls: string[] = [];
      let totalFilesUploaded = 0;

      // Upload each image and get its URL
      for (const file of imageFiles) {
        const fileName = `${Date.now()}-${file.name}`; // Unique filename
        const storageRef = ref(ceylonBeautyStorage, `travelStories/${travelStoryName}/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Track progress
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prev) => ({
              ...prev,
              [fileName]: progress,
            }));
          },
          (error) => {
            console.error("Upload error:", error);
            toast.error("Error uploading image.");
            setLoading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            uploadedImageUrls.push(downloadURL);
            totalFilesUploaded++;

            if (totalFilesUploaded === imageFiles.length) {
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
              fetchTravelStories();
            }
          }
        );
      }
    } catch (error) {
      console.error("Error uploading travel story:", error);
      toast.error("Error uploading travel story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto mt-10 max-w-3xl px-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Upload a New Travel Story</h2>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="travelStoryName" className="text-sm font-semibold text-gray-600">
            Travel Story Name
          </label>
          <input
            type="text"
            id="travelStoryName"
            value={travelStoryName}
            onChange={(e) => setTravelStoryName(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3"
            placeholder="Enter the name of the travel story"
          />
        </div>

        <div>
          <label htmlFor="travelDate" className="text-sm font-semibold text-gray-600">
            Travel Date
          </label>
          <input
            type="date"
            id="travelDate"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3"
          />
        </div>

        <div>
          <label htmlFor="imageFiles" className="text-sm font-semibold text-gray-600">
            Upload Images
          </label>
          <input
            type="file"
            id="imageFiles"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full rounded-md border border-gray-300 p-3"
          />
        </div>

        {/* Progress Bars */}
        <div className="mt-4">
          {imageFiles.map((file) => {
            const fileName = `${Date.now()}-${file.name}`;
            return (
              <div key={fileName} className="my-2">
                <p className="text-sm text-gray-600">{file.name}</p>
                <div className="h-2 w-full rounded-md bg-gray-300">
                  <div
                    style={{ width: `${uploadProgress[fileName] || 0}%` }}
                    className="h-full rounded-md bg-blue-600"
                  />
                </div>
                <p className="mt-1 text-center text-sm text-gray-600">
                  {Math.round(uploadProgress[fileName] || 0)}%
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-6 py-3 text-white">
            {loading ? "Uploading..." : "Upload Story"}
          </button>
        </div>
      </form>

      {/* Display Uploaded Stories */}
      <div className="mt-12">
        <h3 className="mb-4 text-xl font-bold text-gray-800">All Travel Stories</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {allTravelStories.map((story) => (
            <div key={story.id} className="rounded-lg shadow-md">
              <img src={story.imageUrls[0]} alt={story.travelStoryName} className="h-48 w-full rounded-t-lg object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{story.travelStoryName}</h4>
                <p className="text-sm text-gray-600">{story.travelDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </section>
  );
};

export default UploadTravelStory;
