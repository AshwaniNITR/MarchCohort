"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageEditor from "../Components/ImageEditor";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@/components/ui/button";

const Page = () => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");

  const handleHome = () => {
    router.push("/");
  }

  // Utility function to safely access localStorage - MOVED UP
  const getLocalStorageItem = (key: string, defaultValue: string = "") => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key) || defaultValue;
    }
    return defaultValue;
  };

  // Now we can use getLocalStorageItem in useState
  const [displayedResponse, setDisplayedResponse] = useState(() =>
    getLocalStorageItem("lastDisplayedResponse")
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedImage = localStorage.getItem("editImage");
      if (storedImage) {
        setImage(storedImage);
      } else {
        router.push("/");
      }
    }
  }, [router]);

  // const handleDownload = () => {
  //   if (generatedImage) {
  //     const link = document.createElement("a");
  //     link.href = generatedImage;
  //     link.download = "generated-image.png";
  //     link.click();
  //   }
  // };

  if (!image) return null;

  return (
    <div className="min-h-screen w-full bg-gray-950">
      <div className="w-full flex justify-center items-center gap-4 p-4">
        <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30" onClick={onOpen}>
          Post Preview
        </Button>
      </div>
      <div className="container mx-auto p-4">
        <ImageEditor />
      </div>

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
                  Post Preview
                </h2>
              </ModalHeader>
              <ModalBody className="py-6 px-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image Section - Enlarged */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="relative group w-full rounded-lg overflow-hidden border border-gray-700/50 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                      <img
                        src={generatedImage || "/image-placeholder.svg"}
                        alt="Generated"
                        className="w-full h-auto object-contain"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                        <Button className="bg-purple-600 hover:bg-purple-700 transition-colors">
                          Edit Image
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="flex-1 flex text-white flex-col gap-5">
                    {/* Prompt with Edit Option */}
                    <div className="w-full p-4 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-white font-medium">Prompt</h3>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-full bg-gray-700/50 hover:bg-blue-600/50"
                          onClick={handleEdit}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </Button>
                      </div>
                      {isEditing ? (
                        <textarea
                          className="w-full p-2 bg-gray-700 text-white rounded-lg"
                          value={displayedResponse}
                          onChange={(e) => setDisplayedResponse(e.target.value)}
                          onBlur={() => setIsEditing(false)}
                          autoFocus
                        />
                      ) : (
                        displayedResponse || "Your response will appear here."
                      )}
                    </div>

                    {/* Share Options */}
                    <div className="w-full p-4 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg">
                      <h3 className="text-white font-medium mb-3">
                        Share Options
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <Button className="bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                          </svg>
                          Twitter
                        </Button>
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-colors flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <rect
                              x="2"
                              y="2"
                              width="20"
                              height="20"
                              rx="5"
                              ry="5"
                            ></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                          Instagram
                        </Button>
                        <Button className="bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path
                              d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          Pinterest
                        </Button>
                      </div>
                    </div>

                    {/* Additional Metadata */}
                    <div className="w-full p-4 bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg">
                      <h3 className="text-white font-medium mb-2">
                        Image Info
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-400">Created:</div>
                        <div className="text-gray-300">
                          {new Date().toLocaleDateString()}
                        </div>
                        <div className="text-gray-400">Format:</div>
                        <div className="text-gray-300">PNG</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-700/50 px-6 py-4 flex justify-between">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                  onClick={onClose}
                >
                  Close
                </Button>
                <div className="flex gap-3">
                  <Button className="bg-green-600 hover:bg-green-700 transition-colors" onClick={handleHome}>
                    Go to Home
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;
