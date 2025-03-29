// "use client";

// import { Stars } from "@react-three/drei"; // For 3D star field
// import { Canvas } from "@react-three/fiber"; // WebGL rendering
// import React, { useEffect, useState, useRef } from "react";
// import {
//   useMotionTemplate,
//   useMotionValue,
//   motion,
//   animate,
// } from "framer-motion"; // Motion animations
// import { Copy, Pencil, Trash } from "lucide-react"; // Icons
// import { Button } from "@/components/ui/button";
// // Utility function to safely access localStorage
// const getLocalStorageItem = (key: string, defaultValue: string = '') => {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem(key) || defaultValue;
//   }
//   return defaultValue;
// };

// const setLocalStorageItem = (key: string, value: string) => {
//   if (typeof window !== 'undefined') {
//     localStorage.setItem(key, value);
//   }
// };

// const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

// const Page = () => {
//   const color = useMotionValue(COLORS_TOP[0]);
//   //const [prompt, setPrompt] = useState("");
//   //const [displayedResponse, setDisplayedResponse] = useState("");
//   //const [fullResponse, setFullResponse] = useState("");
//   //const [isLoading, setIsLoading] = useState(false);
//   //const [error, setError] = useState("");
//   //const [isTyping, setIsTyping] = useState(false);
//   //const [isEditing, setIsEditing] = useState(false);
//   //const charIndexRef = useRef(0);
//   //const typingSpeedRef = useRef(20); // milliseconds per character
//   const [prompt, setPrompt] = useState(() => 
//     getLocalStorageItem('lastPrompt')
//   );
//   const [displayedResponse, setDisplayedResponse] = useState(() => 
//     getLocalStorageItem('lastDisplayedResponse')
//   );
//   const [fullResponse, setFullResponse] = useState(() => 
//     getLocalStorageItem('lastFullResponse')
//   );
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const charIndexRef = useRef(0);
//   const typingSpeedRef = useRef(20);

//   // Update local storage whenever prompt or responses change
//   // Update local storage whenever prompt or responses change
//   useEffect(() => {
//     setLocalStorageItem('lastPrompt', prompt);
//   }, [prompt]);

//   useEffect(() => {
//     setLocalStorageItem('lastDisplayedResponse', displayedResponse);
//   }, [displayedResponse]);

//   useEffect(() => {
//     setLocalStorageItem('lastFullResponse', fullResponse);
//   }, [fullResponse]);

//   useEffect(() => {
//     animate(color, COLORS_TOP, {
//       ease: "easeInOut",
//       duration: 10,
//       repeat: Infinity,
//       repeatType: "mirror",
//     });
//   }, []);

//   // Typing effect
//   useEffect(() => {
//     if (
//       fullResponse &&
//       isTyping &&
//       charIndexRef.current <= fullResponse.length
//     ) {
//       const typingTimer = setTimeout(() => {
//         setDisplayedResponse(
//           fullResponse.slice(0, charIndexRef.current + 1)
//         );
//         charIndexRef.current += 1;
//       }, typingSpeedRef.current);
  
//       return () => clearTimeout(typingTimer);
//     } else if (charIndexRef.current >= fullResponse.length && isTyping) {
//       setIsTyping(false);
//     }
//   }, [fullResponse, displayedResponse, isTyping]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setDisplayedResponse("");
//     setFullResponse("");
//     charIndexRef.current = 0;

//     try {
//       const apiResponse = await fetch("https://b44a-34-16-202-175.ngrok-free.app/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           prompt: prompt,
//         }),
//         mode: "cors",
//       });
      
//       if (!apiResponse.ok) {
//         throw new Error(`API responded with status: ${apiResponse.status}`);
//       }

//       const data = await apiResponse.json();
//       setFullResponse(data.response);
//       setIsLoading(false);
//       setIsTyping(true);

//       // Clear loading state specific local storage
//       localStorage.setItem('isLoading', 'false');
//     } catch (error:unknown) {
//       console.error("Error fetching response:", error);
//       if (error instanceof Error) {
//         setError(
//           `Error: ${
//             error.message ||
//             "Failed to connect to the API. The ngrok URL might have expired."
//           }`
//         );
//       } else {
//         setError("An unexpected error occurred.");
//       }
      
//       setIsLoading(false);
//       localStorage.setItem('isLoading', 'false');
//     }
//   };

