"use client";

import { useState, useEffect } from "react";
import {
  auth,
  ceylonBeautyStorage,
  ceylonBeautyDatabase,
  onAuthStateChanged,
} from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { User } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadTravelStories = () => {
  const [travelStoryName, setTravelStoryName] = useState<string>("");
  const [travelDate, setTravelDate] = useState<string>("");
  const [travelStoryImages, setTravelStoryImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [stories, setStories] = useState<any[]>([]); // To store retrieved stories

  // Monitor auth state
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTravelStoryImages(Array.from(e.target.files)); // Convert FileList to File[]
    }
  };

  const handleUpload = async () => {
    if (!travelStoryName || !travelDate || travelStoryImages.length === 0) {
      toast.error("Please fill all fields and select images.");
      return;
    }

    try {
      const imageUrls: string[] = [];

      // Upload images to Firebase Storage
      const uploadTasks = travelStoryImages.map((image, index) => {
        const storageRef = ref(
          ceylonBeautyStorage,
          `travelStories/${travelStoryName}/${image.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress((prev) => {
              const updated = [...prev];
              updated[index] = progress;
              return updated;
            });
          },
          (error) => {
            console.error("Upload failed:", error);
            toast.error(`Failed to upload: ${image.name}`);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            imageUrls.push(downloadURL);
          }
        );

        return uploadTask;
      });

      await Promise.all(uploadTasks);

      // Save story details to Firestore
      await addDoc(collection(ceylonBeautyDatabase, "travelStories"), {
        travelStoryName,
        travelDate,
        imageUrls,
        createdAt: new Date(),
      });

      toast.success("Travel story uploaded successfully!");
      setTravelStoryName("");
      setTravelDate("");
      setTravelStoryImages([]);
      setUploadProgress([]);
    } catch (error) {
      console.error("Error uploading travel story:", error);
      toast.error("Failed to upload travel story.");
    }
  };

  const fetchStories = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(ceylonBeautyDatabase, "travelStories")
      );
      const fetchedStories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStories(fetchedStories);

    } catch (error) {
      console.error("Error fetching travel stories:", error);
      toast.error("Failed to fetch travel stories.");
    }
  };

  useEffect(() => {
    fetchStories(); // Fetch stories on component mount
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <ToastContainer />
      {user ? (
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Upload Travel Stories</h1>
          <div className="mb-4">
            <label
              htmlFor="travelStoryName"
              className="block text-sm font-medium text-gray-700"
            >
              Travel Story Name
            </label>
            <input
              type="text"
              id="travelStoryName"
              value={travelStoryName}
              onChange={(e) => setTravelStoryName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a name for the story"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="travelDate"
              className="block text-sm font-medium text-gray-700"
            >
              Travel Date
            </label>
            <input
              type="date"
              id="travelDate"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="travelStoryImages"
              className="block text-sm font-medium text-gray-700"
            >
              Travel Story Images
            </label>
            <input
              type="file"
              id="travelStoryImages"
              multiple
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {travelStoryImages.map((image, index) => (
                <div key={index} className="w-24 h-24 relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
          {uploadProgress.length > 0 && (
            <div className="mb-4">
              <h2 className="text-sm font-medium text-gray-700">Upload Progress</h2>
              {uploadProgress.map((progress, index) => (
                <div key={index} className="w-full bg-gray-200 rounded-lg mb-2">
                  <div
                    className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-l-lg"
                    style={{ width: `${progress}%` }}
                  >
                    {progress}%
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={handleUpload}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
          >
            Upload Travel Story
          </button>
          <hr className="my-6" />
          <h2 className="text-xl font-bold mb-4">Uploaded Stories</h2>
          <ul className="space-y-4">
            {stories.map((story) => (
              <li key={story.id} className="p-4 bg-gray-50 rounded-md shadow-md">
                <h3 className="text-lg font-semibold">{story.travelStoryName}</h3>
                <p className="text-sm text-gray-600">Date: {story.travelDate}</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {story.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Story ${story.travelStoryName} ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600">Please sign in to upload travel stories.</p>
        </div>
      )}
    </div>
  );
};

export default UploadTravelStories;
