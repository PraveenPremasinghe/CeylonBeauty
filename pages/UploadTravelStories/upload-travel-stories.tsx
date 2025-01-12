"use client";

import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage
import { collection, addDoc } from "firebase/firestore"; // Firestore
import { ceylonBeautyDatabase } from "lib/firebase.js"; // Firebase config

export default function TravelStoryUpload() {
  const [storyName, setStoryName] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages(fileArray);

      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewImages(previewUrls);

      // Clean up previous previews
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    }
  };

  // Handle image removal
  const handleImageRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));

    // Clean up removed preview URL
    URL.revokeObjectURL(previewImages[index]);

    setImages(newImages);
    setPreviewImages(newPreviewUrls);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImageUrls: string[] = [];
      const storage = getStorage();

      // Upload images to Firebase Storage
      for (const imageFile of images) {
        const imageRef = ref(storage, `travelStories/${Date.now()}-${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        uploadedImageUrls.push(downloadURL);
      }

      // Save story data to Firestore
      const travelStoryRef = collection(ceylonBeautyDatabase, "travelStories");
      await addDoc(travelStoryRef, {
        name: storyName,
        date,
        images: uploadedImageUrls,
        createdAt: new Date(),
      });

      alert("Travel story submitted successfully!");

      // Reset form
      setStoryName("");
      setDate("");
      setImages([]);
      setPreviewImages([]);
    } catch (error) {
      console.error("Error uploading travel story:", error);
      alert("Failed to submit travel story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-xl">
      <h1 className="text-3xl font-semibold text-center mb-6">Upload Your Travel Story</h1>

      <form onSubmit={handleSubmit}>
        {/* Travel Story Name */}
        <div className="mb-6">
          <label htmlFor="storyName" className="block text-lg font-medium text-gray-700">
            Travel Story Name
          </label>
          <input
            type="text"
            id="storyName"
            value={storyName}
            onChange={(e) => setStoryName(e.target.value)}
            placeholder="Enter story name"
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date Input */}
        <div className="mb-6">
          <label htmlFor="date" className="block text-lg font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label htmlFor="images" className="block text-lg font-medium text-gray-700">
            Upload Images
          </label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Image Previews */}
          <div className="mt-4 flex gap-4 flex-wrap">
            {previewImages.map((img, index) => (
              <div key={index} className="relative">
                <img src={img} alt={`preview-${index}`} className="w-32 h-32 object-cover rounded-lg shadow-lg" />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 mt-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Submit Travel Story"}
        </button>
      </form>
    </div>
  );
}
