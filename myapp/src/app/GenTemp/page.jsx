"use client"; // This must be at the very top
import ImageCarousel from '@/app/Components/ImageCarousel';
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useState, useEffect } from "react";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate
} from "framer-motion"; // Make sure this import exists
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@/components/ui/button";


const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const sampleImages = [
  '/diwali.png',
  '/second.png',
  '/third.png',        
  '/fourth.png',
  '/fifth.png',
];

export default function Home() {
  const color = useMotionValue(COLORS_TOP[0]); // Now this will work
  const [currentImageSrc, setCurrentImageSrc] = useState('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Color animation effect
  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

  const handleImageClick = () => {
    onOpen();
  };

  const handleSaveImage = () => {
    try {
      // Get the image filename from the path
      const imageName = currentImageSrc.split('/').pop();
      
      // Get existing saved images or initialize empty array
      const existingSaved = JSON.parse(localStorage.getItem('savedImages') || '[]');
      
      // Check if this image is already saved
      if (!existingSaved.includes(currentImageSrc)) {
        // Add the current image to the saved images
        const updatedSaved = [...existingSaved, currentImageSrc];
        
        // Save to localStorage
        localStorage.setItem('savedImages', JSON.stringify(updatedSaved));
        
        setToastMessage(`Image ${imageName} saved successfully!`);
      } else {
        setToastMessage(`Image ${imageName} is already saved.`);
      }
      
      // Show toast notification
      setShowToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving image to localStorage:', error);
      setToastMessage('Failed to save image. Please try again.');
      setShowToast(true);
    }
  };

  return (
    <motion.div 
      style={{ backgroundImage }}
      className="relative min-h-screen overflow-hidden bg-gray-950"
    >
      {/* Stars Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4">
        <h1 className="text-3xl text-center font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Templates</h1>
        
        <ImageCarousel 
          images={sampleImages} 
          onCurrentImageChange={setCurrentImageSrc}
          onImageClick={handleImageClick}
        />
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg border border-purple-500 z-50 animate-fade-in-up">
          {toastMessage}
        </div>
      )}

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop: "z-50 bg-black/40 backdrop-blur-sm",
          base: "z-50",
          wrapper: "z-50 fixed inset-0 flex items-center justify-center p-4",
        }}
      >
        <ModalContent className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 w-full max-w-3xl mx-auto z-50 rounded-xl shadow-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white border-b border-gray-700/50 px-6 py-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Image Preview
                </h2>
              </ModalHeader>
              <ModalBody className="py-6 px-6">
                <div className="flex flex-col items-center">
                  <div className="relative group w-full rounded-lg overflow-hidden border border-gray-700/50 shadow-lg">
                    <img
                      src={currentImageSrc || "/image-placeholder.svg"}
                      alt="Current"
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-700/50 px-6 py-4 flex justify-between">
                <Button
                  className="bg-green-600 hover:bg-green-700 transition-colors"
                  onClick={handleSaveImage}
                >
                  Save to Favorites
                </Button>
                <a href="/GenCap">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Generate a relevant caption
                </Button>
                </a>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 transition-colors"
                  onClick={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  );
}