//   const handleCopy = () => {
//     navigator.clipboard.writeText(displayedResponse);
//     alert("Copied to clipboard!");
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleErase = () => {
//     setDisplayedResponse("");
//     setFullResponse("");
//     setIsEditing(false);
//   };

//   const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

//   return (
//     <motion.section
//       style={{ backgroundImage }}
//       className="relative min-h-screen overflow-hidden bg-gray-950"
//     >
//       <div className="absolute inset-0 z-0">
//         <Canvas>
//           <Stars radius={50} count={2500} factor={4} fade speed={2} />
//         </Canvas>
//       </div>

//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
//         <h1 className="mb-8 text-4xl font-bold text-white">
//           AI Caption Generator
//         </h1>

//         {/* Prompt Input Div */}
//         <div className="w-full max-w-2xl mb-6 bg-gray-800 border border-white rounded-lg">
//           <form onSubmit={handleSubmit} className="p-4">
//             <textarea
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               className="w-full h-32 p-4 text-white bg-gray-800 border-none rounded-lg focus:outline-none resize-none"
//               placeholder="Enter your prompt here..."
//             />
//             <div className="flex justify-between mt-2">
//               <div>{error && <p className="text-red-400">{error}</p>}</div>
//               <div>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
//                   disabled={isLoading || isTyping}
//                 >
//                   {isLoading ? "Generating..." : "Get Response"}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* Response Display Div */}
//         <div className="w-full max-w-2xl bg-gray-800 border border-white rounded-lg relative">
//           {/* Icons in the top-right corner */}
//           <div className="absolute top-2 right-2 flex space-x-3">
//             <button
//               onClick={handleCopy}
//               className="text-white hover:text-gray-400"
//               title="Copy"
//             >
//               <Copy size={18} />
//             </button>
//             <button
//               onClick={handleEdit}
//               className="text-white hover:text-gray-400"
//               title="Edit"
//             >
//               <Pencil size={18} />
//             </button>
//             <button
//               onClick={handleErase}
//               className="text-white hover:text-gray-400"
//               title="Erase"
//             >
//               <Trash size={18} />
//             </button>
//           </div>

//           <div className="p-4">
//             <h2 className="mb-2 text-xl font-semibold text-white">Response:</h2>
//             {isLoading ? (
//               <div className="flex items-center justify-center p-4 space-x-2">
//                 <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
//                 <div
//                   className="w-3 h-3 bg-white rounded-full animate-bounce"
//                   style={{ animationDelay: "0.2s" }}
//                 ></div>
//                 <div
//                   className="w-3 h-3 bg-white rounded-full animate-bounce"
//                   style={{ animationDelay: "0.4s" }}
//                 ></div>
//               </div>
//             ) : (
//               <div className="p-4 overflow-auto text-white whitespace-pre-wrap max-h-72">
//                 {isEditing ? (
//                   <textarea
//                     className="w-full p-2 bg-gray-700 text-white rounded-lg"
//                     value={displayedResponse}
//                     onChange={(e) => setDisplayedResponse(e.target.value)}
//                     onBlur={() => setIsEditing(false)}
//                     autoFocus
//                   />
//                 ) : (
//                   displayedResponse || "Your response will appear here."
//                 )}
//                 {isTyping && (
//                   <span className="inline-block w-2 h-4 ml-1 bg-white animate-pulse"></span>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="h-4"></div>
//         <a href="/GenPost"><Button className="bg-violet-600">Generate a Poster For this Caption</Button></a> 
//       </div>
//     </motion.section>
//   );
// };

// export default Page;

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
import { Copy, Pencil, Trash } from "lucide-react"; // Icons
import { Button } from "@/components/ui/button";

// Utility function to safely access localStorage
const getLocalStorageItem = (key: string, defaultValue: string = '') => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
};

const setLocalStorageItem = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

// Translation language pairs
const TRANSLATION_PAIRS = {
  "original": "Original",
  "en-hi": "English → Hindi",
  "hi-en": "Hindi → English",
  "en-ur": "English → Urdu",
  "ur-en": "Urdu → English",
  "en-bn": "English → Bengali",
  "bn-en": "Bengali → English",
  "en-pa": "English → Punjabi",
  "pa-en": "Punjabi → English",
  "en-gu": "English → Gujarati",
  "gu-en": "Gujarati → English",
  "en-mr": "English → Marathi",
  "mr-en": "Marathi → English",
  "en-kn": "English → Kannada",
  "kn-en": "Kannada → English",
  "en-ml": "English → Malayalam",
  "ml-en": "Malayalam → English",
  "en-si": "English → Sinhala",
  "si-en": "Sinhala → English"
};

