"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageEditor from '../Components/ImageEditor';
const Page = () => {
  const router = useRouter();
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    // Retrieve the image from localStorage when the component mounts
    if (typeof window !== 'undefined') {
      const storedImage = localStorage.getItem('editImage');
      if (storedImage) {
        setImage(storedImage);
      } else {
        // If no image is found, redirect back to the generator
        router.push('/');
      }
    }
  }, [router]);

  const handleImageSave = (editedImage: string) => {
    // Save the edited image to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastGeneratedImageBase64', editedImage);
    }
    
    // Redirect back to the main page
    router.push('/');
  };

  const handleCancel = () => {
    // Simply redirect back to the main page
    router.push('/');
  };

  // Render nothing if no image is loaded
  if (!image) return null;

  return (
    <div className=" bg-gray-950 flex items-center justify-center p-4">
          <ImageEditor 
          />
    </div>
  );
};

export default Page;