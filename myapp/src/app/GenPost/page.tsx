"use client";

import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";
import { Copy, Pencil, Trash, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const page = () => {
  const color = useMotionValue(COLORS_TOP[0]);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Color animation effect
  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  // Safely handle localStorage on client-side
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Load initial state from localStorage
      const savedPrompt = localStorage.getItem('lastImagePrompt') || '';
      const savedImage = localStorage.getItem('lastGeneratedImage') || '';
      
      setPrompt(savedPrompt);
      setGeneratedImage(savedImage);
    }
  }, []);

  // Update local storage for prompt
  useEffect(() => {
    if (typeof window !== 'undefined' && prompt) {
      localStorage.setItem('lastImagePrompt', prompt);
    }
  }, [prompt]);

  // Update local storage for generated image
  useEffect(() => {
    if (typeof window !== 'undefined' && generatedImage) {
      localStorage.setItem('lastGeneratedImage', generatedImage);
    }
  }, [generatedImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setGeneratedImage("");

    try {
      const apiResponse = await fetch(
        "https://0eec-34-145-56-140.ngrok-free.app/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
          }),
          mode: "cors",
        }
      );

      if (!apiResponse.ok) {
        throw new Error(`API responded with status: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      setGeneratedImage(data.image);
      setIsLoading(false);
    } catch (error:unknown) {
      console.error("Error fetching image:", error);
      if (error instanceof Error) {
        setError(
          `Error: ${
            error.message ||
            "Failed to connect to the API. The ngrok URL might have expired."
          }`
        );
      } else {
        setError("An unexpected error occurred.");
      }
      
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'generated-image.png';
      link.click();
    }
  };

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative min-h-screen overflow-hidden bg-gray-950"
    >
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="mb-8 text-4xl font-bold text-white">
          AI Image Generator
        </h1>

        {/* Prompt Input Div */}
        <div className="w-full max-w-2xl mb-6 bg-gray-800 border border-white rounded-lg">
          <form onSubmit={handleSubmit} className="p-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 p-4 text-white bg-gray-800 border-none rounded-lg focus:outline-none resize-none"
              placeholder="Enter your image prompt here..."
            />
            <div className="flex justify-between mt-2">
              <div>{error && <p className="text-red-400">{error}</p>}</div>
              <div>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Generate Image"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Image Display Div */}
        <div className="w-full max-w-2xl bg-gray-800 border border-white rounded-lg relative">
          {/* Download Icon */}
          {generatedImage && (
            <div className="absolute top-2 right-2 flex space-x-3">
              <button
                onClick={handleDownload}
                className="text-white hover:text-gray-400"
                title="Download"
              >
                <Download size={18} />
              </button>
            </div>
          )}

          <div className="p-4">
            <h2 className="mb-2 text-xl font-semibold text-white">Generated Image:</h2>
            {isLoading ? (
              <div className="flex items-center justify-center p-4 space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            ) : (
              <div className="p-4 overflow-auto max-h-[500px] flex items-center justify-center">
                {generatedImage ? (
                  <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="max-w-full max-h-[450px] object-contain"
                  />
                ) : (
                  <p className="text-gray-400">Your image will appear here.</p>
                )}
              </div>
            )}
          </div>
        </div>
        <Button className="bg-violet-600">Generate a caption for this poster</Button>
      </div>
    </motion.section>
  );
};

export default page;