"use client";

import { Stars } from "@react-three/drei"; // For 3D star field
import { Canvas } from "@react-three/fiber"; // WebGL rendering
import React, { useEffect, useState, useRef } from "react";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion"; // Motion animations

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const page = () => {
  const color = useMotionValue(COLORS_TOP[0]);
  const [prompt, setPrompt] = useState("");
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [fullResponse, setFullResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const charIndexRef = useRef(0);
  const typingSpeedRef = useRef(50); // milliseconds per character

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  // Typing effect
  useEffect(() => {
    if (fullResponse && isTyping && charIndexRef.current < fullResponse.length) {
      const typingTimer = setTimeout(() => {
        setDisplayedResponse(prev => prev + fullResponse.charAt(charIndexRef.current));
        charIndexRef.current += 1;
      }, typingSpeedRef.current);

      return () => clearTimeout(typingTimer);
    } else if (charIndexRef.current >= fullResponse.length && isTyping) {
      setIsTyping(false);
    }
  }, [fullResponse, displayedResponse, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setDisplayedResponse("");
    setFullResponse("");
    charIndexRef.current = 0;
    
    try {
      const apiResponse = await fetch("https://76c2-34-125-96-178.ngrok-free.app/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
        mode: "cors",
      });
      
      if (!apiResponse.ok) {
        throw new Error(`API responded with status: ${apiResponse.status}`);
      }
      
      const data = await apiResponse.json();
      setFullResponse(data.response);
      setIsLoading(false);
      setIsTyping(true);
    } catch (error: any) {
      console.error("Error fetching response:", error);
      setError(`Error: ${error.message || "Failed to connect to the API. The ngrok URL might have expired."}`);
      setIsLoading(false);
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
        <h1 className="mb-8 text-4xl font-bold text-white">AI Caption Generator</h1>
        
        {/* Prompt Input Div */}
        <div className="w-full max-w-2xl mb-6 bg-gray-800 border border-white rounded-lg">
          <form onSubmit={handleSubmit} className="p-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 p-4 text-white bg-gray-800 border-none rounded-lg focus:outline-none resize-none"
              placeholder="Enter your prompt here..."
            />
            <div className="flex justify-between mt-2">
              <div>
                {error && <p className="text-red-400">{error}</p>}
              </div>
              <div>
                <button 
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  disabled={isLoading || isTyping}
                >
                  {isLoading ? "Generating..." : "Get Response"}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Response Display Div */}
        <div className="w-full max-w-2xl bg-gray-800 border border-white rounded-lg">
          <div className="p-4">
            <h2 className="mb-2 text-xl font-semibold text-white">Response:</h2>
            {isLoading ? (
              <div className="flex items-center justify-center p-4 space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            ) : (
              <div className="p-4 overflow-auto text-white whitespace-pre-wrap" style={{ maxHeight: "300px" }}>
  {displayedResponse || "Your response will appear here."}
  {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-white animate-pulse"></span>}
</div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default page;