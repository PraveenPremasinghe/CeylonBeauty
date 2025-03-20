"use client"; // Ensures it's a client component

import { useState, useEffect } from 'react';
import { ceylonBeautyDatabase, ceylonBeautyStorage } from '@/lib/firebase'; // Updated import
import { collection, addDoc, query, orderBy, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify and ToastContainer

// Import Toastify CSS
import 'react-toastify/dist/ReactToastify.css';

// Define the type for the story object
interface Story {
  id: string;
  storyName: string;
  travelDate: string;
  imageUrls: string[];
  createdAt: Date;
}

const UploadStory = () => {
  const [storyName, setStoryName] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState<Story[]>([]); // Specify the type of stories as Story[]
  const [error, setError] = useState('');

  // Fetch stories from Firestore on component mount
  useEffect(() => {
    const fetchStories = async () => {
      const q = query(collection(ceylonBeautyDatabase, "stories"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const storiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Story[]; // Explicitly type the fetched stories as Story[]
      setStories(storiesData);
    };

    fetchStories();
  }, []);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!storyName || !travelDate || (images && images.length === 0)) {
      setError('Please fill in all fields and upload at least one image');
      return;
    }
    setError('');

    setLoading(true);

    // Upload images to Firebase Storage
    const uploadPromises: Promise<void>[] = []; // Type the array to accept promises of type void
    const imageUrls: string[] = [];
    if (images) {
      for (let i = 0; i < images.length; i++) {
        const imageRef = ref(ceylonBeautyStorage, `stories/${images[i].name}`);
        const uploadTask = uploadBytes(imageRef, images[i]);

        // Add the promise to the array
        uploadPromises.push(uploadTask.then(() => {
          return getDownloadURL(imageRef).then(url => {
            imageUrls.push(url);
          });
        }));
      }
    }

    // Wait for all uploads to finish
    await Promise.all(uploadPromises);

    // Save story data to Firestore
    await addDoc(collection(ceylonBeautyDatabase, "stories"), {
      storyName,
      travelDate,
      imageUrls,
      createdAt: new Date(),
    });

    // Fetch updated stories
    const snapshot = await getDocs(query(collection(ceylonBeautyDatabase, "stories"), orderBy("createdAt", "desc")));
    const storiesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Story[];
    setStories(storiesData);

    setLoading(false);
    setStoryName('');
    setTravelDate('');
    setImages(null);

    // Show success toast notification
    toast.success("Story uploaded successfully!");
  };

  return (
    <div>
      <h1>Upload Travel Story</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={storyName}
          onChange={(e) => setStoryName(e.target.value)}
          placeholder="Travel Story Name"
          required
        />
        <input
          type="date"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          required
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" disabled={loading}>Upload Story</button>
      </form>

      {loading && <p>Uploading...</p>}

      <h2>Uploaded Stories</h2>
      <div>
        {stories.map((story) => (
          <div key={story.id}>
            <h3>{story.storyName}</h3>
            <p>{story.travelDate}</p>
            <div>
              {story.imageUrls.map((url, index) => (
                <img key={index} src={url} alt="story image" style={{ width: '200px', margin: '10px' }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Correct usage of ToastContainer */}
      <ToastContainer />
    </div>
  );
};

export default UploadStory;
