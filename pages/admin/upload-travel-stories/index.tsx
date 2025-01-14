import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ceylonBeautyStorage, ceylonBeautyDatabase } from "@/lib/firebase";


function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle file upload
  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const storageRef = ref(ceylonBeautyStorage, `images/${file.name}`); // Define storage reference
    const uploadTask = uploadBytesResumable(storageRef, file); // Start the upload task

    setUploading(true); // Set uploading state to true

    // Monitor upload progress
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress); // Update progress
      },
      (error) => {
        console.error(error);
        setUploading(false); // Set uploading state to false on error
      },
      () => {
        // Upload complete, get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setDownloadURL(url); // Set the download URL
          setUploading(false); // Set uploading state to false
          alert("File uploaded successfully!");
        });
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? `Uploading ${Math.round(progress)}%` : "Upload Image"}
      </button>

      {downloadURL && (
        <div>
          <h4>Download URL:</h4>
          <a href={downloadURL} target="_blank" rel="noopener noreferrer">
            {downloadURL}
          </a>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
