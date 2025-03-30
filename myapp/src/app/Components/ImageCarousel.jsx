"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { forwardRef, useImperativeHandle } from 'react';

const ImageCarousel = forwardRef(({ images, onCurrentImageChange, onImageClick }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
  
    // Call the callback whenever currentIndex changes
    useEffect(() => {
      if (onCurrentImageChange) {
        onCurrentImageChange(images[currentIndex]);
      }
    }, [currentIndex, images, onCurrentImageChange]);
  
    // Add a transition reset effect
    useEffect(() => {
      if (isTransitioning) {
        // Reset the transitioning state after animation completes
        const timer = setTimeout(() => {
          setIsTransitioning(false);
        }, 500); // Match this to your animation duration
        
        return () => clearTimeout(timer);
      }
    }, [isTransitioning]);
  
    const handleImageClick = () => {
      if (onImageClick) {
        onImageClick(images[currentIndex]);
      }
    };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getImageIndex = (offset) => {
    let index = currentIndex + offset;
    if (index < 0) index = images.length + index;
    if (index >= images.length) index = index - images.length;
    return index;
  };

  const ImageCard = ({ image, index, offset, size }) => (
    <motion.div
      className={`mx-2 relative transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
        isTransitioning ? 'opacity-70' : 'opacity-100'
      }`}
      initial={{ scale: 0.95 }}
      animate={{ 
        scale: offset === 0 ? 1.1 : 0.9 - Math.abs(offset) * 0.1,
        zIndex: offset === 0 ? 10 : 5 - Math.abs(offset)
      }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        if (offset === 0 && isTransitioning) {
          setIsTransitioning(false);
        }
      }}
    >
      <div 
        className={`
          ${size} relative rounded-2xl overflow-hidden 
          backdrop-blur-lg bg-white/10 border border-white/20
          shadow-[0_0_20px_-5px_rgba(192,132,252,0.6)]
          hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.8)]
          transition-all duration-300
          cursor-pointer
        `}
        onClick={offset === 0 ? handleImageClick : undefined}
      >
        <Image
          src={image}
          alt={`Image ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      </div>
    </motion.div>
  );

  return (
    <div className="relative flex flex-col items-center justify-center p-8">
      <div className="relative w-full max-w-6xl h-[500px] flex items-center justify-center">
        {/* Previous button */}
        <motion.button 
          onClick={goToPrevious}
          className="absolute left-4 z-20 backdrop-blur-sm bg-black/30 text-white p-3 rounded-full border border-white/20 hover:bg-purple-900/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={isTransitioning}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        {/* Carousel images */}
        <div className="flex items-center justify-center h-full w-full">
          <ImageCard image={images[getImageIndex(-2)]} index={getImageIndex(-2)} offset={-2} size="w-40 h-40" />
          <ImageCard image={images[getImageIndex(-1)]} index={getImageIndex(-1)} offset={-1} size="w-56 h-56" />
          <ImageCard image={images[currentIndex]} index={currentIndex} offset={0} size="w-72 h-72 md:w-80 md:h-80" />
          <ImageCard image={images[getImageIndex(1)]} index={getImageIndex(1)} offset={1} size="w-56 h-56" />
          <ImageCard image={images[getImageIndex(2)]} index={getImageIndex(2)} offset={2} size="w-40 h-40" />
        </div>

        {/* Next button */}
        <motion.button 
          onClick={goToNext}
          className="absolute right-4 z-20 backdrop-blur-sm bg-black/30 text-white p-3 rounded-full border border-white/20 hover:bg-purple-900/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={isTransitioning}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-8 gap-2">
        {images.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex(index);
              }
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-purple-400 shadow-[0_0_10px_2px_rgba(192,132,252,0.8)]' : 'bg-white/30'
            }`}
            whileHover={{ scale: 1.3 }}
            aria-label={`Go to image ${index + 1}`}
            disabled={isTransitioning}
          />
        ))}
      </div>
    </div>
  );
});
ImageCarousel.displayName = 'ImageCarousel';
export default ImageCarousel;