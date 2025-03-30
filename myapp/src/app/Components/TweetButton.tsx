"use client";

import { useState } from "react";

interface TweetButtonProps {
  generatedImage: string;
  generatedCaption: string;
}

const TweetButton: React.FC<TweetButtonProps> = ({ generatedImage, generatedCaption }) => {
  const [uploading, setUploading] = useState(false);

  const handleTweetImage = async () => {
    if (!generatedImage || !generatedCaption) {
      alert("Image or caption missing!");
      return;
    }

    setUploading(true);

    try {
      // Convert Image URL to Blob
      const response = await fetch(generatedImage);
      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("Invalid image data");
      }

      // Upload Image to Cloudinary
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", "unsigned_preset"); 

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/duwddcqzi/image/upload`, 
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await cloudinaryResponse.json();
      if (!data.secure_url) {
        throw new Error("Image upload failed");
      }

      // Encode Image URL & Caption for Twitter
      const imageUrl = encodeURIComponent(data.secure_url);
      const tweetText = encodeURIComponent(generatedCaption);
      const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${imageUrl}`;

      // Open Twitter Web Intent
      window.open(tweetUrl, "_blank");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <button
      onClick={handleTweetImage}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      disabled={uploading}
    >
      {uploading ? "Uploading..." : "Tweet Image & Caption"}
    </button>
  );
};

export default TweetButton;
