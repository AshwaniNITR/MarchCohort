"use client";

import { useState, useEffect } from "react";

interface TweetButtonProps {
  generatedImage: string;
}

const TweetButton: React.FC<TweetButtonProps> = ({ generatedImage }) => {
  const [uploading, setUploading] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState("");

  useEffect(() => {
    // Extract lastFullResponse from Local Storage
    const lastResponse = localStorage.getItem("lastFullResponse");

    if (lastResponse && lastResponse.trim() !== "") {
      setGeneratedCaption(lastResponse);
      console.log("Extracted Caption:", lastResponse);
    } else {
      console.warn("No caption found in Local Storage");
    }
  }, []);

  const handleTweetImage = async () => {
    if (!generatedImage) {
      alert("Image missing!");
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

      // Ensure caption exists and format it properly
      const captionText = generatedCaption ? generatedCaption : "Check out this image!";
      const additionalText = " - Check out the image here!";
      const maxCaptionLength = 280 - additionalText.length - 25; // Reserve extra 25 characters

      // Slice caption to fit within Twitter's character limit
      const slicedCaption = captionText.slice(0, maxCaptionLength) + additionalText;
      
      const encodedCaption = encodeURIComponent(slicedCaption);
      const encodedImageUrl = encodeURIComponent(data.secure_url);
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodedCaption}&url=${encodedImageUrl}`;

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