const Page = () => {
  const color = useMotionValue(COLORS_TOP[0]);
  const [prompt, setPrompt] = useState(() => 
    getLocalStorageItem('lastPrompt')
  );
  const [displayedResponse, setDisplayedResponse] = useState(() => 
    getLocalStorageItem('lastDisplayedResponse')
  );
  const [originalResponse, setOriginalResponse] = useState(() => 
    getLocalStorageItem('lastFullResponse')
  );
  const [fullResponse, setFullResponse] = useState(() => 
    getLocalStorageItem('lastFullResponse')
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof TRANSLATION_PAIRS>("original");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const charIndexRef = useRef(0);
  const typingSpeedRef = useRef(20);

  // Update local storage whenever prompt or responses change
  useEffect(() => {
    setLocalStorageItem('lastPrompt', prompt);
  }, [prompt]);

  useEffect(() => {
    setLocalStorageItem('lastDisplayedResponse', displayedResponse);
  }, [displayedResponse]);

  useEffect(() => {
    setLocalStorageItem('lastFullResponse', fullResponse);
  }, [fullResponse]);

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
    if (
      fullResponse &&
      isTyping &&
      charIndexRef.current <= fullResponse.length
    ) {
      const typingTimer = setTimeout(() => {
        setDisplayedResponse(
          fullResponse.slice(0, charIndexRef.current + 1)
        );
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
    setOriginalResponse("");
    charIndexRef.current = 0;
    setSelectedLanguage("original");

    try {
      const apiResponse = await fetch("https://a2c0-34-16-142-205.ngrok-free.app/generate", {
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
      setOriginalResponse(data.response);
      setIsLoading(false);
      setIsTyping(true);

      // Clear loading state specific local storage
      localStorage.setItem('isLoading', 'false');
    } catch (error:unknown) {
      console.error("Error fetching response:", error);
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
      localStorage.setItem('isLoading', 'false');
    }
  };

  const handleTranslate = async (langPair: string) => {
    if (langPair === "original") {
      setFullResponse(originalResponse);
      setDisplayedResponse(originalResponse);
      return;
    }
  
    setIsTranslating(true);
    setError("");
  
    try {
      // Format the request body to match the required structure
      const apiResponse = await fetch("https://62c8-35-221-208-195.ngrok-free.app//translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lang_pair: langPair,  // This is the exact format your backend expects
          text: originalResponse
        }),
        mode: "cors",
      });
      
      if (!apiResponse.ok) {
        throw new Error(`Translation API responded with status: ${apiResponse.status}`);
      }
  
      const data = await apiResponse.json();
      
      // Check if the response has the translated_text field
      if (data.translated_text) {
        setFullResponse(data.translated_text);
        setDisplayedResponse(data.translated_text);
      } else {
        throw new Error("Invalid response format from translation API");
      }
      
      setIsTranslating(false);
    } catch (error) {
      console.error("Error translating text:", error);
      if (error instanceof Error) {
        setError(
          `Translation Error: ${
            error.message ||
            "Failed to connect to the translation API. The ngrok URL might have expired."
          }`
        );
      } else {
        setError("An unexpected translation error occurred.");
      }
      
      setIsTranslating(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as keyof typeof TRANSLATION_PAIRS;
    setSelectedLanguage(newLang);
    handleTranslate(newLang);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedResponse);
    alert("Copied to clipboard!");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleErase = () => {
    setDisplayedResponse("");
    setFullResponse("");
    setOriginalResponse("");
    setIsEditing(false);
    setSelectedLanguage("original");
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
          AI Caption Generator
        </h1>

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
              <div>{error && <p className="text-red-400">{error}</p>}</div>
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
        <div className="w-full max-w-2xl bg-gray-800 border border-white rounded-lg relative">
          {/* Icons in the top-right corner */}
          <div className="absolute top-2 right-2 flex space-x-3">
            <button
              onClick={handleCopy}
              className="text-white hover:text-gray-400"
              title="Copy"
            >
              <Copy size={18} />
            </button>
            <button
              onClick={handleEdit}
              className="text-white hover:text-gray-400"
              title="Edit"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={handleErase}
              className="text-white hover:text-gray-400"
              title="Erase"
            >
              <Trash size={18} />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center mb-2 justify-between">
              <h2 className="text-xl font-semibold text-white">Response:</h2>
              
              {/* Language selector */}
              
            </div>
            
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
            ) : isTranslating ? (
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
                <span className="ml-2 text-white">Translating...</span>
              </div>
            ) : (
              <div className="p-4 overflow-auto text-white whitespace-pre-wrap max-h-72">
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
                {isTyping && (
                  <span className="inline-block w-2 h-4 ml-1 bg-white animate-pulse"></span>
                )}
                {displayedResponse && (
  <div className="mt-4">
    <label className="block mb-2 text-white text-sm">Translate to:</label>
    <div className="relative">
      <button 
        className="bg-gray-700 text-white rounded-md px-3 py-2 text-sm border border-gray-600 flex items-center justify-between w-48"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {TRANSLATION_PAIRS[selectedLanguage]}
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-10">
          {Object.entries(TRANSLATION_PAIRS).map(([key, value]) => (
            <button
              key={key}
              className="block w-full text-left px-3 py-2 text-white text-sm hover:bg-gray-600"
              onClick={() => {
                setSelectedLanguage(key as keyof typeof TRANSLATION_PAIRS);
                handleTranslate(key);
                setDropdownOpen(false);
              }}
            >
              {value}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
)}
              </div>
            )}
          </div>
        </div>
        <div className="h-4"></div>
        <a href="/GenPost"><Button className="bg-violet-600">Generate a Poster For this Caption</Button></a> 
      </div>
    </motion.section>
  );
};

export default Page;
