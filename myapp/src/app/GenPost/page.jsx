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
import { Download } from "lucide-react";
import Image from "next/image";

// Removed duplicate import of Button
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure 
} from "@heroui/modal";

import { Button } from "@/components/ui/button";
import TweetButton from "../Components/TweetButton";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const Page = () => {
  const [generatedCaption, setGeneratedCaption] = useState("");
  const router = useRouter();
  const color = useMotionValue(COLORS_TOP[0]);
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  console.log(generatedCaption);

  useEffect(() => {
    const storedCaption = localStorage.getItem("LastFullResponse");
    if (storedCaption) {
      setGeneratedCaption(storedCaption);
      console.log(storedCaption);
    }
  }, []);
  
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
    if (typeof window !== "undefined") {
      const savedPrompt = localStorage.getItem("lastImagePrompt") || "";
      const savedImageBase64 =
        localStorage.getItem("lastGeneratedImageBase64") || "";

      setPrompt(savedPrompt);
      if (savedImageBase64) {
        setGeneratedImage(savedImageBase64);
      }
    }
  }, []);

  // Update local storage for prompt
  useEffect(() => {
    if (typeof window !== "undefined" && prompt) {
      localStorage.setItem("lastImagePrompt", prompt);
    }
  }, [prompt]);

  // Update local storage for generated image
  useEffect(() => {
    if (typeof window !== "undefined" && generatedImage) {
      localStorage.setItem("lastGeneratedImage", generatedImage);
    }
  }, [generatedImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setGeneratedImage("");

    try {
      const apiResponse = await fetch("http://localhost:3001/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        mode: "cors",
      });

      if (!apiResponse.ok) {
        throw new Error(`API responded with status: ${apiResponse.status}`);
      }

      // Convert image to Base64
      const imageBlob = await apiResponse.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64data = reader.result;

        // Store in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("lastGeneratedImageBase64", base64data);
          localStorage.setItem("lastImagePrompt", prompt);
        }

        setGeneratedImage(base64data);
        setIsLoading(false);
      };

      reader.readAsDataURL(imageBlob);
    } catch (error) {
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
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "generated-image.png";
      link.click();
    }
  };

  const handleEditImage = () => {
    // Store the image in localStorage for the edit page to access
    if (typeof window !== "undefined" && generatedImage) {
      localStorage.setItem("editImage", generatedImage);
      // Redirect to the image edit page
      router.push("/ImageEdit");
    }
  };

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
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
            <h2 className="mb-2 text-xl font-semibold text-white">
              Generated Image:
            </h2>
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
              <div className="p-4 overflow-auto max-h-[500px] flex flex-col items-center justify-center">
                {generatedImage && (
                  <div className="flex flex-col items-center">
                    {/* Using div with background image as a workaround since we're dealing with base64 images */}
                    <div 
                      style={{
                        backgroundImage: `url(${generatedImage})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        width: '100%',
                        height: '450px'
                      }}
                      className="max-w-full"
                      role="img"
                      aria-label="Generated image"
                    />
                    <div className="flex flex-row gap-4 mt-4">
                      <Button
                        onClick={handleEditImage}
                        className=" bg-purple-600 "
                      >
                        Edit Image
                      </Button>
                      <Button className="bg-green-500" onClick={onOpen}>
                        Post Preview
                      </Button>
                    </div>
                    {/* Modal section with improved content and styling */}
                    <Modal 
                      backdrop="blur" 
                      isOpen={isOpen} 
                      onOpenChange={onOpenChange}
                      classNames={{
                        backdrop: "z-50 bg-black/40 backdrop-blur-sm",
                        base: "z-50",
                        wrapper: "z-50 fixed inset-0 flex items-center justify-center p-4"
                      }}
                    >
                      <ModalContent className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 w-full max-w-3xl mx-auto z-50 rounded-xl shadow-2xl">
                        {(onClose) => (
                          <>
                            <ModalHeader className="flex flex-col gap-1 text-white border-b border-gray-700/50 px-6 py-4">
                              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Post Preview</h2>
                            </ModalHeader>
                            <ModalBody className="py-6 px-6">
                              <div className="flex flex-col md:flex-row gap-6">
                                {/* Image Section - Enlarged */}
                                <div className="flex-1 flex flex-col items-center">
                                  <div className="relative group w-full rounded-lg overflow-hidden border border-gray-700/50 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                                    <div 
                                      style={{
                                        backgroundImage: `url(${generatedImage})`,
                                        backgroundSize: 'contain',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        width: '100%',
                                        height: '300px'
                                      }}
                                      className="w-full h-auto"
                                      role="img"
                                      aria-label="Generated image"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                                      <Button className="bg-purple-600 hover:bg-purple-700 transition-colors">
                                        Edit Image
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Details Section */}
                                <div className="flex-1 flex flex-col gap-5">
                                  {/* Prompt with Edit Option */}
                                  <div className="w-full p-4 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg">
                                    <div className="flex justify-between items-center mb-2">
                                      <h3 className="text-white font-medium">Prompt</h3>
                                      <Button 
                                        variant="ghost" 
                                        className="h-8 w-8 p-0 rounded-full bg-gray-700/50 hover:bg-blue-600/50"
                                        onClick={() => {/* Add edit functionality */}}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                      </Button>
                                    </div>
                                    <p className="text-gray-300">{prompt}</p>
                                  </div>
                                  
                                  {/* Share Options */}
                                  <div className="w-full p-4 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg">
                                    <h3 className="text-white font-medium mb-3">Share Options</h3>
                                    <div className="flex flex-wrap gap-3">
                                      <Button className="bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                                        <TweetButton generatedImage={generatedImage} />
                                      </Button>
                                      <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-colors flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                        Instagram
                                      </Button>
                                      <Button className="bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                        Pinterest
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {/* Additional Metadata */}
                                  <div className="w-full p-4 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg">
                                    <h3 className="text-white font-medium mb-2">Image Info</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div className="text-gray-400">Created:</div>
                                      <div className="text-gray-300">{new Date().toLocaleDateString()}</div>
                                      <div className="text-gray-400">Format:</div>
                                      <div className="text-gray-300">PNG</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </ModalBody>
                            <ModalFooter className="border-t border-gray-700/50 px-6 py-4 flex justify-between">
                              <Button variant="ghost" className="text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors" onClick={onClose}>
                                Close
                              </Button>
                              <div className="flex gap-3">
                                <Button className="bg-purple-600 hover:bg-purple-700 transition-colors">
                                  Edit
                                </Button>
                                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-colors" onClick={handleDownload}>
                                  Download
                                </Button>
                              </div>
                            </ModalFooter>
                          </>
                        )}
                      </ModalContent>
                    </Modal>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="h-4 m-4 flex flex-row gap-4">
          <div>
            <a href="/GenCap">
              <Button className="bg-violet-600">
                Generate a caption for this poster
              </Button>
            </a>
          </div>
          
        </div>
      </div>
    </motion.section>
  );
};

export default Page;