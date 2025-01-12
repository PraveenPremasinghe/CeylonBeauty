// pages/upload-travel-stories.tsx
import React, { useState } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { auth, ceylonBeautyStorage } from 'lib/firebase';

const UploadTravelStories = () => {
  const [travelStorieName, setTravelStorieName] = useState('');
  const [travelStorieDate, setTravelStorieDate] = useState('');
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (selectedImages) {
      const promises = Array.from(selectedImages).map((file) => {
        const storageRef = ref(ceylonBeautyStorage, `travel_stories/${file.name}`);
        return uploadBytes(storageRef, file);
      });

      try {
        await Promise.all(promises);
        alert('Images uploaded successfully!');
      } catch (error) {
        console.error('Error uploading images:', error);
        alert('Failed to upload images.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Upload Travel Story</h1>
      <form className="space-y-4">
        {/* Travel Story Name */}
        <div>
          <label className="block text-lg font-medium" htmlFor="travelStorieName">
            Travel Story Name
          </label>
          <input
            type="text"
            id="travelStorieName"
            value={travelStorieName}
            onChange={(e) => setTravelStorieName(e.target.value)}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter the name of your travel story"
            required
          />
        </div>

        {/* Travel Story Date */}
        <div>
          <label className="block text-lg font-medium" htmlFor="travelStorieDate">
            Travel Story Date
          </label>
          <input
            type="date"
            id="travelStorieDate"
            value={travelStorieDate}
            onChange={(e) => setTravelStorieDate(e.target.value)}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Travel Story Images */}
        <div>
          <label className="block text-lg font-medium" htmlFor="travelStorieImages">
            Upload Images
          </label>
          <input
            type="file"
            id="travelStorieImages"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="mt-2 w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Upload Travel Story
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadTravelStories;
